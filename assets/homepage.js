/* Static preview: no submission, no personal data in analytics events. */
(() => {
  const root = document.getElementById('homepage');
  const form = document.getElementById('home-project-form');
  if (!root || !form) return;
  form.querySelector('button[type=submit]').disabled = false;
  const emit = (event, detail = {}) => root.dispatchEvent(new CustomEvent('optimism:interaction', {
    bubbles: true, detail: { event, page: 'homepage-preview', ...detail }
  }));
  root.addEventListener('click', event => {
    const a = event.target.closest('a');
    if (!a) return;
    emit(a.dataset.case ? 'case_open' : 'cta_click', {
      block: a.closest('[data-block]')?.dataset.block || '',
      target: a.dataset.case || a.dataset.cta || (a.hash ? a.hash : 'external-link')
    });
  });
  root.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => {
    if (details.open) emit('detail_open', { block: details.closest('[data-block]')?.dataset.block || '' });
  }));
  let started = false;
  form.addEventListener('input', () => {
    if (!started) { emit('form_start', { form: 'project' }); started = true; }
    document.getElementById('project-status').textContent = '';
  });
  const phone = document.getElementById('project-phone');
  const consent = document.getElementById('project-consent');
  const error = (input, id, message) => {
    const node = document.getElementById(id);
    node.textContent = message;
    node.hidden = !message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const digits = phone.value.replace(/\D/g, '');
    const validPhone = /^[+\d\s().-]+$/.test(phone.value.trim()) && digits.length >= 10 && digits.length <= 15;
    error(phone, 'phone-error', validPhone ? '' : 'Введите телефон с кодом страны: от 10 до 15 цифр.');
    error(consent, 'consent-error', consent.checked ? '' : 'Для продолжения необходимо согласие.');
    if (!validPhone || !consent.checked) {
      emit('form_validation_error', { field: !validPhone ? 'phone' : 'consent' });
      (!validPhone ? phone : consent).focus();
      return;
    }
    const status = document.getElementById('project-status');
    status.textContent = 'Форма проверена. Это демоверсия: данные не отправлены и не сохранены. Свяжитесь с агентством по телефону на странице.';
    status.focus();
    emit('form_demo_complete', { form: 'project' });
  }, true);
})();
