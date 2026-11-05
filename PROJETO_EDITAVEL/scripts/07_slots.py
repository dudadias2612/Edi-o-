"""Prepara as gravações reais dos placeholders: ajusta ao tempo exato da janela, recorta para a moldura e
gera overlay/slots/<ID>/%05d.jpg + overlay/data_slots.js. Sem 'src' preenchido => segue o placeholder ilustrativo."""
import json, subprocess, shutil, os, sys
cfg=json.load(open("config/placeholders.json")); FPS=cfg["fps"]; out={}
shutil.rmtree("overlay/slots",ignore_errors=True)
def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
for s in cfg["slots"]:
    if not s.get("src"): continue
    n=s["fim_quadro"]-s["inicio_quadro"]; w,h=[v*2 for v in s["tela_px"]]; d=dur(s["src"]); target=n/FPS
    f=target/d; vf=[]
    if s.get("ajuste","retime")=="retime":
        if not .6<=f<=1.6: print(f"AVISO {s['id']}: gravação tem {d:.2f}s e a janela {target:.2f}s (fator {f:.2f}); idealmente grave ~{target:.1f}s.")
        vf.append(f"setpts=PTS*{f:.6f}")
    vf+= [f"fps={FPS}",f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos",f"crop={w}:{h}"]
    os.makedirs(f"overlay/slots/{s['id']}",exist_ok=True)
    subprocess.check_call(["ffmpeg","-v","error","-y","-i",s["src"],"-vf",",".join(vf),"-frames:v",str(n),"-q:v","2",f"overlay/slots/{s['id']}/%05d.jpg"])
    got=len(os.listdir(f"overlay/slots/{s['id']}"))
    if got<n:  # última imagem repetida até completar a janela (nunca encurta o vídeo)
        last=f"overlay/slots/{s['id']}/{got:05d}.jpg"
        for k in range(got+1,n+1): shutil.copy(last,f"overlay/slots/{s['id']}/{k:05d}.jpg")
    out[s["id"]]={"dir":f"slots/{s['id']}","frames":n}; print("ok",s["id"],n,"quadros")
open("overlay/data_slots.js","w").write("window.SLOTS="+json.dumps(out)+";")
