// Theme detection and toggle logic
// Reference: 06_design_system.md Section 2.5

export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  // 1. Check localStorage for explicit user preference
  const stored = localStorage.getItem('emolens-theme');
  if (stored === 'light' || stored === 'dark') return stored;

  // 2. Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 3. Default to dark (more calming for target users)
  return 'dark';
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('emolens-theme', theme);
}

export function toggleTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme') as Theme;
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
