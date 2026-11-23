/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'gradient':      'gradient 15s ease infinite',
        'cursor-blink':  'cursor-blink 1s step-end infinite',
        'streak-pop':    'streak-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer':       'shimmer 2s linear infinite',
        'fade-in-up':    'fade-in-up 0.5s ease-out',
        'bounce-in':     'bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%':      { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'streak-pop': {
          '0%':   { opacity: '0', transform: 'translateX(-50%) scale(0.6)' },
          '70%':  { transform: 'translateX(-50%) scale(1.1)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) scale(1)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { transform: 'scale(1.1)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};