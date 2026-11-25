/* Native scrolling and disclosures, with bounded tactile motion below the first screen. */
(() => {
  const flow = document.querySelector('.studio-flow');
  if (!flow) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const animations = new Map();
  new IntersectionObserver(entries=>{
    document.body.classList.toggle('studio-body-in-view',entries[0].isIntersecting);
  }).observe(flow);

  function expand(details, open, start = details.getBoundingClientRect().height) {
    const previous = animations.get(details);
    if (previous) {previous.animation.cancel();animations.delete(details);}
    if (reduced.matches || !details.animate) {details.open = open;return;}
    if (open) details.open = true;
    const end = open ? details.getBoundingClientRect().height : details.querySelector('summary').getBoundingClientRect().height;
    // Very large archive disclosures keep native behavior rather than animating the full document.
    if (Math.abs(end-start) > 1100) {details.open=open;return;}
    const animation = details.animate([{height:start+'px'},{height:end+'px'}],{
      duration:open ? 550 : 340,easing:'cubic-bezier(.16,1,.3,1)'
    });
    const originalOverflow = details.style.overflow;
    details.style.overflow='hidden';
    animations.set(details,{animation,open});
    animation.onfinish=()=>{
      if (animations.get(details)?.animation !== animation) return;
      details.open=open;details.style.overflow=originalOverflow;animations.delete(details);animation.cancel();
    };
    animation.oncancel=()=>{details.style.overflow=originalOverflow;};
  }
  flow.querySelectorAll('.studio-service,.home-faq details,.home-roles details').forEach(details=>{
    details.querySelector('summary').addEventListener('click',event=>{
      event.preventDefault();
      const open=!(animations.get(details)?.open ?? details.open);
      const start=details.getBoundingClientRect().height;
      if(details.matches('.studio-service')){manualServices.set(details,open);clearServiceStyle(details);}
      expand(details,open,start);
    });
  });

  // Match the reference's desktop scroll progression; touch and reduced motion keep native clicks.
  const serviceMedia=matchMedia('(min-width: 768px)');
  const serviceList=flow.querySelector('.home-services');
  const serviceCards=[...flow.querySelectorAll('.studio-service')];
  const manualServices=new Map();
  const serviceSizes=new Map();
  let serviceFrame=0,lastServiceWidth=0;
  const autoServices=()=>serviceMedia.matches&&!reduced.matches;
  const clearServiceStyle=card=>{
    card.classList.remove('is-scroll-service');card.style.removeProperty('background-color');card.style.removeProperty('color');
    card.style.removeProperty('--service-progress');card.style.removeProperty('--service-content-progress');delete card.dataset.serviceProgress;
    const body=card.querySelector('.studio-service-body');body.style.removeProperty('height');body.style.removeProperty('padding-bottom');body.inert=false;
  };
  function measureServices(){
    if(!autoServices())return;
    serviceCards.forEach(card=>{
      const body=card.querySelector('.studio-service-body');
      const state={open:card.open,classes:card.className,style:card.getAttribute('style'),bodyStyle:body.getAttribute('style')};
      card.classList.remove('is-scroll-service');card.open=true;body.style.height='auto';body.style.removeProperty('padding-bottom');
      serviceSizes.set(card,{height:body.getBoundingClientRect().height,padding:parseFloat(getComputedStyle(body).paddingBottom)});
      card.open=state.open;card.className=state.classes;
      if(state.style===null)card.removeAttribute('style');else card.setAttribute('style',state.style);
      if(state.bodyStyle===null)body.removeAttribute('style');else body.setAttribute('style',state.bodyStyle);
    });
    requestServices();
  }
  function renderServices(){
    serviceFrame=0;
    if(!autoServices()||document.hidden)return;
    const listRect=serviceList.getBoundingClientRect();
    if(listRect.top>innerHeight||listRect.bottom<0)return;
    // Batch geometry reads before writes. Predict each next row from preceding changes.
    const geometry=serviceCards.map(card=>({card,rect:card.getBoundingClientRect(),summary:card.querySelector('summary').getBoundingClientRect()}));
    const anchorIndex=geometry.findIndex(({rect})=>rect.bottom>0&&rect.top<innerHeight);
    let shift=0,anchorShift=0;
    const updates=[];
    geometry.forEach(({card,rect,summary},i)=>{
      if(i===anchorIndex)anchorShift=shift;
      if(manualServices.has(card))return;
      const size=serviceSizes.get(card);if(!size)return;
      const top=rect.top+shift;
      let progress=i===0?1:Math.max(0,Math.min(1,(innerHeight*.86-top)/Math.min(240,innerHeight*.3)));
      if(progress<.015)progress=0;if(progress>.985)progress=1;
      if(Math.abs(Number(card.dataset.serviceProgress??-1)-progress)<.003)return;
      const rgb=[255,255,255].map((v,k)=>Math.round(v+([6,29,49][k]-v)*progress));
      const linear=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
      const luminance=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
      updates.push({card,progress,size,rgb,foreground:progress===0?'#092d40':luminance>.179?'#000':'#fff'});
      shift+=summary.height+size.height*progress-rect.height;
    });
    updates.forEach(({card,progress,size,rgb,foreground})=>{
      card.classList.add('is-scroll-service');card.dataset.serviceProgress=progress.toFixed(4);card.open=progress>0;
      card.style.backgroundColor=`rgb(${rgb.join(',')})`;card.style.color=foreground;
      card.style.setProperty('--service-progress',progress);
      card.style.setProperty('--service-content-progress',Math.max(0,Math.min(1,(progress-.65)/.3)));
      const body=card.querySelector('.studio-service-body');body.style.height=(size.height*progress)+'px';body.style.paddingBottom=(size.padding*progress)+'px';body.inert=progress<.985;
    });
    // A stable visible card, with no wheel/touch interception or per-row forced layout.
    if(anchorIndex>=0&&Math.abs(anchorShift)>1){scrollBy({top:anchorShift,behavior:'instant'});requestServices();}
  }

  function requestServices(){if(!serviceFrame&&autoServices())serviceFrame=requestAnimationFrame(renderServices);}
  serviceCards.forEach(card=>card.addEventListener('focusin',event=>{
    if(event.target.closest('summary'))return;
    manualServices.set(card,true);clearServiceStyle(card);card.open=true;
  }));
  new ResizeObserver(entries=>{
    const width=entries[0].contentRect.width;
    if(Math.abs(width-lastServiceWidth)>1){lastServiceWidth=width;measureServices();}
  }).observe(serviceList);
  const resetServiceMode=()=>{
    serviceCards.forEach(clearServiceStyle);
    if(autoServices())measureServices();
  };
  serviceMedia.addEventListener('change',resetServiceMode);reduced.addEventListener('change',resetServiceMode);
  addEventListener('scroll',requestServices,{passive:true});addEventListener('resize',requestServices,{passive:true});
  document.fonts.ready.then(measureServices);

  // Keep the click target fixed; only the small arrow follows the pointer inside it.
  flow.querySelectorAll('[data-magnetic],.studio-circle-link').forEach(link=>{
    const arrow=link.querySelector('.studio-arrow,.studio-link-arrow,svg');
    if (!arrow) return;
    link.addEventListener('pointermove',event=>{
      if (!fine.matches || reduced.matches) return;
      const rect=link.getBoundingClientRect();
      const x=Math.max(-7,Math.min(7,(event.clientX-rect.x-rect.width/2)*.08));
      const y=Math.max(-7,Math.min(7,(event.clientY-rect.y-rect.height/2)*.12));
      arrow.style.transform=`translate(${x}px,${y}px)`;
    });
    const reset=()=>{arrow.style.transform='';};
    link.addEventListener('pointerleave',reset);link.addEventListener('blur',reset);
  });

  const covers=[...flow.querySelectorAll('.studio-case-media')];
  const visibleCovers=new Set();
  let mediaFrame=0;
  function renderCovers() {
    mediaFrame=0;
    visibleCovers.forEach(cover=>{
      if (reduced.matches) {cover.style.removeProperty('--media-y');return;}
      const rect=cover.getBoundingClientRect();
      const limit=rect.width<700 ? 6 : 12;
      const offset=Math.max(-limit,Math.min(limit,(innerHeight/2-rect.y-rect.height/2)*.025));
      cover.style.setProperty('--media-y',offset+'px');
    });
  }
  function requestCovers() {
    if (!mediaFrame && visibleCovers.size && !document.hidden) mediaFrame=requestAnimationFrame(renderCovers);
  }
  const coverObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      entry.target.classList.toggle('is-in-view',entry.isIntersecting);
      if(entry.isIntersecting)visibleCovers.add(entry.target);else visibleCovers.delete(entry.target);
    });requestCovers();
  },{rootMargin:'80px 0px'});
  covers.forEach(cover=>coverObserver.observe(cover));
  addEventListener('scroll',requestCovers,{passive:true});addEventListener('resize',requestCovers,{passive:true});

  const steps=flow.querySelectorAll('.home-steps li');
  const stepObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('is-current',entry.isIntersecting));
  },{rootMargin:'-25% 0px -30% 0px'});
  steps.forEach(step=>stepObserver.observe(step));

  // Two authored title moments; explanatory text and the other headings remain still.
  const titleObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      titleObserver.unobserve(entry.target);
      if (reduced.matches) return;
      const projectClose=entry.target.id==='project-title';
      entry.target.animate([
        {clipPath:projectClose?'inset(18% 0 18%)':'inset(0 12% 0 0)',opacity:.65},
        {clipPath:'inset(0)',opacity:1}
      ],{duration:950,easing:'cubic-bezier(.16,1,.3,1)'});
    });
  },{threshold:.25});
  flow.querySelectorAll('#projects h2,#project-title').forEach(title=>titleObserver.observe(title));

  // Cursor hint is limited to actual case links on fine pointers. Native cursors remain elsewhere.
  const cursor=document.createElement('span');cursor.className='studio-cursor';cursor.setAttribute('aria-hidden','true');cursor.textContent='Смотреть';
  document.getElementById('homepage').append(cursor);flow.classList.add('studio-cursor-ready');
  let cursorFrame=0,px=-150,py=-150;
  const hideCursor=()=>{cursor.classList.remove('is-visible');};
  covers.forEach(cover=>{
    cover.addEventListener('pointermove',event=>{
      if(!fine.matches || reduced.matches)return;
      px=event.clientX;py=event.clientY;cursor.classList.add('is-visible');
      if(!cursorFrame)cursorFrame=requestAnimationFrame(()=>{cursorFrame=0;cursor.style.transform=`translate(${px-53}px,${py-53}px)`;});
    });
    cover.addEventListener('pointerleave',hideCursor);cover.addEventListener('click',hideCursor);
  });
  addEventListener('scroll',hideCursor,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hideCursor();else requestCovers();});
  reduced.addEventListener('change',()=>{
    hideCursor();requestCovers();
    if(reduced.matches)animations.forEach(({animation,open},details)=>{animation.cancel();details.open=open;animations.delete(details);});
  });
})();
