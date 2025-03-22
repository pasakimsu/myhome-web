"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppStyleButton from "@/components/AppStyleButton";
import { db, collection, getDocs } from "@/lib/firebase";

interface ScheduleItem {
  id: string;
  date: string;
  content: string;
}

export default function BudgetHomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [monthlySchedules, setMonthlySchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUserId(storedUser);
    }
  }, [router]);

  // ✅ 현재 월 일정 불러오기
  useEffect(() => {
    const fetchMonthlySchedules = async () => {
      const snapshot = await getDocs(collection(db, "schedules"));
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleItem, "id">),
      }));

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const monthStr = `${year}-${month}`; // e.g., "2025-04"

      const filtered = all
        .filter((item) => item.date.startsWith(monthStr))
        .sort((a, b) => a.date.localeCompare(b.date));

      setMonthlySchedules(filtered);
    };

    fetchMonthlySchedules();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-beigeDark px-4 transition-colors">
      <div className="bg-[#2f2a25] p-8 rounded-xl shadow-md w-full max-w-md text-center">

        {/* 상단 인사말 */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {userId}님 로그인했습니다 🎉
        </h2>

        {/* ✅ 공지 + 월간 일정 공간 */}
        <div className="bg-[#3e352c] text-white p-4 rounded-md my-6 text-sm leading-relaxed shadow-inner text-left">
          <p className="mb-2 font-semibold">✍ 이번 달 일정</p>
          {monthlySchedules.length === 0 ? (
            <p className="text-gray-400 text-sm">이번 달 일정이 없습니다.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {monthlySchedules.map((item) => (
                <li key={item.id}>
                  <span className="text-amber-300 font-medium">{item.date}</span> – {item.content}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-6">
          <AppStyleButton icon="📅" label="일정" onClick={() => router.push("/schedule")} />
          <AppStyleButton icon="💰" label="계산기" onClick={() => router.push("/calcul")} />
          <AppStyleButton icon="📁" label="부조금" onClick={() => router.push("/Donations")} />
        </div>

      </div>
    </div>
  );
}
