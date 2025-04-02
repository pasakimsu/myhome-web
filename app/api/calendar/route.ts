"use server";

import { NextResponse } from "next/server";
import { db, collection, getDocs, doc, getDoc } from "@/lib/firebase";

export async function GET() {
  const snapshot = await getDocs(collection(db, "schedules"));

  const schedules = snapshot.docs.map((doc) => {
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

  // ✅ Firestore에서 당번 기준일 가져오기
  const dutyDoc = await getDoc(doc(db, "dutySettings", "dutyStartDate"));
  const dutyStartDate = dutyDoc.exists()
    ? new Date(dutyDoc.data().date)
    : new Date("2025-03-01"); // fallback

  // ✅ 기준일자로부터 향후 60일 간 당번 일정 생성
  const dutyEvents: string[] = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const diff = Math.floor((date.getTime() - dutyStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const pattern = ["당번", "비번", "비번"];
    const label = pattern[(diff % 3 + 3) % 3];

    if (label === "당번") {
      const start = new Date(date);
      start.setHours(9, 0, 0); // 당번 시작시간 (예: 9시)
      const end = new Date(start);
      end.setHours(start.getHours() + 1); // 1시간 일정

      dutyEvents.push(`BEGIN:VEVENT
UID:duty-${i}@myhome-web
DTSTAMP:${toICSDate(new Date())}
DTSTART:${toICSDate(start)}
DTEND:${toICSDate(end)}
SUMMARY:📌 당번
DESCRIPTION:당번 자동생성
END:VEVENT`);
    }
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//myhome-web//EN
${[...schedules, ...dutyEvents].join("\n")}
END:VCALENDAR`;

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
