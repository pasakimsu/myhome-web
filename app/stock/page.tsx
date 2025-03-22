"use client";

import { useEffect, useState } from "react";

interface Stock {
  code: string;
  name: string;
  price: string;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📈 오늘의 주가 (네이버 기준)</h1>
      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
        <ul>
          {stocks.map((stock) => (
            <li key={stock.code} className="mb-2">
              {stock.name} ({stock.code}) → <span className="font-semibold">{stock.price}원</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
