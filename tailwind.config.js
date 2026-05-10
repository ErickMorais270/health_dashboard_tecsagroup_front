/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        health: {
          navy: '#0B3C5D',
          sky: '#328CC1',
          mint: '#2EC4B6',
          cloud: '#F7FBFF',
          leaf: '#1B998B',
        },
      },
    },
  },
  plugins: [],
};
