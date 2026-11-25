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
  flow.querySelectorAll('.home-faq details,.home-roles details').forEach(details=>{
    details.querySelector('summary').addEventListener('click',event=>{
      event.preventDefault();
      const open=!(animations.get(details)?.open ?? details.open);
      const start=details.getBoundingClientRect().height;
      expand(details,open,start);
    });
  });

  // Service disclosure motion lives in services-motion.js.

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
