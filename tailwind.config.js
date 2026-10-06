/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        nastaliq: ['"Noto Nastaliq Urdu"', 'serif'],
        urdu: ['"Amiri"', 'serif'],
        hindi: ['"Rozha One"', 'serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ede2d0',
          300: '#dfcdb1',
          800: '#2b2319',
          900: '#1d1710',
          950: '#120e0a',
        },
        ink: {
          50: '#f6f6f7',
          900: '#151518',
          950: '#0b0b0e',
        },
        rosewood: {
          600: '#9b2c3b',
          700: '#801d2a',
          800: '#641520',
          900: '#480e16',
        },
        amberGold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
