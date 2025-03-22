"use client";

import { useState } from "react";
import CalendarView from "./components/CalendarView";
import ScheduleInput from "./components/ScheduleInput";
import ScheduleList from "./components/ScheduleList";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ 당직 기준일자 및 시작 타입 상태
  const [dutyStartDate, setDutyStartDate] = useState(new Date("2025-03-01"));
  const [dutyStartType, setDutyStartType] = useState<"당번" | "비번">("당번");

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white p-6">
      <h2 className="text-2xl font-bold mb-4">📅 일정 공유 캘린더</h2>

      {/* ✅ 기준 설정 UI */}
      <div className="mb-6 w-full max-w-md">
        <label className="block mb-1 text-sm font-semibold">📅 당직 기준일자</label>
        <input
          type="date"
          value={dutyStartDate.toISOString().split("T")[0]}
          onChange={(e) => setDutyStartDate(new Date(e.target.value))}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />

        <label className="block mb-1 text-sm font-semibold">🧱 시작 근무 상태</label>
        <select
          value={dutyStartType}
          onChange={(e) => setDutyStartType(e.target.value as "당번" | "비번")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="당번">당번</option>
          <option value="비번">비번</option>
        </select>
      </div>

      <CalendarView
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        refreshKey={refreshKey}
        dutyStartDate={dutyStartDate}
        dutyStartType={dutyStartType}
      />

      <ScheduleInput
        selectedDate={selectedDate}
        onRegister={handleRefresh}
      />

      <ScheduleList
        selectedDate={selectedDate}
        refreshKey={refreshKey}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
