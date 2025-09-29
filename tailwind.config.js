/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#481E14',      // Cokelat tanah yang dalam
        'brand-secondary': '#E5533D',    // Oranye-merah yang lebih seimbang
        'brand-dark': '#1A1A1A',          // Abu-abu sangat gelap (lebih lembut dari hitam)
        'brand-light': '#F7F2EC',         // Off-white yang hangat dan lembut (BARU)
      },
    },
  },
  plugins: [],
};