/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          DEFAULT: '#0EA5E9',
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#082F49',
        },
        brutalism: {
          bg: '#FAFAFA',
          dark: '#0A0B0D',
          border: '#000000',
        },
        'focus-ring': '#0EA5E9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-sky': '4px 4px 0px 0px rgba(14, 165, 233, 1)',
        'focus': '0 0 0 3px rgba(14, 165, 233, 0.5)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      outline: {
        'focus': '3px solid #0EA5E9',
      },
      spacing: {
        '18': '4.5rem',
      },
      keyframes: {
        fly: {
          'from': {
            transform: 'translateX(-100px)',
          },
          'to': {
            transform: 'translateX(calc(100vw + 100px))',
          },
        },
      },
      animation: {
        'fly-slow': 'fly 20s linear infinite',
      },
    },
  },
  plugins: [],
}
