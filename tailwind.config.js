/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#FF9500', // Tangerine color
        },
      },
    },
  },
  plugins: [],
} 