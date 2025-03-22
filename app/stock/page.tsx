"use client";

import MyStocks from "./components/MyStocks";

export default function StockPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📈 내 주식 평가 페이지</h1>
      <MyStocks />
    </div>
  );
}
