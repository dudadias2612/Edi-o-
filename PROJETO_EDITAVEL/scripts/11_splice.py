"""Emenda sem recodificar: pacotes do vídeo anterior (fora da janela) + segmento novo (janela das gravações reais).
Garante que tudo fora do segmento é bit a bit o mesmo do arquivo anterior.
uso: 11_splice.py anterior_silencioso.mp4 segmento.mp4 saida_silenciosa.mp4 quadro_ini quadro_fim_exclusivo"""
import av, sys
prev_p,seg_p,out_p,fa,fb=sys.argv[1],sys.argv[2],sys.argv[3],int(sys.argv[4]),int(sys.argv[5]); PTS_PER=512
ci=av.open(prev_p); si=ci.streams.video[0]; P=[p for p in ci.demux(si) if p.size]
cs=av.open(seg_p); ss=cs.streams.video[0]; S=[p for p in cs.demux(ss) if p.size]
assert bytes(si.codec_context.extradata)==bytes(ss.codec_context.extradata),"SPS/PPS diferentes"
assert P[fa].is_keyframe and P[fb].is_keyframe and P[fa].pts==fa*PTS_PER and P[fb].pts==fb*PTS_PER,"cortes não estão em quadros-chave"
off=fa*PTS_PER; assert len(S)==fb-fa
oc=av.open(out_p,"w"); os_=oc.add_stream_from_template(si)
last=-10**12
def put(p,d_off=0):
    global last
    p.pts+=d_off; p.dts+=d_off; assert p.dts>last,(p.dts,last); last=p.dts; p.stream=os_; oc.mux(p)
for p in P[:fa]: put(p)
for p in S: put(p,off)
for p in P[fb:]: put(p)
oc.close(); print("ok",len(P[:fa]),len(S),len(P[fb:]),"=",len(P[:fa])+len(S)+len(P[fb:]))
