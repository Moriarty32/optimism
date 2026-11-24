/* One persistent brand, nine service scenes, a five-second reading cycle. */
(() => {
  const hero = document.querySelector('.hero-dynamic');
  if (!hero) return;
  const services = [
    [
        "SEO-продвижение",
        "Помогаем клиентам найти ваш сайт в нужный момент. Работаем с технической основой, структурой и содержанием.",
        "Поиск на экране ноутбука",
        "Поиск, который приводит к вам",
        "#0057d9"
    ],
    [
        "Интернет-реклама",
        "Соединяем рекламную стратегию, объявления и посадочные страницы. Анализируем путь от первого клика до обращения.",
        "Управление интернет-рекламой на ноутбуке",
        "Ваше предложение. Нужная аудитория.",
        "#bf361e"
    ],
    [
        "Аналитика и UX",
        "Выясняем, как люди пользуются сайтом и где теряются обращения. Находим точки роста в аналитике и интерфейсе.",
        "Аналитические графики на экране ноутбука",
        "От данных — к понятным решениям",
        "#006258"
    ],
    [
        "Разработка сайтов",
        "Проектируем структуру и интерфейс, разрабатываем и развиваем сайты. Соединяем задачи бизнеса и удобство клиента.",
        "Разработка: код на экране монитора",
        "Сайт как продолжение вашего бизнеса",
        "#5431b5"
    ],
    [
        "Контент-маркетинг",
        "Помогаем рассказать о продукте так, чтобы его поняли. От стратегии и экспертных материалов до контента для продвижения.",
        "Подготовка съёмки: оператор и камера",
        "Содержание, за которым видна ценность",
        "#ab245b"
    ],
    [
        "Социальные сети",
        "Соединяем стратегию, контент и продвижение. Помогаем бренду находить свою аудиторию и выстраивать с ней связь.",
        "Социальная сеть на экране смартфона",
        "В центре разговора — ваш бренд",
        "#1351b2"
    ],
    [
        "Продвижение бренда",
        "Выстраиваем позиционирование и коммуникации. Объединяем каналы продвижения вокруг узнаваемого образа бренда.",
        "Узнаваемое оформление торгового пространства",
        "Чтобы узнавали. И выбирали.",
        "#843c07"
    ],
    [
        "Разработка AI-агента",
        "Разрабатываем AI-агентов под рабочие задачи: с нужными данными, интеграциями и понятными границами самостоятельности.",
        "AI-помощник на экране смартфона",
        "Меньше рутины. Больше возможностей.",
        "#372b86"
    ],
    [
        "GEO-продвижение",
        "Работаем с контентом, фактами и упоминаниями компании, чтобы она была понятнее системам поиска с генеративными ответами.",
        "Интерфейс генеративного поиска на ноутбуке",
        "Ваш бренд в новом поиске",
        "#005e70"
    ]
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
    if (index === active) return;
    clearTimeout(cleanup);
    scenes.forEach(scene => scene.classList.remove('is-leaving'));
    const old = active;
    active = index;
    elapsed = 0;
    hero.style.setProperty('--hero-progress', '0');
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
    hero.querySelector('#hero-service-promise').textContent = services[active][3];
    hero.querySelector('#hero-current').textContent = String(active + 1).padStart(2, '0');
    hero.style.setProperty('--hero-accent', services[active][4]);
    scenes.forEach((scene, i) => scene.setAttribute('aria-hidden', String(i !== active)));
    hero.querySelector('.hero-service-copy').setAttribute('aria-live', manual ? 'polite' : 'off');
    cleanup = setTimeout(() => {
      scenes.forEach(scene => scene.classList.remove('is-leaving'));
      hero.classList.remove('is-changing');
    }, 1000);
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', event => { focused = event.detail === 0; select(i, true); sync(); });
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
  hero.querySelector('.hero-prev').addEventListener('click', () => { focused = false; select((active + services.length - 1) % services.length, true); sync(); });
  hero.querySelector('.hero-next').addEventListener('click', () => { focused = false; select((active + 1) % services.length, true); sync(); });
  playback.addEventListener('click', () => { paused = !paused; focused = false; sync(); });
  hero.querySelector('.hero-services').addEventListener('focusin', () => { focused = true; sync(); });
  hero.querySelector('.hero-services').addEventListener('focusout', event => {
    if (!event.relatedTarget || !hero.querySelector('.hero-services').contains(event.relatedTarget)) { focused = false; sync(); }
  });
  document.addEventListener('visibilitychange', () => { previous = performance.now();sync(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    document.body.classList.toggle('hero-in-view', visible);
    previous = performance.now();sync();
  }, { threshold: .15 }).observe(hero);
  motion.addEventListener('change', () => { paused = motion.matches;sync(); });
  sync();
  function tick(now) {
    const delta = Math.min(now - previous, 100);
    previous = now;
    if (!stopped) {
      elapsed += delta;
      hero.style.setProperty('--hero-progress', String(Math.min(1, elapsed / 5000)));
      if (elapsed >= 5000) select((active + 1) % services.length);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
