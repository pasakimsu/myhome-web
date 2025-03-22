"use client";

import { useState } from "react";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "@/lib/firebase";

interface DonationData {
  id: string;
  date: string;
  name: string;
  reason: string;
  amount: number;
  sentAmount?: number;
}

export default function SearchDonations() {
  const [searchName, setSearchName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DonationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

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

  const handleToggleInput = (id: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInputChange = (id: string, value: string) => {
    const numeric = value.replace(/[^\d]/g, ""); // 숫자만 남김
    const formatted = numeric ? Number(numeric).toLocaleString() : "";
    setInputValues((prev) => ({
      ...prev,
      [id]: formatted,
    }));
  };

  const handleRegister = async (id: string) => {
    const raw = inputValues[id];
    const number = Number(raw.replace(/,/g, ""));

    if (!number || isNaN(number) || number <= 0) {
      alert("올바른 금액을 입력하세요.");
      return;
    }

    try {
      const ref = doc(db, "donations", id);
      await updateDoc(ref, {
        sentAmount: number,
      });

      setSearchResults((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, sentAmount: number } : item
        )
      );
    } catch (err) {
      console.error("❌ 등록 오류:", err);
      alert("❌ 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const ref = doc(db, "donations", id);
      await updateDoc(ref, {
        sentAmount: null,
      });

      setSearchResults((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, sentAmount: undefined } : item
        )
      );
      setInputValues((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (err) {
      console.error("❌ 삭제 오류:", err);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 w-full">
      <h2 className="text-2xl font-bold mb-4">부조금 검색</h2>

      <input
        type="text"
        placeholder="이름을 입력하세요"
        className="p-3 mb-3 border border-brownBorder rounded bg-gray-700 text-white placeholder-gray-400 w-full max-w-md"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className={`p-3 rounded-lg w-40 mb-4 ${
          searchName
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 cursor-not-allowed"
        }`}
        disabled={!searchName}
      >
        {loading ? "검색 중..." : "🔍 검색"}
      </button>

      {searchResults.length > 0 && (
        <div className="w-full max-w-md bg-[#3a312a] p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">검색 결과</h3>
          <ul className="space-y-4">
            {searchResults.map((result) => (
              <li key={result.id} className="border-b brownBorder pb-2">
                <div className="flex flex-col text-sm">
                  <div className="mb-1">
                    📅 <strong>{result.date}</strong> | 👤{" "}
                    <strong>{result.name}</strong> | 💰{" "}
                    <strong>{result.amount.toLocaleString()}원</strong> | 📝{" "}
                    <strong>{result.reason}</strong>{" "}
                    <input
                      type="checkbox"
                      className="ml-2 align-middle"
                      checked={!!activeInputs[result.id]}
                      onChange={() => handleToggleInput(result.id)}
                      title="송금 여부 체크"
                    />
                  </div>

                  {activeInputs[result.id] && (
                    <div className="flex items-center gap-2 mt-1">
                      💸
                      <input
                        type="text"
                        placeholder="보낸 금액"
                        value={inputValues[result.id] || ""}
                        onChange={(e) =>
                          handleInputChange(result.id, e.target.value)
                        }
                        className="flex-1 p-1 rounded bg-gray-700 text-white placeholder-gray-400 text-sm"
                      />
                      <button
                        onClick={() => handleRegister(result.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs rounded"
                      >
                        등록
                      </button>
                      <button
                        onClick={() => handleDelete(result.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
                      >
                        삭제
                      </button>
                    </div>
                  )}

                  {typeof result.sentAmount === "number" && (
                    <p className="text-xs text-right text-green-400 mt-1">
                      📤 내가 보낸 금액: {result.sentAmount.toLocaleString()}원
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          
        </div>
      )}
    </div>
  );
}
