"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppStyleButton from "@/components/AppStyleButton"; 

export default function BudgetHomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUserId(storedUser);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-beigeDark px-4 transition-colors">
      <div className="bg-[#2f2a25] p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {/* 상단 인사말 */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {userId}님 로그인했습니다 🎉
        </h2>

        {/* 메모 / 공지 공간 */}
        <div className="bg-[#3e352c] text-white p-4 rounded-md my-6 text-sm leading-relaxed shadow-inner">
          ✍ 오늘의 공지 또는 앞으로의 일정이 여기에 표시됩니다.  
          <br />
          나중에 캘린더와 연동할 수 있도록 준비되어 있습니다.
        </div>

        {/* 작은 원형 버튼 2개 */}
        <div className="flex justify-center gap-6">
        <div className="flex justify-center gap-6">
        <AppStyleButton icon="⚙️" onClick={() => router.push("/budget/ledger")} />
<AppStyleButton icon="📁" onClick={() => router.push("/budget/donations")} />
<AppStyleButton icon="💰" onClick={() => router.push("/budget/summary")} />

 

    
</div>


      </div>
    </div>
  );
}
