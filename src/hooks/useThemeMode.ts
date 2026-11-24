import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'night' | 'day';

const STORAGE_KEY = 'apex-theme';

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'night';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'day' || saved === 'night') return saved;
  } catch {
    // Ignore storage read errors in restricted contexts
  }
  return 'night';
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'night') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
  }, []);

  return {
    theme,
    isDay: theme === 'day',
    isNight: theme === 'night',
    setTheme,
    toggleTheme,
  };
}
