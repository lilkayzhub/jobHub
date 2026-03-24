/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          400: '#2dd4aa',
          500: '#14b897',
          600: '#0d9478',
          700: '#0a7560',
        },
        surface: {
          900: '#080c14',
          800: '#0d1220',
          700: '#131a2e',
          600: '#1a2340',
          500: '#212d52',
          400: '#2e3f6e',
        },
        gold: '#f0a500',
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        sans:    ['"Cabinet Grotesk"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(45,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,170,0.03) 1px, transparent 1px)',
        'glow-brand': 'radial-gradient(ellipse at center, rgba(20,184,151,0.15) 0%, transparent 70%)',
        'glow-gold':  'radial-gradient(ellipse at center, rgba(240,165,0,0.12) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'brand-glow': '0 0 40px rgba(20,184,151,0.25)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45,212,170,0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
