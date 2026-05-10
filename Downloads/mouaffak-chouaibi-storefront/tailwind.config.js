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
          yellow:       '#F5C842',
          'yellow-dark':  '#D4A800',
          'yellow-light': '#FEF3C0',
          teal:         '#4ECDC4',
          'teal-dark':    '#35B8AF',
          'teal-light':   '#CCFAF8',
        },
        surface: {
          50:  '#FAFAF8',
          100: '#F5F5F2',
          200: '#EBEBEB',
        },
        ink: {
          DEFAULT:   '#0F0F0F',
          secondary: '#404040',
          muted:     '#737373',
          faint:     '#A3A3A3',
          border:    '#E5E5E5',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card':         '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
        'card-hover':   '0 4px 8px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12)',
        'glow-yellow':  '0 0 40px rgba(245,200,66,0.3)',
        'glow-teal':    '0 0 40px rgba(78,205,196,0.3)',
        'button':       '0 2px 8px rgba(0,0,0,0.1)',
        'button-hover': '0 4px 16px rgba(0,0,0,0.15)',
        'modal':        '0 25px 80px rgba(0,0,0,0.25)',
        'nav':          '0 1px 0 rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #F5C842 0%, #4ECDC4 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-right':'slideRight 0.4s cubic-bezier(0.16,1,0.3,1)',
        'float':      'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'marquee':    'marquee 28s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
