(function () {
  var href = 'https://optimism.ru/seo-calc/';
  var title = 'Калькулятор работ';

  function addCalcButton() {
    var socialBlock = document.querySelector(
      '[data-b24-crm-button-block].b24-widget-button-social'
    );

    if (!socialBlock) return false;
    if (socialBlock.querySelector('.opt-b24-extra-button')) return true;

    var button = document.createElement('a');
    button.className = 'b24-widget-button-social-item opt-b24-extra-button';
    button.href = href;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.title = '';
    button.setAttribute('aria-label', title);
    button.setAttribute('data-b24-widget-sort', '50');

    button.innerHTML =
      '<i>' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect x="5" y="3" width="14" height="18" rx="2" stroke="white" stroke-width="2"></rect>' +
          '<rect x="8" y="6" width="8" height="3" rx="1" fill="white"></rect>' +
          '<circle cx="9" cy="13" r="1" fill="white"></circle>' +
          '<circle cx="12" cy="13" r="1" fill="white"></circle>' +
          '<circle cx="15" cy="13" r="1" fill="white"></circle>' +
          '<circle cx="9" cy="17" r="1" fill="white"></circle>' +
          '<circle cx="12" cy="17" r="1" fill="white"></circle>' +
          '<circle cx="15" cy="17" r="1" fill="white"></circle>' +
        '</svg>' +
      '</i>' +
      '<span data-b24-crm-button-tooltip class="b24-widget-button-social-tooltip">' + title + '</span>';

    var firstSocialItem = socialBlock.querySelector('.b24-widget-button-social-item');
    socialBlock.insertBefore(button, firstSocialItem);

    return true;
  }

  function addStyles() {
    if (document.querySelector('#opt-b24-extra-button-style')) return;

    var style = document.createElement('style');
    style.id = 'opt-b24-extra-button-style';
    style.textContent =
      '.opt-b24-extra-button {' +
        'background-color: #0c144f !important;' +
        'background-image: none !important;' +
      '}' +
      '.opt-b24-extra-button i {' +
        'display: flex !important;' +
        'align-items: center;' +
        'justify-content: center;' +
        'width: 100%;' +
        'height: 100%;' +
        'background: none !important;' +
      '}' +
      '.opt-b24-extra-button svg {' +
        'display: block;' +
        'width: 24px;' +
        'height: 24px;' +
      '}';

    document.head.appendChild(style);
  }

  function init() {
    addStyles();
    addCalcButton();

    var observer = new MutationObserver(function () {
      addCalcButton();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();