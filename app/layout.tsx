import { useEffect } from "react"; // React import 추가
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggleButton from "../components/ThemeToggleButton"; // 다크모드 토글 버튼

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
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeToggleButton /> {/* 다크모드 토글 버튼 */}
        {children}
      </body>
    </html>
  );
}
