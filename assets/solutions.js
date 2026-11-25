/* Selection leads the choreography; content is readable without motion or scripts. */
(() => {
  const section=document.querySelector('.solutions-workspace');if(!section)return;
  const tabs=[...section.querySelectorAll('[data-solution]')],panels=[...section.querySelectorAll('[data-solution-panel]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:700px)');
  let active=-1,animations=[];
  const orientation=()=>section.querySelector('[role=tablist]').setAttribute('aria-orientation',compact.matches?'vertical':'horizontal');
  orientation();compact.addEventListener('change',orientation);
  function select(index,manual=false){
    if(index===active)return;animations.forEach(a=>a.cancel());animations=[];active=index;
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(index===i));tab.tabIndex=index===i?0:-1;panels[i].hidden=index!==i;});
    if(manual){
      const panel=panels[index];
      if(reduced.matches)animations.push(panel.animate([{opacity:.65},{opacity:1}],{duration:130,easing:'ease-out'}));
      else{
        const title=panel.querySelector('h3');
        animations.push(title.animate([{clipPath:'inset(0 0 30% 0)',opacity:.4,transform:'translateY(8px)'},{clipPath:'inset(0)',opacity:1,transform:'translateY(0)'}],{duration:580,easing:'cubic-bezier(.16,1,.3,1)'}));
        [panel.querySelector('.solution-description'),...panel.querySelectorAll('.solution-steps li'),panel.querySelector('.solution-actions')].forEach((node,i)=>animations.push(node.animate([{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:460,delay:Math.min(i*45,180),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
      }
      section.dispatchEvent(new CustomEvent('optimism:interaction',{bubbles:true,detail:{event:'solution_select',page:'homepage-preview',block:'N-02',target:tabs[index].dataset.solution}}));
    }
  }
  new IntersectionObserver(entries=>document.body.classList.toggle('solutions-in-view',entries[0].isIntersecting)).observe(section);
  select(0);section.classList.add('solutions-ready');
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(i,true));
    tab.addEventListener('keydown',event=>{
      let index;if(event.key==='ArrowDown'||event.key==='ArrowRight')index=(i+1)%tabs.length;
      if(event.key==='ArrowUp'||event.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;
      if(event.key==='Home')index=0;if(event.key==='End')index=tabs.length-1;if(index===undefined)return;
      event.preventDefault();tabs[index].focus();select(index,true);
    });
  });
  reduced.addEventListener('change',()=>{animations.forEach(a=>a.cancel());animations=[];});
})();
