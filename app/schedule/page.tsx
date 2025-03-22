"use client";

import { useState } from "react";
import CalendarView from "./components/CalendarView";
import ScheduleInput from "./components/ScheduleInput";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white p-6">
      <h2 className="text-2xl font-bold mb-6">📅 일정 공유 캘린더</h2>
      <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <ScheduleInput selectedDate={selectedDate} />
    </div>
  );
}
