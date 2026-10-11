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
          dark: '#11131A',
          cream: '#FAF7F2',
          purple: '#9B51E0',
          lavender: '#E6D5F7',
          mint: '#2ED573',
          coral: '#FF4757',
          gray: '#F3F4F6'
        }
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 36px -6px rgba(0, 0, 0, 0.1), 0 6px 16px -3px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 24px 48px -12px rgba(0, 0, 0, 0.14), 0 12px 24px -6px rgba(0, 0, 0, 0.06)',
        'glow-pink': '0 0 25px -4px rgba(255, 110, 180, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(0, 212, 216, 0.45)',
        'glow-yellow': '0 0 25px -4px rgba(250, 204, 21, 0.45)',
        'glow-purple': '0 0 25px -4px rgba(155, 81, 224, 0.45)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        // Retain compatibility keys with softer, modern drop-shadows
        'neo-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'neo': '0 4px 14px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'neo-md': '0 8px 20px -3px rgba(0, 0, 0, 0.09), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        'neo-lg': '0 14px 28px -5px rgba(0, 0, 0, 0.12), 0 6px 12px -3px rgba(0, 0, 0, 0.06)',
        'neo-xl': '0 20px 40px -8px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
        'neo-pink': '0 8px 24px -4px rgba(255, 110, 180, 0.35)',
        'neo-cyan': '0 8px 24px -4px rgba(0, 212, 216, 0.35)',
        'neo-yellow': '0 8px 24px -4px rgba(250, 204, 21, 0.35)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'holo-shine': 'holoShine 3s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        holoShine: {
          '0%': { transform: 'translateX(-100%) rotate(25deg)' },
          '100%': { transform: 'translateX(200%) rotate(25deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      }
    },
  },
  plugins: [],
}
