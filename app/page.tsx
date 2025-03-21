"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, getDocs, query, where } from "../lib/firebase";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    if (!userId || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userId", "==", userId), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem("userId", userId);
        router.push("/budget");
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige dark:bg-beigeDark px-4 transition-colors">
      {/* ✅ 다크모드 토글 버튼 */}
      <button
        onClick={() => {
          document.documentElement.classList.toggle("dark");
        }}
        className="fixed top-4 right-4 p-2 text-sm bg-camel text-white rounded shadow-md"
      >
        🌗 다크모드
      </button>

      <div className="bg-cream dark:bg-[#2f2a25] p-8 rounded-xl shadow-md w-full max-w-md transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-center text-darkText dark:text-white">로그인</h2>

        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-3 mb-3 border border-brownBorder rounded bg-white placeholder-gray-500 text-darkText"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 border border-brownBorder rounded bg-white placeholder-gray-500 text-darkText"
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-camel text-white font-semibold py-3 px-4 rounded hover:brightness-105 transition"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
