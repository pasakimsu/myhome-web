"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (value: any) => {
    // value가 배열이면 첫 번째 날짜만 사용
    const selected = Array.isArray(value) ? value[0] : value;

    if (!(selected instanceof Date)) return;

    setSelectedDate(selected);
    console.log("선택한 날짜:", selected.toISOString().split("T")[0]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white p-6">
      <h2 className="text-2xl font-bold mb-6">📅 일정 공유 캘린더</h2>

      <div className="bg-white rounded-lg p-4 text-black shadow-md">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          calendarType="gregory"
          locale="ko-KR"
          selectRange={false}
        />
      </div>

      <div className="mt-6 text-sm text-white">
        선택한 날짜:{" "}
        <strong>{selectedDate.toISOString().split("T")[0]}</strong>
      </div>
    </div>
  );
}
