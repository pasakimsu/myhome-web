"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  refreshKey: number;
  onRefresh: () => void; // ✅ 삭제 후 부모에게 알리는 함수
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

  const fetchSchedules = async () => {
    const snapshot = await getDocs(collection(db, "schedules"));
    const all = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ScheduleData, "id">),
    }));
    const filtered = all.filter((s) => s.date === formattedDate);
    setSchedules(filtered);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("이 일정을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "schedules", id));
      await fetchSchedules();     // ✅ 현재 목록 갱신
      onRefresh();                // ✅ 달력 타일도 갱신 트리거
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate, refreshKey]);

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
            <span className="text-white truncate">{item.content}</span>
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
