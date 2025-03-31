"use client";

import { useEffect, useState } from "react";
import { db, collection, onSnapshot, deleteDoc, doc } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  refreshKey: number;
  onRefresh: () => void; // 유지 가능
}

interface ScheduleData {
  id: string;
  date: string;
  content: string;
}

export default function ScheduleList({ selectedDate, refreshKey, onRefresh }: Props) {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  const formattedDate = selectedDate
    .toLocaleDateString("ko-KR")
    .replaceAll(". ", "-")
    .replace(".", "");

  // ✅ 실시간 구독으로 해당 날짜 일정 필터링
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleData, "id">),
      }));

      const filtered = all.filter((s) => s.date === formattedDate);
      setSchedules(filtered);
    });

    return () => unsubscribe();
  }, [formattedDate, refreshKey]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("이 일정을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "schedules", id));
      // ❌ fetchSchedules 필요 없음
      onRefresh(); // 🔁 달력 타일 갱신용
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  if (schedules.length === 0) return null;

  return (
    <div className="mt-4 w-full max-w-md text-sm">
      <h3 className="font-semibold mb-2">📌 {formattedDate} 일정 목록</h3>
      <ul className="space-y-2">
        {schedules.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-[#3a312a] p-2 rounded"
          >
            <span
              className={`truncate ${
                item.content.includes("(bak)")
                  ? "text-black"
                  : item.content.includes("(yong)")
                  ? "text-red-500"
                  : "text-white"
              }`}
            >
              {item.content}
            </span>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
