"use client";

import { useState } from "react";
import { db, collection, getDocs, query, where } from "@/lib/firebase";

interface DonationData {
  id: string;
  date: string;
  name: string;
  reason: string;
  amount: number;
}

export default function SearchDonations() {
  const [searchName, setSearchName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DonationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert("검색할 이름을 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "donations"),
        where("nameKeywords", "array-contains", searchName.trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setSearchResults([]);
        alert("❌ 해당 이름으로 등록된 부조금 내역이 없습니다.");
      } else {
        const results: DonationData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DonationData, "id">),
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error("❌ 검색 오류:", error);
      alert("❌ 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="text-2xl font-bold mb-4">부조금 검색</h2>

      <input
        type="text"
        placeholder="이름을 입력하세요"
        className="p-3 mb-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className={`p-3 rounded-lg w-40 mb-4 ${
          searchName ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
        }`}
        disabled={!searchName}
      >
        {loading ? "검색 중..." : "🔍 검색"}
      </button>

      {searchResults.length > 0 && (
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">검색 결과</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id} className="border-b border-gray-600 py-2">
                📅 <strong>{result.date}</strong> | 👤 <strong>{result.name}</strong> | 💰 <strong>{result.amount.toLocaleString()}원</strong> | 📝 <strong>{result.reason}</strong>
              </li>
            ))}
          </ul>
          {/* 🔹 합계 출력 */}
          <p className="text-right text-sm text-gray-300 mt-2">
            총합:{" "}
            <strong>
              {searchResults.reduce((sum, r) => sum + Number(r.amount), 0).toLocaleString()}원
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
