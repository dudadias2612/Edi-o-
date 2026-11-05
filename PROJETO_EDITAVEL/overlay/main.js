/* ===== motor: aplica o estado de cada item no tempo t e devolve assinaturas por camada ===== */
function hashStr(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return h}
const r2=v=>Math.round(v*100)/100;
function applyItem(it,st){
  const e=it.el;
  if(!st||st.o<=0.004){ if(it.vis){e.style.visibility='hidden';e.style.opacity=0;it.vis=false} return '' }
  if(!it.vis){e.style.visibility='visible';it.vis=true}
  e.style.opacity=r2(st.o*1000)/1000;
  e.style.transform=`translate(${r2(st.x||0)}px,${r2(st.y||0)}px) rotate(${r2(st.r||0)}deg) scale(${(st.s==null?1:Math.round(st.s*1e4)/1e4)})`;
  e.style.filter=st.filter||'';
  if(st.css){for(const k in st.css)e.style[k]=st.css[k]}
  let sig=`${it.id}:${r2(st.o)},${r2(st.x||0)},${r2(st.y||0)},${Math.round((st.s==null?1:st.s)*1e4)},${r2(st.r||0)},${st.filter||''}`;
  if(st.css){for(const k in st.css)sig+=`|${k}=${st.css[k]}`}
  if(st.vars){for(const k in st.vars){const v=typeof st.vars[k]==='number'?Math.round(st.vars[k]*1000)/1000:st.vars[k];e.style.setProperty(k,v);sig+=`|${k}=${v}`}}
  if(st.txt){for(const sel in st.txt){const n=(it.cache[sel]||(it.cache[sel]=e.querySelector(sel)));if(n&&n.textContent!==st.txt[sel])n.textContent=st.txt[sel];sig+=`|${sel}=${st.txt[sel]}`}}
  if(st.html!=null){if(it.html!==st.html){e.innerHTML=st.html;it.html=st.html;it.cache={};it.kidsEls=null}sig+=`|h${hashStr(st.html)}`}
  if(st.kids){const sel=st.kidsSel||'.w';if(!it.kidsEls||it.kidsSel!==sel){it.kidsEls=[...e.querySelectorAll(sel)];it.kidsSel=sel}
    st.kids.forEach((k,i)=>{const n=it.kidsEls[i];if(!n)return;n.style.opacity=r2(k.o==null?1:k.o);n.style.transform=`translateY(${r2(k.y||0)}px) scale(${Math.round((k.s==null?1:k.s)*1e3)/1e3})`;if(k.c!=null)n.style.color=k.c;sig+=`,${r2(k.o==null?1:k.o)}/${r2(k.y||0)}/${Math.round((k.s==null?1:k.s)*1e3)}`})}
  if(st.media){const n=it.cache['.media']||(it.cache['.media']=e.querySelector('.media'));if(n&&n.getAttribute('src')!==st.media){n.setAttribute('src',st.media)}sig+='|m'+st.media}
  return sig;
}
window.renderAt=function(t){
  const sig={behind:'',front:''};
  for(const it of items){
    it.cache=it.cache||{};
    const st=(t>=it.a-0.002&&t<=it.b+1.0)?it.fn(t):null;
    const s=applyItem(it,st); if(s) sig[it.layer]+=s+';';
  }
  return sig;
};
window.setLayer=(name)=>{L('behind').style.display=name==='behind'?'block':'none';L('front').style.display=name==='front'?'block':'none'};
window.ready=Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode?i.decode().catch(()=>{}):0)]);
