/* ---------- PLACEHOLDER 03 · palavra-chave, mensagem, link, ativação ---------- */
(function(){
  const [a,b]=SL('P3');
  const rows=[['page','PUBLICAÇÃO','<span class="sk" style="width:120px;height:62px;border-radius:14px;background:linear-gradient(135deg,#ffd6a5,#ff8da1)"></span>'],
    ['key','PALAVRA-CHAVE','<span class="pill" style="background:#fff;border:3px solid #008FFE;color:#008FFE;font-size:26px;padding:10px 22px">AUTOMATIZAR</span>'],
    ['chat','MENSAGEM','<span style="display:flex;flex-direction:column;gap:9px"><span class="sk" style="width:190px;height:15px"></span><span class="sk" style="width:130px;height:15px"></span></span>'],
    ['link','LINK','<span class="sk" style="width:200px;height:30px;border-radius:15px"></span>'],
    ['bolt','ATIVAÇÃO','<span style="width:112px;height:56px;border-radius:28px;background:#d5dae3;position:relative;display:inline-block"><i style="position:absolute;left:6px;top:6px;width:44px;height:44px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.25)"></i></span>']];
  const rh=80;
  const inner=`<div class="tag" style="top:14px;font-size:20px;color:#6b7280;font-weight:700;letter-spacing:.03em">CAPTURA DE TELA SERÁ ADICIONADA DEPOIS · ILUSTRATIVO</div>`+
    rows.map((r,i)=>`<div class="r3" style="position:absolute;left:34px;right:34px;top:${54+i*(rh+8)}px;height:${rh}px;border-radius:24px;background:#f4f7fb;border:3px solid #e6ebf3;display:flex;align-items:center;gap:20px;padding:0 24px;font-family:Montserrat;font-weight:800;font-size:33px;color:#0e0e13">
      <span class="ico" style="width:56px;height:56px;border-radius:17px;background:#e6f3ff;padding:13px;color:#008FFE">${ico(r[0],30,'#008FFE')}</span><span style="flex:1">${r[1]}</span>${r[2]}<span class="ck ico" style="width:44px;height:44px;border-radius:50%;background:#19c37d;color:#fff;padding:10px;opacity:0">${ico('check',24,'#fff',3.2)}</span></div>`).join('')+mediaImg('P3');
  const br=browser(980,560,inner,{x:50,y:352});
  reg(br,a,b,t=>{if(t>b+.3)return null;const i=popIn(t,a,.4);const f=fadeOut(t,b,.2);return{o:i.o*f,s:approach(a,a+.5)(t)*i.s,y:(1-E.out4(P(t,a,a+.5)))*60,media:slotFrame('P3',t)}});
  const hl=[58.50,60.22,61.82,64.04,65.20];
  br.querySelectorAll('.r3').forEach((r,i)=>{
    reg(r,a,b,tt=>{const k=E.out3(P(tt,hl[i],hl[i]+.3));const done=i<4&&tt>=(hl[i+1]-.05);
      return{o:1,s:1+.02*k*(done?0:1),vars:{'border-color':k>.5&&!done?'#008FFE':'#e6ebf3','background':k>.5&&!done?'#eaf5ff':'#f4f7fb'}}});
    const ck=r.querySelector('.ck');
    reg(ck,a,b,tt=>{const k=(i<4)?E.back(P(tt,hl[i+1]-.05,hl[i+1]+.25)):0;return{o:i<4?k:0,s:.6+.4*k}});
  });
})();
/* ---------- PLACEHOLDER 04 · teste da automação (dois celulares + seta) ---------- */
(function(){
  const [a,b]=SL('P4');
  const LX=45,RX=615,PW=420,PH=860,PY=312;
  const banner=el(`<span class="pill" style="background:rgba(255,255,255,.97);border:3px solid #008FFE;color:#0e0e13;font-size:23px;padding:13px 26px;letter-spacing:.02em;box-shadow:0 12px 34px rgba(0,0,0,.28)"><i style="display:inline-flex;width:34px;height:34px;border-radius:50%;background:#008FFE;color:#fff;align-items:center;justify-content:center;font-style:normal;font-family:Inter;font-weight:900;font-size:22px">i</i>DEMONSTRAÇÃO ILUSTRATIVA — AGUARDANDO TESTE REAL</span>`,'','left:0;right:0;top:214px;text-align:center');
  reg(banner,a,b,t=>{if(slotMedia('P4A')||slotMedia('P4B'))return null;const p=popIn(t,a+.1,.34);return t>b+.3?null:{o:p.o*fadeOut(t,b,.2),s:p.s,y:(1-E.out4(P(t,a+.1,a+.5)))*-18}});
  const left=`<div style="position:absolute;inset:0;background:#fff">
     <div style="position:absolute;top:84px;left:0;right:0;text-align:center;font-weight:800;font-size:28px;color:#0e0e13">Comentários</div>
     <div style="position:absolute;left:24px;right:24px;top:140px;height:78px;border-radius:39px;background:#f1f3f7;border:2px solid #e1e5ec;display:flex;align-items:center;padding:0 24px;font-weight:700;font-size:28px;color:#0e0e13"><span class="typ"></span><i class="cur" style="width:3px;height:36px;background:#008FFE;margin-left:3px"></i></div>
     <div class="posted" style="position:absolute;left:24px;right:24px;top:250px;display:flex;gap:16px;align-items:flex-start"><span>${avatar(4,66)}</span><div><div style="font-weight:700;font-size:22px;color:#3a3a42">sua_conta2<i style="font-style:normal;color:#9a9aa3;font-weight:500"> · agora</i></div><div style="font-weight:800;font-size:30px;margin-top:2px">AUTOMATIZAR</div></div></div>
     <div class="reply" style="position:absolute;left:84px;right:24px;top:376px;display:flex;gap:14px;align-items:center"><span class="ico" style="width:56px;height:56px;border-radius:50%;background:#008FFE;padding:13px;color:#fff">${ico('bolt',30,'#fff')}</span><div style="flex:1"><div class="sk" style="width:210px;height:15px"></div><div class="sk" style="width:150px;height:15px;margin-top:10px"></div></div></div>
     ${mediaImg('P4A')}</div>`;
  const right=`<div style="position:absolute;inset:0;background:#fff">
     <div style="position:absolute;top:80px;left:0;right:0;display:flex;align-items:center;gap:14px;padding:0 26px;font-weight:800;font-size:28px;color:#0e0e13"><span style="font-size:32px">‹</span>${avatar(3,56)}<span>Direct</span></div>
     <div style="position:absolute;left:0;right:0;top:170px;height:2px;background:#eef0f4"></div>
     <div class="dm" style="position:absolute;left:24px;top:210px;width:340px;background:#eef0f5;border-radius:30px 30px 30px 8px;padding:24px 26px;font-weight:600;font-size:27px;line-height:1.3;color:#0e0e13">Aqui está o seu link!
        <div style="margin-top:16px;background:#fff;border:2px solid #dde2ea;border-radius:20px;padding:14px 18px;display:flex;align-items:center;gap:12px;font-weight:700;font-size:22px;color:#008FFE">${ico('link',30,'#008FFE')}<span class="sk" style="width:150px;height:14px;background:#cfe6ff"></span></div></div>
     <div class="notif" style="position:absolute;left:18px;right:18px;top:92px;height:96px;border-radius:26px;background:rgba(30,30,36,.94);color:#fff;display:flex;align-items:center;gap:16px;padding:0 20px;box-shadow:0 12px 30px rgba(0,0,0,.35);z-index:9"><span class="ico" style="width:56px;height:56px;border-radius:15px;background:#008FFE;padding:13px">${ico('send',30,'#fff')}</span><div style="font-weight:700;font-size:23px;line-height:1.25">Nova mensagem<br><span style="font-weight:500;opacity:.75">ilustração</span></div></div>${mediaImg('P4B')}</div>`;
  const pl=phone(PW,PH,left,{x:LX,y:PY}), pr=phone(PW,PH,right,{x:RX,y:PY});
  const wl=70.42, post=71.30, rep=74.14, dmT=75.95;
  reg(pl,a,b,t=>{if(t>b+.3)return null;const p=popIn(t,a+.1,.4);return{o:p.o*fadeOut(t,b,.2),s:p.s*approach(a,a+.5)(t),y:(1-E.out4(P(t,a,a+.5)))*60,x:(1-E.out4(P(t,a,a+.5)))*-40,media:slotFrame('P4A',t)}});
  reg(pr,a,b,t=>{if(t>b+.3)return null;const s0=72.30;const p=popIn(t,s0,.4);return{o:p.o*fadeOut(t,b,.2),s:p.s*(.97+.03*E.out3(P(t,s0,s0+.5))),y:(1-E.out4(P(t,s0,s0+.5)))*60,x:(1-E.out4(P(t,s0,s0+.5)))*40,media:slotFrame('P4B',t)}});
  // digitação AUTOMATIZAR no campo
  const typ=pl.querySelector('.typ'),cur=pl.querySelector('.cur'),posted=pl.querySelector('.posted'),reply=pl.querySelector('.reply');
  const WORD='AUTOMATIZAR';
  reg(typ,a,b,t=>{const n=Math.floor(clamp((t-wl)/(0.62),0,1)*WORD.length);const gone=t>=post;return{o:1,html:gone?'':WORD.slice(0,n)}});
  reg(posted,a,b,t=>{const p=popIn(t,post,.36);return{o:p.o,s:p.s,y:(1-E.out4(P(t,post,post+.4)))*16}});
  reg(reply,a,b,t=>{const p=popIn(t,rep,.4);return{o:p.o,s:p.s}});
  const dm=pr.querySelector('.dm'),notif=pr.querySelector('.notif');
  reg(dm,a,b,t=>{const p=popIn(t,dmT+.28,.4);return{o:p.o,s:p.s,y:(1-E.out4(P(t,dmT+.28,dmT+.7)))*28}});
  reg(notif,a,b,t=>{if(t<dmT)return null;const p=popIn(t,dmT,.34);return{o:p.o*(1-E.io3(P(t,dmT+1.7,dmT+2.0))),s:p.s,y:(1-E.out4(P(t,dmT,dmT+.4)))*-40}});
  const ar=arrow(458,420,164,120,'M8 60 C60 4 104 4 150 56','M132 28 L158 60 L124 70 Z',{layer:'behind'});
  reg(ar,a,b,t=>{const s0=73.30,e0=75.50;if(t<s0||t>b+.3)return null;return{o:fadeOut(t,b,.2),vars:{'--p':E.io3(P(t,s0,e0))}}});
})();
/* ---------- H · "a parte que eu mais gostei" + "sem abrir conversa" ---------- */
T([{t:'A PARTE QUE EU',size:66},{t:'*MAIS *GOSTEI',size:98}],66.40,67.92,{y:372,times:[66.46,66.72,66.98,67.18,67.36,67.50]});
T([{t:'*SEM ABRIR',size:104},{t:'NENHUMA CONVERSA',size:70}],81.62,85.95,{y:372,times:[81.62,81.78,82.40,82.98]});
/* =====================================================================
   CENA I · aplicações práticas · 4 cartões
   ===================================================================== */
T([{t:'NÃO SERVE SÓ PRA',size:70},{t:'LINK DE *PRODUTO',size:80}],88.12,90.40,{y:372,times:[88.26,88.48,88.88,89.08,89.42,89.70,89.96]});
(function(){
  const arts={
   portfolio:`<svg viewBox="0 0 150 180" width="150" height="180"><rect x="6" y="6" width="138" height="168" rx="16" fill="#f4f7fb" stroke="#dfe5ee" stroke-width="3"/><rect x="18" y="18" width="114" height="14" rx="7" fill="#008FFE"/><rect x="18" y="44" width="54" height="54" rx="10" fill="#ffd6a5"/><rect x="78" y="44" width="54" height="54" rx="10" fill="#ff8da1"/><rect x="18" y="108" width="114" height="10" rx="5" fill="#dfe5ee"/><rect x="18" y="128" width="80" height="10" rx="5" fill="#dfe5ee"/><rect x="18" y="148" width="54" height="14" rx="7" fill="#008FFE"/></svg>`,
   curso:`<svg viewBox="0 0 150 180" width="150" height="180"><rect x="4" y="30" width="142" height="100" rx="16" fill="#0e0e13"/><circle cx="75" cy="80" r="26" fill="#008FFE"/><path d="M68 66v28l24-14z" fill="#fff"/><rect x="4" y="142" width="142" height="12" rx="6" fill="#dfe5ee"/><rect x="4" y="142" width="62" height="12" rx="6" fill="#008FFE"/><rect x="4" y="162" width="90" height="10" rx="5" fill="#dfe5ee"/></svg>`,
   cupom:`<svg viewBox="0 0 150 180" width="150" height="180"><rect x="4" y="34" width="142" height="112" rx="16" fill="#e6f3ff" stroke="#008FFE" stroke-width="3"/><circle cx="4" cy="104" r="13" fill="#fff"/><circle cx="146" cy="104" r="13" fill="#fff"/><text x="75" y="86" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="28" fill="#008FFE">CUPOM</text><path d="M24 104h102" stroke="#008FFE" stroke-width="3" stroke-dasharray="6 7"/><rect x="38" y="120" width="74" height="13" rx="6.5" fill="#b9dcff"/></svg>`,
   oferta:`<svg viewBox="0 0 150 180" width="150" height="180"><rect x="6" y="18" width="138" height="104" rx="14" fill="#fff" stroke="#dfe5ee" stroke-width="3"/><rect x="20" y="32" width="70" height="12" rx="6" fill="#008FFE"/><circle cx="26" cy="64" r="6" fill="#19c37d"/><rect x="40" y="59" width="84" height="10" rx="5" fill="#dfe5ee"/><circle cx="26" cy="86" r="6" fill="#19c37d"/><rect x="40" y="81" width="64" height="10" rx="5" fill="#dfe5ee"/><circle cx="26" cy="108" r="6" fill="#19c37d"/><rect x="40" y="103" width="76" height="10" rx="5" fill="#dfe5ee"/><rect x="30" y="134" width="90" height="30" rx="15" fill="#008FFE"/></svg>`};
  const defs=[['CREATOR','PORTFÓLIO','portfolio',91.12,40,238,-2.6,'brief'],['CURSO','AULA GRATUITA','curso',93.98,610,252,2.4,'play'],['LOJA','CUPOM','cupom',97.22,40,520,2.0,'store'],['SERVIÇOS','OFERTA','oferta',100.36,610,534,-2.2,'tag']];
  defs.forEach(([k,v,art,t0,x,y,rot,ic],i)=>{
    const n=el(`<div style="display:flex;height:100%;padding:24px 20px 20px 28px;gap:6px"><div style="flex:1;display:flex;flex-direction:column;justify-content:center">
       <span class="pill" style="align-self:flex-start;background:#e6f3ff;color:#008FFE;font-size:22px;padding:9px 18px 9px 12px;gap:8px">${ico(ic,28,'#008FFE')}${k}</span>
       <span style="margin:12px 0 8px 6px;display:block;height:34px"><svg width="30" height="34" viewBox="0 0 30 34"><path d="M15 3v24M5 18l10 12 10-12" fill="none" stroke="#008FFE" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
       <div style="font-weight:900;font-size:${v.length>9?38:46}px;line-height:1.05;letter-spacing:-.015em">${v.replace(' ','<br>')}</div></div><div style="flex:none;align-self:center">${arts[art]}</div></div>`,'card',`left:${x}px;top:${y}px;width:430px;height:262px`,L('behind'));
    reg(n,t0,104.50,t=>{if(t>104.50+.30)return null;const p=popIn(t,t0,.42);const f=fadeOut(t,104.50,.22);
      const fl=Math.sin((t-t0)*1.6+i)*7, rr=rot+Math.sin((t-t0)*1.1+i*2)*.9;
      const sl=(1-E.out4(P(t,t0,t0+.5)))*(x<500?-70:70);
      return{o:p.o*f,s:p.s*(1-.05*(1-f)),y:fl+(1-E.out4(P(t,t0,t0+.5)))*24,x:sl,r:rr}});
  });
})();
/* =====================================================================
   CENA J · posicionamento estratégico (menos elementos)
   ===================================================================== */
T([{t:'PERCEBE A',size:78},{t:'*DIFERENÇA?',size:118}],104.90,106.30,{y:372,times:[104.92,105.34,105.40]});
T([{t:'SEM DEPENDER DE',size:66},{t:'ESTAR *ONLINE',size:104}],110.00,112.70,{y:372,times:[110.00,110.42,110.94,111.08,111.30].slice(0,5)});
T([{t:'CONTEÚDO GERA',size:80},{t:'*ATENÇÃO.',size:118}],114.40,116.98,{y:372,times:[114.40,114.86,115.70]});
T([{t:'*AUTOMAÇÃO AJUDA',size:70},{t:'A DAR *CONTINUIDADE.',size:62}],117.12,120.95,{y:372,times:[117.12,117.50,117.70,118.40,118.9].slice(0,5)});
