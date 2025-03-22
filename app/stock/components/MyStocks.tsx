"use client";

import { useEffect, useState } from "react";

interface Stock {
  code: string;
  name: string;
  price: string;
}

export default function MyStocks() {
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
    <div className="mt-6 bg-gray-800 p-4 rounded-lg text-white w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">📊 오늘의 주가 (네이버)</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.code} className="mb-2">
            {stock.name} ({stock.code}) →{" "}
            <span className="font-semibold">{stock.price}원</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
