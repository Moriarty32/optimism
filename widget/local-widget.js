/* Original public widget markup/styles; local preview interactions only. */
(function () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;
  window.addEventListener('scroll', function () {
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = '/widget/original.css'; document.head.appendChild(css);
    document.body.appendChild(document.querySelector('#local-widget-template').content.cloneNode(true));
    var widget = document.querySelector('.b24-widget-button-wrapper');
    var hello = widget.querySelector('[data-b24-crm-hello-cont]');
    // The static preview has no live operator; keep only the contact button.
    hello.style.display = 'none';
    widget.querySelector('[data-b24-hello-btn-hide]').addEventListener('click', function () {
      hello.classList.remove('b24-widget-button-popup-show');
    });
    widget.querySelector('[data-b24-crm-button-block-button]').addEventListener('click', function () {
      widget.classList.toggle('b24-widget-button-bottom');
      hello.classList.remove('b24-widget-button-popup-show');
    });
    widget.querySelector('[data-b24-crm-button-widget="openline_livechat"]').addEventListener('click', function () {
      widget.classList.remove('b24-widget-button-bottom');
      window.jQuery('.b24-web-form-popup-btn-14').first().trigger('click');
    });
  }, {once:true});
})();
