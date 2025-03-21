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
        beigeDark: "#3b3228", // 예시 다크 베이지
      },
    },
  },
  plugins: [],
};
