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
  const dutyStart = new Date("2025-01-01"); // 기준일
  const dutyLabels = ["당번", "비번", "비번"]; // 3일 주기

  const getDutyLabel = (date: Date) => {
    const diff = Math.floor((date.getTime() - dutyStart.getTime()) / (1000 * 60 * 60 * 24));
    const index = (diff % 3 + 3) % 3;
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
    const isDuty = getDutyLabel(date) === "당번";

    return (
      <div className="relative text-center text-[10px] px-1 mt-4">
        {isDuty && (
          <div className="absolute top-0 left-0">
            <span className="bg-green-600 text-white text-[10px] px-1 rounded">
              당
            </span>
          </div>
        )}

        {/* 일정 내용 */}
        {daySchedules.slice(0, 1).map((s, i) => (
          <p
            key={i}
            className={`leading-tight whitespace-normal truncate ${
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
          <p className="text-gray-400">+{daySchedules.length - 1}</p>
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
