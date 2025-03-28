// components/ManualDonationInput.tsx
"use client";

import { useState } from "react";
import { db, collection, addDoc } from "@/lib/firebase";

interface ManualDonationInputProps {
  onAfterRegister?: () => void;
}

export default function ManualDonationInput({ onAfterRegister }: ManualDonationInputProps) {
  const [form, setForm] = useState({
    date: "",
    name: "",
    reason: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const numeric = value.replace(/[^\d]/g, "");
      const formatted = numeric ? Number(numeric).toLocaleString() : "";
      setForm((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.date || !form.name || !form.reason || !form.amount) {
      alert("모든 항목을 입력하세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId") || "donations";
      const amount = Number(form.amount.replace(/,/g, ""));
      if (isNaN(amount) || amount <= 0) {
        alert("유효한 금액을 입력하세요.");
        return;
      }

      await addDoc(collection(db, userId), {
        date: form.date,
        name: form.name.trim(),
        nameKeywords: generateNameKeywords(form.name.trim()),
        reason: form.reason.trim(),
        amount,
      });

      alert("✅ 부조금이 성공적으로 등록되었습니다!");
      setForm({ date: "", name: "", reason: "", amount: "" });

      onAfterRegister?.(); // 🔁 외부에서 전달받은 콜백 실행
    } catch (error) {
      console.error("❌ 등록 오류:", error);
      alert("❌ 등록 중 오류가 발생했습니다.");
    }
  };

  const generateNameKeywords = (name: string): string[] => {
    const keywords = new Set<string>();
    for (let i = 0; i < name.length; i++) {
      for (let j = i + 1; j <= name.length; j++) {
        keywords.add(name.substring(i, j));
      }
    }
    return Array.from(keywords);
  };

  return (
    <div className="w-full max-w-md mt-8 bg-[#3a312a] p-4 rounded-lg shadow-md text-sm">
      <h3 className="text-white font-semibold mb-3">📝 부조금 수동 등록</h3>
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <input
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <input
        name="reason"
        placeholder="사유"
        value={form.reason}
        onChange={handleChange}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <input
        name="amount"
        placeholder="금액"
        value={form.amount}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-[#8d7864] hover:bg-[#a48d77] text-white font-bold py-2 rounded transition duration-300"
      >
        ➕ 등록
      </button>
    </div>
  );
}
