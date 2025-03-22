"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, collection, getDocs } from "@/lib/firebase";

interface ScheduleData {
  id: string;
  date: string;       // yyyy-MM-dd
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
      <div className="text-xs text-blue-500 text-center mt-1">
        {daySchedules.slice(0, 2).map((s, i) => (
          <div key={i} className="truncate">
            {s.content}
          </div>
        ))}
        {daySchedules.length > 2 && <div className="text-gray-400">+{daySchedules.length - 2}</div>}
      </div>
    );
  };

  const handleChange = (value: unknown) => {
    if (value instanceof Date) onDateChange(value);
    else if (Array.isArray(value) && value[0] instanceof Date) onDateChange(value[0]);
  };

  return (
    <div className="bg-white rounded-lg p-4 text-black shadow-md">
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
