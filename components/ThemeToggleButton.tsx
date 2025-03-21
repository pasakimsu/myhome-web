"use client";

import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 text-sm bg-camel text-white rounded shadow-md transition"
    >
      {isDark ? "☀️ 라이트모드" : "🌙 다크모드"}
    </button>
  );
}
