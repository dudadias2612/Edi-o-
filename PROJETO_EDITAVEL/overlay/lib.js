/* ===== utilidades de tempo/animação (tudo é função pura do tempo => render determinístico) ===== */
const W=1080,H=1920;
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const P=(t,a,b)=>clamp((t-a)/(b-a));
const E={out3:x=>1-Math.pow(1-x,3),out4:x=>1-Math.pow(1-x,4),in3:x=>x*x*x,io3:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
  expo:x=>x>=1?1:1-Math.pow(2,-10*x),back:(x,s=1.5)=>{const c=s+1;return 1+c*Math.pow(x-1,3)+s*Math.pow(x-1,2)},lin:x=>x};
/* entrada "pop": escala 90%→105%→100% com fade rápido (padrão pedido no briefing) */
function popIn(t,a,d=.34){const p=P(t,a,a+d);if(p<=0)return{o:0,s:.9};
  const s=p<.62?.9+.15*E.out3(p/.62):1.05-.05*E.io3((p-.62)/.38);return{o:clamp(p/.30),s}}
function fadeOut(t,b,d=.24){return 1-E.io3(P(t,b,b+d))}
/* padrão: item aparece em [a,b] com pop + leve subida, sai com fade+descida */
function std(a,b,o={}){const {d=.34,out=.24,rise=26,sc=1}=o;return t=>{
  if(t<a||t>b+out)return null;const i=popIn(t,a,d);const f=fadeOut(t,b,out);
  const up=(1-E.out4(P(t,a,a+d*1.2)))*rise; const down=E.in3(P(t,b,b+out))*14;
  return{o:i.o*f,s:i.s*sc*(1-.03*(1-f)),y:up+down}}}
/* ===== ícones (traço) ===== */
const IC={
chat:'<path d="M4 5.5h16v11H10l-5 4v-4H4z"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
bolt:'<path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z"/>',
send:'<path d="M3.5 11.5l17-8-7.5 17-2.2-7.3z"/><path d="M10.8 13.2l4-3.6"/>',
check:'<path d="M5 12.5l4.6 4.6L19.5 7"/>',
tool:'<path d="M14.5 6.2a4 4 0 0 0-5.3 5.2L3.5 17.1l3.4 3.4 5.7-5.7a4 4 0 0 0 5.2-5.3l-2.7 2.7-2.4-.6-.6-2.4z"/>',
gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2.4M12 18.1v2.4M3.5 12h2.4M18.1 12h2.4M6 6l1.7 1.7M16.3 16.3L18 18M6 18l1.7-1.7M16.3 7.7L18 6"/>',
key:'<circle cx="8" cy="12" r="3.6"/><path d="M11.6 12H21M17.5 12v3M20.5 12v2.4"/>',
user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.8-4 3.6-5.8 7.5-5.8s6.7 1.8 7.5 5.8"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.4 2"/>',
plug:'<path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0zM12 17v4"/>',
page:'<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>',
play:'<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M10.2 9.2v5.6l4.8-2.8z"/>',
tag:'<path d="M3.5 12.2V4.5h7.7l9.3 9.3-7.7 7.7z"/><circle cx="8" cy="9" r="1.4"/>',
brief:'<rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5v-2h6v2M3.5 12.5h17"/>',
heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
cam:'<rect x="3" y="6.5" width="18" height="13" rx="3"/><circle cx="12" cy="13" r="3.6"/><path d="M8.5 6.5L10 4h4l1.5 2.5"/>',
cursor:'<path d="M6 3l12 8.5-5.2 1.2 3 5.6-2.4 1.3-3-5.6L6 18z"/>',
sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
doc:'<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/>',
store:'<path d="M4 9l1.5-5h13L20 9M4 9h16v11H4zM4 9a3 3 0 0 0 5.3 1.9A3 3 0 0 0 14.7 10.9 3 3 0 0 0 20 9"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>'};
const ico=(n,sz=40,c='currentColor',sw)=>`<span class="ico" style="width:${sz}px;height:${sz}px;color:${c}"><svg viewBox="0 0 24 24" ${sw?`style="stroke-width:${sw}"`:''}>${IC[n]}</svg></span>`;
/* ===== avatares ilustrados (vetoriais, sem fotos de terceiros) ===== */
const AVP=[['#ffd3b6','#ff8c94','#5b3a29'],['#cfe8ff','#7aa7ff','#2d2a4a'],['#ffe6a7','#f4a259','#3d2b1f'],['#d4f1c4','#7cc6a4','#243b2f'],['#f6d5f7','#c58af9','#33214a'],['#ffd6d6','#ef6f6c','#4a2020']];
function avatar(i=0,sz=90){const [a,b,h]=AVP[i%AVP.length];
 return `<div class="av" style="width:${sz}px;height:${sz}px"><div><svg viewBox="0 0 100 100"><defs><linearGradient id="g${i}${sz}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g${i}${sz})"/><path d="M12 100c2-24 18-34 38-34s36 10 38 34z" fill="#fff" opacity=".92"/><circle cx="50" cy="40" r="19" fill="#f3cdb1"/><path d="M31 40c0-14 8-22 19-22s19 8 19 22c-5-8-10-11-19-11s-14 3-19 11z" fill="${h}"/></svg></div></div>`}
/* ===== construtores de DOM ===== */
function el(html,cls='',style='',layer){const d=document.createElement('div');d.className='it '+cls;d.style.cssText=style;d.innerHTML=html;(layer||document.getElementById('front')).appendChild(d);return d}
const items=[];
function reg(node,a,b,fn){node.style.visibility='hidden';node.style.opacity=0;items.push({el:node,a,b,fn,vis:false,id:items.length,layer:node.closest('.layer').id,cache:{}});return node}
function L(name){return document.getElementById(name)}
/* título multilinha. lines: [{t:'texto com <b class=bl>azul</b>', size:64}] */
function title(lines,{x=540,y=300,w=1000,gap=0,layer='front',cls=''}={}){
  const html=lines.map(l=>`<div class="ln" style="font-size:${l.size}px;${l.mt?`margin-top:${l.mt}px;`:''}">${l.t.split(' ').map(s=>s.includes('<')||true?`<span class="w">${s}</span>`:s).join(' ')}</div>`).join('');
  return el(html,'ttl '+cls,`left:${x-w/2}px;top:${y}px;width:${w}px`,L(layer))}
/* card de comentário (réplica do estilo dos mockups da Duda) */
function comment({handle,text,time='12 min',av=0,w=560,x=0,y=0,layer='front',cls='',foot=true}){
  return el(`<div class="avw">${avatar(av,92)}</div><div class="bd"><div class="hd">${handle}<i>· <span class="tm">${time}</span></i></div><div class="tx"><span class="typ">${text}</span></div>${foot?'<div class="ft">Responder&nbsp;&nbsp;Curtir</div>':''}<span class="hr ico"><svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round">${IC.heart}</svg></span></div>`,
    'cm '+cls,`left:${x}px;top:${y}px;width:${w}px`,L(layer))}
function arrow(x,y,w,h,pathD,headD,{layer='front'}={}){ // pathD em coordenadas 0..w,0..h
  return el(`<svg viewBox="0 0 ${w} ${h}"><path class="sh" pathLength="1" d="${pathD}"/><path class="hd" d="${headD}"/></svg>`,'arrow',`left:${x}px;top:${y}px;width:${w}px;height:${h}px`,L(layer))}
function phone(w,h,inner,{x,y,layer='behind',clock='9:41'}){
  return el(`<div class="scr"><div class="isl"></div><div class="sb"><span>${clock}</span><span style="letter-spacing:2px">▂▄▆ ▮</span></div>${inner}</div>`,'ph',`left:${x}px;top:${y}px;width:${w}px;height:${h}px`,L(layer))}
function browser(w,h,inner,{x,y,layer='behind'}){
  return el(`<div class="bar"><span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span><span class="url"></span></div><div style="position:relative;height:${h-68}px">${inner}</div>`,'br',`left:${x}px;top:${y}px;width:${w}px;height:${h}px`,L(layer))}
