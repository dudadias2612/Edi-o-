"""Controle de qualidade do MP4 final. Gera REVISAO_VISUAL/ e qc_resultado.json."""
import subprocess, json, re, os, sys, numpy as np, cv2, io
from PIL import Image, ImageDraw, ImageFont
OUT=sys.argv[1] if len(sys.argv)>1 else "saida/NEXTAGS_DUDA_PREVIA_APROVACAO.mp4"
os.makedirs("REVISAO_VISUAL",exist_ok=True); R={}
def run(c): return subprocess.run(c,capture_output=True,text=True)
pr=json.loads(run(["ffprobe","-v","error","-show_streams","-show_format","-of","json",OUT]).stdout)
v=[s for s in pr["streams"] if s["codec_type"]=="video"][0]; a=[s for s in pr["streams"] if s["codec_type"]=="audio"][0]
R["video"]={k:v.get(k) for k in("codec_name","profile","width","height","pix_fmt","r_frame_rate","color_space","color_transfer","color_primaries","color_range","nb_frames","bit_rate")}
R["audio"]={k:a.get(k) for k in("codec_name","sample_rate","channels","bit_rate")}
R["formato"]={"duracao_s":float(pr["format"]["duration"]),"tamanho_MB":round(int(pr["format"]["size"])/1e6,1),"faststart":open(OUT,"rb").read(64*1024).find(b"moov")>0}
# decodificação completa sem erros
e=run(["ffmpeg","-v","error","-i",OUT,"-f","null","-"]); R["erros_decodificacao"]=e.stderr.strip() or "nenhum"
# loudness / true peak
l=run(["ffmpeg","-hide_banner","-nostats","-i",OUT,"-vn","-af","ebur128=peak=true","-f","null","-"]).stderr
R["loudness"]={"integrado_LUFS":float(re.findall(r"I:\s+(-?[\d.]+) LUFS",l)[-1]),"LRA":float(re.findall(r"LRA:\s+([\d.]+) LU",l)[-1]),"true_peak_dBFS":float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS",l)[-1])}
# telas pretas / frames congelados
b=run(["ffmpeg","-hide_banner","-nostats","-i",OUT,"-vf","blackdetect=d=0.1:pix_th=0.06","-an","-f","null","-"]).stderr
R["telas_pretas"]=re.findall(r"black_start:([\d.]+) black_end:([\d.]+)",b) or "nenhuma"
fz=run(["ffmpeg","-hide_banner","-nostats","-i",OUT,"-vf","freezedetect=n=-60dB:d=0.8","-an","-f","null","-"]).stderr
R["trechos_congelados_>0.8s"]=re.findall(r"freeze_start: ([\d.]+)",fz) or "nenhum"
_x=np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",OUT,"-vn","-f","f32le","-ac","2","-"],capture_output=True).stdout,np.float32)
R["clipping"]={"amostras_>=0.999":int((np.abs(_x)>=0.999).sum()),"pico_amostra_dBFS":round(float(20*np.log10(np.abs(_x).max())),2)}
# preservação dos primeiros 30 s: PSNR do original vs final na faixa superior (sem legendas), quadro a quadro
def frames(path,t0,t1,fps=2):
    p=subprocess.run(["ffmpeg","-v","error","-ss",str(t0),"-t",str(t1-t0),"-i",path,"-vf",f"fps={fps},crop=1080:750:0:250,scale=540:375","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
    return np.frombuffer(p,np.uint8).reshape(-1,375,540,3)
fo=frames("entrada/original_nextags_v1.mov",0,29,2); ff=frames(OUT,0,29,2); n=min(len(fo),len(ff))
mse=((fo[:n].astype(float)-ff[:n].astype(float))**2).mean(axis=(1,2,3)); ps=10*np.log10(255**2/np.maximum(mse,1e-9))
R["preservacao_0_29s"]={"PSNR_medio_dB":round(float(ps.mean()),1),"PSNR_minimo_dB":round(float(ps.min()),1),"obs":"faixa y=250..1000 (títulos/mockups já editados), fora do marcador da prévia e das legendas"}
json.dump(R,open("REVISAO_VISUAL/qc_resultado.json","w"),indent=1,ensure_ascii=False); print(json.dumps(R,indent=1,ensure_ascii=False))
# pranchas de revisão (a cada 5 s) + momentos-chave
def still(t):
    d=subprocess.run(["ffmpeg","-v","error","-ss",f"{t:.3f}","-i",OUT,"-frames:v","1","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    return Image.open(io.BytesIO(d)).convert("RGB")
font=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf",26)
ts=[i*5.0 for i in range(0,31)]+[151.4]
for k in range(0,len(ts),8):
    sh=Image.new("RGB",(360*8,640),"black")
    for i,t in enumerate(ts[k:k+8]):
        sh.paste(still(t).resize((360,640),Image.LANCZOS),(i*360,0)); d=ImageDraw.Draw(sh); d.rectangle([i*360,0,i*360+100,32],fill="black"); d.text((i*360+4,2),f"{t:.0f}s",fill="yellow",font=font)
    sh.save(f"REVISAO_VISUAL/prancha_{k//8+1}.jpg",quality=90)
chave={"01_gancho":1.0,"02_cena_D_interesse_perdido":33.8,"03_cena_E_fluxo":40.9,"04_cena_F_nextags":49.4,"05_P1_conexao":51.8,"06_P2_automacao":56.5,"07_P3_configuracao":62.5,"08_P4_teste_comentario":71.2,"09_P4_teste_direct":77.2,"10_cena_I_aplicacoes":102.0,"11_cena_J_estrategia":115.5,"12_cena_K_cta":128.5,"13_cena_L_comparacao":148.2,"14_quadro_final":151.7}
for n,t in chave.items(): still(t).save(f"REVISAO_VISUAL/{n}.jpg",quality=92)
print("revisão visual salva")
