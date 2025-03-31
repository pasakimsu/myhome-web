"use client";

import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import ScheduleInput from "./components/ScheduleInput";
import ScheduleList from "./components/ScheduleList";
import AuthGuard from "@/components/AuthGuard";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const [dutyStartDate, setDutyStartDate] = useState<Date | null>(null);
  const [tempStartDate, setTempStartDate] = useState(new Date("2025-03-01"));
  const [userId, setUserId] = useState<string | null>(null); // ✅ 사용자 ID 상태 추가

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) {
      setUserId(stored); // ✅ userId 설정
    }

    const saved = localStorage.getItem("dutyStartDate");
    if (saved) {
      const parsed = new Date(saved);
      if (!isNaN(parsed.getTime())) {
        setDutyStartDate(parsed);
        setTempStartDate(parsed);
        return;
      }
    }

    const defaultDate = new Date("2025-03-01");
    setDutyStartDate(defaultDate);
    setTempStartDate(defaultDate);
  }, []);

  const handleConfirmDutyDate = () => {
    setDutyStartDate(tempStartDate);
    localStorage.setItem("dutyStartDate", tempStartDate.toISOString());
  };

  if (!dutyStartDate) return null;

  return (
    <AuthGuard>
      <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white p-6">
        <h2 className="text-2xl font-bold mb-4">📅 일정 공유 캘린더</h2>

        {/* ✅ bak 사용자에게만 기준일자 설정 UI 표시 */}
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
