(function () {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const intakeForm = document.querySelector('[data-intake-form]');
  if (!intakeForm) return;

  const status = document.querySelector('[data-intake-status]');
  const key = 'gabriel-growth-engine-public-intake-draft';
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.entries(data).forEach(([name, value]) => {
        const field = intakeForm.elements[name];
        if (field) field.value = value;
      });
      if (status) status.textContent = 'Draft restored locally on this device. Nothing has been sent.';
    } catch (error) {
      localStorage.removeItem(key);
    }
  }

  intakeForm.addEventListener('input', () => {
    const data = Object.fromEntries(new FormData(intakeForm).entries());
    localStorage.setItem(key, JSON.stringify(data));
    if (status) status.textContent = 'Draft saved locally only. No email, API, or auto-posting is active.';
  });

  intakeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(intakeForm).entries());
    localStorage.setItem(key, JSON.stringify(data));
    if (status) status.textContent = 'Request draft saved locally. Next build can connect this to approved intake handling.';
  });
})();