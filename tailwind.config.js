/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#08080c',
          850: '#0b0b11',
          800: '#101017',
          700: '#17171f',
        },
        accent: {
          DEFAULT: '#96a5ff',
          soft: '#c3caff',
          violet: '#a78bfa',
          deep: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.42em',
        wide2: '0.24em',
      },
      boxShadow: {
        glow: '0 0 80px -20px rgba(150,165,255,0.45)',
        card: '0 30px 80px -40px rgba(0,0,0,0.9)',
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        float: 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 5s ease-in-out infinite',
        'spin-slow': 'spin 26s linear infinite',
        shimmer: 'shimmer 2.8s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.75' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
