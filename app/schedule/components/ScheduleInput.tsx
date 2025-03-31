"use client";

import { useEffect, useState } from "react";
import { db, collection, addDoc } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  onRegister: () => void;
}

export default function ScheduleInput({ selectedDate, onRegister }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  const handleSubmit = async () => {
    if (!content.trim() || !userId) {
      alert("내용을 입력하세요.");
      return;
    }

    const dateStr = selectedDate
      .toLocaleDateString("ko-KR")
      .replaceAll(". ", "-")
      .replace(".", "");

    try {
      await addDoc(collection(db, "schedules"), {
        date: dateStr,
        content: `${content.trim()} (${userId})`,
        userId,
        createdAt: new Date(),
      });
      alert("✅ 등록 완료!");
      setContent("");
      onRegister(); // ✅ 새로고침 트리거
    } catch (err) {
      console.error("❌ 등록 오류:", err);
      alert("❌ 등록 중 문제가 발생했습니다.");
    }
  };

  const formattedDate = selectedDate
    .toLocaleDateString("ko-KR")
    .replaceAll(". ", "-")
    .replace(".", "");

  return (
    <div className="mt-6 w-full max-w-md">
      <p className="mb-2">선택한 날짜: <strong>{formattedDate}</strong></p>
      <input
        type="text"
        placeholder="일정 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 mb-2"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-[#8d7864] hover:bg-[#a48d77] text-white font-bold py-2 rounded transition duration-300"
      >
        일정 등록
      </button>
    </div>
  );
}
