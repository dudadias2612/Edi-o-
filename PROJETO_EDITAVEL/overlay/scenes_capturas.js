/* =====================================================================
   GRAVAÇÕES REAIS DA NEXTAGS (A: fluxo, B: teste) · celular + lupa sincronizada
   Dados de retime/lupa vêm de data_slots.js (gerado por scripts/07_capturas.py).
   ===================================================================== */
(function(){
  const S=window.SLOTS||{};
  function build(K,{inA,outB}){
    const d=S[K]; if(!d||!d.hl) return;
    const idx=t=>Math.min(d.hl.length-1,Math.max(0,Math.round(t*30)-d.f0)), num=t=>String(idx(t)+1).padStart(5,'0');
    const a=d.f0/30;
    // celular
    const ph=el(`<div class="scr2"><img class="media" src=""><div class="hl2"></div></div>`,'ph2','left:36px;top:348px;width:454px;height:960px',L('behind'));
    reg(ph,a,outB,t=>{ if(t>outB+.3)return null; const p=popIn(t,inA,.42), f=fadeOut(t,outB,.2);
      return{o:p.o*f,s:p.s*(.96+.04*E.out3(P(t,inA,inA+.5)))*(1-.03*(1-f)),y:(1-E.out4(P(t,inA,inA+.5)))*70,x:(1-E.out4(P(t,inA,inA+.5)))*-46,media:`${d.dir}/${num(t)}.jpg`}});
    const hl=ph.querySelector('.hl2');
    reg(hl,a,outB,t=>{ if(t<d.lupaIni+.2||t>d.lupaFim)return null; const r=d.hl[idx(t)];
      const o=Math.min(1,P(t,d.lupaIni+.2,d.lupaIni+.5))*fadeOut(t,d.lupaFim-.1,.2);
      return{o,css:{left:r[0]+'px',top:r[1]+'px',width:r[2]+'px',height:r[3]+'px'}}});
    // lupa
    const lp=el(`<img class="media" src="">`,'lupa','left:540px;top:372px;width:506px;height:306px',L('behind'));
    reg(lp,d.lupaIni,d.lupaFim,t=>{ if(t<d.lupaIni||t>d.lupaFim+.3)return null; const p=popIn(t,d.lupaIni,.42), f=fadeOut(t,d.lupaFim,.2);
      return{o:p.o*f,s:p.s*(1-.03*(1-f)),y:(1-E.out4(P(t,d.lupaIni,d.lupaIni+.5)))*30,media:`${d.lupa}/${num(t)}.jpg`}});
    // rótulo
    const lb=el('','','left:566px;top:340px',L('behind'));
    reg(lb,d.lupaIni,d.lupaFim,t=>{ if(t<d.lupaIni||t>d.lupaFim+.3)return null; const k=d.lab[idx(t)]; const t0=Math.max(d.segT[k],d.lupaIni+.1);
      const p=popIn(t,t0-.04,.3), f=fadeOut(t,d.lupaFim,.2), fin=Math.min(1,P(t,d.lupaIni+.08,d.lupaIni+.4));
      return{o:Math.min(p.o,1)*f*fin,s:p.s,y:(1-E.out4(P(t,t0-.04,t0+.3)))*10,
        html:`<span class="pill" style="background:#008FFE;color:#fff;font-size:25px;padding:11px 24px;letter-spacing:.04em;box-shadow:0 10px 26px rgba(0,60,140,.45)">${d.labels[k]}</span>`}});
  }
  build('A',{inA:50.48,outB:66.10});
  build('B',{inA:67.98,outB:81.50});
})();
