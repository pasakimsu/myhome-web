"use client";

import { useEffect, useState } from "react";

interface Stock {
  code: string;
  name: string;
  price: string;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [quantities, setQuantities] = useState<{ [code: string]: number }>({});

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

  const handleQuantityChange = (code: string, value: string) => {
    const quantity = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setQuantities((prev) => ({ ...prev, [code]: quantity }));
  };

  const getEvaluation = (price: string, quantity: number) => {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    return numericPrice * quantity;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📈 내 보유 주식 평가 (네이버 기준)</h1>
      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
        <ul>
          {stocks.map((stock) => {
            const quantity = quantities[stock.code] || 0;
            const evalAmount = getEvaluation(stock.price, quantity);

            return (
              <li key={stock.code} className="mb-4">
                <div className="mb-1">
                  {stock.name} ({stock.code}) → <span className="font-semibold">{stock.price}원</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="보유 수량"
                    value={quantity || ""}
                    onChange={(e) => handleQuantityChange(stock.code, e.target.value)}
                    className="p-2 w-28 bg-gray-700 text-white rounded"
                  />
                  <span>= {evalAmount.toLocaleString()} 원</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
