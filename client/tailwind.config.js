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
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        heading: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700, //Only adding the Google Imported font sizes
      },
      colors: {
        primary: colors.blue[700],
        secondary: '#34b7f1',
        tertiary: '4a46fb',
        neutral: colors.gray,
        warning: colors.red[600],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), //Plugin for 'prose' class to style articles (or don't add it and style everything manually). npm install @tailwindcss/typography
    require('@tailwindcss/forms'), //Resets forms
  ],
};
