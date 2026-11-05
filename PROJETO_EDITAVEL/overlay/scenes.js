/* ===== CENAS: tudo ancorado nos tempos reais da fala (config/ palavras revisadas) ===== */
const SNAP=t=>Math.round(t*30)/30;
/* ---------- título com palavras entrando em tempos explícitos ---------- */
function T(lines,a,b,o={}){
  // tokens: "*AZUL"  "~CINZA". times: lista de inícios por palavra (senão stag)
  const {x=540,y=300,w=1000,stag=.08,d=.32,out=.26,times=null,layer='front',shadowless=false}=o;
  const html=lines.map(l=>`<div class="ln" style="font-size:${l.size}px;${l.mt?`margin-top:${l.mt}px`:''}">${l.t.split(' ').map(s=>s[0]==='*'?`<span class="w bl">${s.slice(1)}</span>`:s[0]==='~'?`<span class="w gr">${s.slice(1)}</span>`:`<span class="w">${s}</span>`).join(' ')}</div>`).join('');
  const node=el(html,'ttl',`left:${x-w/2}px;top:${y}px;width:${w}px`,L(layer));
  const n=node.querySelectorAll('.w').length;
  reg(node,a,b,t=>{
    if(t<a||t>b+out)return null;const f=fadeOut(t,b,out);const kids=[];
    for(let i=0;i<n;i++){const ts=times?times[i]:a+i*stag;const pi=popIn(t,ts,d);kids.push({o:pi.o,s:pi.s,y:(1-E.out4(P(t,ts,ts+d*1.2)))*28})}
    return{o:f,kids,y:E.in3(P(t,b,b+out))*14}});
  return node}
/* ---------- marcador de prévia (removível: classe .marker) ---------- */
(function(){const n=el(`<span class="pill" style="background:rgba(10,10,14,.66);color:#fff;font-size:25px;padding:12px 22px;letter-spacing:.04em;backdrop-filter:blur(6px)"><i style="width:12px;height:12px;border-radius:50%;background:#ff4d4f;display:inline-block"></i>PRÉVIA PARA APROVAÇÃO CRIATIVA</span>`,'marker','left:40px;top:128px');
  reg(n,0,1.5,t=>t>1.8?null:{o:Math.min(1,t/0.2)*fadeOut(t,1.5,.3)})})();
/* ---------- LEGENDAS ---------- */
(function(){
  const G=window.CAP||[];const cap=el('','', 'left:140px;top:1352px;width:800px;height:176px;display:flex;align-items:flex-end;justify-content:center');
  cap.classList.add('cap');
  const htmlOf=g=>g.words.map(w=>`<span class="wd${w.key?' k':''}">${w.t}</span>`).join(' ');
  reg(cap,0,999,t=>{
    let gi=-1;for(let i=0;i<G.length;i++){if(t>=G[i].start&&t<=G[i].end+0.001){gi=i;break}}
    if(gi<0)return null;const g=G[gi];const p=P(t,g.start,g.start+0.16);
    const s=.93+.07*E.out3(p)+(p>.5?0:0);const o=Math.min(1,p*2.2)*(1-P(t,g.end-.05,g.end));
    return{o,s,y:(1-E.out3(p))*10,html:`<div style="max-width:800px">${htmlOf(g)}</div>`}});
})();
/* =====================================================================
   CENA D · 29,4–34,6 · "o interesse desaparece"
   ===================================================================== */
(function(){
  const card=comment({handle:'juliana.m_',text:'ME MANDA O LINK?',time:'12 min',av:1,w:690,x:195,y:600});
  reg(card,30.30,33.9,t=>{
    const base=std(30.30,33.9,{rise:30})(t);if(!base)return null;
    const k=E.io3(P(t,32.78,33.55));const tm=t<31.15?'12 min':t<32.05?'1 h':'3 h';
    return{...base,o:base.o*(1-.62*k),filter:`grayscale(${k}) saturate(${1-.5*k})`,txt:{'.tm':tm}}});
  T([{t:'A PESSOA AINDA',size:76},{t:'ESTÁ *ESPERANDO',size:76}],31.02,33.30,{y:300,times:[31.02,31.12,31.40,31.58,31.80]});
  T([{t:'INTERESSE',size:84},{t:'*PERDIDO',size:132}],33.46,34.55,{y:292,times:[33.46,33.70]});
})();
/* =====================================================================
   CENA E · 34,2–43 · fluxo da automação
   ===================================================================== */
(function(){
  const cw=760,cx=(1080-cw)/2,h=126;
  const c1=el(`<div style="display:flex;align-items:center;gap:20px;height:100%;padding:0 26px 0 22px">
      <span class="ico" style="width:78px;height:78px;border-radius:50%;background:#e6f3ff;color:#008FFE;padding:19px">${ico('chat',40,'#008FFE')}</span>
      <div style="flex:1;font-weight:800;font-size:35px;letter-spacing:-.01em">COMENTÁRIO</div>
      <span class="pill" style="background:#008FFE;color:#fff;font-size:27px;padding:11px 22px">AUTOMATIZAR</span></div>`,'card',`left:${cx}px;top:228px;width:${cw}px;height:${h}px`);
  const c2=el(`<div style="display:flex;align-items:center;gap:20px;height:100%;padding:0 26px 0 22px">
      <span class="ico" style="width:78px;height:78px;border-radius:50%;background:#e6f3ff;color:#008FFE;padding:19px">${ico('key',40,'#008FFE')}</span>
      <div style="flex:1;font-weight:800;font-size:30px;line-height:1.12;letter-spacing:-.01em">PALAVRA-CHAVE<br><span style="color:#008FFE">IDENTIFICADA</span></div>
      <span class="ico" style="width:54px;height:54px;border-radius:50%;background:#19c37d;color:#fff;padding:12px">${ico('check',30,'#fff',3)}</span></div>`,'card',`left:${cx}px;top:418px;width:${cw}px;height:${h}px`);
  const c3=el(`<div style="display:flex;align-items:center;gap:20px;height:100%;padding:0 26px 0 22px">
      <span class="ico" style="width:78px;height:78px;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;padding:19px" id="planeW">${ico('send',40,'#fff')}</span>
      <div style="flex:1;font-weight:800;font-size:30px;line-height:1.12;letter-spacing:-.01em">MENSAGEM AUTOMÁTICA<br>NO DIRECT</div></div>`,'card bluec',`left:${cx}px;top:608px;width:${cw}px;height:${h}px`);
  const A=(y)=>arrow(510,y,60,64,'M30 4 V46','M12 38 L30 60 L48 38 Z');
  const a1=A(354),a2=A(544);
  const out=42.55;
  reg(c1,37.46,out,std(37.46,out,{rise:34}));
  reg(a1,38.50,out,t=>{const p=P(t,38.50,38.95);if(t>out+.3)return null;return{o:fadeOut(t,out,.24)*Math.min(1,p*3),vars:{'--p':E.out3(p)}}});
  reg(c2,38.80,out,std(38.80,out,{rise:34}));
  reg(a2,39.98,out,t=>{const p=P(t,39.98,40.40);if(t>out+.3)return null;return{o:fadeOut(t,out,.24)*Math.min(1,p*3),vars:{'--p':E.out3(p)}}});
  reg(c3,40.12,out,t=>{const b=std(40.12,out,{rise:34})(t);if(!b)return null;const pulse=1+.035*Math.sin(P(t,40.5,41.2)*Math.PI);return{...b,s:b.s*pulse}});
})();
/* =====================================================================
   CENA F · 43,3–50 · apresentação da Nextags
   ===================================================================== */
(function(){
  T([{t:'*AUTOMAÇÃO',size:112},{t:'DE COMENTÁRIOS NO',size:58,mt:2},{t:'INSTAGRAM',size:58}],44.04,46.30,{y:350,times:[44.04,44.94,45.14,45.42,46.00]});
  const wm=el(`<div style="text-align:center"><div style="font-family:Montserrat;font-weight:900;font-size:138px;letter-spacing:-.035em;color:#fff;text-shadow:0 5px 26px rgba(0,0,0,.45);line-height:1">Next<span style="color:#008FFE">ags</span></div>
     <div style="margin:18px auto 0;display:inline-block;background:rgba(255,255,255,.96);border:3px solid rgba(160,224,152,.9);border-radius:999px;padding:13px 30px;font-family:Montserrat;font-weight:800;font-size:27px;letter-spacing:.03em;color:#0e0e13;box-shadow:0 12px 34px rgba(0,0,0,.25)">AUTOMAÇÃO DE COMENTÁRIOS NO INSTAGRAM</div></div>`,'',`left:40px;top:372px;width:1000px`);
  reg(wm,48.46,50.18,std(48.46,50.18,{d:.4,rise:30}));
})();
/* =====================================================================
   CENA G/H · tutorial + placeholders (módulos independentes e substituíveis)
   ===================================================================== */
const SLOT={P1:[1515,1578],P2:[1578,1755],P3:[1755,1974],P4:[2040,2447]};SLOT.P4A=SLOT.P4;SLOT.P4B=SLOT.P4; // frames @30fps — duração exata das futuras gravações
const SL=(k)=>[SLOT[k][0]/30,SLOT[k][1]/30];
function slotMedia(k){return (window.SLOTS&&window.SLOTS[k])?window.SLOTS[k]:null}
function mediaImg(k){return slotMedia(k)?`<img class="media" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:20" src="">`:''}
function slotFrame(k,t){const m=slotMedia(k);if(!m)return null;const a=SLOT[k][0];const n=Math.min(m.frames-1,Math.max(0,Math.round(t*30)-a));return `${m.dir}/${String(n+1).padStart(5,'0')}.jpg`}
const approach=(a,b)=>t=>.95+.05*E.out3(P(t,a,b))+.02*P(t,a,b);
/* chips de passo */
(function(){
  const steps=[[50.62,52.66,1,'CONECTAR O INSTAGRAM'],[52.66,54.86,2,'ABRIR FERRAMENTAS'],[54.86,59.62,3,'CRIAR AUTOMAÇÃO DE COMENTÁRIOS'],[59.62,61.12,4,'DEFINIR A PALAVRA <b style="color:#008FFE">AUTOMATIZAR</b>'],[61.12,65.80,5,'ESCREVER O DIRECT, ADICIONAR<br>O LINK E ATIVAR']];
  steps.forEach(([a,b,n,txt])=>{
    const two=txt.includes('<br>');
    const node=el(`<span class="ico" style="width:${two?92:78}px;height:${two?92:78}px;border-radius:50%;background:#008FFE;color:#fff;font-weight:900;font-size:${two?44:38}px;font-family:Montserrat">${n}</span><div style="font-weight:800;font-size:${two?29:32}px;line-height:1.14;letter-spacing:-.005em;white-space:nowrap">${txt}</div>`,
      'card',`left:50%;top:${two?196:206}px;margin-left:-${two?470:450}px;width:${two?940:900}px;height:${two?112:100}px;display:flex;align-items:center;gap:22px;padding:0 34px 0 ${two?10:11}px;border-radius:999px`);
    node.style.justifyContent='flex-start';
    reg(node,a,b,t=>{if(t<a-.0001||t>b+.3)return null;const i=popIn(t,a,.3);const f=n===5?fadeOut(t,b,.24):fadeOut(t,b,.2);return{o:i.o*f,s:i.s,y:(1-E.out4(P(t,a,a+.36)))*-22}});
  });
  const dots=el([1,2,3,4,5].map(()=>`<i class="d" style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#fff;margin:0 8px;box-shadow:0 2px 8px rgba(0,0,0,.4)"></i>`).join(''),'','left:340px;top:322px;width:400px;text-align:center;line-height:0');
  reg(dots,50.62,65.80,t=>{if(t>66.2)return null;const cur=t<52.66?1:t<54.86?2:t<59.62?3:t<61.12?4:5;
    return{o:Math.min(1,P(t,50.62,50.9))*fadeOut(t,65.8,.2),kidsSel:'.d',kids:[1,2,3,4,5].map(i=>({o:i<=cur?1:.38,s:i===cur?1.45:1,c:i<=cur?'#008FFE':'#fff'}))}});
})();
/* ---------- PLACEHOLDER 01 · conexão do Instagram ---------- */
(function(){ if(window.SLOTS&&window.SLOTS.A) return;
  const [a,b]=SL('P1');
  const tag=(t1,t2,t3)=>`<div class="tag" style="top:${t1}px;text-align:center"><div style="font-size:31px;color:#0e0e13;line-height:1.15">${t2}</div><div style="font-size:31px;color:#008FFE;line-height:1.15">${t3}</div><div style="font-weight:600;font-size:25px;color:#8a8a93;margin-top:12px;text-transform:none;letter-spacing:0">Pendente de integração</div></div>`;
  const inner=`<div style="position:absolute;inset:0;background:linear-gradient(170deg,#f3f9ff 0%,#fff 55%)"></div>
    <div style="position:absolute;left:0;right:0;top:128px;display:flex;justify-content:center;align-items:center;gap:0">
      <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#ffe0b3,#ff8da1,#a66bff);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(120,80,200,.25)">${ico('user',60,'#fff')}</div>
      <div style="width:110px;height:10px;position:relative;margin:0 6px"><svg viewBox="0 0 110 10" style="width:110px;height:10px"><path d="M2 5H108" stroke="#008FFE" stroke-width="5" stroke-dasharray="2 11" stroke-linecap="round" fill="none"/></svg></div>
      <div style="width:120px;height:120px;border-radius:32px;background:#008FFE;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(0,143,254,.35)">${ico('bolt',64,'#fff')}</div></div>
    ${tag(300,'','CAPTURA REAL:<br>CONEXÃO DO INSTAGRAM').replace('<div style="font-size:31px;color:#0e0e13;line-height:1.15"></div>','')}
    <div class="sk" style="position:absolute;left:46px;right:46px;top:560px;height:62px;border-radius:31px"></div>
    <div class="sk" style="position:absolute;left:46px;right:46px;top:644px;height:62px;border-radius:31px;opacity:.7"></div>${mediaImg('P1')}`;
  const ph=phone(500,1010,inner,{x:290,y:352});
  reg(ph,a,b,t=>{if(t>b+.3)return null;const i=popIn(t,a,.4);const s=approach(a,a+.5)(t);const f=fadeOut(t,b,.2);return{o:i.o*f,s:s*i.s,y:(1-E.out4(P(t,a,a+.5)))*60,media:slotFrame('P1',t)}});
})();
/* ---------- PLACEHOLDER 02 · criação da automação ---------- */
(function(){ if(window.SLOTS&&window.SLOTS.A) return;
  const [a,b]=SL('P2');
  const row=(i,icn,label,extra='')=>`<div class="r2" style="position:absolute;left:34px;right:34px;top:${82+i*118}px;height:100px;border-radius:26px;background:#f4f7fb;border:3px solid #e6ebf3;display:flex;align-items:center;gap:22px;padding:0 28px;font-family:Montserrat;font-weight:800;font-size:37px;color:#0e0e13">
     <span class="ico" style="width:66px;height:66px;border-radius:20px;background:#e6f3ff;padding:15px;color:#008FFE">${ico(icn,36,'#008FFE')}</span><span style="flex:1">${label}</span>${extra}</div>`;
  const inner=`<div class="tag" style="top:16px;font-size:23px;color:#fff;background:#008FFE;padding:10px 26px;border-radius:999px;letter-spacing:.04em">INSERIR GRAVAÇÃO REAL DA NEXTAGS</div>
     ${row(0,'tool','Ferramentas')}${row(1,'chat','Automação de comentários')}${row(2,'sparkle','Criar automação','<span class="pill" style="background:#008FFE;color:#fff;font-size:27px;padding:13px 26px">+ NOVA</span>')}${mediaImg('P2')}`;
  const br=browser(980,560,inner,{x:50,y:352});
  const hl=[53.54,54.86,56.92];
  reg(br,a,b,t=>{if(t>b+.3)return null;const i=popIn(t,a,.4);const f=fadeOut(t,b,.2);
    return{o:i.o*f,s:approach(a,a+.5)(t)*i.s,y:(1-E.out4(P(t,a,a+.5)))*60,media:slotFrame('P2',t)}});
  // destaque sequencial nas linhas
  br.querySelectorAll('.r2').forEach((r,i)=>{
    reg(r,a,b,tt=>{const k=E.out3(P(tt,hl[i],hl[i]+.3));return{o:1,s:1+.02*k,vars:{'border-color':k>.5?'#008FFE':'#e6ebf3','background':k>.5?'#eaf5ff':'#f4f7fb'}}});
  });
})();
