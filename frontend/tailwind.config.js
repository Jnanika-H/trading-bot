/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0d0f14',
          1: '#13161e',
          2: '#1a1e28',
          3: '#21263a',
        },
        accent: {
          buy: '#00c896',
          sell: '#f03e3e',
          gold: '#f5a623',
          blue: '#4a9eff',
        },
        border: {
          DEFAULT: '#2a2f45',
          light: '#3a4060',
        },
        text: {
          primary: '#e8ecf5',
          secondary: '#8892aa',
          muted: '#5a6378',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1.2s step-end infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
}
