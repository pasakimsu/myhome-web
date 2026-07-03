"use client";

import { useState } from "react";
import { db, collection, addDoc } from "@/lib/firebase";

interface ManualDonationInputProps {
  onAfterRegister?: () => void;
}

export default function ManualDonationInput({ onAfterRegister }: ManualDonationInputProps) {
  const [sentForm, setSentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    name: "",
    reason: "",
    amount: "",
  });

  const [receivedForm, setReceivedForm] = useState({
    date: new Date().toISOString().split('T')[0],
    name: "",
    reason: "",
    amount: "",
  });

  const handleTextChange = (type: "sent" | "received", e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const setter = type === "sent" ? setSentForm : setReceivedForm;

    if (name === "amount") {
      const numeric = value.replace(/[^\d]/g, "");
      const formatted = numeric ? Number(numeric).toLocaleString() : "";
      setter((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (type: "sent" | "received") => {
    const form = type === "sent" ? sentForm : receivedForm;
    if (!form.date || !form.name || !form.reason || !form.amount) {
      alert("모든 항목을 입력하세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId") || "donations";
      const amountValue = Number(form.amount.replace(/,/g, ""));

      await addDoc(collection(db, userId), {
        date: form.date,
        name: form.name.trim(),
        nameKeywords: generateNameKeywords(form.name.trim()),
        reason: form.reason.trim(),
        amount: type === "received" ? amountValue : 0,
        sentAmount: type === "sent" ? amountValue : null,
        sentDate: type === "sent" ? form.date : null,
        type: type
      });

      alert(`✅ ${type === "sent" ? "보낸" : "받은"} 부조금이 등록되었습니다!`);
      const resetForm = { date: new Date().toISOString().split('T')[0], name: "", reason: "", amount: "" };
      if (type === "sent") setSentForm(resetForm);
      else setReceivedForm(resetForm);
      onAfterRegister?.();
    } catch (error) {
      console.error(error);
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

  // 공통 입력창 스타일 (크기 축소)
  const inputStyle = "box-border p-2 rounded-lg bg-gray-700 text-white border border-brownBorder outline-none focus:ring-1 focus:ring-beigeLight text-xs text-right w-full";

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

        {/* 왼쪽: 내가 보낸 부조금 */}
        <div className="bg-[#2d3a35] p-3 rounded-2xl shadow-lg border border-[#4F7A6E]/30 w-full box-border">
          <h3 className="text-[#86b5a7] font-bold mb-3 flex items-center gap-2 text-xs">📤 내가 보낸 부조금</h3>
          <div className="space-y-2 flex flex-col items-center">
            {/* 날짜: 2/3 크기 */}
            <div className="w-2/3 self-start">
              <input name="date" type="date" value={sentForm.date} onChange={(e) => handleTextChange("sent", e)} className={inputStyle} />
            </div>

            {/* 이름 & 사유: 한 줄에 배치 */}
            <div className="flex gap-2 w-full">
              <input name="name" placeholder="이름" value={sentForm.name} onChange={(e) => handleTextChange("sent", e)} className={inputStyle} />
              <input name="reason" placeholder="사유" value={sentForm.reason} onChange={(e) => handleTextChange("sent", e)} className={inputStyle} />
            </div>

            {/* 보낸 금액: 2/3 크기 */}
            <div className="w-2/3 self-start">
              <input name="amount" placeholder="보낸 금액" value={sentForm.amount} inputMode="numeric" onChange={(e) => handleTextChange("sent", e)} className={inputStyle} />
            </div>

            <button onClick={() => handleSubmit("sent")} className="w-full bg-[#4F7A6E] text-white font-bold py-2.5 rounded-xl mt-1 active:scale-95 transition shadow-md text-xs">보낸 내역 등록</button>
          </div>
        </div>

        {/* 오른쪽: 내가 받은 부조금 */}
        <div className="bg-[#3a312a] p-3 rounded-2xl shadow-lg border border-brownBorder w-full box-border">
          <h3 className="text-beigeLight font-bold mb-3 flex items-center gap-2 text-xs">📥 내가 받은 부조금</h3>
          <div className="space-y-2 flex flex-col items-center">
            {/* 날짜: 2/3 크기 */}
            <div className="w-2/3 self-start">
              <input name="date" type="date" value={receivedForm.date} onChange={(e) => handleTextChange("received", e)} className={inputStyle} />
            </div>

            {/* 이름 & 사유: 한 줄에 배치 */}
            <div className="flex gap-2 w-full">
              <input name="name" placeholder="이름" value={receivedForm.name} onChange={(e) => handleTextChange("received", e)} className={inputStyle} />
              <input name="reason" placeholder="사유" value={receivedForm.reason} onChange={(e) => handleTextChange("received", e)} className={inputStyle} />
            </div>

            {/* 받은 금액: 2/3 크기 */}
            <div className="w-2/3 self-start">
              <input name="amount" placeholder="받은 금액" value={receivedForm.amount} inputMode="numeric" onChange={(e) => handleTextChange("received", e)} className={inputStyle} />
            </div>

            <button onClick={() => handleSubmit("received")} className="w-full bg-beigeLight text-darkText font-bold py-2.5 rounded-xl mt-1 active:scale-95 transition shadow-md text-xs">받은 내역 등록</button>
          </div>
        </div>

      </div>
    </div>
  );
}
