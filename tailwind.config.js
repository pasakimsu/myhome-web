/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 🌙 다크모드 설정 추가!
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#fefcf9",
        cream: "#fffaf4",
        camel: "#d8bfa3",
        brownBorder: "#e3d9c8",
        darkText: "#4a4a4a",
        beigeDark: "#3b3228", // 🌙 어두운 베이지 추가
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
