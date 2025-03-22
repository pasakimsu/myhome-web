"use client";

import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import ScheduleInput from "./components/ScheduleInput";
import ScheduleList from "./components/ScheduleList";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ 임시 기준일자 (입력용)
  const [tempStartDate, setTempStartDate] = useState(new Date("2025-03-01"));

  // ✅ 확정된 기준일자 (달력에 반영되는 기준)
  const [dutyStartDate, setDutyStartDate] = useState(() => {
    const saved = localStorage.getItem("dutyStartDate");
    return saved ? new Date(saved) : new Date("2025-03-01");
  });

  // ✅ 수동 기준일자 확정 핸들러
  const handleConfirmDutyDate = () => {
    setDutyStartDate(tempStartDate);
    localStorage.setItem("dutyStartDate", tempStartDate.toISOString());
  };

  // ✅ 새로고침 시 localStorage에서 초기화
  useEffect(() => {
    const saved = localStorage.getItem("dutyStartDate");
    if (saved) {
      const restored = new Date(saved);
      if (!isNaN(restored.getTime())) {
        setDutyStartDate(restored);
        setTempStartDate(restored); // 입력창 동기화
      }
    }
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white p-6">
      <h2 className="text-2xl font-bold mb-4">📅 일정 공유 캘린더</h2>

      {/* ✅ 기준일자 설정 */}
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
  );
}
