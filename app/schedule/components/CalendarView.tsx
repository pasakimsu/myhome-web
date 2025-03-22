"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, collection, getDocs } from "@/lib/firebase";

interface ScheduleData {
  id: string;
  date: string;
  content: string;
}

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CalendarView({ selectedDate, onDateChange }: Props) {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR").replaceAll(". ", "-").replace(".", "");

  useEffect(() => {
    const fetchSchedules = async () => {
      const snapshot = await getDocs(collection(db, "schedules"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleData, "id">),
      }));
      setSchedules(data);
    };

    fetchSchedules();
  }, []);

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDate(date);
    const daySchedules = schedules.filter((s) => s.date === dateStr);

    return (
      <div className="mt-1 px-1">
        {daySchedules.slice(0, 1).map((s, i) => (
          <div
            key={i}
            className="text-[10px] leading-tight text-blue-500 truncate text-center"
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
    <div className="bg-white rounded-lg p-4 text-black shadow-md w-[360px] sm:w-[420px]">
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
