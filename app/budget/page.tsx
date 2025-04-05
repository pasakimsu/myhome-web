"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppStyleButton from "@/components/AppStyleButton";
import { db, collection, onSnapshot } from "@/lib/firebase";
import AuthGuard from "@/components/AuthGuard";

interface ScheduleItem {
  id: string;
  date: string;
  content: string;
}

export default function BudgetHomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [monthlySchedules, setMonthlySchedules] = useState<ScheduleItem[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const toISODate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    const mm = m.padStart(2, "0");
    const dd = d.padStart(2, "0");
    return new Date(`${y}-${mm}-${dd}`);
  };

  const toKoreaDate = (date: Date) => new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const getKoreanDay = (date: Date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  const formatContentWithDay = (item: ScheduleItem) => {
    const match = item.content.match(/^(\d{1,2})\.(\d{1,2})(?:~(\d{1,2})\.(\d{1,2}))?/);
    if (!match) return item.content;

    const year = new Date(item.date).getFullYear();
    const m1 = Number(match[1]), d1 = Number(match[2]);
    const m2 = match[3] ? Number(match[3]) : null;
    const d2 = match[4] ? Number(match[4]) : null;

    const start = new Date(`${year}-${m1}-${d1}`);
    const end = m2 && d2 ? new Date(`${year}-${m2}-${d2}`) : null;

    const s = `${m1}.${d1}(${getKoreanDay(start)})`;
    const e = end ? `${m2}.${d2}(${getKoreanDay(end)})` : "";

    const rest = item.content.replace(match[0], "").trim();
    return end ? `${s}~${e} ${rest}` : `${s} ${rest}`;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleItem, "id">),
      }));

      const today = toKoreaDate(new Date());
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);

      const currentWeekEnd = new Date(today);
      currentWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
      currentWeekEnd.setHours(23, 59, 59, 999);

      const filteredMonth = all
        .filter((item) => {
          const [y, m] = item.date.split("-");
          return Number(y) === currentYear && Number(m) === currentMonth;
        })
        .sort((a, b) => toISODate(a.date).getTime() - toISODate(b.date).getTime());

      const filteredWeek = all
        .filter((item) => {
          const date = toISODate(item.date);
          return date >= currentWeekStart && date <= currentWeekEnd;
        })
        .sort((a, b) => toISODate(a.date).getTime() - toISODate(b.date).getTime());

      setMonthlySchedules(filteredMonth);
      setWeeklySchedules(filteredWeek);
    });

    return () => unsubscribe();
  }, []);

  const getDaysSinceReference = (referenceDateStr: string) => {
    const referenceDate = new Date(referenceDateStr);
    const today = toKoreaDate(new Date());
    const diffTime = today.getTime() - referenceDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-beigeDark px-4 transition-colors">
        <div className="bg-[#2f2a25] p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {userId}님 로그인했습니다 🎉
          </h2>

          <div className="bg-[#3e352c] text-white p-4 rounded-md my-6 text-sm leading-relaxed shadow-inner text-left">
            <p className="mb-2 font-bold text-lg border-b border-brownBorder pb-1">
              서한이-{getDaysSinceReference("2025-01-13")}일째
            </p>

            {weeklySchedules.length > 0 && (
              <>
                <p className="mt-4 font-semibold">이번주 일정</p>
                <ul className="list-disc list-inside space-y-1">
                  {weeklySchedules.map((item) => (
                    <li key={item.id} className="font-bold text-[#FFC90E]">
                      {formatContentWithDay(item)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {monthlySchedules.length > 0 && (
              <>
                <p className="mt-4 font-semibold">이번달 일정</p>
                <ul className="list-disc list-inside space-y-1">
                  {monthlySchedules.map((item) => (
                    <li key={item.id}>{formatContentWithDay(item)}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="flex justify-center gap-6">
            <AppStyleButton icon="\ud83d\uddd3\ufe0f" label="일정" onClick={() => router.push("/schedule")} />
            <AppStyleButton icon="\ud83d\udcb0" label="계산기" onClick={() => router.push("/calcul")} />
            <AppStyleButton icon="\ud83d\udcc1" label="부조금" onClick={() => router.push("/Donations")} />
            <AppStyleButton icon="\ud83d\udcc8" label="주식" onClick={() => router.push("/stock")} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}