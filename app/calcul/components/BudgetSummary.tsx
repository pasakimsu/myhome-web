"use client";
import { useState } from "react";

interface BudgetSummaryProps {
  allocated: { [key: string]: number };
  accountNumbers: { [key: string]: string };
}

export default function BudgetSummary({ allocated, accountNumbers }: BudgetSummaryProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`📋 복사 완료: ${text}`);
    });
  };

  return (
    <div className="mt-4 p-4 bg-[#2f2a25] rounded-lg text-white space-y-2 text-sm">
      {["생활비", "적금", "투자", "가족"].map((key) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            {key}: <strong>{allocated[key]?.toLocaleString() || 0}원</strong> ({accountNumbers[key]})
          </div>
          <button
            onClick={() => handleCopy(accountNumbers[key])}
            className="text-xs bg-[#8d7864] hover:bg-[#a48d77] px-2 py-1 rounded"
          >
            복사
          </button>
        </div>
      ))}
    </div>
  );
}
