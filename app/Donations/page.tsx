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
        <div className="w-full max-w-2xl space-y-6">
          <DonationsHeader />

          {/* 상단 관리 도구 정렬 수정 (admin 전용) */}
          {typeof window !== "undefined" && localStorage.getItem("userId") === "admin" && (
            <div className="bg-[#3a312a] p-4 rounded-2xl border border-brownBorder/50 shadow-lg space-y-3">
              <div className="w-full">
                <FileUpload isCompact={false} />
              </div>
              <div className="flex gap-2 w-full">
                {/* 엑셀 업로드와 전체삭제 버튼을 1:1 비율로 배치 */}
                <div className="flex-1">
                  <FileUpload showOnlyButton={true} />
                </div>
                <div className="flex-1">
                  <DeleteAllButton />
                </div>
              </div>
            </div>
          )}

          <ManualDonationInput onAfterRegister={handleAfterRegister} />

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
