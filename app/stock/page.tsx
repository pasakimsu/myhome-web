"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs, query, where, setDoc, doc } from "@/lib/firebase";
import AuthGuard from "@/components/AuthGuard";

interface Stock {
  code: string;
  name: string;
  price: string;
}

interface InputData {
  quantity: number;
  averagePrice: number;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [inputs, setInputs] = useState<{ [code: string]: InputData }>({});
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 로그인된 사용자 가져오기
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (uid) {
      setUserId(uid);
      fetchInputsFromFirestore(uid);
    }
  }, []);

  // 🔹 Firestore에서 사용자 입력값 불러오기
  const fetchInputsFromFirestore = async (uid: string) => {
    try {
      const q = query(collection(db, "stockInputs"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const newInputs: { [code: string]: InputData } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newInputs[data.code] = {
          quantity: data.quantity,
          averagePrice: data.averagePrice,
        };
      });

      setInputs(newInputs);
      setSubmitted(true);
    } catch (error) {
      console.error("❌ Firestore에서 데이터 불러오기 실패:", error);
    }
  };

  // 🔹 주가 불러오기
  const fetchStocks = async () => {
    try {
      const res = await fetch("/api/stocks");
      const data = await res.json();
      setStocks(data.stocks);
    } catch (err) {
      console.error("📉 주가 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 입력 변경 처리
  const handleChange = (code: string, field: keyof InputData, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setInputs((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: num },
    }));
  };

  // 🔹 Firestore에 저장
  const handleSingleSave = async (code: string) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const input = inputs[code];
    if (!input) return;

    try {
      await setDoc(doc(db, "stockInputs", `${userId}_${code}`), {
        userId,
        code,
        quantity: input.quantity,
        averagePrice: input.averagePrice,
        updatedAt: new Date(),
      });

      alert("✅ 저장되었습니다!");
      setSubmitted(true);
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      alert("❌ 저장 중 오류 발생");
    }
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const getEvaluation = (price: string, quantity: number) => {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    return numericPrice * quantity;
  };

  const getProfit = (price: string, input: InputData) => {
    const marketPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    return (marketPrice - input.averagePrice) * input.quantity;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#2f2a25] flex flex-col items-center justify-start p-4 text-white">
        <h1 className="text-xl font-bold mb-4">📈 내 보유 주식 평가</h1>
        <div className="bg-[#2f2a25] border border-brownBorder p-4 rounded-lg w-full max-w-md">
          <ul className="space-y-6">
            {stocks.map((stock) => {
              const input = inputs[stock.code] || { quantity: 0, averagePrice: 0 };
              const evalAmount = getEvaluation(stock.price, input.quantity);
              const profit = getProfit(stock.price, input);

              return (
                <li key={stock.code} className="border-b border-brownBorder pb-4">
                  <div className="text-base mb-2">
                    <span className="font-semibold">{stock.name}</span> ({stock.code})<br />
                    현재가: <span className="text-white">{stock.price}원</span>
                  </div>

                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="수량"
                        value={input.quantity || ""}
                        onChange={(e) => handleChange(stock.code, "quantity", e.target.value)}
                        className="p-1 w-24 bg-gray-700 text-white rounded text-sm"
                      />
                      <button
                        onClick={() => handleSingleSave(stock.code)}
                        className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded"
                      >
                        등록
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="평단"
                        value={input.averagePrice || ""}
                        onChange={(e) => handleChange(stock.code, "averagePrice", e.target.value)}
                        className="p-1 w-24 bg-gray-700 text-white rounded text-sm"
                      />
                      <button
                        onClick={() => handleSingleSave(stock.code)}
                        className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded"
                      >
                        등록
                      </button>
                    </div>
                  </div>

                  {submitted && (
                    <div className="text-sm text-gray-300">
                      📌 평가 금액: <span className="text-white font-semibold">{formatNumber(evalAmount)} 원</span><br />
                      📈 수익률: <span className="text-white font-semibold">{formatNumber(profit)} 원</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
}
