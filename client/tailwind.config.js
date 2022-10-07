/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        bold: 700,
        black: 900, //Only adding the available Lato font sizes
      },
      colors: {
        primary: colors.indigo,
        secondary: colors.yellow,
        neutral: colors.gray,
        warning: colors.red,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), //Plugin for 'prose' class to style articles (or don't add it and style everything manually). npm install @tailwindcss/typography
    require('@tailwindcss/forms'), //Resets forms
  ],
};
