"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("/api/stocks");
        const data = await res.json();
        setStocks(data.stocks);
      } catch (err) {
        console.error("📉 주가 불러오기 실패:", err);
      }
    };

    fetchStocks();
  }, []);

  const handleChange = (code: string, field: keyof InputData, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setInputs((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: num },
    }));
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📈 내 보유 주식 평가 (네이버 기준)</h1>
      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
        <ul>
          {stocks.map((stock) => {
            const input = inputs[stock.code] || { quantity: 0, averagePrice: 0 };
            const evalAmount = getEvaluation(stock.price, input.quantity);
            const profit = getProfit(stock.price, input);

            return (
              <li key={stock.code} className="mb-6">
                <div className="mb-1">
                  {stock.name} ({stock.code}) → <span className="font-semibold">{stock.price}원</span>
                </div>
                <div className="flex gap-2 items-center mb-1">
                  <input
                    type="number"
                    placeholder="보유 수량"
                    value={input.quantity || ""}
                    onChange={(e) => handleChange(stock.code, "quantity", e.target.value)}
                    className="p-2 w-28 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="number"
                    placeholder="평균 단가"
                    value={input.averagePrice || ""}
                    onChange={(e) => handleChange(stock.code, "averagePrice", e.target.value)}
                    className="p-2 w-28 bg-gray-700 text-white rounded"
                  />
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
        <button
          onClick={() => setSubmitted(true)}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
        >
          등록 / 수정
        </button>
      </div>
    </div>
  );
}
