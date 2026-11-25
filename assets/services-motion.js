/* Reversible service reveals. Native scroll; stable white headings and a navy content reveal.
   Geometry is read before writes; only visible progress is damped. Focused controls remain usable. */
(() => {
  const list=document.querySelector('.home-services');if(!list)return;
  const cards=[...list.querySelectorAll('.studio-service')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:768px)');
  const sizes=new Map(),states=new Map(cards.map(card=>[card,{p:0}])),manual=new Map(),tweens=new Map();
  let frame=0,lastTime=0,listWidth=0,navigationAnchor=null;
  const automatic=()=>!reduced.matches;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=(a,b,v)=>{v=clamp((v-a)/(b-a));return v*v*(3-2*v);};
  const bodyOf=card=>card.querySelector('.studio-service-body');
  function clear(card){
    card.classList.remove('is-scroll-service');
    for(const prop of ['background-color','color','--service-progress','--service-content-progress'])card.style.removeProperty(prop);
    delete card.dataset.serviceProgress;delete card.dataset.serviceTarget;
    const body=bodyOf(card);for(const prop of ['height','padding-top','padding-bottom'])body.style.removeProperty(prop);body.inert=false;
  }
  function apply(card,p){
    const size=sizes.get(card);if(!size)return;
    const body=bodyOf(card);card.classList.add('is-scroll-service');card.open=p>.001;
    card.dataset.serviceProgress=p.toFixed(4);card.style.setProperty('--service-progress',p);
    card.style.setProperty('--service-content-progress',smooth(.12,.82,p));
    body.style.height=(size.height*p)+'px';body.style.paddingTop=(size.top*p)+'px';body.style.paddingBottom=(size.bottom*p)+'px';
    body.inert=p<.985;
  }
  function stopTween(card){const item=tweens.get(card);if(item){item.animation.cancel();card.open=item.open;tweens.delete(card);}card.style.removeProperty('overflow');}
  function manualOpen(card,open,animate=true){
    const start=card.getBoundingClientRect().height;stopTween(card);clear(card);manual.set(card,open);states.get(card).p=open?1:0;
    if(reduced.matches||!animate||!card.animate){card.open=open;return;}
    card.open=true;
    const end=open?card.getBoundingClientRect().height:card.querySelector('summary').getBoundingClientRect().height;
    if(Math.abs(end-start)<1){card.open=open;return;}
    const animation=card.animate([{height:start+'px'},{height:end+'px'}],{duration:open?560:360,easing:'cubic-bezier(.16,1,.3,1)'});
    card.style.overflow='hidden';tweens.set(card,{animation,open});
    const reset=()=>{card.style.removeProperty('overflow');};
    animation.oncancel=reset;
    animation.onfinish=()=>{if(tweens.get(card)?.animation!==animation)return;card.open=open;tweens.delete(card);reset();animation.cancel();request();};
  }
  function measure(){
    if(!automatic())return;
    const saved=cards.map(card=>({card,open:card.open,className:card.className,style:bodyOf(card).style.cssText}));
    // Open every row together, read the natural dimensions together, then restore.
    saved.forEach(({card})=>{card.classList.remove('is-scroll-service');card.open=true;const b=bodyOf(card);b.style.removeProperty('height');b.style.removeProperty('padding-top');b.style.removeProperty('padding-bottom');});
    const measured=saved.map(({card})=>{const b=bodyOf(card),s=getComputedStyle(b);return{card,height:b.getBoundingClientRect().height,top:parseFloat(s.paddingTop),bottom:parseFloat(s.paddingBottom)};});
    saved.forEach(({card,open,className,style})=>{card.open=open;card.className=className;bodyOf(card).style.cssText=style;});
    measured.forEach(({card,...size})=>sizes.set(card,size));
    cards.forEach(card=>{if(!manual.has(card))apply(card,states.get(card).p);});request();
  }
  function render(now){
    frame=0;if(!automatic()||document.hidden){lastTime=0;return;}
    const listRect=list.getBoundingClientRect();
    if(listRect.top>innerHeight+100||listRect.bottom<-100){lastTime=0;return;}
    const dt=lastTime?Math.min(40,Math.max(1,now-lastTime)):16;lastTime=now;
    const geometry=cards.map(card=>({card,rect:card.getBoundingClientRect(),summary:card.querySelector('summary').getBoundingClientRect()}));
    const requested=geometry.findIndex(({card})=>card===navigationAnchor);
    const anchorIndex=requested>=0?requested:geometry.findIndex(({rect})=>rect.bottom>90&&rect.top<innerHeight);
    let shift=0,anchorShift=0,settling=false;const writes=[];
    geometry.forEach(({card,rect,summary},index)=>{
      if(index===anchorIndex)anchorShift=shift;
      const size=sizes.get(card);if(!size)return;
      if(manual.has(card)){
        const focusedBody=bodyOf(card).contains(document.activeElement);
        if(!focusedBody&&card!==navigationAnchor&&(rect.top>innerHeight+160||rect.bottom<-160))manual.delete(card);else return;
      }
      const state=states.get(card),top=rect.top+shift;
      const distance=Math.max(200,Math.min(360,innerHeight*(desktop.matches ? .38 : .3)));
      const target=clamp((innerHeight*.84-top)/distance);
      const nearby=top<innerHeight+40&&rect.bottom>40;
      const tau=target>state.p?90:70;
      let p=nearby?state.p+(target-state.p)*(1-Math.exp(-dt/tau)):target;
      if(Math.abs(target-p)<.003)p=target;
      if(p<.002)p=0;if(p>.998)p=1;
      if(Math.abs(target-p)>.002)settling=true;
      if(Math.abs(state.p-p)<.0002&&card.classList.contains('is-scroll-service'))return;
      state.p=p;writes.push({card,p,target});
      shift+=summary.height+size.height*p-rect.height;
    });
    writes.forEach(({card,p,target})=>{apply(card,p);card.dataset.serviceTarget=target.toFixed(4);});
    // Height changes above the visible row must not pull the reader away from it.
    if(anchorIndex>=0&&Math.abs(anchorShift)>.5){scrollBy({top:anchorShift,behavior:'instant'});settling=true;}
    if(requested>=0){if(writes.length||settling)settling=true;else navigationAnchor=null;}
    if(settling)request();else lastTime=0;
  }
  function request(){if(!frame&&automatic()&&!document.hidden)frame=requestAnimationFrame(render);}
  cards.forEach(card=>{
    card.querySelector('summary').addEventListener('click',event=>{event.preventDefault();manualOpen(card,!(tweens.get(card)?.open??card.open));});
    card.addEventListener('focusin',event=>{if(event.target.closest('summary'))return;manualOpen(card,true,false);});
  });
  list.addEventListener('optimism:service-open',event=>{
    const card=event.target.closest('.studio-service');if(!card)return;
    manualOpen(card,true);navigationAnchor=automatic()?card:null;request();
  });
  const reset=()=>{
    if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;navigationAnchor=null;
    cards.forEach(card=>{stopTween(card);clear(card);});
    if(automatic())measure();
  };
  desktop.addEventListener('change',reset);reduced.addEventListener('change',reset);
  new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-listWidth)>1){listWidth=width;measure();}}).observe(list);
  new IntersectionObserver(()=>request(),{rootMargin:'100px 0px'}).observe(list);
  const preload=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const img=entry.target.querySelector('img');if(img)img.loading='eager';preload.unobserve(entry.target);});},{rootMargin:'600px 0px'});
  cards.forEach(card=>preload.observe(card));
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;}else request();});
  document.fonts.ready.then(measure);
})();
