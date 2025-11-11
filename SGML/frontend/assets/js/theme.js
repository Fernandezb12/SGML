const THEME_KEY = 'sgml_theme';

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function initThemeToggle(button) {
  const stored = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(stored);

  if (!button) return;

  button.textContent = stored === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro';

  button.addEventListener('click', () => {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    button.textContent = next === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro';
    document.body.classList.toggle('is-dark', next === 'dark');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme) {
    applyTheme(theme);
    if (theme === 'dark') {
      document.body.classList.add('is-dark');
    }
  }
});
