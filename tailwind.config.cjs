/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        workday: {
          blue: '#4285f4',
          'blue-dark': '#1a73e8',
          gray: '#f8f9fa',
          'gray-dark': '#5f6368',
          green: '#34a853',
          orange: '#ff9800',
        }
      }
    },
  },
  plugins: [],
}