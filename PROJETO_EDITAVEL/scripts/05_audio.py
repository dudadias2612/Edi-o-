"""Áudio: voz tratada + biblioteca de SFX sintetizados + trilha original (120 BPM) + ducking + master -14 LUFS.
Tudo gerado em código (nenhuma amostra de terceiros)."""
import numpy as np, soundfile as sf, subprocess, json, sys
from scipy import signal
import pyloudnorm as pyln
SR=48000; T=152.3; N=int(T*SR); rng=np.random.default_rng(7)
dB=lambda x:10**(x/20)
def tarr(d): return np.arange(int(d*SR))/SR
def norm(x,peak_db=-3): m=np.abs(x).max(); return x*(dB(peak_db)/m) if m>0 else x
def stereo(x,pan=0.0): # pan -1..1, lei de potência constante
    a=(pan+1)*np.pi/4; return np.stack([x*np.cos(a),x*np.sin(a)],1)
def sos_f(x,kind,fc,order=4): return signal.sosfilt(signal.butter(order,fc,kind,fs=SR,output='sos'),x)
# ====================== SFX ======================
def sfx_pop(f0=950,f1=330,d=.16):
    t=tarr(d); f=f1+(f0-f1)*np.exp(-t*34); ph=2*np.pi*np.cumsum(f)/SR
    y=np.sin(ph)*np.exp(-t*30)*(1-np.exp(-t*900)); y+=0.35*np.sin(2*ph)*np.exp(-t*55)
    c=sos_f(rng.standard_normal(len(t)),'highpass',2500)*np.exp(-t*900)*.12; return norm(y+c)
def sfx_click(f=1900,d=.05):
    t=tarr(d); y=sos_f(rng.standard_normal(len(t)),'highpass',3000)*np.exp(-t*700)*.6+np.sin(2*np.pi*f*t)*np.exp(-t*260)*.8
    return norm(sos_f(y,'lowpass',9000,2))
def sweep_noise(d,f0,f1,width=1.1,seed=0):
    r=np.random.default_rng(seed); n=int(d*SR); x=r.standard_normal(n)
    f,tt,Z=signal.stft(x,SR,nperseg=1024,noverlap=896); ff=np.maximum(f,1)[:,None]
    cen=(f0*(f1/f0)**(np.clip(tt/d,0,1)))[None,:]
    Z=Z*np.exp(-0.5*(np.log2(ff/cen)/(width/2))**2); _,y=signal.istft(Z,SR,nperseg=1024,noverlap=896); y=y[:n]
    return np.pad(y,(0,max(0,n-len(y))))
def sfx_whoosh(d=.45,f0=350,f1=3800,seed=1,rev=False):
    L=sweep_noise(d,f0,f1,1.3,seed); R=sweep_noise(d,f0,f1,1.3,seed+50)
    t=np.linspace(0,1,len(L)); env=np.sin(np.pi*t**(0.8))**2
    if rev: env=np.sin(np.pi*t**(1.6))**2
    y=np.stack([L*env,R*env],1); return y/np.abs(y).max()*dB(-3)
def sfx_impact(d=.9):
    t=tarr(d); f=44+90*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR; y=np.sin(ph)*np.exp(-t*5.2)*(1-np.exp(-t*400))
    n=sos_f(rng.standard_normal(len(t)),'lowpass',1400,2)*np.exp(-t*24)*.5
    h=sos_f(rng.standard_normal(len(t)),'highpass',4000)*np.exp(-t*60)*.08
    return norm(np.tanh(1.6*(y+n+h))/np.tanh(1.6))
def sfx_riser(d=2.0,f0=300,f1=7000,seed=3):
    L=sweep_noise(d,f0,f1,1.6,seed); R=sweep_noise(d,f0,f1,1.6,seed+9)
    t=np.linspace(0,1,len(L)); env=(t**2.4)*(1-np.exp(-np.linspace(0,1,len(L))*40)*0)
    tone=np.sin(2*np.pi*np.cumsum(180+900*t**2)/SR)*.12*t**2
    y=np.stack([L*env+tone,R*env+tone],1); y[-int(.02*SR):]*=np.linspace(1,0,int(.02*SR))[:,None]; return y/np.abs(y).max()*dB(-3)
def bell(f,d,decay=9,mod=1.1):
    t=tarr(d); return np.sin(2*np.pi*f*t+mod*np.sin(2*np.pi*2.01*f*t)*np.exp(-t*14))*np.exp(-t*decay)*(1-np.exp(-t*1500))
def sfx_notify(): # dois toques suaves, assinatura própria (não imita nenhum app)
    y=np.zeros(int(.7*SR)); a=bell(1318.5,.55); b=bell(1975.5,.5,decay=8); y[:len(a)]+=a*.9; o=int(.115*SR); y[o:o+len(b)]+=b
    return norm(stereo(y,0)*1.0,-3)
def sfx_confirm():
    y=np.zeros(int(.5*SR))
    for i,f in enumerate([1046.5,1318.5,1568]):
        b=bell(f,.3,decay=11,mod=.6); o=int(i*.07*SR); y[o:o+len(b)]+=b
    return norm(stereo(y,0),-3)
def sfx_down(d=.8):
    t=tarr(d); f=520*np.exp(-t*3.2)+90; y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3.6)*(1-np.exp(-t*60)); y=sos_f(y,'lowpass',900,2)
    n=sweep_noise(d,2400,260,1.2,5)*np.exp(-t*4)*.25; return norm(stereo(y+n,0))
def sfx_type(n=8,gap=.075):
    L=int((n*gap+.1)*SR); y=np.zeros(L)
    for i in range(n):
        c=sfx_click(1500+rng.integers(0,700),.04); o=int(i*gap*SR+rng.integers(0,int(.008*SR))); y[o:o+len(c)]+=c*rng.uniform(.6,1)
    return stereo(y/np.abs(y).max()*dB(-3),0)
LIB={'pop':lambda s=0:sfx_pop(950*(1+.06*s),330*(1+.04*s)),'click':lambda s=0:sfx_click(1900*(1+.12*s)),'whoosh':lambda s=0:sfx_whoosh(.42,320,3600,10+int(s)),
     'whoosh_s':lambda s=0:sfx_whoosh(.3,500,5200,20+int(s)),'impact':lambda s=0:sfx_impact(),'riser':lambda s=0:sfx_riser(2.0),'notify':lambda s=0:sfx_notify(),
     'confirm':lambda s=0:sfx_confirm(),'down':lambda s=0:sfx_down(),'digital':lambda s=0:sfx_whoosh(.5,900,7000,40)}
# cue: (tempo, tipo, pico dBFS, variação)
CUES=[
 # --- trecho já editado por você (instantes medidos quadro a quadro no MP4 de entrada) ---
 (0.40,'pop',-21,0),(4.50,'impact',-15,0),(6.00,'pop',-21,0),(6.20,'pop',-22,1),(6.50,'pop',-22,2),(6.90,'pop',-22,3),(8.15,'whoosh_s',-26,0),
 (10.10,'pop',-22,1),(10.70,'click',-22,0),(11.00,'pop',-20,2),(12.10,'pop',-22,-1),(13.85,'whoosh_s',-26,1),(13.95,'pop',-22,3),
 (14.90,'riser',-31,0),(16.90,'impact',-17,0),(17.88,'whoosh_s',-25,2),(18.00,'down',-22,0),(18.10,'pop',-22,1),(18.90,'pop',-22,2),(19.90,'pop',-22,-1),
 (20.70,'whoosh_s',-27,3),(20.85,'whoosh',-26,0),(23.10,'whoosh_s',-27,4),(24.00,'pop',-22,0),(25.20,'click',-19,0),(25.85,'click',-19,-1),(26.50,'click',-19,1),
 (27.40,'pop',-22,1),(28.40,'whoosh_s',-26,5),
 # --- trecho novo ---
 (30.30,'pop',-21,0),(32.78,'down',-21,0),(33.46,'impact',-19,0),(37.46,'pop',-21,1),(38.50,'click',-23,0),(38.80,'pop',-21,2),(39.98,'click',-23,1),
 (40.12,'pop',-21,3),(40.50,'notify',-20,0),(42.55,'whoosh_s',-28,5),(44.00,'digital',-27,0),(48.46,'impact',-17,0),(50.18,'whoosh',-26,1),
 (50.50,'whoosh_s',-28,6),(50.62,'pop',-22,0),(52.60,'whoosh_s',-28,7),(52.66,'click',-21,0),(53.54,'click',-24,1),(54.86,'click',-21,0),(54.86,'click',-24,2),
 (56.92,'click',-24,1),(58.50,'whoosh_s',-28,8),(58.50,'click',-24,0),(59.62,'click',-21,0),(60.22,'click',-24,1),(61.12,'click',-21,0),(61.82,'click',-24,2),
 (64.04,'click',-24,1),(65.20,'click',-24,0),(65.84,'pop',-21,0),(66.46,'whoosh_s',-27,9),(68.00,'whoosh',-27,2),(71.30,'pop',-22,1),(72.30,'whoosh_s',-27,10),
 (73.30,'click',-24,0),(74.14,'pop',-22,2),(75.95,'notify',-16,0),(81.62,'impact',-19,0),(88.26,'whoosh_s',-27,11),(91.12,'pop',-21,0),(93.98,'pop',-21,1),
 (97.22,'pop',-21,2),(100.36,'pop',-21,3),(91.10,'whoosh_s',-29,12),(93.96,'whoosh_s',-29,13),(97.20,'whoosh_s',-29,14),(100.34,'whoosh_s',-29,15),
 (104.52,'whoosh',-27,3),(104.92,'impact',-19,0),(114.40,'impact',-24,0),(117.12,'impact',-24,0),(121.66,'whoosh_s',-27,16),(124.80,'riser',-26,0),
 (126.52,'pop',-21,0),(126.90,'impact',-14,0),(127.88,'pop',-21,1),(130.60,'click',-23,0),(130.92,'notify',-18,0),(135.84,'whoosh_s',-27,17),
 (143.56,'pop',-21,2),(146.70,'click',-23,1),(147.30,'pop',-21,3),(149.05,'riser',-33,0),(150.37,'impact',-14,0),(150.46,'impact',-20,0),(150.90,'pop',-21,0)]
EXTRA_TYPING=[(70.42,8,.078,-27)]
def place(buf,x,t,gdb):
    if x.ndim==1: x=stereo(x,0)
    i=int(t*SR); n=min(len(x),len(buf)-i)
    if i<0 or n<=0: return
    pk=np.abs(x).max(); buf[i:i+n]+=x[:n]/pk*dB(gdb)
SFX_TRIM=7.0   # dB globais nos efeitos (impactos limitados a -9 dBFS)
def build_sfx():
    b=np.zeros((N,2)); cache={}
    for t,k,db,v in CUES:
        key=(k,v); 
        if key not in cache: cache[key]=LIB[k](v)
        place(b,cache[key],t,min(db+SFX_TRIM,-9.0))
    for t,n,g,db in EXTRA_TYPING: place(b,sfx_type(n+3,g),t,db+SFX_TRIM)
    return b
# ====================== MÚSICA ======================
BEAT=.5; PH=.2
def additive_saw(f,d,hmax=5200,det=0.0):
    t=tarr(d); y=np.zeros(len(t)); h=1
    while h*f<hmax: y+=np.sin(2*np.pi*h*f*(1+det)*t+h*0.7)/h; h+=1
    return y
def k_kick():
    t=tarr(.42); f=46+120*np.exp(-t*34); y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*8.5)*(1-np.exp(-t*800))+sos_f(rng.standard_normal(len(t)),'highpass',1800)*np.exp(-t*700)*.18
    return np.tanh(1.25*y)
def k_clap():
    t=tarr(.3); n=sos_f(rng.standard_normal(len(t)),'bandpass',[1100,3600],2); e=np.exp(-t*22)
    for o in (.012,.024): e+=np.exp(-np.maximum(t-o,0)*22)*(t>=o)*.7
    return n*e*.5
def k_hat(op=False):
    t=tarr(.25 if op else .07); return sos_f(rng.standard_normal(len(t)),'highpass',7500)*np.exp(-t*(16 if op else 90))*.35
def k_bass(f,d=.5):
    t=tarr(d); y=np.sin(2*np.pi*f*t)+.38*np.sin(4*np.pi*f*t)+.12*np.sin(6*np.pi*f*t); y=np.tanh(1.8*y)*np.exp(-t*3.2)*(1-np.exp(-t*600)); return sos_f(y,'lowpass',260,2)
def k_pad(freqs,d=2.4):
    t=tarr(d); y=np.zeros(len(t))
    for f in freqs:
        for det in (-.004,0,.0045): y+=additive_saw(f,d,2400,det)*.1
    y=sos_f(y,'lowpass',1300,2); e=np.minimum(1,t/.5)*np.minimum(1,(d-t)/.6); return y*e
def k_pluck(f,d=.34):
    t=tarr(d); y=np.zeros(len(t)); h=1
    while h*f<6000: y+=np.sin(2*np.pi*h*f*t+h)/h*np.exp(-t*(11+h*2.6)); h+=1
    return y*(1-np.exp(-t*900))
CH={'Am':([110,220,261.6,329.6],[220,261.6,329.6,440,523.3]),'F':([87.3,174.6,220,261.6],[220,261.6,349.2,440,523.3]),
    'C':([130.8,261.6,329.6,392],[261.6,329.6,392,523.3,659.3]),'G':([98,196,246.9,293.7],[196,246.9,293.7,392,493.9])}
ROOT={'Am':110,'F':87.31,'C':130.81,'G':98}
PROGS={'A':['Am','F','C','G'],'B':['C','G','Am','F'],'U':['F','C','G','Am']}
snap=lambda t:PH+round((t-PH)/BEAT)*BEAT
# seção: (t, kick, kickpat, clap, hat, bass, pad, arp, prog)
SECT=[(0,.80,'four',0,.55,.65,.30,.55,'A'),(11.1,.62,'half',0,.40,.70,.45,.42,'A'),(29.4,0,'half',0,0,.30,.55,.22,'A'),
 (34.2,.88,'four',.55,.60,.82,.55,.62,'B'),(50.2,0,'half',0,.28,.45,.40,.26,'A'),(65.8,.62,'four',.45,.50,.62,.45,.50,'U'),(72.0,.92,'four',.70,.70,.88,.50,.78,'U'),
 (86.3,.88,'four',.65,.72,.86,.45,.82,'B'),(104.9,0,'half',0,0,.36,.60,.16,'A'),(121.0,.98,'four',.75,.82,1.0,.50,.86,'U'),(124.9,0,'half',0,.2,.6,.6,.5,'U'),(126.9,1.0,'four',.80,.85,1.0,.55,.90,'U'),
 (141.4,.72,'four',.5,.6,.80,.55,.62,'B'),(149.0,0,'half',0,.3,.5,.65,.3,'B'),(150.37,0,'half',0,0,0,.0,0,'B')]
def sect_at(t):
    cur=SECT[0]
    for s in SECT:
        if t>=s[0]-1e-6: cur=s
    return cur
def build_music(voice_env=None):
    N2=N; stems={k:np.zeros((N2,2)) for k in ('drums','bass','pad','arp')}
    kick,clap,hh,hho=k_kick(),k_clap(),k_hat(),k_hat(True)
    nb=int((T-PH)/BEAT)
    cache={}
    def add(stem,x,t,g,pan=0):
        i=int(t*SR); 
        if i<0 or i>=N2: return
        x=stereo(x,pan) if x.ndim==1 else x; n=min(len(x),N2-i); stems[stem][i:i+n]+=x[:n]*g
    for k in range(nb):
        t=PH+k*BEAT; s=sect_at(t); _,kg,kp,cg,hg,bg,pg,ag,prog=s
        if t>=150.2: continue
        bar=int((t-PH)//(4*BEAT)); ch=PROGS[prog][bar%4]; step_in_bar=k%4
        # bateria
        if kg>0 and (kp=='four' or step_in_bar in (0,2)): add('drums',kick,t,kg*.95)
        if cg>0 and step_in_bar in (1,3): add('drums',clap,t,cg*.55,.05)
        if hg>0:
            add('drums',hh,t+.25*BEAT*0,hg*.55*(0.6 if step_in_bar else 1),.15)
            add('drums',hho if step_in_bar%2==0 else hh,t+.5*BEAT,hg*.7,-.12)
            add('drums',hh,t+.25*BEAT,hg*.28,.1); add('drums',hh,t+.75*BEAT,hg*.30,-.1)
        # baixo (síncope 8ths)
        if bg>0:
            r=ROOT[ch]; 
            for off,mul,dur in ((0,1,.45),(.5,1,.2),(.75,2 if prog!='A' else 1,.2)):
                if step_in_bar in (0,2) or off==.5:
                    key=(r*mul,dur); 
                    if key not in cache: cache[key]=k_bass(r*mul,.5)
                    if off==0 or step_in_bar in (0,2): add('bass',cache[key],t+off*BEAT,bg*.9)
        # arp 16ths
        if ag>0:
            tones=CH[ch][1]; pat=[0,2,1,3,2,1,3,1,0,2,1,3,2,4,3,1]
            for j in range(4):
                idx=pat[(step_in_bar*4+j)%16]%len(tones); f=tones[idx]*(2 if prog=='B' else 1)
                key=('p',f); 
                if key not in cache: cache[key]=k_pluck(f,.34)
                add('arp',cache[key],t+j*BEAT/4,ag*(1.0 if j==0 else .62)*.5,-.35+.7*((j+step_in_bar)%2))
        # pad uma vez por compasso
        if pg>0 and step_in_bar==0:
            key=('pad',ch)
            if key not in cache: cache[key]=k_pad(CH[ch][1][:4],2.5)
            add('pad',cache[key],t,pg*.9,0)
    # cadência final: acorde de C (tônica) + cauda
    t0=150.37
    st=k_pad([130.8,261.6,329.6,392,523.3],2.7)
    pl=sum(np.pad(k_pluck(f,.9),(0,int(2.7*SR)-int(.9*SR)))*.45 for f in (523.3,659.3,784))
    kk=k_kick()
    add('pad',st,t0,.95); add('arp',pl,t0,.8); add('drums',kk,t0,.9); add('bass',k_bass(65.4,1.6),t0,.9)
    # reverb nos instrumentos melódicos
    def rev(x,wet,tau=.55,seed=0):
        r=np.random.default_rng(seed); n=int(1.9*SR); tt=np.arange(n)/SR; out=np.zeros_like(x)
        for c in (0,1):
            ir=r.standard_normal(n)*np.exp(-tt/tau); ir=sos_f(ir,'lowpass',5000,2); ir[:int(.018*SR)]*=np.linspace(0,1,int(.018*SR)); ir/=np.sqrt((ir**2).sum())
            out[:,c]=signal.fftconvolve(x[:,c],ir)[:len(x)]
        return x*(1-wet)+out*wet*1.4
    stems['pad']=rev(stems['pad'],.35,.7,1); stems['arp']=rev(stems['arp'],.30,.5,2)
    mix=stems['drums']*1.0+stems['bass']*1.05+stems['pad']*.8+stems['arp']*.62
    # fim: fade final
    mix[int(151.7*SR):]*=np.linspace(1,0,N-int(151.7*SR))[:,None]
    return mix
def smooth_env(x,fs,att,rel):
    a=np.exp(-1/(att*fs)); r=np.exp(-1/(rel*fs)); y=np.zeros_like(x); s=0.0
    for i in range(len(x)):
        v=x[i]; s=a*s+(1-a)*v if v>s else r*s+(1-r)*v; y[i]=s
    return y
def main():
    voice_raw,_=sf.read("work/audio/voz_declip.wav")
    voice=np.zeros(N); n=min(len(voice_raw),N); voice[:n]=voice_raw[:n]
    m=pyln.Meter(SR); lv=m.integrated_loudness(np.stack([voice,voice],1)); g=dB(-15.0-lv); voice*=g
    print("voz: LUFS bruto",round(lv,2),"-> ganho",round(20*np.log10(g),2),"dB; pico",np.abs(voice).max())
    sfx=build_sfx(); print("sfx ok",np.abs(sfx).max())
    music=build_music(); print("música ok",np.abs(music).max())
    # envelope da voz em 200 Hz (RMS 25 ms) -> ducking
    hop=SR//200; frames=len(voice)//hop; rms=np.sqrt((voice[:frames*hop].reshape(frames,hop)**2).mean(1))
    env=smooth_env(np.clip(rms/0.075,0,1),200,.04,.45)
    envs=np.interp(np.arange(N)/SR,np.arange(frames)/200,env)
    depth=11.0; duck=10**(-depth*envs/20)
    # redução extra na seção estratégica (104,9-121)
    ex=np.ones(N); 
    for a,b,gdb in ((104.9,121.0,-2.0),(29.4,34.2,-2.0)):
        i0,i1=int(a*SR),int(b*SR); r=int(.6*SR); w=np.ones(N); w[i0:i1]=dB(gdb); ex=np.minimum(ex,1)*1; ex[i0:i1]=dB(gdb)
    ex=signal.sosfiltfilt(signal.butter(2,1.2,'lowpass',fs=SR,output='sos'),ex)
    md=music*(duck*ex)[:,None]
    # nível da música: integrado = voz - 19 LU
    lm=pyln.Meter(SR).integrated_loudness(md); target=-15.0-17.0; gm=dB(target-lm); md*=gm
    print("música: LUFS",round(lm,2),"-> ganho",round(20*np.log10(gm),2))
    vstereo=np.stack([voice,voice],1)
    mix=vstereo+md+sfx
    lmix=m.integrated_loudness(mix); mix*=dB(-14.0-lmix); print("mix LUFS",round(lmix,2),"-> normalizado -14; pico",np.abs(mix).max())
    for nme,x in (('voz',vstereo),('musica',md),('sfx',sfx),('mix_pre',mix)): sf.write(f"work/audio/{nme}.wav",x.astype(np.float32),SR,subtype='FLOAT')
    json.dump({"cues":CUES},open("work/audio/cues.json","w"))
if __name__=="__main__": main()
