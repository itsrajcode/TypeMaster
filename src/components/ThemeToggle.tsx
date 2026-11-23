import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-full 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-md 
        border border-gray-200/80 dark:border-gray-700/80 
        shadow-lg hover:shadow-xl hover:scale-110 active:scale-95
        text-gray-700 dark:text-gray-200 
        transition-all duration-200 flex items-center justify-center group"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
