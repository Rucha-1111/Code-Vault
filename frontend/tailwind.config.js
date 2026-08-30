/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#0f0a2e',
          900: '#1a1147',
          800: '#241a5e',
        },
        brand: {
          50: '#f4f1ff',
          100: '#ece5ff',
          200: '#d9ccff',
          300: '#bda3ff',
          400: '#9d72ff',
          500: '#8347ff',
          600: '#6f2af0',
          700: '#5d1fd1',
          800: '#4c1ba8',
          900: '#3f1a86',
        },
        coral: {
          400: '#ff8a7a',
          500: '#ff6b5b',
          600: '#f5504a',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(31, 20, 90, 0.06)',
        popup: '0 20px 60px rgba(31, 20, 90, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #2a1a63 0%, #4b2a8f 45%, #7a3fc4 100%)',
      },
    },
  },
  plugins: [],
}
