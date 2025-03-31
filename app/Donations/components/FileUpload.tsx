"use client";

import { useState } from "react";
import { db, collection, addDoc } from "@/lib/firebase";
import { getUserId } from "@/lib/getUserId"; // ✅ 추가

interface DonationData {
  date: string;
  name: string;
  nameKeywords: string[];
  reason: string;
  amount: number;
  userId: string; // ✅ 추가
}

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택하세요.");
      return;
    }

    const userId = getUserId(); // ✅ 변경
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsText(selectedFile, "utf-8");
      reader.onload = async (e) => {
        try {
          let csvData = e.target?.result as string;
          if (csvData.charCodeAt(0) === 0xfeff) {
            csvData = csvData.slice(1);
          }

          const rows = csvData.split("\n").map((row) => row.split(","));
          rows.shift(); // 헤더 제거

          const jsonData: DonationData[] = rows.map((row): DonationData => {
            const name = row[1]?.trim() || "이름 없음";
            return {
              userId, // ✅ 반드시 포함
              date: row[0]?.trim() || "날짜 없음",
              name,
              nameKeywords: generateNameKeywords(name),
              reason: row[2]?.trim() || "사유 없음",
              amount: isNaN(Number(row[3]?.replace(/,/g, "").trim()))
                ? 0
                : Number(row[3]?.replace(/,/g, "").trim()),
            };
          });

          if (jsonData.length === 0) {
            alert("📢 CSV 파일이 비어 있습니다! ❌");
            return;
          }

          for (let i = 0; i < jsonData.length; i++) {
            await addDoc(collection(db, userId), jsonData[i]); // ✅ 컬렉션은 여전히 userId 기준
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          alert(`✅ ${jsonData.length}개의 데이터가 성공적으로 업로드되었습니다!`);
          setSelectedFile(null);
          setFileName("");
        } catch (error) {
          console.error("❌ CSV 파일 처리 오류:", error);
          alert("❌ CSV 파일을 처리하는 중 오류가 발생했습니다.");
        }
      };
    } catch (error) {
      console.error("❌ 파일 업로드 오류:", error);
      alert("❌ 파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const generateNameKeywords = (name: string): string[] => {
    const keywords = new Set<string>();
    for (let i = 0; i < name.length; i++) {
      for (let j = i + 1; j <= name.length; j++) {
        keywords.add(name.substring(i, j));
      }
    }
    return Array.from(keywords);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="bg-[#2f2a25] text-white p-3 rounded-lg cursor-pointer hover:bg-[#3a2f28] mb-3 transition-colors shadow-md">
        📂 파일 선택
        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
      </label>

      {fileName && <p className="text-gray-400 mb-4">📄 {fileName}</p>}

      <button
        onClick={handleFileUpload}
        disabled={!selectedFile}
        className={`w-40 px-4 py-3 rounded-lg font-semibold text-white shadow-md transition-colors duration-300 mb-4 ${
          selectedFile
            ? "bg-[#8d7864] hover:bg-[#a48d77]"
            : "bg-[#5c5249] cursor-not-allowed"
        }`}
      >
        {uploading ? "업로드 중..." : "⬆️ 업로드"}
      </button>
    </div>
  );
}
