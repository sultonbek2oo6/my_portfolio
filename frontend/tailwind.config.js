/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        gold: {
          light: "#D6B979",
          DEFAULT: "#C8A96A",
          dark: "#9E7B3D",
        },

        cream: "#F7F3EB",
        marble: "#FDFBF7",
      },

      boxShadow: {
        luxury: "0 10px 30px rgba(200,169,106,0.20)",
        gold: "0 0 20px rgba(200,169,106,0.30)",
      },

      backgroundImage: {
        luxury:
          "linear-gradient(135deg, #C8A96A 0%, #E2C488 50%, #9E7B3D 100%)",
      },
    },
  },

  plugins: [],
}