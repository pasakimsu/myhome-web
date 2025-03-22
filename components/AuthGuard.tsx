"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("userId"); // ✅ 수정된 부분
    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
