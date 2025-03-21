"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BudgetHomePage() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login"); // 로그인 안 되어 있으면 강제 이동
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-beigeDark px-4 transition-colors">
      <div className="bg-[#2f2a25] p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          원하시는 기능을 선택하세요
        </h2>

        <div className="flex flex-col gap-4">
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
      </div>
    </div>
  );
}
