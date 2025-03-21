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
        beigeDark: "#3b3228",     // ✅ 다크모드 배경
        beigeLight: "#f5ede1",    // ✅ 연한 베이지 버튼용
        camel: "#d8bfa3",
        brownBorder: "#e3d9c8",
        darkText: "#4a4a4a",
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
