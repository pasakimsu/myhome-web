"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, collection, getDocs } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  refreshKey: number;
}

interface ScheduleData {
  id: string;
  date: string;
  content: string;
}

export default function CalendarView({ selectedDate, onDateChange, refreshKey }: Props) {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR").replaceAll(". ", "-").replace(".", "");

  // ✅ 당직 스케줄 계산
  const dutyStart = new Date("2025-01-01"); // 기준일 (당번 시작일)
  const dutyLabels = ["당번", "비번", "비번"]; // 3일 주기

  const getDutyLabel = (date: Date) => {
    const diff = Math.floor((date.getTime() - dutyStart.getTime()) / (1000 * 60 * 60 * 24));
    const index = (diff % 3 + 3) % 3; // 음수 방지
    return dutyLabels[index];
  };

  const fetchSchedules = async () => {
    const snapshot = await getDocs(collection(db, "schedules"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ScheduleData, "id">),
    }));
    setSchedules(data);
  };

  useEffect(() => {
    fetchSchedules();
  }, [refreshKey]);

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDate(date);
    const daySchedules = schedules.filter((s) => s.date === dateStr);
    const dutyLabel = getDutyLabel(date); // ✅ 당직 표시

    return (
      <div className="mt-1 px-1 text-center">
        <p
          className={`text-[10px] font-semibold ${
            dutyLabel === "당번" ? "text-green-500" : "text-gray-400"
          }`}
        >
          {dutyLabel}
        </p>
        {daySchedules.slice(0, 1).map((s, i) => (
          <p
            key={i}
            className={`text-[10px] leading-tight whitespace-normal truncate ${
              s.content.includes("(bak)")
                ? "text-black"
                : s.content.includes("(yong)")
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            {s.content}
          </p>
        ))}
        {daySchedules.length > 1 && (
          <p className="text-[10px] text-gray-400">+{daySchedules.length - 1}</p>
        )}
      </div>
    );
  };

  const handleChange = (value: unknown) => {
    if (value instanceof Date) onDateChange(value);
    else if (Array.isArray(value) && value[0] instanceof Date) onDateChange(value[0]);
  };

  return (
    <div className="bg-white rounded-lg p-4 text-black shadow-md w-full max-w-[430px]">
      <Calendar
        onChange={handleChange}
        value={selectedDate}
        calendarType="gregory"
        locale="ko-KR"
        selectRange={false}
        tileContent={tileContent}
      />
    </div>
  );
}
