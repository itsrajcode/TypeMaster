import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-lg
        dark:bg-white dark:bg-opacity-10 bg-black hover:bg-opacity-30 transition-all"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-gray-800 dark:text-white" />
      ) : (
        <Sun className="w-6 h-6 text-gray-800 dark:text-white" />
      )}
    </button>
  );
};

export default ThemeToggle;