import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type ThemeOption = {
  value: 'light' | 'dark' | 'system';
  icon: typeof Sun;
  label: string;
};

const themeOptions: ThemeOption[] = [
  { value: 'light', icon: Sun, label: 'Claro' },
  { value: 'dark', icon: Moon, label: 'Oscuro' },
  { value: 'system', icon: Monitor, label: 'Sistema' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-theme-tertiary border border-theme">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <motion.button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              relative flex items-center justify-center w-8 h-8 rounded-full
              transition-colors duration-200
              ${isActive
                ? 'text-accent'
                : 'text-theme-tertiary hover:text-theme-secondary'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={option.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-theme-card rounded-full shadow-sm"
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
          </motion.button>
        );
      })}
    </div>
  );
}

// Simple toggle for just light/dark
export function ThemeToggleSimple() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="
        flex items-center justify-center w-10 h-10 rounded-xl
        bg-theme-tertiary
        text-theme-secondary
        hover:bg-theme-hover
        border border-theme
        transition-colors duration-200
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={resolvedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
