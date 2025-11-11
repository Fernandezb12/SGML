const THEME_KEY = 'sgml_theme';

export function applyTheme(theme) {
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', resolvedTheme);
  if (document.body) {
    document.body.setAttribute('data-theme', resolvedTheme);
    document.body.classList.toggle('is-dark', resolvedTheme === 'dark');
  }
  localStorage.setItem(THEME_KEY, resolvedTheme);
}

export function initThemeToggle(button) {
  const stored = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(stored);

  if (!button) return;

  button.textContent = stored === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro';

  button.addEventListener('click', () => {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    button.textContent = next === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme) {
    applyTheme(theme);
  }
});
