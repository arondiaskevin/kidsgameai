/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Adicione a fonte Inter para um visual moderno
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

