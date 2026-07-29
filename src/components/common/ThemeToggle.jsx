import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-indigo-900/50 border-indigo-500' 
          : 'bg-amber-100 border-amber-400'
      } border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0.5 rounded-full transition-all duration-300 ${
        isDark 
          ? 'translate-x-7 bg-indigo-600' 
          : 'translate-x-0 bg-amber-500'
      }`}>
        <div className="flex items-center justify-center w-full h-full">
          {isDark ? (
            <FaMoon className="w-3 h-3 text-white" />
          ) : (
            <FaSun className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
