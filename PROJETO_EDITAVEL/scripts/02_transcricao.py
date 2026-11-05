"""Alinha o texto revisado aos tempos por palavra do Whisper e gera:
transcricao/palavras_revisadas.json, config/caption_groups.json, LEGENDAS_NEXTAGS.srt, LEGENDAS_ESTILIZADAS.ass"""
import json, re, difflib, unicodedata
raw=json.load(open("transcricao/whisper_raw.json"))
rw=[w for s in raw for w in s["words"]]
# remove duplicatas de comprimento zero no fim do trecho "no Instagram" (116.78)
rw=[w for i,w in enumerate(rw) if not (w["e"]-w["s"]<0.001 and i>0 and w["s"]>=rw[i-1]["e"]-0.001 and w["s"]==w["e"])]
def norm(x):
    x=unicodedata.normalize("NFD",x.lower()); x="".join(c for c in x if unicodedata.category(c)!="Mn")
    return re.sub(r"[^a-z0-9]","",x)
cur=open("transcricao/texto_revisado.txt").read().split()
a=[norm(w["w"]) for w in rw]; b=[norm(t) for t in cur]
# "-chave," vem separado de "palavra" no Whisper: junta
sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
out=[None]*len(cur); 
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=="equal":
        for k in range(i2-i1): out[j1+k]=rw[i1+k]
    elif tag=="replace" and (i2-i1)==(j2-j1):
        for k in range(i2-i1): out[j1+k]=rw[i1+k]
    elif tag=="replace":
        # distribui proporcionalmente
        for k in range(j2-j1): out[j1+k]=rw[min(i1+int(k*(i2-i1)/(j2-j1)),i2-1)]
# preenche faltantes (palavra composta palavra-chave) por interpolação
words=[]
for j,t in enumerate(cur):
    w=out[j]
    words.append({"t":t,"s":w["s"] if w else None,"e":w["e"] if w else None,"p":w["p"] if w else 0})
for j,w in enumerate(words):
    if w["s"] is None:
        pj=max(i for i in range(j) if words[i]["s"] is not None); nj=min(i for i in range(j+1,len(words)) if words[i]["s"] is not None)
        w["s"]=words[pj]["e"]; w["e"]=words[nj]["s"]
# Whisper atribui pausas à palavra anterior: limita a duração plausível da palavra
for j,w in enumerate(words):
    dur=w["e"]-w["s"]; plaus=0.10+0.055*len(re.sub(r"\W","",w["t"]))
    w["e_eff"]=round(w["s"]+min(dur,max(plaus,0.22)) ,3)
    w["s"]=round(w["s"],3); w["e"]=round(w["e"],3)
json.dump(words,open("transcricao/palavras_revisadas.json","w"),ensure_ascii=False,indent=1)
print("palavras",len(words))
# ---- grupos de legenda ----
KEY={"vídeo viral":"VÍDEO VIRAL","instagram":"INSTAGRAM","automação":"AUTOMAÇÃO","comentários":"COMENTÁRIOS","direct":"DIRECT","dm":"DM","nextags":"NEXTAGS","automatizar":"AUTOMATIZAR","automações":"AUTOMAÇÕES","automáticas":"AUTOMÁTICAS","automaticamente":"AUTOMATICAMENTE"}
def isend(t): return re.search(r"[.?!]$",t) is not None
def iscomma(t): return t.endswith(",")
# 1) frases: quebra em pontuação ou pausa longa; 2) divide frases longas em blocos equilibrados de 2-4 palavras
phrases=[];cur_p=[]
for j,w in enumerate(words):
    cur_p.append(j)
    nxt=words[j+1] if j+1<len(words) else None
    gap=(nxt["s"]-w["e_eff"]) if nxt else 9
    if isend(w["t"]) or iscomma(w["t"]) or gap>0.55:
        phrases.append(cur_p);cur_p=[]
if cur_p: phrases.append(cur_p)
# vírgulas curtas (1-2 palavras) grudam na frase seguinte
mp=[]
for ph in phrases:
    if mp and len(mp[-1])<=2 and not isend(words[mp[-1][-1]]["t"]) and words[ph[0]]["s"]-words[mp[-1][-1]]["e_eff"]<0.55:
        mp[-1]=mp[-1]+ph
    else: mp.append(ph)
phrases=mp
def split_phrase(ph):
    n=len(ph); chars=sum(len(words[k]["t"])+1 for k in ph)
    if n<=3 or (n==4 and chars<=30): return [ph]
    k=max(2,-(-n//4)) if chars<=34 else -(-n//3)
    if n>=5: k=max(k,2)
    # tamanhos equilibrados
    base,extra=divmod(n,k); sizes=[base+(1 if i<extra else 0) for i in range(k)]
    cuts=[];c=0
    for sz in sizes[:-1]:
        c+=sz; cuts.append(c)
    # evita separar "vídeo|viral", "de|vezes" e artigo/preposição no fim do bloco
    weak={"a","o","as","os","um","uma","de","do","da","no","na","em","que","e","pra","para","por","com","meu","seu","sua","minha","eu","te","se","ao","à","nos"}
    for i,c in enumerate(cuts):
        lo=(cuts[i-1] if i else 0)+2; hi=(cuts[i+1] if i+1<len(cuts) else n)-2
        def bad(c):
            w1=re.sub(r"\W","",words[ph[c-1]]["t"]).lower(); w2=re.sub(r"\W","",words[ph[c]]["t"]).lower()
            return (w1 in weak) or (w1=="vídeo" and w2=="viral")
        if bad(c):
            for cand in (c+1,c-1,c+2,c-2):
                if lo<=cand<=hi and cand<n and not bad(cand): cuts[i]=cand;break
    out=[];prev=0
    for c in cuts+[n]:
        out.append(ph[prev:c]);prev=c
    return out
groups=[]
for ph in phrases: groups+=split_phrase(ph)
# blocos curtos demais (<0,45 s) viram parte do bloco seguinte, se couber em 5 palavras
i=0
while i<len(groups)-1:
    g=groups[i]; span=words[g[-1]]["e_eff"]-words[g[0]]["s"]
    if span<0.45 and len(g)+len(groups[i+1])<=5 and not isend(words[g[-1]]["t"]):
        groups[i]=g+groups[i+1]; del groups[i+1]
    else: i+=1
def disp(tokens):
    txt=" ".join(tokens)
    return txt
G=[]
for gi,g in enumerate(groups):
    toks=[]
    for k in g:
        t=words[k]["t"]; core=re.sub(r"[^\wÀ-ÿ-]","",t); pun=t[len(core):] if t.startswith(core) else re.sub(r"^[\wÀ-ÿ-]+","",t)
        keyword=KEY.get(core.lower())
        toks.append({"t":(keyword+pun) if keyword else t,"key":bool(keyword),"s":words[k]["s"],"e":words[k]["e_eff"]})
    # "vídeo viral" como par
    for i in range(len(toks)-1):
        if re.sub(r"\W","",toks[i]["t"]).lower()=="vídeo" and re.sub(r"\W","",toks[i+1]["t"]).lower()=="viral":
            toks[i]["t"]=toks[i]["t"].upper(); toks[i]["key"]=True; toks[i+1]["t"]=toks[i+1]["t"].upper(); toks[i+1]["key"]=True
    G.append({"id":gi,"words":toks})
# tempos de exibição
for i,g in enumerate(G):
    s=g["words"][0]["s"]-0.03; e=g["words"][-1]["e"]+0.18
    if i+1<len(G):
        ns=G[i+1]["words"][0]["s"]-0.03
        if ns-e<0.40: e=ns-0.02      # sem piscar entre blocos próximos
        else: e=min(e,ns-0.02)
    g["start"]=round(max(0,s),3); g["end"]=round(e,3)
json.dump(G,open("config/caption_groups.json","w"),ensure_ascii=False,indent=1)
print("grupos",len(G), "maior grupo palavras",max(len(g["words"]) for g in G))
def tc(t,sep=","):
    ms=int(round(t*1000)); h=ms//3600000; m=ms//60000%60; s=ms//1000%60; x=ms%1000
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{x:03d}"
with open("LEGENDAS_NEXTAGS.srt","w",encoding="utf-8") as f:
    for i,g in enumerate(G,1):
        txt=" ".join(w["t"] for w in g["words"])
        f.write(f"{i}\n{tc(g['start'])} --> {tc(g['end'])}\n{txt}\n\n")
def act(t): ms=int(round(t*100)); return f"{ms//360000}:{ms//6000%60:02d}:{ms//100%60:02d}.{ms%100:02d}"
ass=["[Script Info]","ScriptType: v4.00+","PlayResX: 1080","PlayResY: 1920","WrapStyle: 0","ScaledBorderAndShadow: yes","",
"[V4+ Styles]","Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding",
"Style: Padrao,Montserrat ExtraBold,64,&H00FFFFFF,&H00FFFFFF,&H99000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,2,2,100,140,400,1","",
"[Events]","Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text"]
for g in G:
    parts=[]
    for w in g["words"]:
        parts.append(("{\\c&HFE8F00&}"+w["t"]+"{\\c&HFFFFFF&}") if w["key"] else w["t"])   # azul #008FFE em BGR
    ass.append(f"Dialogue: 0,{act(g['start'])},{act(g['end'])},Padrao,,0,0,0,,"+" ".join(parts))
open("LEGENDAS_ESTILIZADAS.ass","w",encoding="utf-8").write("\n".join(ass)+"\n")
