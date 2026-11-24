/* Explicit choice: no timer, no form gate, and full content when scripts are unavailable. */
(() => {
  const section = document.querySelector('.solutions-workspace');
  if (!section) return;
  const tabs = [...section.querySelectorAll('[data-solution]')];
  const panels = [...section.querySelectorAll('[data-solution-panel]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function select(index, manual = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
      panels[i].hidden = index !== i;
    });
    if (manual) {
      section.dispatchEvent(new CustomEvent('optimism:interaction', {
        bubbles: true, detail: {event: 'solution_select', page: 'homepage-preview', block: 'N-02', target: tabs[index].dataset.solution}
      }));
    }
  }
  new IntersectionObserver(entries => {
    document.body.classList.toggle('solutions-in-view', entries[0].isIntersecting);
  }).observe(section);
  select(0);
  section.classList.add('solutions-ready');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', event => {
      select(i, true);
      if (event.detail > 0 && matchMedia('(max-width: 850px)').matches) {
        panels[i].scrollIntoView({block: 'nearest', behavior: reduced.matches ? 'instant' : 'smooth'});
      }
    });
    tab.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index === undefined) return;
      event.preventDefault();tabs[index].focus();select(index, true);
    });
  });
})();
