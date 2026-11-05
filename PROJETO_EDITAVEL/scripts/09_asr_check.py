"""Transcreve o ÁUDIO FINAL (voz+música+SFX) e compara com o texto revisado: prova que a música não encobre a fala."""
import json, re, unicodedata, difflib, numpy as np, soundfile as sf, subprocess, sys
from faster_whisper import WhisperModel
src=sys.argv[1] if len(sys.argv)>1 else "work/audio/mix_master.wav"
subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-ac","1","-ar","16000","work/audio/_final16k.wav"],check=True)
a,_=sf.read("work/audio/_final16k.wav",dtype="float32")
m=WhisperModel("large-v3",device="cpu",compute_type="int8",download_root="/home/user/models")
segs,_=m.transcribe(a,language="pt",beam_size=5,condition_on_previous_text=False,initial_prompt="Nextags, Instagram, Direct, AUTOMATIZAR, automação de comentários.")
hyp=" ".join(s.text for s in segs)
def norm(t):
    t=unicodedata.normalize("NFD",t.lower()); t="".join(c for c in t if unicodedata.category(c)!="Mn"); return re.findall(r"[a-z0-9]+",t)
ref=norm(open("transcricao/texto_revisado.txt").read()); h=norm(hyp)
# normaliza variantes de marca
fix=lambda L:[("nextags" if w in("nextex","nextags","nextegs") else w) for w in L]; ref,h=fix(ref),fix(h)
sm=difflib.SequenceMatcher(None,ref,h,autojunk=False); eq=sum(b.size for b in sm.get_matching_blocks())
wer=1-eq/len(ref); print(f"palavras ref={len(ref)} hyp={len(h)}  acerto={eq/len(ref):.3f}  (taxa de divergência={wer:.3f})")
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag!="equal": print(tag,"REF:",ref[i1:i2],"| ÁUDIO FINAL:",h[j1:j2])
json.dump({"palavras_ref":len(ref),"acerto":round(eq/len(ref),4),"hipotese":hyp},open("REVISAO_VISUAL/asr_audio_final.json","w"),ensure_ascii=False,indent=1)
