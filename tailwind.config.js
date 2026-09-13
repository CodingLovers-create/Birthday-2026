/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        surface: '#FAF0E8',
        brand: '#E96A3B',
        'brand-dark': '#D96B38',
        accent: '#80558B',
        ink: '#191919',
        heading: '#40261A',
        danger: '#E14E45'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['"Playfair Display"', 'serif'],
        nunito: ['"Nunito Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
