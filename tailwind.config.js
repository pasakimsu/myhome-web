/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 기본값 유지
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        camel: "#d8bfa3",        // 기존 진한 베이지
        beigeLight: "#f5ede1",   // ✅ 연한 베이지 추가
      },
    },
  },
  plugins: [],
};
