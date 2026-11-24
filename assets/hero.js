/* Constant brand. Nine topics. Authored canvas depth field, no external animation library. */
(() => {
  const services = [
  {
    "title": "SEO-продвижение",
    "description": "Помогаем клиентам найти ваш сайт в нужный момент. Работаем с технической основой, структурой и содержанием.",
    "words": [
      "Поисковые запросы",
      "Индексация",
      "Семантика",
      "SEO",
      "Структура сайта",
      "Поисковая выдача",
      "Контент",
      "Яндекс",
      "Google",
      "Внутренние ссылки",
      "Оптимизация",
      "Технический аудит",
      "Органический трафик",
      "Видимость",
      "Скорость сайта",
      "Страницы входа"
    ],
    "light": [
      15,
      72
    ]
  },
  {
    "title": "Интернет-реклама",
    "description": "Соединяем рекламную стратегию, объявления и посадочные страницы. Анализируем путь от первого клика до обращения.",
    "words": [
      "Реклама",
      "Аудитория",
      "Поисковые кампании",
      "Посадочная страница",
      "Объявления",
      "Медиаплан",
      "Бюджет",
      "Ключевые фразы",
      "Ретаргетинг",
      "Яндекс Директ",
      "Конверсия",
      "Креатив",
      "Целевой трафик",
      "Сегменты",
      "Аналитика",
      "Обращения"
    ],
    "light": [
      85,
      65
    ]
  },
  {
    "title": "Аналитика и UX",
    "description": "Выясняем, как люди пользуются сайтом и где теряются обращения. Находим точки роста в аналитике и интерфейсе.",
    "words": [
      "Аналитика",
      "UX",
      "Путь клиента",
      "События",
      "Вебвизор",
      "Воронка",
      "Конверсия",
      "Интерфейс",
      "Формы",
      "Карта кликов",
      "Цели",
      "Точки роста",
      "Пользовательский опыт",
      "Исследования",
      "Гипотезы",
      "Яндекс Метрика"
    ],
    "light": [
      20,
      20
    ]
  },
  {
    "title": "Разработка сайтов",
    "description": "Проектируем структуру и интерфейс, разрабатываем и развиваем сайты. Соединяем задачи бизнеса и удобство клиента.",
    "words": [
      "Разработка",
      "Интерфейс",
      "Прототип",
      "Структура",
      "Скорость",
      "Адаптивность",
      "Каталог",
      "Интеграции",
      "Тестирование",
      "Навигация",
      "Дизайн",
      "Сайт",
      "CMS",
      "Архитектура",
      "Код",
      "Запуск"
    ],
    "light": [
      80,
      25
    ]
  },
  {
    "title": "Контент-маркетинг",
    "description": "Помогаем рассказать о продукте так, чтобы его поняли. От стратегии и экспертных материалов до контента для продвижения.",
    "words": [
      "Контент",
      "Редакция",
      "Экспертиза",
      "Истории",
      "Статьи",
      "Блог",
      "Содержание",
      "Редплан",
      "Продукт",
      "Форматы",
      "Интервью",
      "Сценарий",
      "Материалы",
      "Дистрибуция",
      "Коммуникация",
      "Читатель"
    ],
    "light": [
      10,
      65
    ]
  },
  {
    "title": "Социальные сети",
    "description": "Соединяем стратегию, контент и продвижение. Помогаем бренду находить свою аудиторию и выстраивать с ней связь.",
    "words": [
      "Соцсети",
      "Сообщество",
      "Контент",
      "Telegram",
      "ВКонтакте",
      "Аудитория",
      "Публикации",
      "Диалог",
      "Подписчики",
      "Стратегия",
      "Видео",
      "Реакции",
      "Продвижение",
      "Форматы",
      "Вовлечение",
      "Бренд"
    ],
    "light": [
      90,
      70
    ]
  },
  {
    "title": "Продвижение бренда",
    "description": "Выстраиваем позиционирование и коммуникации. Объединяем каналы продвижения вокруг узнаваемого образа бренда.",
    "words": [
      "Бренд",
      "Позиционирование",
      "Узнаваемость",
      "Коммуникация",
      "Репутация",
      "Ценности",
      "Стратегия",
      "Аудитория",
      "Образ",
      "Смысл",
      "Медиа",
      "Каналы",
      "Сообщение",
      "Восприятие",
      "Доверие",
      "Выбор"
    ],
    "light": [
      20,
      50
    ]
  },
  {
    "title": "Разработка AI-агента",
    "description": "Разрабатываем AI-агентов под рабочие задачи: с нужными данными, интеграциями и понятными границами самостоятельности.",
    "words": [
      "AI-агент",
      "База знаний",
      "Интеграции",
      "Диалог",
      "Данные",
      "Рабочие процессы",
      "Автоматизация",
      "Контекст",
      "Сценарии",
      "Инструменты",
      "Задачи",
      "Модели",
      "API",
      "Ассистент",
      "Контроль",
      "Команда"
    ],
    "light": [
      75,
      20
    ]
  },
  {
    "title": "GEO-продвижение",
    "description": "Работаем с контентом, фактами и упоминаниями компании, чтобы она была понятнее системам поиска с генеративными ответами.",
    "words": [
      "GEO",
      "Генеративный поиск",
      "Ответы AI",
      "Упоминания",
      "Источники",
      "Факты",
      "Бренд",
      "Контекст",
      "Нейросети",
      "Структура контента",
      "Цитирование",
      "Поиск",
      "Экспертиза",
      "Видимость",
      "Знания",
      "Релевантность"
    ],
    "light": [
      15,
      30
    ]
  }
];
  const hero = document.querySelector('.hero-typographic');
  if (!hero) return;
  const buttons = [...hero.querySelectorAll('[data-slide]')];
  const playback = hero.querySelector('.hero-playback');
  const copy = hero.querySelector('.hero-service-copy');
  const canvas = hero.querySelector('canvas');
  const context = canvas.getContext('2d', {alpha: true});
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const field = hero.querySelector('.hero-atmosphere');
  let active = 0, elapsed = 0, previous = 0, frame = 0, lastPaint = 0;
  let paused = motion.matches, visible = true, focused = false, running = false;
  let width = 0, height = 0, density = 1, burst = 0;
  let words = [], sprites = [], resetTimer;

  // Deterministic spacing keeps the same topic recognisable on revisit.
  function random(seed) {const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;return v - Math.floor(v);}
  function buildField() {
    if (!context || !width || !height) return;
    const pool = services[active].words;
    const baseSize = width < 700 ? 24 : Math.min(38, width / 50);
    // Cache text once; no per-frame font rasterisation, blur, or canvas filters.
    sprites = pool.map((text, i) => {
      const sprite = document.createElement('canvas');
      const c = sprite.getContext('2d');
      const size = Math.round(baseSize * (i % 4 === 0 ? 1.2 : 1));
      c.font = `700 ${size}px JoannaSansNova, sans-serif`;
      sprite.width = Math.ceil(c.measureText(text).width) + 8;
      sprite.height = Math.ceil(size * 1.5);
      c.font = `700 ${size}px JoannaSansNova, sans-serif`;
      c.textBaseline = 'middle';
      c.fillStyle = i % 3 === 0 ? '#56d1f5' : '#80b9de';
      c.fillText(text, 4, sprite.height / 2);
      return sprite;
    });
    const count = width < 700 ? 38 : 64;
    words = Array.from({length: count}, (_, i) => ({
      x:(random(i + active * 51 + 1) - .5) * 2.8,
      y:(random(i + active * 37 + 77) - .5) * 2.2,
      z:.32 + random(i + 193) * 1.55,
      sprite:i % sprites.length
    }));
    render(0);
  }
  function resize() {
    const bounds = field.getBoundingClientRect();
    width = bounds.width;height = bounds.height;
    density = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(3000000 / (width * height)));
    canvas.width = Math.round(width * density);canvas.height = Math.round(height * density);
    buildField();
  }
  function render(delta) {
    if (!context || !width) return;
    context.setTransform(density, 0, 0, density, 0, 0);
    context.clearRect(0, 0, width, height);
    burst = Math.max(0, burst - delta / 1000);
    for (const word of words) {
      word.z -= delta * .000065 * (1 + burst * 2.4);
      if (word.z < .24) word.z += 1.63;
      const depth = .85 / word.z;
      const x = width / 2 + word.x * width * .48 * depth;
      const y = height * .47 + word.y * height * .51 * depth;
      const sprite = sprites[word.sprite];
      const w = sprite.width * depth, h = sprite.height * depth;
      if (x < -w || x > width + w || y < -h || y > height + h) continue;
      const enter = Math.min(1, (1.87 - word.z) / .3);
      const leave = Math.min(1, (word.z - .24) / .18);
      context.globalAlpha = Math.max(0, enter * leave * (.19 + .2 * depth));
      context.drawImage(sprite, x - w / 2, y - h / 2, w, h);
    }
    context.globalAlpha = 1;
  }
  function select(index, manual = false) {
    elapsed = 0;
    hero.style.setProperty('--hero-progress', '0');
    if (index === active) return;
    active = index;
    const service = services[active];
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === active);
      button.setAttribute('aria-pressed', String(i === active));
    });
    copy.setAttribute('aria-live', manual ? 'polite' : 'off');
    hero.querySelector('#hero-service-title').textContent = service.title;
    hero.querySelector('#hero-service-description').textContent = service.description;
    hero.querySelector('#hero-current').textContent = String(active + 1).padStart(2, '0');
    hero.dataset.activeService = String(active);
    hero.style.setProperty('--flow-x', service.light[0] + '%');
    hero.style.setProperty('--flow-y', service.light[1] + '%');
    // The background changes its subject; the brand and actions never move.
    buildField();burst = motion.matches ? 0 : 1;
    clearTimeout(resetTimer);
    hero.classList.remove('is-changing');
    if (!motion.matches) {
      void copy.offsetWidth;
      hero.classList.add('is-changing');
      resetTimer = setTimeout(() => hero.classList.remove('is-changing'), 800);
    }
    if (manual) hero.dispatchEvent(new CustomEvent('optimism:interaction', {
      bubbles:true, detail:{event:'hero_service_select',page:'homepage-preview',block:'N-01',target:String(index)}
    }));
  }
  function sync() {
    const shouldRun = !paused && visible && !focused && !document.hidden;
    hero.classList.toggle('is-paused', !shouldRun);
    playback.setAttribute('aria-pressed', String(paused));
    playback.setAttribute('aria-label', paused ? 'Включить автоматическую смену услуг' : 'Остановить автоматическую смену услуг');
    playback.querySelector('span').textContent = paused ? 'Воспроизвести' : 'Пауза';
    if (shouldRun && !running) {running = true;previous = performance.now();frame = requestAnimationFrame(tick);}
    if (!shouldRun && running) {running = false;cancelAnimationFrame(frame);}
  }
  function tick(now) {
    if (!running) return;
    const delta = Math.min(now - previous, 80);previous = now;
    elapsed += delta;
    hero.style.setProperty('--hero-progress', String(Math.min(1, elapsed / 5000)));
    if (now - lastPaint >= 32) {
      render(motion.matches ? 0 : now - lastPaint > 100 ? 32 : now - lastPaint);
      lastPaint = now;
    }
    if (elapsed >= 5000) select((active + 1) % services.length);
    frame = requestAnimationFrame(tick);
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', event => {focused = event.detail === 0;select(i, true);sync();});
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
  hero.querySelector('.hero-prev').addEventListener('click', () => {focused=false;select((active+8)%9,true);sync();});
  hero.querySelector('.hero-next').addEventListener('click', () => {focused=false;select((active+1)%9,true);sync();});
  playback.addEventListener('click', () => {paused=!paused;focused=false;sync();});
  hero.querySelector('.hero-services').addEventListener('focusin', () => {focused=true;sync();});
  hero.querySelector('.hero-services').addEventListener('focusout', event => {
    if (!event.relatedTarget || !hero.querySelector('.hero-services').contains(event.relatedTarget)) {focused=false;sync();}
  });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(entries => {
    visible=entries[0].isIntersecting;
    document.body.classList.toggle('hero-in-view',visible);sync();
  },{threshold:.15}).observe(hero);
  motion.addEventListener('change', () => {paused=motion.matches;sync();render(0);});
  if (context) {
    hero.classList.add('hero-has-canvas');
    new ResizeObserver(resize).observe(field);
    document.fonts.ready.then(resize);
  }
  sync();

})();
