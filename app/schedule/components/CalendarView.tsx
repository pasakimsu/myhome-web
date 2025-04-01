"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarStyle.css";
import { db, collection, getDocs } from "@/lib/firebase";

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  refreshKey: number;
  dutyStartDate: Date;
}

interface ScheduleData {
  id: string;
  date: string;
  content: string;
}

export default function CalendarView({
  selectedDate,
  onDateChange,
  refreshKey,
  dutyStartDate,
}: Props) {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR").replaceAll(". ", "-").replace(".", "");

  const toKoreanDate = (date: Date) => {
    const kstOffset = 9 * 60 * 60 * 1000;
    return new Date(date.getTime() + kstOffset);
  };

  const getDutyLabel = (date: Date): "당번" | "비번" => {
    const start = toKoreanDate(new Date(dutyStartDate));
    const target = toKoreanDate(new Date(date));

    start.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = Math.floor(
      (target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const index = (diff % 3 + 3) % 3;
    const pattern: ("당번" | "비번")[] = ["당번", "비번", "비번"];
    return pattern[index];
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

  const tileClassName = ({ date }: { date: Date }) =>
    getDutyLabel(date) === "당번" ? "duty-tile" : "";

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
        tileClassName={tileClassName}
        tileContent={tileContent}
      />
    </div>
  );
}