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

  // ✅ 사용자 ID 로드만 (검사는 AuthGuard가 수행)
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setUserId(storedUser);
    }
  }, []);

  // ✅ 안정적인 날짜 정렬 함수
  const toISODate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    const mm = m.padStart(2, "0");
    const dd = d.padStart(2, "0");
    return new Date(`${y}-${mm}-${dd}`);
  };

  // ✅ Firestore 실시간 구독 + 월 필터 + 안정적 정렬
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleItem, "id">),
      }));

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      const filtered = all
        .filter((item) => {
          const [y, m] = item.date.split("-");
          return Number(y) === currentYear && Number(m) === currentMonth;
        })
        .sort((a, b) => toISODate(a.date).getTime() - toISODate(b.date).getTime());

      setMonthlySchedules(filtered);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-beigeDark px-4 transition-colors">
        <div className="bg-[#2f2a25] p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {userId}님 로그인했습니다 🎉
          </h2>

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

          <div className="flex justify-center gap-6">
            <AppStyleButton icon="📅" label="일정" onClick={() => router.push("/schedule")} />
            <AppStyleButton icon="💰" label="계산기" onClick={() => router.push("/calcul")} />
            <AppStyleButton icon="📁" label="부조금" onClick={() => router.push("/Donations")} />
            <AppStyleButton icon="📈" label="주식" onClick={() => router.push("/stock")} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
