import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent-teal dark:hover:border-accent-teal transition-all shadow-lg hover:shadow-glow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-accent-teal" />
      ) : (
        <Moon className="w-5 h-5 text-accent-teal" />
      )}
    </motion.button>
  );
}
