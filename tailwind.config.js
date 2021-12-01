module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'jit' : '',
  theme: {
    container: {
      center: true,
      screens: {
        xl: '1280px',
      },
      padding: '.75rem',
    },
    rotate: {
      360: '360deg',
    },
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        orange: {
          DEFAULT: '#F17621',
          50: '#FCE1CE',
          100: '#FBD5BB',
          200: '#F8BD94',
          300: '#F6A56E',
          400: '#F38E47',
          500: '#F17621',
          600: '#CD5B0D',
          700: '#98440A',
          800: '#632C06',
          900: '#2F1503',
        },
      },
    },
  },
}
