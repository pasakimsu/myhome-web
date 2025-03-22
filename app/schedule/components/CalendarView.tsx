"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarStyle.css"; // ✅ 추가된 CSS import
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

  const dutyStart = new Date("2025-01-01");
  const dutyLabels = ["당번", "비번", "비번"];

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

  const tileClassName = ({ date }: { date: Date }) => {
    return getDutyLabel(date) === "당번" ? "duty-tile" : "";
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDate(date);
    const daySchedules = schedules.filter((s) => s.date === dateStr);

    return (
      <div className="mt-4 text-center text-[10px] px-1">
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
        tileClassName={tileClassName} // ✅ 당번 날짜에 클래스 적용
        tileContent={tileContent}
      />
    </div>
  );
}
