/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Cyber Brutalist Palette */
        cyber: {
          primary: '#00FF88',
          DEFAULT: '#00FF88',
          dark: '#00CC6A',
          glow: 'rgba(0, 255, 136, 0.5)',
        },
        neon: {
          green: '#00FF9F',
          pink: '#FF3366',
          blue: '#00D9FF',
          purple: '#B936FF',
        },
        neutral: {
          50: '#F7F4EC',
          100: '#EBE4E1',
          200: '#C4B5BC',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#4A5568',
          600: '#3D3E51',
          700: '#2A2A35',
          800: '#151518',
          900: '#0A0A0F',
        },
        dark: {
          bg: '#0A0A0F',
          surface: '#1A1A2E',
          'surface-alt': '#252530',
          border: '#2A2A35',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'brutal': '4px 4px 0 #000',
        'brutal-lg': '8px 8px 0 #000',
        'brutal-sm': '2px 2px 0 #000',
        'glow': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 255, 136, 0.4)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'grid-pattern':
          "linear-gradient(to right, #2A2A35 1px, transparent 1px), linear-gradient(to bottom, #2A2A35 1px, transparent 1px)",
        'scanlines':
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.03) 2px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'fade-in': 'fade-in-up 0.4s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'glitch': 'glitch 0.3s infinite',
        'scan': 'scan 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.5' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-2px, 1px)' },
          '50%': { transform: 'translate(2px, -1px)' },
          '75%': { transform: 'translate(-2px, 1px)' },
        },
        'scan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    // Add custom utilities for theme toggle
    function({ addUtilities, theme }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
    },
  ],
}
