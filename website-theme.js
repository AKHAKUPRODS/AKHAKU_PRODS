(() => {
  'use strict';
  const key = 'ap_theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: light)');
  let choice;
  try { choice = localStorage.getItem(key); } catch (_) {}
  let theme = choice === 'light' || choice === 'dark' ? choice : (system.matches ? 'light' : 'dark');
  function paint() {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (document.body) document.body.classList.toggle('light', theme === 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-label', 'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' mode');
      button.setAttribute('aria-pressed', String(theme === 'light'));
      const icon = button.querySelector('[data-theme-icon], #ti');
      const label = button.querySelector('[data-theme-label], #tl');
      if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
      if (label) label.textContent = theme === 'light' ? 'Dark' : 'Light';
    });
  }
  function set(next, persist = true) {
    if (next !== 'light' && next !== 'dark') return;
    theme = next;
    if (persist) { choice = next; try { localStorage.setItem(key, next); } catch (_) {} }
    paint();
  }
  window.SiteTheme = { get: () => theme, set, toggle: () => set(theme === 'light' ? 'dark' : 'light') };
  window.toggleTheme = window.SiteTheme.toggle;
  paint();
  function ready() {
    paint();
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', window.SiteTheme.toggle));
    document.querySelectorAll('[data-current-year], #year').forEach(node => { node.textContent = new Date().getFullYear(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else ready();
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    choice = event.newValue;
    set(choice === 'light' || choice === 'dark' ? choice : (system.matches ? 'light' : 'dark'), false);
  });
  system.addEventListener('change', () => { if (choice !== 'light' && choice !== 'dark') set(system.matches ? 'light' : 'dark', false); });
})();
