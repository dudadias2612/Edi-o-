"""Gera, a partir das gravações reais (A: fluxo, B: teste): sequência do celular (retime com speed ramp e pausas),
sequência da lupa (zoom sincronizado) e overlay/data_slots.js (retângulo de destaque + rótulos por quadro)."""
import json, os, math, shutil, numpy as np, cv2
cfg=json.load(open("config/capturas.json")); PW,PH,LW,LH=430,936,500,300; FPS=30
shutil.rmtree("overlay/slots",ignore_errors=True); out={}
sm=lambda x:x*x*(3-2*x)
for K in ("A","B"):
    c=cfg[K]; f0,f1=c["start_frame"],c["end_frame"]; fps=c["src_fps"]; n_src=len(os.listdir(c["frames_dir"]))
    at=[a[0] for a in c["anchors"]]; asrc=[a[1] for a in c["anchors"]]
    segs=c["lupa"]; D=0.30
    os.makedirs(f"overlay/slots/{K}",exist_ok=True); os.makedirs(f"overlay/slots/{K}_lupa",exist_ok=True)
    cache={}
    def load(i):
        if i not in cache:
            if len(cache)>8: cache.pop(next(iter(cache)))
            cache[i]=cv2.imread(f"{c['frames_dir']}/{i+1:05d}.jpg")
        return cache[i]
    def rect(t):
        k=max([i for i,s in enumerate(segs) if t>=s["t0"]-D/2] or [0])
        s=segs[k]; cur=(s["cx"],s["cy"],s["w"])
        if k>0 and t<s["t0"]+D/2:
            p=sm(np.clip((t-(s["t0"]-D/2))/D,0,1)); q=segs[k-1]; prev=(q["cx"],q["cy"],q["w"])
            cur=(prev[0]+(cur[0]-prev[0])*p,prev[1]+(cur[1]-prev[1])*p,math.exp(math.log(prev[2])+(math.log(cur[2])-math.log(prev[2]))*p))
        return k,cur
    hl=[];lab=[]
    for f in range(f0,f1):
        t=f/FPS; st=float(np.interp(t,at,asrc)); x=st*fps; i=min(int(math.floor(x)),n_src-1); a=x-i; j=min(i+1,n_src-1)
        k0=max(0,int(np.searchsorted(at,t,side='right'))-1); k1=min(k0+1,len(at)-1)
        slope=(asrc[k1]-asrc[k0])/max(at[k1]-at[k0],1e-6)
        # mistura de quadros só em câmera lenta (<0,8x); em velocidade normal/acelerada usa o quadro mais próximo (sem imagem dupla)
        if slope>=0.8: i=min(int(round(x)),n_src-1); a=0.0; j=i
        img=load(i) if (a<0.04 or j==i) else cv2.addWeighted(load(i),1-a,load(j),a,0)
        n=f-f0+1
        cv2.imwrite(f"overlay/slots/{K}/{n:05d}.jpg",cv2.resize(img,(PW,PH),interpolation=cv2.INTER_AREA),[cv2.IMWRITE_JPEG_QUALITY,94])
        k,(cx,cy,w)=rect(t); h=w*LH/LW; x0=min(max(cx-w/2,0),882-w); y0=min(max(cy-h/2,0),1920-h)
        crop=img[int(round(y0)):int(round(y0+h)),int(round(x0)):int(round(x0+w))]
        interp=cv2.INTER_AREA if w>LW else cv2.INTER_LANCZOS4
        cv2.imwrite(f"overlay/slots/{K}_lupa/{n:05d}.jpg",cv2.resize(crop,(LW,LH),interpolation=interp),[cv2.IMWRITE_JPEG_QUALITY,93])
        sc=PW/882; hl.append([round(x0*sc,1),round(y0*sc,1),round(w*sc,1),round(h*sc,1)]); lab.append(k)
    out[K]={"dir":f"slots/{K}","lupa":f"slots/{K}_lupa","f0":f0,"f1":f1,"hl":hl,"lab":lab,"labels":[s["label"] for s in segs],
            "segT":[s["t0"] for s in segs],"lupaIni":segs[0]["t0"]-0.12,"lupaFim":c["lupa_fim"]}
    print(K,f1-f0,"quadros")
open("overlay/data_slots.js","w").write("window.SLOTS="+json.dumps(out)+";")
