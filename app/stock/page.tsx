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
    const savedInputs = localStorage.getItem("stockInputs");
    if (savedInputs) {
      setInputs(JSON.parse(savedInputs));
      setSubmitted(true);
    }

    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (code: string, field: keyof InputData, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setInputs((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: num },
    }));
  };

  const handleSingleSave = () => {
    localStorage.setItem("stockInputs", JSON.stringify(inputs));
    setSubmitted(true);
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
                      onClick={handleSingleSave}
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
                      onClick={handleSingleSave}
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
  );
}
