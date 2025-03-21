"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  <button
    onClick={() => router.push("/budget/ledger")}
    className="w-20 h-20 bg-camel text-white text-2xl rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.3)] border-b-4 border-[#b89f7b] 
               hover:brightness-105 hover:translate-y-[1px] 
               active:translate-y-[3px] active:brightness-95 
               transition-all duration-150 ease-in-out 
               flex items-center justify-center"
  >
    ⚙
  </button>

  <button
    onClick={() => router.push("/budget/donations")}
    className="w-20 h-20 bg-camel text-white text-2xl rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.3)] border-b-4 border-[#b89f7b] 
               hover:brightness-105 hover:translate-y-[1px] 
               active:translate-y-[3px] active:brightness-95 
               transition-all duration-150 ease-in-out 
               flex items-center justify-center"
  >
    📁
  </button>
</div>
      </div>
    </div>
  );
}
