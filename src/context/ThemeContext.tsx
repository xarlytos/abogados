import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// Función para obtener el tema inicial sin causar hydratation mismatch
const getInitialTheme = (defaultTheme: Theme): Theme => {
  if (typeof window === 'undefined') return defaultTheme;
  return (localStorage.getItem('derecho-theme') as Theme) || defaultTheme;
};

// Función para resolver el tema (considerando 'system')
const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'derecho-theme',
}: ThemeProviderProps) {
  // Inicializar con el valor por defecto para evitar hydratation mismatch
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Efecto para cargar el tema desde localStorage después del montaje
  useEffect(() => {
    const storedTheme = getInitialTheme(defaultTheme);
    setThemeState(storedTheme);
    
    const resolved = resolveTheme(storedTheme);
    setResolvedTheme(resolved);
    
    // Aplicar la clase inmediatamente
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    
    setMounted(true);
  }, [defaultTheme]);

  // Efecto para aplicar cambios de tema
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      root.classList.remove('light', 'dark');

      let resolved: 'light' | 'dark';
      if (theme === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }

      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    applyTheme();

    // Listen for system theme changes
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Always wrap children with the provider, even before mounting
  // This ensures useTheme() works during initial render
  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
