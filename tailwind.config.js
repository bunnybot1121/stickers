/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00D4D8',
          pink: '#FF6EB4',
          yellow: '#F5E642',
          dark: '#111111',
          cream: '#FFF9F0',
          purple: '#9B51E0',
          lavender: '#E6D5F7',
          mint: '#2ED573',
          coral: '#FF4757',
          gray: '#F3F4F6'
        }
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #111111',
        'neo': '3px 3px 0px #111111',
        'neo-md': '4px 4px 0px #111111',
        'neo-lg': '6px 6px 0px #111111',
        'neo-xl': '8px 8px 0px #111111',
        'neo-pink': '4px 4px 0px #FF6EB4',
        'neo-cyan': '4px 4px 0px #00D4D8',
        'neo-yellow': '4px 4px 0px #F5E642',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
