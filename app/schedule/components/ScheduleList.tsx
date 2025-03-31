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

  // 날짜를 "YYYY-MM-DD" 형식으로 변환 (예: "2025-05-02")
  const formattedDate = selectedDate
    .toISOString()
    .split("T")[0]; // "2025-05-02"

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleData, "id">),
      }));

      // Firestore에서 받은 date 값을 "YYYY-MM-DD" 형식으로 비교
      const filtered = all.filter((s) => s.date === formattedDate);
      console.log("필터링된 일정 데이터:", filtered); // 필터링 결과 확인

      setSchedules(filtered);
    });

    return () => unsubscribe();
  }, [formattedDate, refreshKey]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("이 일정을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "schedules", id));
      onRefresh(); // 달력 타일 갱신용
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  if (schedules.length === 0) return (
    <div className="mt-4 w-full max-w-md text-sm text-center text-gray-400">
      해당 날짜의 일정이 없습니다.
    </div>
  );

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
