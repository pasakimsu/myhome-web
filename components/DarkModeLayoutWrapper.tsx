"use client";

import { useEffect } from "react";

export default function DarkModeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
}
