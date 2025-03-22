"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DonationsHeader from "./components/DonationsHeader";
import FileUpload from "./components/FileUpload";
import DeleteAllButton from "./components/DeleteAllButton";
import SearchDonations from "./components/SearchDonations"; // 🔍 검색 기능 추가!

export default function DonationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    // 🔹 로그인한 사용자 확인
    if (!storedUserId) {
      router.push("/login");
    } else {
      setUserId(storedUserId);

      // 🔹 bak이 아닌 경우 접근 차단
      if (storedUserId !== "bak") {
        alert("🚨 접근 권한이 없습니다.");
        router.push("/budget");
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] p-6 text-white">
      <DonationsHeader />
      <FileUpload />
      <DeleteAllButton />
      <SearchDonations /> {/* 🔍 부분 검색 UI 추가 */}
    </div>
  );
}
