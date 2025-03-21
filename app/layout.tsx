"use client";  // 클라이언트 컴포넌트로 지정

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";  // globals.css를 가져옴

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
    // 페이지 로드 시 바로 다크모드 적용
    document.documentElement.classList.add("dark");
  }, []);  // 페이지 로드시 다크모드 적용

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
