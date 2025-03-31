"use client";

import {
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "@/lib/firebase";

export interface SearchDonationsRef {
  refreshSearch: () => void;
}

interface DonationData {
  id: string;
  date: string;
  name: string;
  reason: string;
  amount: number;
  sentAmount?: number;
  sentDate?: string;
}

const SearchDonations = forwardRef<SearchDonationsRef>((_, ref) => {
  const [searchName, setSearchName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DonationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [inputDates, setInputDates] = useState<Record<string, string>>({});

  const refreshSearch = async () => {
    if (!searchName.trim()) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId") || "donations";
      const q = query(
        collection(db, userId),
        where("nameKeywords", "array-contains", searchName.trim())
      );
      const snapshot = await getDocs(q);
      const results: DonationData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DonationData, "id">),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("❌ 검색 오류:", error);
      alert("❌ 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshSearch,
  }));

  const handleSearch = () => {
    refreshSearch();
  };

  const handleToggleInput = (id: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInputChange = (id: string, value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    const formatted = numeric ? Number(numeric).toLocaleString() : "";
    setInputValues((prev) => ({
      ...prev,
      [id]: formatted,
    }));
  };

  const handleDateChange = (id: string, value: string) => {
    setInputDates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRegister = async (id: string) => {
    const raw = inputValues[id];
    const number = Number(raw.replace(/,/g, ""));
    const date = inputDates[id];

    if (!number || isNaN(number) || number <= 0) {
      alert("올바른 금액을 입력하세요.");
      return;
    }
    if (!date) {
      alert("날짜를 입력하세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId") || "donations";
      const ref = doc(db, userId, id);
      await updateDoc(ref, {
        sentAmount: number,
        sentDate: date,
      });

      setSearchResults((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, sentAmount: number, sentDate: date } : item
        )
      );
    } catch (err) {
      console.error("❌ 등록 오류:", err);
      alert("❌ 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const userId = localStorage.getItem("userId") || "donations";
      const ref = doc(db, userId, id);
      await updateDoc(ref, {
        sentAmount: null,
        sentDate: null,
      });

      setSearchResults((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, sentAmount: undefined, sentDate: undefined } : item
        )
      );
      setInputValues((prev) => ({
        ...prev,
        [id]: "",
      }));
      setInputDates((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (err) {
      console.error("❌ 삭제 오류:", err);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleFullDelete = async (id: string) => {
    const confirmDelete = confirm("정말로 이 부조금 항목을 완전히 삭제할까요?");
    if (!confirmDelete) return;

    try {
      const userId = localStorage.getItem("userId") || "donations";
      await deleteDoc(doc(db, userId, id));
      setSearchResults((prev) => prev.filter((item) => item.id !== id));
      alert("✅ 항목이 삭제되었습니다.");
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
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
        <div className="w-full flex flex-col items-center gap-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-[#3a312a] w-full max-w-md p-4 rounded-lg shadow-md text-sm"
            >
              {/* 상단 정보 + 삭제 버튼 */}
              <div className="mb-1 flex justify-between items-start">
                <div>
                  <p>📅 {result.date}</p>
                  <p>👤 {result.name}</p>
                  <p>📝 {result.reason}</p>
                  <p>💰 {result.amount.toLocaleString()}원</p>
                </div>
                <button
                  onClick={() => handleFullDelete(result.id)}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-sm font-semibold rounded shadow-md"
                >
                  🗑 항목 삭제
                </button>
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!activeInputs[result.id]}
                    onChange={() => handleToggleInput(result.id)}
                  />
                  송금 여부 표시
                </label>

                {activeInputs[result.id] && (
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="보낸 금액"
                      value={inputValues[result.id] || ""}
                      onChange={(e) =>
                        handleInputChange(result.id, e.target.value)
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 text-sm"
                    />
                    <input
                      type="date"
                      value={inputDates[result.id] || ""}
                      onChange={(e) =>
                        handleDateChange(result.id, e.target.value)
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegister(result.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-2 text-sm rounded"
                      >
                        등록
                      </button>
                      <button
                        onClick={() => handleDelete(result.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-2 text-sm rounded"
                      >
                        송금 삭제
                      </button>
                    </div>
                  </div>
                )}

                {typeof result.sentAmount === "number" && (
                  <p className="text-xs text-right text-green-400 mt-2">
                    📤 내가 보낸 금액: {result.sentAmount.toLocaleString()}원<br />
                    📅 보낸 날짜: {result.sentDate || "-"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SearchDonations;
SearchDonations.displayName = "SearchDonations";
