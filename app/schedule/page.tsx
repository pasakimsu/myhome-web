"use client";

import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import ScheduleInput from "./components/ScheduleInput";
import ScheduleList from "./components/ScheduleList";
import AuthGuard from "@/components/AuthGuard";
import { db, doc, getDoc, setDoc } from "@/lib/firebase";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const [dutyStartDate, setDutyStartDate] = useState<Date | null>(null);
  const [tempStartDate, setTempStartDate] = useState(new Date("2025-03-01"));
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 기준일자 Firestore에서 불러오기
  const loadDutyStartDateFromFirestore = async () => {
    try {
      const snapshot = await getDoc(doc(db, "config", "dutyStartDate"));
      if (snapshot.exists()) {
        const data = snapshot.data();
        const loaded = new Date(data.date);
        if (!isNaN(loaded.getTime())) {
          setDutyStartDate(loaded);
          setTempStartDate(loaded);
        }
      } else {
        const defaultDate = new Date("2025-03-01");
        setDutyStartDate(defaultDate);
        setTempStartDate(defaultDate);
      }
    } catch (error) {
      console.error("❌ 기준일자 불러오기 오류:", error);
    }
  };

  // ✅ Firestore에 기준일자 저장 (bak만)
  const saveDutyStartDateToFirestore = async (date: Date) => {
    try {
      await setDoc(doc(db, "config", "dutyStartDate"), {
        date: date.toISOString(),
        updatedAt: new Date(),
      });
      alert("✅ 기준일자가 저장되었습니다!");
      loadDutyStartDateFromFirestore(); // 다시 로딩
    } catch (error) {
      console.error("❌ 저장 실패:", error);
      alert("❌ 저장 중 오류가 발생했습니다.");
    }
  };

  const handleConfirmDutyDate = () => {
    if (!tempStartDate || userId !== "bak") return;
    saveDutyStartDateToFirestore(tempStartDate);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);

    loadDutyStartDateFromFirestore(); // 기준일자 로드
  }, []);

  if (!dutyStartDate) return null;

  return (
    <AuthGuard>
      <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white p-6">
        <h2 className="text-2xl font-bold mb-4">📅 일정 공유 캘린더</h2>

        {/* ✅ bak만 기준일자 수정 가능 */}
        {userId === "bak" && (
          <div className="mb-6 w-full max-w-md">
            <label className="block mb-1 text-sm font-semibold">📅 당번 기준일자</label>
            <input
              type="date"
              value={tempStartDate.toISOString().split("T")[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate.getTime())) {
                  setTempStartDate(newDate);
                }
              }}
              className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleConfirmDutyDate}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition duration-300"
            >
              ✅ 기준일자 확정
            </button>
          </div>
        )}

        <CalendarView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          refreshKey={refreshKey}
          dutyStartDate={dutyStartDate}
        />

        <ScheduleInput selectedDate={selectedDate} onRegister={handleRefresh} />
        <ScheduleList
          selectedDate={selectedDate}
          refreshKey={refreshKey}
          onRefresh={handleRefresh}
        />
      </div>
    </AuthGuard>
  );
}
