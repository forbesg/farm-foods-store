const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'jit' : '',
  theme: {
    container: {
      center: true,
      screens: {
        xl: '1280px',
      },
      padding: {
        DEFAULT: '1rem',
        lg: '4rem',
      },
    },
    rotate: {
      360: '360deg',
    },
    extend: {
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
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
        green: {
          DEFAULT: '#103a32',
          50: '#f3f5f5',
          100: '#e7ebeb',
          200: '#c3cecc',
          300: '#9fb0ad',
          400: '#587570',
          500: '#103a32',
          600: '#0e342d',
          700: '#0c2c26',
          800: '#0a231e',
          900: '#081c19',
        },
      },
      screens: {
        xs: { max: '320px' },
        ...defaultTheme.screens,
      },
    },
  },
}
