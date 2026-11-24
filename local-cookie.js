/* Строка cookie в подвале: выбор на домене, «отключить» гасит счётчики (OPT320971).
   Собирается из business/projects/optimism/scripts/cookie-OPT320971/cookie_stroka.py, правка только там. */
(function () {
  var GOD = 31536000;
  var GA = ['G-J29Q7NWYNM', 'UA-18696008-6', 'UA-18696008-1'];
  var SLED = /^(_ym_|_ga|_gid|_gat|_gcl_|mdd$)/;
  var KUDA = /mc\.yandex\.|mc\.webvisor\.|google-analytics\.com|analytics\.google\.com|googletagmanager\.com|vk\.com\/(rtrg|js\/api\/openapi)/;
  var perekryto = false;
  var host = location.hostname;
  var domen = '.' + host.split('.').slice(-2).join('.');

  function off() { return /(?:^|;\s*)opt_cookie=off(?:;|$)/.test(document.cookie); }

  function zapisat(vyklyuchit) {
    document.cookie = 'opt_cookie=off; path=/; SameSite=Lax; max-age=' + (vyklyuchit ? GOD : 0);
  }

  function steret(imya) {
    [domen, host, ''].forEach(function (d) {
      document.cookie = imya + '=; path=/; max-age=0' + (d ? '; domain=' + d : '');
    });
  }

  /* GA копит хиты и шлёт пачкой: запрос из очереди уходил через 4,6 с после нажатия, флаг ga-disable его не держит */
  function perekryt() {
    if (perekryto) return;
    perekryto = true;
    var b = navigator.sendBeacon, f = window.fetch;
    if (b) navigator.sendBeacon = function (u, d) { return KUDA.test(u) || b.call(navigator, u, d); };
    if (f) window.fetch = function (u) {
      return KUDA.test(u && u.url || u) ? Promise.resolve(new Response(null, { status: 204 })) : f.apply(window, arguments);
    };
    /* пинг диагностики GTM и подгрузка тегов идут не через fetch, а через src картинки или скрипта */
    [window.HTMLImageElement, window.HTMLScriptElement].forEach(function (K) {
      var d = Object.getOwnPropertyDescriptor(K.prototype, 'src');
      Object.defineProperty(K.prototype, 'src', {
        configurable: true, enumerable: true, get: d.get,
        set: function (v) { if (!KUDA.test(v)) d.set.call(this, v); }
      });
    });
  }

  function pogasit() {
    if (!off()) return;
    perekryt();
    GA.forEach(function (id) { window['ga-disable-' + id] = true; });
    /* GTM живёт до конца страницы: возвращаем массиву обычный push, и события форм до его тегов не доходят */
    if (window.dataLayer) window.dataLayer.push = Array.prototype.push;
    var ya = window.Ya && window.Ya.Metrika2;
    if (!ya && window.ym) window.ym = function () {}; /* tag.js ещё в пути: очередь вызовов ему не достанется */
    (ya && ya.counters ? ya.counters() : []).forEach(function (c) {
      window['disableYaCounter' + c.id] = true;
      try { window.ym(c.id, 'destruct'); } catch (e) {}
    });
    document.cookie.split(';').forEach(function (k) {
      var imya = k.split('=')[0].trim();
      if (SLED.test(imya)) steret(imya);
    });
    try {
      Object.keys(localStorage).forEach(function (k) { if (/^_ym/.test(k)) localStorage.removeItem(k); });
    } catch (e) {}
  }

  function primenit() {
    var o = off();
    window.optCookieOff = o; /* отложенный запуск счётчика на этой странице смотрит сюда */
    document.querySelectorAll('[data-opt-cookie]').forEach(function (m) {
      m.querySelector('a').textContent = o ? 'принять cookies' : 'отключить cookies';
      m.lastChild.textContent = o ? ' для\xa0вашего удобства.' : ' для\xa0вашего спокойствия.';
    });
    /* счётчик мог ещё грузиться в момент нажатия */
    if (o) [0, 300, 800, 1500, 3000, 5000, 8000, 12000, 20000].forEach(function (t) { setTimeout(pogasit, t); });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-opt-cookie] a');
    if (!a) return;
    e.preventDefault();
    zapisat(!off());
    primenit();
  });
  addEventListener('pageshow', function (e) { if (e.persisted) primenit(); });
  /* Метрика дописывает служебные ключи _ym_afr в localStorage и после destruct, уже без сети */
  addEventListener('pagehide', pogasit);

  if (document.querySelector('footer.footer [data-opt-cookie]')) {
    var s = document.createElement('style');
    s.textContent = '@media (max-width:575px){footer.footer{padding-bottom:96px}}';
    document.head.appendChild(s);
  }
  primenit();
})();
