/* One persistent brand, nine service scenes, a five-second reading cycle. */
(() => {
  const hero = document.querySelector('.hero-dynamic');
  if (!hero) return;
  const services = [
    ['SEO-продвижение', 'Помогаем вашему сайту стать заметнее в поиске — от технической оптимизации до контента и структуры.', 'SEARCH / ORGANIC GROWTH'],
    ['Интернет-реклама', 'Соединяем ваше предложение с нужной аудиторией. Настраиваем кампании, проверяем гипотезы и анализируем обращения.', 'AUDIENCE / PRECISE CONNECTION'],
    ['Аналитика и UX', 'Находим, где теряются клиенты. Исследуем путь пользователя и превращаем данные в решения для сайта.', 'DATA / HUMAN EXPERIENCE'],
    ['Разработка сайтов', 'Создаём пространство для вашего бизнеса: от структуры и интерфейса до разработки и развития сайта.', 'INTERFACE / DIGITAL ARCHITECTURE'],
    ['Контент-маркетинг', 'Помогаем объяснить ценность вашего продукта. Создаём контент, который отвечает на вопросы аудитории.', 'CONTENT / MEANINGFUL STORIES'],
    ['Социальные сети', 'Выстраиваем связь бренда с людьми через стратегию, контент и продвижение в социальных сетях.', 'COMMUNITY / CONNECTED PEOPLE'],
    ['Продвижение бренда', 'Помогаем бренду стать узнаваемым. Соединяем позиционирование, коммуникации и продвижение в единую стратегию.', 'BRAND / RECOGNITION'],
    ['Разработка AI-агента', 'Превращаем повторяющиеся задачи в управляемые сценарии автоматизации — с вашими данными и нужными интеграциями.', 'INTELLIGENCE / CONNECTED WORKFLOWS'],
    ['GEO-продвижение', 'Работаем над тем, как компания представлена в генеративном поиске: контент, источники фактов и упоминания бренда.', 'GENERATIVE SEARCH / KNOWLEDGE']
  ];
  const buttons = [...hero.querySelectorAll('[data-slide]')];
  const scenes = [...hero.querySelectorAll('[data-scene]')];
  const playback = hero.querySelector('.hero-playback');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = motion.matches;
  let visible = true;
  let focused = false;
  let elapsed = 0;
  let previous = performance.now();
  let cleanup;
  let stopped = true;
  function sync() {
    stopped = paused || !visible || focused || document.hidden;
    hero.classList.toggle('is-paused', stopped);
    playback.setAttribute('aria-pressed', String(paused));
    playback.setAttribute('aria-label', paused ? 'Включить автоматическую смену услуг' : 'Остановить автоматическую смену услуг');
    playback.querySelector('span').textContent = paused ? 'Воспроизвести' : 'Пауза';
    return stopped;
  }
  function select(index, manual = false) {
    if (index === active) { elapsed = 0; return; }
    clearTimeout(cleanup);
    scenes.forEach(scene => scene.classList.remove('is-leaving'));
    const old = active;
    active = index;
    elapsed = 0;
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === active);
      button.setAttribute('aria-pressed', String(i === active));
    });
    scenes[old].classList.remove('is-active');
    scenes[old].classList.add('is-leaving');
    scenes[active].classList.add('is-active');
    hero.classList.remove('is-changing');
    // Restart the bounded scene-change sequence; the company name is outside it.
    void hero.offsetWidth;
    hero.classList.add('is-changing');
    hero.dataset.activeService = String(active);
    hero.querySelector('#hero-service-title').textContent = services[active][0];
    hero.querySelector('#hero-service-description').textContent = services[active][1];
    hero.querySelector('#hero-scene-caption').textContent = services[active][2];
    hero.querySelector('.hero-service-copy').setAttribute('aria-live', manual ? 'polite' : 'off');
    cleanup = setTimeout(() => {
      scenes.forEach(scene => scene.classList.remove('is-leaving'));
      hero.classList.remove('is-changing');
    }, 1000);
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i, true));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();buttons[next].focus();select(next, true);
    });
  });
  playback.addEventListener('click', () => { paused = !paused; focused = false; sync(); });
  hero.querySelector('.hero-services').addEventListener('focusin', () => { focused = true; sync(); });
  hero.querySelector('.hero-services').addEventListener('focusout', event => {
    if (!event.relatedTarget || !hero.querySelector('.hero-services').contains(event.relatedTarget)) { focused = false; sync(); }
  });
  document.addEventListener('visibilitychange', () => { previous = performance.now();sync(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;previous = performance.now();sync();
  }, { threshold: .15 }).observe(hero);
  motion.addEventListener('change', () => { paused = motion.matches;sync(); });
  sync();
  function tick(now) {
    const delta = Math.min(now - previous, 100);
    previous = now;
    if (!stopped) {
      elapsed += delta;
      if (elapsed >= 5000) select((active + 1) % services.length);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
