/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        sidebar: '#0f0f1a',
        primary: '#6c63ff',
        'primary-hover': '#5a52e0',
        'primary-light': 'rgba(108,99,255,0.15)',
        'bg-main': '#f4f6fb',
        'bg-card': '#ffffff',
        'text-dark': '#1a1a2e',
        'text-muted': '#8890a4',
        'text-light': '#b0b8cc',
        border: '#e4e8f0',
        green: '#00c853',
        'sidebar-text': '#7a80a0',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
