"""Recorte da pessoa (matte) com Robust Video Matting (ONNX, CPU).
Gera work/matte.mkv (cinza, FFV1 sem perdas, 1080x1920, 30fps).
Uso: python3 scripts/01_matte.py [max_frames] [saida]"""
import sys, subprocess, numpy as np, onnxruntime as ort, time
W,H=1080,1920
MAXF=int(sys.argv[1]) if len(sys.argv)>1 else 10**9
OUT=sys.argv[2] if len(sys.argv)>2 else "work/matte.mkv"
so=ort.SessionOptions(); so.intra_op_num_threads=4
sess=ort.InferenceSession("/home/user/models/rvm.onnx",so,providers=["CPUExecutionProvider"])
dec=subprocess.Popen(["ffmpeg","-v","error","-i","entrada/original_nextags_v1.mov","-frames:v",str(MAXF),"-f","rawvideo","-pix_fmt","rgb24","-"],stdout=subprocess.PIPE)
enc=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","gray","-s",f"{W}x{H}","-r","30","-i","-","-c:v","ffv1","-level","3",OUT],stdin=subprocess.PIPE)
rec=[np.zeros((1,1,1,1),np.float32) for _ in range(4)]
ds=np.array([0.3],np.float32)
n=0;t=time.time()
while True:
    buf=dec.stdout.read(W*H*3)
    if len(buf)<W*H*3: break
    src=(np.frombuffer(buf,np.uint8).reshape(H,W,3).astype(np.float32)/255.).transpose(2,0,1)[None]
    fgr,pha,*rec=sess.run(None,{"src":src,"r1i":rec[0],"r2i":rec[1],"r3i":rec[2],"r4i":rec[3],"downsample_ratio":ds})
    enc.stdin.write((np.clip(pha[0,0],0,1)*255).astype(np.uint8).tobytes()); n+=1
    if n%100==0: print(n,round((time.time()-t)/n,3),"s/frame",flush=True)
enc.stdin.close(); enc.wait(); print("frames",n,"tempo",round(time.time()-t))
