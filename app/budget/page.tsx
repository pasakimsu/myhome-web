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
        {/* ✅ 사용자 아이디 표시 */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {userId}님 로그인했습니다 🎉
        </h2>

        <p className="text-white text-sm mb-6">원하시는 기능을 선택하세요</p>

        {/* ✅ 주요 기능 버튼 */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={() => router.push("/budget/salary")}
            className="w-full bg-camel text-white py-4 px-6 rounded-lg shadow hover:brightness-110 active:scale-95 transition"
          >
            💰 월급 관리
          </button>
          <button
            onClick={() => router.push("/budget/donations")}
            className="w-full bg-camel text-white py-4 px-6 rounded-lg shadow hover:brightness-110 active:scale-95 transition"
          >
            🎁 부조금 관리
          </button>
        </div>

        {/* ✅ 하단 가계부 버튼 (작게) */}
        <button
          onClick={() => router.push("/budget/ledger")}
          className="text-sm text-white underline hover:text-camel transition"
        >
          📓 가계부 관리
        </button>
      </div>
    </div>
  );
}
