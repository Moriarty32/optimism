/* Blog discovery and reading tools progressively enhance complete static pages. */
(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  if (menu) {
    menu.hidden = false;
    header.dataset.menu = 'closed';
    const close = () => { header.dataset.menu = 'closed'; menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      header.dataset.menu = open ? 'open' : 'closed';
    });
    header.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); menu.focus(); } });
    header.querySelectorAll('nav a').forEach(a => a.addEventListener('click', close));
  }

  const data = document.querySelector('#blog-search-data');
  if (data) {
    const entries = JSON.parse(data.textContent);
    const form = document.querySelector('.search-form');
    const input = document.querySelector('#blog-search');
    const clear = document.querySelector('.clear-search');
    const topics = document.querySelector('.topic-filters');
    const count = document.querySelector('#results-count');
    const empty = document.querySelector('.search-empty');
    const heading = document.querySelector('#stories-heading');
    const cards = [...document.querySelectorAll('.stories .story')];
    const allowed = new Set(entries.flatMap(a => a.topics));
    const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/\bseo\b/g, 'сео').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const searchable = new Map(entries.map(a => [a.slug, normalize(a.title + ' ' + a.summary + ' ' + a.topics.join(' ') + ' ' + a.searchText)]));
    const plural = n => n === 1 ? 'материал' : 'материала';
    let topic = '';
    let timer;
    topics.hidden = false;

    function readURL() {
      const params = new URLSearchParams(location.search);
      input.value = (params.get('q') || '').slice(0, 160);
      topic = allowed.has(params.get('topic')) ? params.get('topic') : '';
    }
    function render(writeURL = false, push = false) {
      const query = input.value.trim();
      const words = normalize(query).split(' ').filter(Boolean);
      let shown = 0;
      cards.forEach(card => {
        const entry = entries.find(a => a.slug === card.dataset.slug);
        const match = (!topic || entry.topics.includes(topic)) && words.every(word => searchable.get(entry.slug).includes(word));
        card.hidden = !match;
        if (match) shown++;
      });
      topics.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
      clear.hidden = !input.value;
      count.textContent = shown ? `${shown} ${plural(shown)}${query ? ' по вашему запросу' : ''}` : 'Материалы не найдены';
      heading.textContent = query ? 'Результаты поиска' : topic ? `Статьи: ${topic}` : 'Разобраться и применить';
      empty.hidden = shown !== 0;
      document.querySelector('#empty-description').textContent = query ? `По запросу «${query}»${topic ? ` в теме «${topic}»` : ''} ничего не нашлось.` : 'В выбранной теме пока нет подходящих материалов.';
      if (writeURL) {
        const url = new URL(location.href);
        query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
        topic ? url.searchParams.set('topic', topic) : url.searchParams.delete('topic');
        if (url.href !== location.href) history[push ? 'pushState' : 'replaceState']({}, '', url);
      }
      try { sessionStorage.setItem('optimism-blog-return', location.pathname + location.search); } catch (_) { /* Storage is optional. */ }
      document.querySelector('.stories').classList.toggle('single-result', shown === 1);
    }
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => render(true), 160); });
    form.addEventListener('submit', e => { e.preventDefault(); clearTimeout(timer); render(true, true); });
    input.addEventListener('search', () => render(true));
    clear.addEventListener('click', () => { clearTimeout(timer); input.value = ''; render(true); input.focus(); });
    topics.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) return;
      clearTimeout(timer); topic = button.dataset.topic; render(true, true);
    });
    document.querySelector('.reset-search').addEventListener('click', () => { clearTimeout(timer); input.value = ''; topic = ''; render(true, true); input.focus(); });
    window.addEventListener('popstate', () => { clearTimeout(timer); readURL(); render(); });
    window.addEventListener('pageshow', () => { readURL(); render(); });
    document.querySelectorAll('.story a').forEach(a => a.addEventListener('click', () => { clearTimeout(timer); render(true); }));
    readURL(); render();
  }

  const content = document.querySelector('#article-content');
  if (content) {
    const progress = document.querySelector('.reading-progress');
    const toc = document.querySelector('.toc');
    const tools = document.querySelector('.article-tools');
    const media = matchMedia('(min-width: 1000px)');
    const setToc = () => { toc.open = media.matches; };
    setToc(); media.addEventListener('change', setToc);
    tools.hidden = false; progress.hidden = false;
    try {
      const saved = sessionStorage.getItem('optimism-blog-return');
      const blogLink = document.querySelector('.back-to-blog');
      const base = new URL(blogLink.href);
      const candidate = new URL(saved || base.href, location.origin);
      if (candidate.origin === location.origin && candidate.pathname === base.pathname) {
        document.querySelectorAll('.back-to-blog').forEach(a => a.href = candidate.pathname + candidate.search);
      }
    } catch (_) { /* Direct blog navigation remains available. */ }
    const headings = [...content.querySelectorAll('h2[id]')];
    const links = [...toc.querySelectorAll('a')];
    let ticking = false;
    function updateReading() {
      const rect = content.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight * .6);
      progress.value = Math.round(Math.max(0, Math.min(100, (110 - rect.top) / distance * 100)));
      let active = '';
      headings.forEach(h => { if (h.getBoundingClientRect().top <= 160) active = h.id; });
      links.forEach(a => active && a.hash === '#' + active ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
      ticking = false;
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateReading); } }, {passive:true});
    window.addEventListener('resize', updateReading);
    links.forEach(a => a.addEventListener('click', event => {
      const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      if (!media.matches) toc.open = false;
      history.pushState({}, '', a.hash);
      // Collapse the contents before positioning the target: closing it changes page height.
      requestAnimationFrame(() => {
        target.setAttribute('tabindex', '-1');
        target.focus({preventScroll:true});
        target.scrollIntoView({behavior:'instant', block:'start'});
        updateReading();
      });
    }));
    tools.querySelector('[data-print]').addEventListener('click', () => window.print());
    tools.querySelector('[data-copy-link]').addEventListener('click', async () => {
      const status = tools.querySelector('.copy-status');
      try { await navigator.clipboard.writeText(location.href); status.textContent = 'Ссылка скопирована'; }
      catch (_) { status.textContent = 'Скопируйте адрес из строки браузера'; }
    });
    updateReading();
  }
})();
