import React from "react";

interface AppIconButtonProps {
  icon?: string;
  label?: string;
  onClick: () => void;
}

export default function AppIconButton({
  icon = "⚙️",
  label,
  onClick,
}: AppIconButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-[28px] p-[6px] bg-gradient-to-b from-[#e0d4c2] to-[#a89273] shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
        <button
          onClick={onClick}
          className="w-20 h-20 rounded-[20px] bg-gradient-to-b from-[#e5d5bd] to-[#9c7b58]
                     shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-2px_-2px_4px_rgba(255,255,255,0.2)]
                     flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <span className="text-white text-3xl">{icon}</span>
        </button>
      </div>
      {label && <span className="text-sm text-white/80">{label}</span>}
    </div>
  );
}
