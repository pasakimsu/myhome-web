import React from "react";

export default function AppStyleButton({
  onClick,
  icon = "⚙️", // 기본 아이콘 지정
}: {
  onClick: () => void;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-20 h-20 rounded-[24px] bg-gradient-to-b from-[#f5ede1] to-[#d6c1a4]
                 shadow-[0_6px_12px_rgba(0,0,0,0.2)] flex items-center justify-center
                 transition-all duration-200 ease-in-out hover:brightness-105 active:scale-95"
    >
      <span className="text-white text-3xl">{icon}</span>
    </button>
  );
}
