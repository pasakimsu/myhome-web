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
      <div className="flex flex-col items-center min-h-screen bg-[#2f2a25] text-white px-4 py-8 sm:px-6 sm:py-10 transition-colors overflow-x-hidden">
        <div className="w-full max-w-2xl bg-[#3a312a] p-4 sm:p-8 rounded-3xl shadow-2xl border border-brownBorder box-border overflow-hidden">
          <DonationsHeader />

          <div className="space-y-6 mt-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <FileUpload />
              <DeleteAllButton />
            </div>

            <ManualDonationInput onAfterRegister={handleAfterRegister} />

            <div className="border-t border-white/5 pt-8 mt-10">
              <SearchDonations ref={searchRef} />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        input[type="date"] {
          min-width: 0;
          width: 100% !important;
        }
      `}</style>
    </AuthGuard>
  );
}
