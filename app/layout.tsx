"use client";  // 클라이언트 컴포넌트로 지정

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
    // 페이지 로드시 바로 다크모드 적용
    document.documentElement.classList.add("dark");
  }, []);  // 다크모드를 페이지 로드시 바로 적용

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
