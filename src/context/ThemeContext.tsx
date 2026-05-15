import React, { createContext, useContext, useState, useEffect } from 'react';

export type Plan = 'access' | 'privilege' | null;
export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  plan: Plan;
  setPlan: (p: Plan) => void;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
  // CSS token helper
  t: (light: string, dark: string) => string;
}

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlanState] = useState<Plan>(null);
  const [manualOverride, setManualOverride] = useState<ThemeMode | null>(null);

  const defaultTheme: ThemeMode = plan === 'privilege' ? 'dark' : 'light';
  const theme: ThemeMode = manualOverride ?? defaultTheme;
  const isDark = theme === 'dark';

  const setPlan = (p: Plan) => {
    setPlanState(p);
    setManualOverride(null); // reset override when plan changes
  };

  const toggleTheme = () => setManualOverride(isDark ? 'light' : 'dark');
  const setTheme = (t: ThemeMode) => setManualOverride(t);

  const t = (light: string, dark: string) => isDark ? dark : light;

  // Apply CSS class to root for global token switching
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, plan, setPlan, toggleTheme, setTheme, isDark, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
