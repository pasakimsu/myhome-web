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
    const allowedUsers = ["bak", "yong"]; // ✅ 접근 허용할 사용자 목록
    if (storedUserId && !allowedUsers.includes(storedUserId)) {
      alert("🚨 접근 권한이 없습니다.");
      router.push("/budget");
    }
  }, [router]);
  

  return (
    <AuthGuard>
      <div className="flex flex-col items-center min-h-screen justify-center bg-[#2f2a25] text-white px-6 py-10 transition-colors">
        <div className="w-full max-w-xl bg-[#3a312a] p-6 rounded-lg shadow-lg">
          <DonationsHeader />
          <FileUpload />
          <DeleteAllButton />
          <ManualDonationInput onAfterRegister={handleAfterRegister} />
          <SearchDonations />
        </div>
      </div>
    </AuthGuard>
  );
}
