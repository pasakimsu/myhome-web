"use client";  // 이 라인 추가!

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";  // 이미 설정된 globals.css 가져오기

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // 다크모드를 기본으로 적용
    document.documentElement.classList.add("dark");
  }, []);  // 다크모드 기본 적용을 위한 useEffect

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
