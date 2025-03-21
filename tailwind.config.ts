// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
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
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
