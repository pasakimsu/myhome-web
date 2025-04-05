"use client";

import { useEffect, useState } from "react";
import { db, collection, onSnapshot, deleteDoc, doc } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  refreshKey: number;
  onRefresh: () => void;
}

interface ScheduleData {
  id: string;
  date: string;
  content: string;
}

export default function ScheduleList({ selectedDate, refreshKey, onRefresh }: Props) {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null); // 🔸 삭제할 ID 상태
  const [showConfirm, setShowConfirm] = useState(false); // 🔸 모달 상태

  const formattedDate = selectedDate
    .toLocaleDateString("ko-KR")
    .replaceAll(". ", "-")
    .replace(".", "");

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

  const handleDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteDoc(doc(db, "schedules", toDeleteId));
      onRefresh();
      setShowConfirm(false); // 닫기
      setToDeleteId(null); // 초기화
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  if (schedules.length === 0) return null;

  return (
    <div className="mt-4 w-full max-w-md text-sm relative">
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
              onClick={() => {
                setToDeleteId(item.id);
                setShowConfirm(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {/* ✅ 삭제 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-md text-center w-72">
            <p className="mb-4 font-semibold">정말 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete();
                }}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                삭제
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setToDeleteId(null);
                }}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
