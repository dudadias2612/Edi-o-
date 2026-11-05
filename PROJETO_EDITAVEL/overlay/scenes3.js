/* =====================================================================
   CENA K · CTA interativo
   ===================================================================== */
T([{t:'*EXPERIMENTE',size:98},{t:'EM VEZ DE SÓ ASSISTIR',size:58}],121.66,124.12,{y:372,times:[121.70,122.62,122.76,122.94,123.14,123.34]});
(function(){
  const out=135.58;
  const c1=el('COMENTE','ttl','left:40px;top:228px;width:1000px;font-size:80px;text-align:center');
  reg(c1,126.52,out,t=>{const b=std(126.52,out,{d:.34,rise:30})(t);return b});
  const au=el('AUTOMATIZAR','ttl bl','left:40px;top:316px;width:1000px;font-size:110px;font-weight:900;text-align:center;letter-spacing:-.025em;text-shadow:0 3px 0 rgba(0,45,120,.42),0 8px 30px rgba(0,25,70,.6),0 2px 6px rgba(0,0,0,.35)');
  reg(au,126.88,out,t=>{if(t<126.88||t>out+.3)return null;const p=P(t,126.88,127.30);const sc=1.28-.28*E.back(p,1.2);const f=fadeOut(t,out,.24);
    return{o:Math.min(1,p*4)*f,s:sc*(1+.012*Math.sin((t-127.3)*3.2)*(t>127.3?1:0)),y:E.in3(P(t,out,out+.24))*14}});
  const rc=el('<span class="w">RECEBA</span> <span class="w">O</span> <span class="w">LINK</span> <span class="w">NO</span> <span class="w">*DIRECT*</span>'.replace('*DIRECT*','DIRECT'),'ttl','left:40px;top:448px;width:1000px;font-size:48px;text-align:center');
  const ts=[129.50,129.62,129.74,129.86,129.98];
  reg(rc,129.50,out,t=>{if(t>out+.3)return null;const f=fadeOut(t,out,.24);return{o:f,kids:ts.map(s=>{const pi=popIn(t,s,.3);return{o:pi.o,s:pi.s,y:(1-E.out4(P(t,s,s+.36)))*22}})}});
  /* mini-fluxo: comentário → direct (ilustrativo), atrás do rosto */
  const cm=comment({handle:'seu_perfil',text:'AUTOMATIZAR',time:'agora',av:2,w:470,x:36,y:590,layer:'behind',foot:false});
  cm.querySelector('.tx').style.fontSize='36px';
  const dm=el(`<div style="display:flex;align-items:center;gap:18px;height:100%;padding:0 22px"><span class="ico" style="width:70px;height:70px;border-radius:50%;background:#008FFE;padding:17px;color:#fff;flex:none">${ico('send',36,'#fff')}</span><div><div style="font-weight:800;font-size:29px;line-height:1.1">Seu link de acesso</div><div style="font-weight:600;font-size:20px;color:#8a8a93;margin-top:4px">no Direct · ilustração</div></div></div>`,'card',`left:560px;top:596px;width:484px;height:112px;border-radius:32px`,L('behind'));
  reg(cm,127.88,out,t=>{const b=std(127.88,out,{rise:26})(t);if(!b)return null;return{...b,html:undefined}});
  const ar=arrow(500,596,60,110,'M6 56 H40','M34 36 L58 56 L34 76 Z',{layer:'behind'});
  ar.style.width='60px';
  reg(ar,130.60,out,t=>{if(t>out+.3)return null;return{o:fadeOut(t,out,.2),vars:{'--p':E.out3(P(t,130.60,131.00))}}});
  reg(dm,130.92,out,std(130.92,out,{rise:26}));
})();
T([{t:'CONHEÇA A *NEXTAGS',size:72},{t:'E CRIE A SUA *AUTOMAÇÃO',size:54}],135.84,140.62,{y:372,times:[136.34,136.74,137.00,137.40,137.82,138.10,138.24,138.92]});
/* =====================================================================
   CENA L · encerramento: manual vs automação
   ===================================================================== */
(function(){
  const end=150.20;
  const man=el(`<div style="display:flex;align-items:center;gap:20px;height:100%;padding:0 28px 0 22px"><span class="ico" style="width:72px;height:72px;border-radius:50%;background:#eceef2;color:#6b6f7a;padding:17px">${ico('clock',38,'#6b6f7a')}</span><div><div style="font-weight:900;font-size:40px;letter-spacing:-.01em;color:#2a2c33">MANUALMENTE</div><div style="font-weight:700;font-size:21px;color:#8a8a93;margin-top:2px;letter-spacing:.03em">HORAS ENVIANDO LINK, UM POR UM</div></div></div>`,'card','left:190px;top:238px;width:700px;height:116px;filter:grayscale(.55)');
  const vs=el(`<span class="pill" style="background:#0e0e13;color:#fff;font-size:24px;padding:9px 24px;letter-spacing:.14em">VERSUS</span>`,'','left:0;right:0;top:372px;text-align:center');
  const au=el(`<div style="display:flex;align-items:center;gap:20px;height:100%;padding:0 28px 0 22px"><span class="ico" style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.22);color:#fff;padding:17px">${ico('bolt',38,'#fff')}</span><div><div style="font-weight:900;font-size:40px;letter-spacing:-.01em">AUTOMAÇÃO PRONTA</div><div style="font-weight:700;font-size:21px;opacity:.9;margin-top:2px;letter-spacing:.03em">FUNCIONANDO POR VOCÊ</div></div></div>`,'card bluec','left:190px;top:426px;width:700px;height:116px');
  reg(man,143.56,end,std(143.56,end,{rise:30}));
  reg(vs,146.70,end,std(146.70,end,{d:.3,rise:14}));
  reg(au,147.30,end,std(147.30,end,{rise:30}));
})();
/* =====================================================================
   QUADRO FINAL (após a última fala): "COMENTE AUTOMATIZAR — NEXTAGS × DUDA DIAS"
   ===================================================================== */
(function(){
  const a=150.367,b=999;
  const shade=el('','','left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(6,10,20,.64) 0%,rgba(6,10,20,.38) 44%,rgba(6,10,20,.08) 100%)');
  reg(shade,150.10,b,t=>({o:E.io3(P(t,150.10,150.62))}));
  const c=el('COMENTE','ttl','left:40px;top:272px;width:1000px;font-size:76px;text-align:center');
  const au=el('AUTOMATIZAR','ttl bl','left:40px;top:362px;width:1000px;font-size:112px;font-weight:900;text-align:center;letter-spacing:-.025em;text-shadow:0 6px 30px rgba(0,60,140,.55),0 3px 10px rgba(0,0,0,.4)');
  const nx=el('NEXTAGS <span style="color:#008FFE;margin:0 14px">×</span> DUDA DIAS','ttl','left:40px;top:540px;width:1000px;font-size:46px;text-align:center;letter-spacing:.06em');
  reg(c,150.30,b,t=>{const p=popIn(t,150.30,.34);return{o:p.o,s:p.s,y:(1-E.out4(P(t,150.30,150.7)))*24}});
  reg(au,150.46,b,t=>{const p=P(t,150.46,150.86);return{o:Math.min(1,p*4),s:1.25-.25*E.back(p,1.2),y:0}});
  reg(nx,150.90,b,t=>{const p=popIn(t,150.90,.38);return{o:p.o,s:p.s,y:(1-E.out4(P(t,150.90,151.3)))*18}});
})();
