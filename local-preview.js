/* Local-only transport adapters. Original form validation and layout are preserved. */
(function () {
  window.optZagruzitKapchu = function () {};
  window.optZagruzitV3 = function () {};
  function previewResult(form) {
    var $form = window.jQuery(form);
    $form.removeClass('opacity-0 error success');
    $form.find('.success-block').attr('role', 'status').text(
      'Это локальная копия сайта. Заявка не отправлена.'
    ).show();
  }
  window.optOtpravkaYadro = previewResult;
  window.sendForm = previewResult;
})();
