/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          void: '#02040A',
          deep: '#060D1D',
          panel: '#081226',
          border: '#162847',
          cyan: '#38BDF8',
          ice: '#7DD3FC',
          text: '#F4F7FB',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
