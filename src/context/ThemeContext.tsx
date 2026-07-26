import React, { createContext, useContext, useMemo } from 'react';
import { COLORS, DARK_COLORS } from '../theme';
import { ThemeMode, ThemeContextType } from '../types';
import { usePersistedState } from '../storage/usePersistedState';

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
  colors: COLORS,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = usePersistedState<ThemeMode>('themeMode', 'light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setThemeMode: setMode,
      colors: mode === 'dark' ? DARK_COLORS : COLORS,
      isDark: mode === 'dark',
    }),
    [mode, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

