/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        val: {
          red: '#ff4655',
          'red-hover': '#e03e4d',
          dark: '#0f1923',
          panel: '#182533',
          'panel-light': '#223344',
          border: '#2a3e52',
          text: '#ece8e1',
          muted: '#8b9bb4',
          gold: '#ece8e1',
          'gold-accent': '#ffb400',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tactical: ['Teko', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'val-glow': '0 0 15px rgba(255, 70, 85, 0.4)',
        'val-panel': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
