"""Compositor: vídeo base + zoom + camada 'atrás' (com recorte da pessoa por cima) + camada 'frente' -> H.264.
uso: 04_composite.py --out work/video_silent.mp4 [--preset slow --crf 17] [--total 152.3]
     04_composite.py --stills 12.2,31.6 --outdir work/stills        (PNGs do resultado, sem codificar)"""
import argparse, json, subprocess, sys, os, numpy as np, cv2
ap=argparse.ArgumentParser()
ap.add_argument("--out"); ap.add_argument("--preset",default="slow"); ap.add_argument("--crf",default="17")
ap.add_argument("--total",type=float,default=152.3); ap.add_argument("--stills"); ap.add_argument("--outdir",default="work/stills")
ap.add_argument("--overlay",default="work/overlay"); ap.add_argument("--range")
ap.add_argument("--noperson",action="store_true",help="não reaplica o recorte da pessoa")
a=ap.parse_args()
W,H,FPS=1080,1920,30; SRC="entrada/original_nextags_v1.mov"; NSRC=4511
man=json.load(open(f"{a.overlay}/manifest.json")); zc=json.load(open("config/zoom.json"))
EV=zc["eventos"]; CX,CY=zc["centro"]
def ease(x,k): return x if k=="lin" else 1-(1-x)**3
def zoom_at(t):
    z=1.0
    for e in EV:
        if t<e["t"]: break
        p=min(1,(t-e["t"])/max(e["dur"],1e-6)); z0=z; z=z0+(e["z"]-z0)*ease(p,e.get("ease","out"))
        if p<1: return z
    return z
# --- decodificação (bt709 explícito) ---
VF="scale=in_range=tv:out_range=pc:in_color_matrix=bt709,format=rgb24"
def reader(ss=0):
    return subprocess.Popen(["ffmpeg","-v","error","-ss",str(ss),"-i",SRC,"-vf",VF,"-f","rawvideo","-pix_fmt","rgb24","-"],stdout=subprocess.PIPE,bufsize=W*H*3*2)
def mreader(ss=0):
    return subprocess.Popen(["ffmpeg","-v","error","-ss",str(ss),"-i","work/matte.mkv","-f","rawvideo","-pix_fmt","gray","-"],stdout=subprocess.PIPE,bufsize=W*H*2)
cache={}
def load(path):
    if path not in cache:
        if len(cache)>6: cache.clear()
        cache[path]=cv2.imread(f"{a.overlay}/{path}",cv2.IMREAD_UNCHANGED)   # BGRA reto
    return cache[path]
def over(dst,bgra):
    al=bgra[:,:,3:4].astype(np.float32)/255.
    rgb=bgra[:,:,2::-1].astype(np.float32)
    return dst*(1-al)+rgb*al
def zoomed(img,z,interp=cv2.INTER_LANCZOS4):
    if z<1.0005: return img
    M=np.float32([[z,0,CX-z*CX],[0,z,CY-z*CY]]); return cv2.warpAffine(img,M,(W,H),flags=interp,borderMode=cv2.BORDER_REPLICATE)
def compose(f,base,matte):
    t=f/FPS; rec=man.get(str(f),{}) or {}; z=zoom_at(t)
    b=base.astype(np.float32); bz=zoomed(base,z).astype(np.float32) if z>1.0005 else b
    out=bz
    if rec.get("behind"):
        out=over(bz,load(rec["behind"]))
        if not a.noperson:
            mz=zoomed(matte,z,cv2.INTER_LINEAR) if z>1.0005 else matte
            m=(mz.astype(np.float32)/255.)[:,:,None]
            out=out*(1-m)+bz*m
    if rec.get("front"): out=over(out,load(rec["front"]))
    return np.clip(out+0.5,0,255).astype(np.uint8)
NF=int(round(a.total*FPS))
def frames_iter(f0=0,f1=NF):
    r=reader(f0/FPS if f0<NSRC else 0); mr=mreader(f0/FPS if f0<NSRC else 0); last=None; lastm=None
    for f in range(f0,f1):
        if f<NSRC:
            b=r.stdout.read(W*H*3); mb=mr.stdout.read(W*H)
            if len(b)<W*H*3: raise SystemExit(f"fim inesperado do vídeo em {f}")
            last=np.frombuffer(b,np.uint8).reshape(H,W,3).copy(); lastm=np.frombuffer(mb,np.uint8).reshape(H,W).copy()
        yield f,last,lastm
    r.kill(); mr.kill()
if a.stills:
    os.makedirs(a.outdir,exist_ok=True)
    for ts in a.stills.split(","):
        t=float(ts); f=round(t*FPS); r=reader(min(t,150.3)); mr=mreader(min(t,150.3))
        base=np.frombuffer(r.stdout.read(W*H*3),np.uint8).reshape(H,W,3).copy(); matte=np.frombuffer(mr.stdout.read(W*H),np.uint8).reshape(H,W).copy(); r.kill(); mr.kill()
        img=compose(f,base,matte); cv2.imwrite(f"{a.outdir}/{t:07.2f}.png",img[:,:,::-1]); print("ok",t)
    sys.exit()
f0,f1=0,NF
if a.range: f0,f1=[int(round(float(x)*FPS)) for x in a.range.split(",")]
enc=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
  "-vf","scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p","-c:v","libx264","-preset",a.preset,"-crf",a.crf,"-profile:v","high","-level","4.2",
  "-colorspace","bt709","-color_primaries","bt709","-color_trc","bt709","-color_range","tv","-r",str(FPS),"-movflags","+faststart",a.out],stdin=subprocess.PIPE)
import time; t0=time.time()
for f,base,matte in frames_iter(f0,f1):
    enc.stdin.write(compose(f,base,matte).tobytes())
    if f%150==0: print(f"{f}/{NF} {time.time()-t0:.0f}s",flush=True)
enc.stdin.close(); enc.wait(); print("pronto",a.out)
