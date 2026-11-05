"""Compara o vídeo novo com o anterior quadro a quadro (canal de luminância, resolução cheia) e o áudio decodificado.
Prova que só mudaram os trechos das gravações reais. uso: 10_compare.py antigo.mp4 novo.mp4"""
import subprocess, sys, hashlib, numpy as np, json
old,new=sys.argv[1],sys.argv[2]; W,H=1080,1920
def rd(p): return subprocess.Popen(["ffmpeg","-v","error","-i",p,"-an","-f","rawvideo","-pix_fmt","gray","-"],stdout=subprocess.PIPE,bufsize=W*H*2)
a,b=rd(old),rd(new); diffs=[]; i=0
while True:
    x=a.stdout.read(W*H); y=b.stdout.read(W*H)
    if len(x)<W*H or len(y)<W*H: break
    d=np.abs(np.frombuffer(x,np.uint8).astype(np.int16)-np.frombuffer(y,np.uint8).astype(np.int16)); diffs.append((int(d.max()),float(d.mean()))); i+=1
mx=np.array([d[0] for d in diffs]); me=np.array([d[1] for d in diffs]); ch=np.where(mx>0)[0]
runs=[]
for f in ch:
    if runs and f-runs[-1][1]<=3: runs[-1][1]=int(f)
    else: runs.append([int(f),int(f)])
res={"quadros_comparados":i,"quadros_com_qualquer_diferenca":int(len(ch)),"trechos_alterados_s":[[round(r[0]/30,2),round(r[1]/30,2)] for r in runs]}
def ah(p):
    d=subprocess.run(["ffmpeg","-v","error","-i",p,"-vn","-f","s16le","-ac","2","-ar","48000","-"],capture_output=True).stdout; return hashlib.sha256(d).hexdigest()[:16],len(d)
res["audio_antigo"],res["audio_novo"]=ah(old),ah(new); res["audio_identico"]=res["audio_antigo"]==res["audio_novo"]
print(json.dumps(res,indent=1)); json.dump(res,open("REVISAO_VISUAL/comparacao_com_versao_anterior.json","w"),indent=1)
