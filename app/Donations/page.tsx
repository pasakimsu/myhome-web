"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DonationsHeader from "./components/DonationsHeader";
import FileUpload from "./components/FileUpload";
import DeleteAllButton from "./components/DeleteAllButton";
import ManualDonationInput from "./components/ManualDonationInput";
import SearchDonations, { SearchDonationsRef } from "./components/SearchDonations";
import AuthGuard from "@/components/AuthGuard";

export default function DonationsPage() {
  const router = useRouter();
  const searchRef = useRef<SearchDonationsRef>(null);

  const handleAfterRegister = () => {
    searchRef.current?.refreshSearch();
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const allowedUsers = ["bak", "yong", "admin"];
    if (storedUserId && !allowedUsers.includes(storedUserId)) {
      alert("🚨 접근 권한이 없습니다.");
      router.push("/budget");
    }
  }, [router]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#2f2a25] text-white p-4 sm:p-8 flex flex-col items-center overflow-x-hidden">
        <div className="w-full max-w-2xl space-y-8">
          <DonationsHeader />

          {/* 상단 관리 도구 (업로드/삭제) */}
          <div className="flex flex-wrap gap-2 justify-center bg-[#3a312a] p-4 rounded-2xl border border-brownBorder/50 shadow-lg">
            <FileUpload />
            <DeleteAllButton />
          </div>

          {/* 등록 섹션 (기존 사각형 내부 사각형 제거됨) */}
          <ManualDonationInput onAfterRegister={handleAfterRegister} />

          {/* 검색 섹션 */}
          <div className="border-t border-white/5 pt-10">
            <SearchDonations ref={searchRef} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        input[type="date"] {
          min-width: 0;
          width: 100% !important;
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>
    </AuthGuard>
  );
}
