"use server";

import { NextResponse } from "next/server";
import { db, collection, getDocs } from "@/lib/firebase";

export async function GET() {
  const snapshot = await getDocs(collection(db, "schedules"));

  const events = snapshot.docs.map((doc) => {
    const data = doc.data();
    const startDate = new Date(data.date);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    return `BEGIN:VEVENT
UID:${doc.id}@myhome-web
DTSTAMP:${toICSDate(new Date())}
DTSTART:${toICSDate(startDate)}
DTEND:${toICSDate(endDate)}
SUMMARY:${data.content}
DESCRIPTION:등록자 - ${data.userId}
END:VEVENT`;
  });

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//myhome-web//EN
${events.join("\n")}\nEND:VCALENDAR`;

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": "inline; filename=calendar.ics",
    },
  });
}

function toICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
