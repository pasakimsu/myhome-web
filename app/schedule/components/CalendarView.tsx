"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CalendarView({ selectedDate, onDateChange }: Props) {
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
      />
    </div>
  );
}
