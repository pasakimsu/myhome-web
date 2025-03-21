/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beigeDark: "#3b3228",
        beigeLight: "#f5ede1",
        camel: "#d8bfa3",
        brownBorder: "#e3d9c8",
        darkText: "#4a4a4a",
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
      boxShadow: {
        neumorphism: "inset 4px 4px 10px rgba(0,0,0,0.3), 0px 4px 8px rgba(255,255,255,0.2)",
        pressed: "inset -4px -4px 10px rgba(0,0,0,0.3), 0px 4px 8px rgba(255,255,255,0.2)",
        deep: "0px 6px 12px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
