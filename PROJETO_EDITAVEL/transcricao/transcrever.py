"""Transcreve a voz com Whisper large-v3 (local) e salva palavras com timestamps."""
import json,time,sys,numpy as np,soundfile as sf
from faster_whisper import WhisperModel
a,sr=sf.read("assets/audio/voz16k.wav",dtype="float32"); assert sr==16000
m=WhisperModel("large-v3",device="cpu",compute_type="int8",download_root="/home/user/models")
t=time.time()
segs,info=m.transcribe(a,language="pt",word_timestamps=True,vad_filter=False,beam_size=5,
  initial_prompt="Nextags, Instagram, Direct, AUTOMATIZAR, automação de comentários, Reels, link, creator.",
  condition_on_previous_text=False)
out=[]
for s in segs:
    out.append({"start":s.start,"end":s.end,"text":s.text,"words":[{"w":w.word,"s":w.start,"e":w.end,"p":w.probability} for w in s.words]})
json.dump(out,open("transcricao/whisper_raw.json","w"),ensure_ascii=False,indent=1)
print("tempo",round(time.time()-t),"segs",len(out))
for s in out: print(f"[{s['start']:6.2f}-{s['end']:6.2f}] {s['text'].strip()}")
