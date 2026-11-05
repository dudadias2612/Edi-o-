"""Prévia rápida: compõe overlay (atrás/frente) sobre quadros do vídeo e monta uma prancha.
uso: python3 scripts/preview_sheet.py <dir_overlay> <saida.png> t1,t2,... [--matte]"""
import sys, json, subprocess, numpy as np, os
from PIL import Image, ImageDraw, ImageFont
d,out,ts=sys.argv[1],sys.argv[2],[float(x) for x in sys.argv[3].split(",")]
use_matte="--matte" in sys.argv
man=json.load(open(f"{d}/manifest.json"))
tiles=[]
for t in ts:
    f=round(t*30)
    base=subprocess.run(["ffmpeg","-v","error","-ss",f"{min(t,150.3):.3f}","-i","entrada/original_nextags_v1.mov","-frames:v","1","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    import io
    im=Image.open(io.BytesIO(base)).convert("RGBA")
    rec=man.get(str(f),{})
    if rec.get("behind"): im=Image.alpha_composite(im,Image.open(f"{d}/{rec['behind']}").convert("RGBA"))
    if rec.get("behind") and use_matte and os.path.exists("work/matte.mkv"):
        m=subprocess.run(["ffmpeg","-v","error","-ss",f"{t:.3f}","-i","work/matte.mkv","-frames:v","1","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
        mm=Image.open(io.BytesIO(m)).convert("L"); orig=Image.open(io.BytesIO(base)).convert("RGBA"); orig.putalpha(mm); im=Image.alpha_composite(im,orig)
    if rec.get("front"): im=Image.alpha_composite(im,Image.open(f"{d}/{rec['front']}").convert("RGBA"))
    tiles.append(im.convert("RGB").resize((405,720),Image.LANCZOS))
cols=min(4,len(tiles)); rows=-(-len(tiles)//cols)
sheet=Image.new("RGB",(405*cols,720*rows),"black"); font=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf",22)
for i,(t,im) in enumerate(zip(ts,tiles)):
    sheet.paste(im,((i%cols)*405,(i//cols)*720)); dr=ImageDraw.Draw(sheet); dr.rectangle([(i%cols)*405,(i//cols)*720,(i%cols)*405+80,(i//cols)*720+28],fill="black"); dr.text(((i%cols)*405+4,(i//cols)*720+2),f"{t}s",fill="yellow",font=font)
sheet.save(out)
