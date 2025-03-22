"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, collection, getDocs } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  refreshKey: number; // ✅ 새로고침 트리거
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
  }, [refreshKey]); // ✅ refreshKey 변경 시 다시 불러옴

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDate(date);
    const daySchedules = schedules.filter((s) => s.date === dateStr);

    return (
      <div className="mt-1 px-1">
      {daySchedules.slice(0, 1).map((s, i) => (
  <div
    key={i}
    className={`text-[10px] leading-tight text-center whitespace-normal ${
      s.content.includes("(bak)")
        ? "text-black"
        : s.content.includes("(yong)")
        ? "text-red-500"
        : "text-blue-500"
    }`}
  >
    {s.content}
  </div>
))}

        {daySchedules.length > 1 && (
          <div className="text-[10px] text-gray-400 text-center">
            +{daySchedules.length - 1}
          </div>
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
