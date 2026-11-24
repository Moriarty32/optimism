// 20.11.2026 OPT321083: новый путь заявок на ядро-приёмник /otpravka.php. Слова Романа: 20.11.2026 07:05 «ок, свои
// формы optimism.ru и блога на ядро», 19.11.2026 03:18 внешне формы не меняются, меняется механика, 19.11.2026 00:29
// «чтобы капча сама не показывалась». Канон в git: business/projects/agency-landings-ru/optimism-ru/crm-forms_rec.js,
// база для сравнения и отката рядом (crm-forms_rec.orig.js), на сайт кладёт scripts/optimism_formy.py (шаги svoi-*).
// Режим подставляет выкладка одной заменой метки ниже:
//   'proba'  новый путь только у того, кто открыл любую страницу сайта с ?forma=nasha (метка живёт в sessionStorage до
//            закрытия вкладки, ?forma=portal снимает); остальные идут старым путём без изменений, с невидимой v2;
//   'vsegda' новый путь у всех, скрипт reCAPTCHA v2 не грузится вовсе.
// Метка не подставлена: старый путь у всех.
// Новый путь: те же проверки полей и тот же вид; reCAPTCHA v3 оценкой (скрипт грузится при касании формы или открытии
// окна, значок скрыт, в форме строка про reCAPTCHA); POST на /otpravka.php: тело формы как есть плюс forma, forma_sec,
// stranica, rc_token. Google не ответил: заявка уходит без токена, ядро её не теряет.
var OPT_REZHIM_SVOIH_FORM = 'vsegda';
var OPT_KLUCH_V3 = '6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM';
var OPT_NOVYJ_PUT = (function () {
    if (OPT_REZHIM_SVOIH_FORM === 'vsegda') {
        return true;
    }
    if (OPT_REZHIM_SVOIH_FORM !== 'proba') {
        return false;
    }
    var m = /[?&]forma=(nasha|portal)\b/.exec(location.search);
    try {
        if (m && m[1] === 'nasha') {
            sessionStorage.setItem('optForma', '1');
        }
        if (m && m[1] === 'portal') {
            sessionStorage.removeItem('optForma');
        }
        return sessionStorage.getItem('optForma') === '1';
    } catch (e) {
        return !!(m && m[1] === 'nasha');
    }
})();

var idCaptcha3, 
    idCaptcha14,
    idCaptcha36,
    idCaptcha35,
    idCaptcha34,
    idCaptcha33,
    idCaptcha32,
    idCaptcha31,
    onloadReCaptchaInvisible = function() {
		
	  setTimeout(() => {
		console.log('init recap')
	  
		
      idCaptcha3 = grecaptcha.render('recaptcha3', {
        "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
        "callback": "onSubmitReCaptcha3",
        "size": "invisible"
      });
      idCaptcha14 = grecaptcha.render('recaptcha14', {
        "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
        "callback": "onSubmitReCaptcha14",
        "size": "invisible"
      });
      if($('#bitrix-36').length) {
        idCaptcha36 = grecaptcha.render('recaptcha36', {
            "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
            "callback": "onSubmitReCaptcha36",
            "size": "invisible"
        });
      };
      if($('#bitrix-35').length) {
        idCaptcha35 = grecaptcha.render('recaptcha35', {
            "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
            "callback": "onSubmitReCaptcha35",
            "size": "invisible"
        });
      };
      if($('#bitrix-34').length) {
        idCaptcha34 = grecaptcha.render('recaptcha34', {
            "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
            "callback": "onSubmitReCaptcha34",
            "size": "invisible"
        });
      };
      if($('#bitrix-33').length) {
        idCaptcha33 = grecaptcha.render('recaptcha33', {
            "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
            "callback": "onSubmitReCaptcha33",
            "size": "invisible"
        });
      };
      if($('#bitrix-32').length) {
        idCaptcha32 = grecaptcha.render('recaptcha32', {
            "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
            "callback": "onSubmitReCaptcha32",
            "size": "invisible"
        });
      };
      if($('#bitrix-31').length) {
        idCaptcha31 = grecaptcha.render('recaptcha31', {
            "sitekey": "6LeQutktAAAAAIvPvLVeZEwulVmeWGq0mSYJSgyM",
            "callback": "onSubmitReCaptcha31",
            "size": "invisible"
        });
      };
	  
	  },300);
	  
    };
	

// 16.11.2026 OPT321044: отправляется та форма, где нажали кнопку. На странице бывает две формы с одним id (на /land/
// форма 14 в блоке страницы и во всплывающем окне), и $('#bitrix-14') всегда брал первую: из второй уходили чужие поля.
// Галочка согласия проверяется ещё раз в момент отправки: пока капча думала, отметку могли снять.
var optFormaOtpravki = {};
var OPT_SOGLASIE_TEKST = 'Отметьте согласие на обработку персональных данных, без него заявку отправить нельзя.';
function optPodskazkaSoglasiya($galka, pokazat) {
    var $mesto = $galka.closest('label, .checkbox-area');
    if (!$mesto.length) {
        $mesto = $galka;
    }
    var $p = $mesto.nextAll('.opt-soglasie-podskazka').first();
    if (!pokazat) {
        $p.remove();
        return;
    }
    if (!$p.length) {
        $p = $('<div class="opt-soglasie-podskazka" role="alert"></div>').text(OPT_SOGLASIE_TEKST).css({
            'flex': '0 0 100%', 'order': 11, 'width': '100%', 'margin': '6px 0 0', 'padding': '6px 10px',
            'border-radius': '4px', 'background': '#fff3f3', 'color': '#b00020', 'font-size': '13px',
            'line-height': '1.35', 'text-align': 'center'});
        $mesto.after($p);
    }
}
$(document).on('change', '.crm-form input[type=checkbox][name=agreement]', function () {
    if ($(this).prop('checked')) {
        optPodskazkaSoglasiya($(this), false);
    }
});

// 08.11.2026 OPT320970: reCAPTCHA грузится при первом касании формы, а не по таймеру на каждой странице.
var optKapchaNachata = false;
function optZagruzitKapchu() {
    if (OPT_NOVYJ_PUT) {
        optZagruzitV3();   // OPT321083: на новом пути v2 не грузится и не рисуется
        return;
    }
    if (optKapchaNachata) {
        return;
    }
    optKapchaNachata = true;
    // Виджет форм Битрикс24 мог уже загрузить api.js без нашего onload: тогда отрисовать капчи форм самим.
    if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
        grecaptcha.ready(onloadReCaptchaInvisible);
        return;
    }
    var s = document.createElement('script');
    s.src = 'https://www.google.com/recaptcha/api.js?onload=onloadReCaptchaInvisible&render=explicit';
    s.async = true;
    document.head.appendChild(s);
}
function optKasanieFormy(e) {
    if (e.target && e.target.closest && e.target.closest('form.crm-form')) {
        optZagruzitKapchu();
    }
}
document.addEventListener('focusin', optKasanieFormy, true);
document.addEventListener('pointerdown', optKasanieFormy, true);
document.addEventListener('touchstart', optKasanieFormy, {capture: true, passive: true});
// Отправка могла опередить загрузку капчи: ждём её, а не падаем с исключением.
function optKogdaKapchaGotova($form, fn) {
    var id = Number($form.data('form-id'));
    if ([3, 14, 31, 32, 33, 34, 35, 36].indexOf(id) < 0) {
        fn();
        return;
    }
    optZagruzitKapchu();
    var start = Date.now();
    (function zhdi() {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.execute && window['idCaptcha' + id] !== undefined) {
            fn();
        } else if (Date.now() - start > 15000) {
            $form.find('.success-block').html('Не удалось отправить заявку. Попробуйте ещё раз немного позже.');
            todefaultCrm($form);
        } else {
            setTimeout(zhdi, 200);
        }
    })();
}

// ---------- 20.11.2026 OPT321083: новый путь на ядро /otpravka.php ----------
var OPT_YADRO = '/otpravka.php';
var OPT_FORMY = [3, 14, 31, 32, 33, 34, 35, 36];
// Слово Романа 20.11.2026 18:14: строку «Форму защищает reCAPTCHA…» убрать во всех формах («не несёт пользы»).
// Без строки условие Google требует видимого значка reCAPTCHA, поэтому optZagruzitV3 его не прячет.
var OPT_STROKA_RECAPTCHA = false;
// Слово Романа 20.11.2026 18:17 «значок убери везде»: значок Google прячем везде, хотя условие Google велит его показывать
// без строки. Вернуть значок: false.
var OPT_SKRYT_ZNACHOK = true;
// Там же: текст «Согласен на обработку персональных данных» был 11-13 px, «очень мелкий, не красиво».
// 22:40: в окне формы 3 галочка стояла по верху (align-items-start), текст выше её центра, «криво». Центрируем во всех формах.
// 21.11 07:06 (смотр форм, окна 14 и 3): «размер шрифта нужно больше во всех таких случаях»: 15 px в этом шрифте выглядели
// мельче описания окна. 16 px на телефоне, 18 px с 768 px.
var OPT_STIL_SOGLASIYA = '.crm-form .agreement_note,.crm-form label.opt-soglasie>span{font-size:16px!important;line-height:1.35!important}'
    + '@media (min-width:768px){.crm-form .agreement_note,.crm-form label.opt-soglasie>span{font-size:18px!important}}'
    + '.crm-form .checkbox-area{align-items:center!important}';
var OPT_TELEFON = '+7 (495) 118-20-98';
var OPT_TELEFON_SSYLKA = 'tel:+74951182098';
var OPT_T_USPEH = 'Спасибо, принято!';   // тот же текст, что отдавал старый обработчик bitrix24_form-rec.php
var OPT_T_SET = 'Не удалось отправить заявку. Позвоните нам, пожалуйста: ' + OPT_TELEFON + '.';
var OPT_V3_ZAGRUZKA_MS = 8000;   // сколько ждать скрипт Google, дальше заявка уходит без токена
var OPT_V3_TOKEN_MS = 4000;      // сколько ждать сам токен
var optV3 = {nachat: false, gotov: false, sboj: false, id: null};

function optZagruzitV3() {
    if (optV3.nachat) {
        return;
    }
    optV3.nachat = true;
    if (!/^6L[0-9A-Za-z_\-]{30,60}$/.test(OPT_KLUCH_V3)) {
        optV3.sboj = true;
        return;
    }
    // Значок Google скрывать можно, только если в форме есть строка про reCAPTCHA со ссылками Google: её ставит
    // optStrokaRecaptcha в каждую форму нового пути.
    // На странице есть форма с одним полем и без строки (слово Романа 17:00): значок Google не прячем.
    // С 18:14 строки нет ни у одной формы (OPT_STROKA_RECAPTCHA). Слово Романа 18:17 «значок убери везде»: значок
    // прячем и без строки, осознанно вопреки условию Google (OPT_SKRYT_ZNACHOK).
    if (OPT_SKRYT_ZNACHOK || (OPT_STROKA_RECAPTCHA && !document.querySelector('form.crm-form[data-opt-bez-stroki]'))) {
        var st = document.createElement('style');
        st.textContent = '.grecaptcha-badge{visibility:hidden!important}';
        document.head.appendChild(st);
    }
    var gotov = function (yavnyj) {
        try {
            window.grecaptcha.ready(function () {
                try {
                    if (yavnyj) {
                        // api.js уже загрузил кто-то другой (например, с render=explicit): свой невидимый клиент с ключом v3.
                        var mesto = document.createElement('div');
                        mesto.style.display = 'none';
                        document.body.appendChild(mesto);
                        optV3.id = window.grecaptcha.render(mesto, {sitekey: OPT_KLUCH_V3, size: 'invisible', badge: 'bottomright'});
                    }
                    optV3.gotov = true;
                } catch (e) {
                    optV3.sboj = true;
                }
            });
        } catch (e) {
            optV3.sboj = true;
        }
    };
    if (window.grecaptcha && window.grecaptcha.ready) {
        gotov(true);
        return;
    }
    var s = document.createElement('script');
    s.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(OPT_KLUCH_V3);
    s.async = true;
    s.onload = function () {
        gotov(false);
    };
    s.onerror = function () {
        optV3.sboj = true;
    };
    document.head.appendChild(s);
}

// Токен v3 или пустая строка: Google не загрузился или промолчал, заявка всё равно уходит.
function optTokenV3(fn) {
    optZagruzitV3();
    var start = Date.now(), vyshlo = false;
    var otdat = function (t) {
        if (!vyshlo) {
            vyshlo = true;
            fn(typeof t === 'string' ? t : '');
        }
    };
    (function zhdi() {
        if (optV3.gotov) {
            setTimeout(function () {
                otdat('');
            }, OPT_V3_TOKEN_MS);
            try {
                var p = optV3.id !== null
                    ? window.grecaptcha.execute(optV3.id, {action: 'zayavka'})
                    : window.grecaptcha.execute(OPT_KLUCH_V3, {action: 'zayavka'});
                p.then(otdat, function () {
                    otdat('');
                });
            } catch (e) {
                otdat('');
            }
        } else if (optV3.sboj || Date.now() - start > OPT_V3_ZAGRUZKA_MS) {
            otdat('');
        } else {
            setTimeout(zhdi, 150);
        }
    })();
}

function optTekstSTelefonom(tekst) {
    var $d = $('<div></div>');
    var i = tekst.indexOf(OPT_TELEFON);
    if (i < 0) {
        return $d.text(tekst).html();
    }
    $d.append(document.createTextNode(tekst.slice(0, i)));
    $d.append($('<a></a>').attr('href', OPT_TELEFON_SSYLKA).css('color', 'inherit').text(OPT_TELEFON));
    $d.append(document.createTextNode(tekst.slice(i + OPT_TELEFON.length)));
    return $d.html();
}

// Ответ ядра (OTVET_VID 'json'): успех 200 {"ok":true}; отказ {"ok":false,"oshibka":"…"} кодом 400, 429, 503 и др.
function optOtvetYadra($form, kod, d) {
    $form.data('optIdet', false);
    var uspeh = kod === 200 && !!d && (d.ok === true || d.error === false);
    var tekst;
    if (uspeh) {
        tekst = OPT_T_USPEH;
    } else if (d && typeof d.oshibka === 'string' && d.oshibka) {
        tekst = d.oshibka;
    } else if (d && d.ok !== true && typeof d.text === 'string' && d.text) {
        tekst = d.text;
    } else {
        tekst = OPT_T_SET;
    }
    if ($form.hasClass('landzone__form')) {
        $form.addClass(uspeh ? 'success' : 'error');
    }
    $form.find('.success-block').html(optTekstSTelefonom(tekst));
    todefaultCrm($form);
}

function optOtpravitVYadro($form, id, token) {
    var $soglasie = $form.find('input[type=checkbox][name=agreement]');
    if ($soglasie.length && !$soglasie.prop('checked')) {
        optPodskazkaSoglasiya($soglasie, true);
        $form.removeClass('opacity-0');
        $form.find('.success-block').html('');
        $form.data('optIdet', false);
        return;
    }
    if (typeof yaCounter1992100 != 'undefined') {
        $form.find('#clientid').val(yaCounter1992100.getClientID());
    }
    if (typeof b24Tracker != 'undefined' && b24Tracker.guest) {
        $form.find('#trace').val(b24Tracker.guest.getTrace());
    }
    var sec = $form.data('form-sec') || $('[data-form-id="' + id + '"]').data('form-sec') || '';
    var telo = $form.serialize() + '&' + $.param({forma: id, forma_sec: sec, stranica: String(location.href), rc_token: token || ''});
    $.ajax({
        url: OPT_YADRO,
        type: 'POST',
        dataType: 'json',
        timeout: 20000,
        data: telo,
        success: function (data, status, xhr) {
            var d = data;
            if (typeof d === 'string') {
                try {
                    d = JSON.parse(d);
                } catch (e) {
                    d = null;
                }
            }
            optOtvetYadra($form, xhr.status, d);
        },
        error: function (xhr) {
            var d = xhr.responseJSON;
            if (!d && xhr.responseText) {
                try {
                    d = JSON.parse(xhr.responseText);
                } catch (e) {}
            }
            optOtvetYadra($form, xhr.status, d);
        }
    });
}

// Вызывается из обработчика submit после всех прежних проверок полей и checkit.
function optOtpravkaYadro($form) {
    var id = Number($form.data('form-id'));
    if (OPT_FORMY.indexOf(id) < 0) {
        $form.find('.success-block').html('Что-то пошло не так...');
        todefaultCrm($form);
        return;
    }
    if ($form.data('optIdet')) {
        return;
    }
    $form.data('optIdet', true);
    optTokenV3(function (token) {
        optOtpravitVYadro($form, id, token);
    });
}

// Флекс-строка без переноса: строка про reCAPTCHA внутри неё сжала бы поля формы.
function optFleksVRyad(el) {
    var s = window.getComputedStyle ? window.getComputedStyle(el) : null;
    return !!s && /flex/.test(s.display) && !/column/.test(s.flexDirection) && s.flexWrap === 'nowrap';
}

// Строка про reCAPTCHA со ссылками Google у каждой формы нового пути (значок Google скрыт). Вёрстку полей не трогаем:
// форма в колонку или с переносом получает строку последней внутри себя (своей строкой), форма-ряд без переноса
// получает её сразу после себя, а если и родитель такой же ряд, то после родителя.
// Слово Романа 20.11.2026 17:00: у форм, где человек видит одно поле (только телефон), строку не ставить. Поля
// считаются по видимости: у отрисованной формы по размеру поля, у формы в закрытом окне по стилям.
function optVidimyhPolej(f) {
    var forma_vidna = f.getClientRects().length > 0;
    var n = 0;
    $(f).find('input, textarea, select').each(function () {
        if (/^(hidden|checkbox|radio|submit|button|image|reset)$/i.test(this.type || '')) {
            return;
        }
        if (this.tabIndex < 0 && this.getAttribute('aria-hidden')) {
            return;
        }
        var s = window.getComputedStyle ? window.getComputedStyle(this) : null;
        if (s && (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0')) {
            return;
        }
        if (forma_vidna) {
            var b = this.getBoundingClientRect();
            if (b.width < 2 || b.height < 2 || b.right < 0) {
                return;
            }
        }
        n += 1;
    });
    return n;
}

function optStrokaRecaptcha() {
    $('form.crm-form').each(function () {
        var $f = $(this);
        if (OPT_FORMY.indexOf(Number($f.data('form-id'))) < 0 || $f.data('optStroka')) {
            return;
        }
        $f.data('optStroka', true);
        if (!OPT_STROKA_RECAPTCHA || optVidimyhPolej(this) < 2) {
            // Без строки значок Google скрывать нельзя (условие Google): optZagruzitV3 его оставит.
            $f.attr('data-opt-bez-stroki', '1');
            return;
        }
        var $s = $('<div class="opt-recaptcha-stroka"></div>').attr('data-forma', String($f.data('form-id'))).css({
            'flex': '0 0 auto', 'order': 12, 'width': '100%', 'max-width': '100%', 'box-sizing': 'border-box',
            'margin': '8px 0 0', 'padding': '0', 'font-size': '11px', 'line-height': '1.35', 'color': 'inherit',
            'opacity': '0.7', 'text-align': 'center', 'font-weight': '400', 'text-transform': 'none', 'letter-spacing': 'normal'});
        var ssylka = function (tekst, href) {
            return $('<a target="_blank" rel="noopener"></a>').attr('href', href).css({'color': 'inherit', 'text-decoration': 'underline'}).text(tekst);
        };
        $s.append(document.createTextNode('Форму защищает reCAPTCHA. Действуют '))
            .append(ssylka('Политика конфиденциальности', 'https://policies.google.com/privacy'))
            .append(document.createTextNode(' и '))
            .append(ssylka('Условия использования', 'https://policies.google.com/terms'))
            .append(document.createTextNode(' Google.'));
        if (!optFleksVRyad(this)) {
            $f.append($s);
            return;
        }
        var mesto = this;
        while (mesto.parentElement && mesto.parentElement !== document.body && optFleksVRyad(mesto.parentElement)) {
            mesto = mesto.parentElement;
        }
        // Снаружи формы место в ряду соседей держит тот же order, что у формы (родитель-колонка бывает с order у детей).
        $s.css('order', window.getComputedStyle(mesto).order || 0);
        $(mesto).after($s);
    });
}
if (OPT_NOVYJ_PUT) {
    // Окно формы открыли: скрипт Google начинает грузиться заранее, к нажатию кнопки токен уже готов.
    $(document).on('click', '.b24-web-form-popup-btn-14, .b24-web-form-popup-btn-3', function () {
        optZagruzitV3();
    });
}

function onSubmitReCaptcha3(token) {
  var idForm = 'bitrix-3';
  sendForm(document.getElementById(idForm), $('[data-form-id=3]').data('form-id'), $('[data-form-id=3]').data('form-sec'), idCaptcha3);
}

function onSubmitReCaptcha14(token) {
  var idForm = 'bitrix-14';
  sendForm(document.getElementById(idForm), $('[data-form-id="14"]').data('form-id'), $('[data-form-id="14"]').data('form-sec'), idCaptcha14);
}

function onSubmitReCaptcha36(token) {
  var idForm = 'bitrix-36';
  sendForm(document.getElementById(idForm), $('[data-form-id="36"]').data('form-id'), $('[data-form-id="36"]').data('form-sec'), idCaptcha36);
}

function onSubmitReCaptcha35(token) {
  var idForm = 'bitrix-35';
  sendForm(document.getElementById(idForm), $('[data-form-id="35"]').data('form-id'), $('[data-form-id="35"]').data('form-sec'), idCaptcha35);
}

function onSubmitReCaptcha34(token) {
  var idForm = 'bitrix-34';
  sendForm(document.getElementById(idForm), $('[data-form-id="34"]').data('form-id'), $('[data-form-id="34"]').data('form-sec'), idCaptcha34);
}

function onSubmitReCaptcha33(token) {
  var idForm = 'bitrix-33';
  sendForm(document.getElementById(idForm), $('[data-form-id="33"]').data('form-id'), $('[data-form-id="33"]').data('form-sec'), idCaptcha33);
}

function onSubmitReCaptcha32(token) {
  var idForm = 'bitrix-32';
  sendForm(document.getElementById(idForm), $('[data-form-id="32"]').data('form-id'), $('[data-form-id="32"]').data('form-sec'), idCaptcha32);
}

function onSubmitReCaptcha31(token) {
  var idForm = 'bitrix-31';
  sendForm(document.getElementById(idForm), $('[data-form-id="31"]').data('form-id'), $('[data-form-id="31"]').data('form-sec'), idCaptcha31);
}

var sendForm = function(feedbackForm, id, sec, captchaID) {
    var $form = (optFormaOtpravki[id] && optFormaOtpravki[id].length) ? optFormaOtpravki[id] : $('#bitrix-'+id);
    var $soglasie = $form.find('input[type=checkbox][name=agreement]');
    if ($soglasie.length && !$soglasie.prop('checked')) {
        optPodskazkaSoglasiya($soglasie, true);
        $form.removeClass('opacity-0');
        $form.find('.success-block').html('');
        if (typeof grecaptcha != 'undefined' && captchaID !== undefined) {
            grecaptcha.reset(captchaID);
        }
        return;
    }
	if (typeof yaCounter1992100 != 'undefined') {
		$form.find('#clientid').val(yaCounter1992100.getClientID());
	}
	if (typeof b24Tracker != 'undefined' && b24Tracker.guest) {
		$form.find('#trace').val(b24Tracker.guest.getTrace());
	}
    $.ajax({
        url: '/local/includes/bitrix24_form-rec.php?CRM_ID='+id+'&CRM_SEC='+sec,
        type: 'POST',
        dataType: 'json',
		timeout: 20000,
        data: $form.serialize(),
        success: function(data) {
            var d = (typeof data === 'string') ? JSON.parse(data) : data;
			var isSuccess = d && (d.error === false || d.code === 0);
			if($form.hasClass('landzone__form') && isSuccess) {
                $form.addClass('success');
            }
            $form.find('.success-block').html(d && d.text ? d.text : 'Не удалось обработать ответ сервера. Попробуйте ещё раз.');
			if (typeof grecaptcha != 'undefined' && captchaID !== undefined) {
				grecaptcha.reset(captchaID);
			}
            todefaultCrm($form);
        },
        error: function(xhr) {
			var d = xhr.responseJSON;
			if (!d && xhr.responseText) {
				try {
					d = JSON.parse(xhr.responseText);
				} catch (e) {}
			}
            if($form.hasClass('landzone__form')) {
                $form.addClass('error');
            }
			$form.find('.success-block').html(d && d.text ? d.text : 'Не удалось отправить заявку. Попробуйте ещё раз немного позже.');
			if (typeof grecaptcha != 'undefined' && captchaID !== undefined) {
				grecaptcha.reset(captchaID);
			}
            todefaultCrm($form);
        }
    });
}

function todefaultCrm(form) {
    setTimeout(function() {
        form.removeClass('opacity-0').removeClass('error').removeClass('success');
        form.find('.success-block').html('');
        form.find('#checkit').val('');
        if($('.popup-box').length) $('.popup-box').hide().removeClass('showed');
        if($('.popup-overlay').length) $('.popup-overlay').hide();
        $('body').removeClass('overflowed');
    }, 10500)
};

function removeErrorClass(input) {
    setTimeout(function() {
        input.removeClass('error-input')
    }, 7000)
}

function validateCrmInputs(input, type) {
    var inpVal = input.val();

    if (type == "email") {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z-Яа-яЁё0-9_\-\.])+\.([A-Za-z-Яа-яЁё]{2,4})$/;
        if (inpVal == '') {
            input.removeClass('error-input');
            return !0
        }
    } else if (type == "name") {
        // OSP320473 08.10.2026: имя с дефисом и апострофом (слово Романа)
        var reg = /^[a-zA-ZА-Яа-яЁё\s'’\-]+$/
    } else if (type == "url") {
        var reg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    } 
	else if (type == "web") {
        // OSP320473 08.10.2026: сайт необязателен, регистр любой, кириллические домены (слово Романа)
        if (String(inpVal || '').trim() == '') {
            input.removeClass('error-input');
            return !0
        }
        var reg = /^(https?:\/\/)?([a-zа-яё0-9][a-zа-яё0-9\-]*\.)+[a-zа-яё0-9][a-zа-яё0-9\-]*/i
    }
	else if (type == "phone") {
        if (inpVal !== '' && inpVal.indexOf('_') !== -1) {
            input.addClass('error-input');
            removeErrorClass(input);
            return !1
        } else if (inpVal == '') {
            input.addClass('error-input');
            removeErrorClass(input);
            return !1
        } else {
            input.removeClass('error-input');
            return !0
        }
    } else if (type == "checkbox") {
        if (!input.prop('checked')) {
            if (input.is('[name=agreement]')) {
                optPodskazkaSoglasiya(input, true);
            }
            input.addClass('error-input');
            removeErrorClass(input);
            return !1
        } else {            
            input.removeClass('error-input');
            return !0
        }
    }
    if (reg.test(inpVal) == !1) {
        input.addClass('error-input');
        removeErrorClass(input);
        return !1
    } else if (reg.test(inpVal) == !0) {
        input.removeClass('error-input');
        return !0
    }
};

$(document).ready(function() {
	
	/*
	var check_click = false;
	$("form.crm-form input").one('click', function(){
		console.log("!!!recap");
		console.log(check_click);
		if(check_click === false)
			onloadReCaptchaInvisible();
		check_click = true;
	});
	*/
	
	
	
	
    if (OPT_NOVYJ_PUT) {
        optStrokaRecaptcha();   // OPT321083
        var optSt = document.createElement('style');
        optSt.textContent = OPT_STIL_SOGLASIYA;
        document.head.appendChild(optSt);
    }

    $('.agreement_note').click(function() {
        $(this).closest('.checkbox-area').find('label').trigger('click');
    });

    $('.crm-form input').on('focus', function() {
        var $form = $(this).closest('.crm-form'),
            $bxId = $form.data('form-id');
			
		
        if(!$form.hasClass('goal-send')) {
            //dataLayer.push({'event': 'GAEvent', 'eventCategory': 'B24_FORM_' + $bxId, 'eventAction': 'START'});
            $form.addClass('goal-send');
        }
		
		
		
        if($(this).prop('name') == 'LEAD_PHONE' && !$(this).hasClass('goal-send')) {
            $(this).addClass('goal-send');
			/*
            setTimeout(function() {
                dataLayer.push({'event': 'GAEvent', 'eventCategory': 'B24_FORM_' + $bxId, 'eventAction': 'LEAD_PHONE'});
            }, 500);           
            */
        }
		
        
    });

    if($('#form-popup-14').length) {
        $('.b24-web-form-popup-btn-14').click(function() {
            $('.popup-overlay').show();
            $('#form-popup-14').show().addClass('showed');
			
			setTimeout(() => {
				$('#form-popup-14 input:text:first').focus();
			}, 500);
			
            $('body').addClass('overflowed')
        })
    };

    if($('#form-popup-3').length) {
        $('.b24-web-form-popup-btn-3').click(function() {
            $('.popup-overlay').show();
            $('#form-popup-3').show().addClass('showed');
			
			setTimeout(() => {
				$('#form-popup-3 input:text:first').focus();
			}, 500);
			
			
            $('body').addClass('overflowed')
        })
    };

    $('.crm-form').keydown(function(event) {
        if (event.keyCode == 13) {
            $(this).closest('.crm-form').find('#checkit').val('checkitplease')
        }
    });


    $('.crm-form .btn').click(function() {
        $(this).closest('.crm-form').find('#checkit').val('checkitplease')
    });
    $('.crm-form input[name=LEAD_EMAIL]').on('keydown, blur', function() {
        validateCrmInputs($(this), 'email')
    });
    $('.crm-form input[name=LEAD_NAME]').on('keydown, blur', function() {
        validateCrmInputs($(this), 'name')
    });
    /*$('.crm-form input[name=LEAD_UF_CRM_1450338895]').on('keydown, blur', function() {
        validateCrmInputs($(this), 'url')
    });*/
	
	$('.crm-form input[name=LEAD_WEB]').on('keydown, blur', function() {
        validateCrmInputs($(this), 'web')
    });
	
    $('.crm-form input[name=LEAD_PHONE]').on('keydown, blur', function() {
        validateCrmInputs($(this), 'phone')
    });
    $('.crm-form input[type=checkbox]').on('change', function() {
        validateCrmInputs($(this), 'checkbox')
    });
    $('.crm-form').submit(function(e) {
        var $form = $(this),
            $emailInp = $form.find('input[name=LEAD_EMAIL]'),
            $nameInp = $form.find('input[name=LEAD_NAME]'),
            $urlInp = $form.find('input[name=LEAD_UF_CRM_1450338895]'),
            $phoneInp = $form.find('input[name=LEAD_PHONE]'),
            $agreeInp = $form.find('input[type=checkbox]'),
			
			$urlWeb = $form.find('input[name=LEAD_WEB]');
			
        if ($emailInp.length > 0 && !validateCrmInputs($emailInp, 'email')) {
            /*$emailInp.focus();*/
            return !1
        };
        if ($nameInp.length > 0 && !validateCrmInputs($nameInp, 'name')) {
            /*$nameInp.focus();*/
            return !1
        };
        /*if ($urlInp.length > 0 && !validateCrmInputs($urlInp, 'url')) {
            $urlInp.focus();
            return !1
        };*/
		
		if ($urlWeb.length > 0 && !validateCrmInputs($urlWeb, 'web')) {
            return !1
        };
		
        if ($phoneInp.length > 0 && !validateCrmInputs($phoneInp, 'phone')) {
            /*$phoneInp.focus();*/
            return !1
        };
        if ($agreeInp.length > 0 && !validateCrmInputs($agreeInp, 'checkbox')) {
            return !1
        };
		
		
		
		/**DELETE RECAPTHCA**/
		/* если рекапча не нужна убрать
		e.preventDefault();
		var idForm = 'bitrix-'+$(this).data('form-id');
		sendForm(document.getElementById(idForm), $('[data-form-id="'+$(this).data('form-id')+'"]').data('form-id'), $('[data-form-id="'+$(this).data('form-id')+'"]').data('form-sec'));
		/*****/
		
        
        optFormaOtpravki[$form.data('form-id')] = $form;
        $form.addClass('opacity-0');
        $form.find('.success-block').html('Идёт отправка...');
		console.log($form.data('form-id'));
        if ($form.find('#checkit').val() != 'checkitplease') {
            $form.find('.success-block').html('Что-то пошло не так...');
            todefaultCrm($form)
        } else if (OPT_NOVYJ_PUT) {
            optOtpravkaYadro($form);   // OPT321083: ядро /otpravka.php, токен v3
        } else {
            optKogdaKapchaGotova($form, function () {
            switch ($form.data('form-id')) {
                case 3:
                grecaptcha.execute(idCaptcha3);
                break;
                case 14:
                grecaptcha.execute(idCaptcha14);
                break;
                case 36:
                grecaptcha.execute(idCaptcha36);
                break;
                case 35:
                grecaptcha.execute(idCaptcha35);
                break;
                case 34:
                grecaptcha.execute(idCaptcha34);
                break;
                case 33:
                grecaptcha.execute(idCaptcha33);
                break;
                case 32:
                grecaptcha.execute(idCaptcha32);
                break;
                case 31:
                grecaptcha.execute(idCaptcha31);
                break;  
                default:
                $form.find('.success-block').html('Что-то пошло не так...');
                todefaultCrm($form);
                break;
            }
            });
        }
        return !1
    });

    $('.crm-form input[name=LEAD_PHONE]').mask('+7 (999) 999-99-99', {
        placeholder: '_'
    });

    $('.landzone__form input[name=LEAD_PHONE]').mask('+7 999 9999999', {
        placeholder: '_'
    });

    $('.popup-close, .popup-overlay').click(function() {
        $('.popup-overlay').hide();
        $('.popup-box').hide().removeClass('showed');
        $('body').removeClass('overflowed');
    });

    $(document).keydown(function(eventObject) {
        if (eventObject.which == 27) {
            $('body').removeClass('overflowed');
            if($('.popup-box').length) $('.popup-box').hide().removeClass('showed');
            if($('.popup-overlay').length) $('.popup-overlay').hide();           
        }
    });

    function checkAnswer(elemen, successGoalName) {
        successGoalName = successGoalName || '';
        var url = $(elemen).val(),
            http = url.split(':'),
            form = $(elemen).closest('form'),
            btn = form.find('button');
        if (http['0'] == 'http' || http['0'] == 'https') {
            domain = url;
            culcDomain = new URL(url);
            culcDomain = culcDomain.hostname;
            console.log(culcDomain)
        } else {
            domain = 'http://' + url;
            culcDomain = url;
            console.log(domain)
        }
        btn.prop('disabled', 'disabled');
        $.ajax({
            url: '/local/includes/answe.php',
            type: 'POST',
            dataType: 'json',
            data: {
                param1: domain
            },
            success: function(data) {
                var obj = eval(data);
                if (obj.headers[0] == 'HTTP/1.1 404 Not Found' || obj.headers[0] == 'HTTP/1.1434 Requested host unavailable' || obj.headers[0] == 'HTTP/1.1 403 Forbidden' || obj.headers[0] == undefined) {
                    console.log(obj.headers[0]);
                    $(elemen).addClass('input_state_error');
                    $(elemen).removeClass('input_state_success');
                    var oldVal = $(elemen).val();
                    if ($(elemen).val() == "")
                        $(elemen).val('Введите адрес сайта');
                    else $(elemen).val('Введите корректный адрес');
                    btn.prop('disabled', false);
                    setTimeout(function() {
                        $(elemen).val(oldVal);
                        $(elemen).removeClass('input_state_error')
                    }, 2000);
                } else {
                    $(elemen).removeClass('input_state_error');
                    $(elemen).addClass('input_state_success');
                    if (typeof yaCounter1992100 != "undefined") {
                        yaCounter1992100.reachGoal('ПереходНаKалькулятор')
                    }
                    if (successGoalName != '' && typeof yaCounter1992100 != "undefined") {
                        yaCounter1992100.reachGoal(successGoalName)
                    }
                    document.location.href = 'https://start.optimism.ru/' + obj.message.split('//')[1] + '#main'
                }
            }
        })
    };

    $('.sec-intro__form').submit(function() {
        checkAnswer('.sec-intro__input', '');
        return !1
    });
})
