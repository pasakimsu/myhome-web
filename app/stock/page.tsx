// app/api/stocks/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const stockCodes = [
  { code: "005930", name: "삼성전자" },
  { code: "035720", name: "카카오" },
  { code: "005380", name: "현대차" },
];

export async function GET() {
  const results: { code: string; name: string; price: string }[] = [];

  try {
    for (const stock of stockCodes) {
      const url = `https://finance.naver.com/item/main.naver?code=${stock.code}`;
      const res = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const html = res.data as string;
      const $ = cheerio.load(html);
      const price = $(".no_today .blind").first().text().trim();

      results.push({ code: stock.code, name: stock.name, price });
    }

    return NextResponse.json({ stocks: results });
  } catch (err) {
    console.error("❌ 스크래핑 실패:", err);
    return NextResponse.json({ error: "스크래핑 실패" }, { status: 500 });
  }
}

// app/stock/page.tsx

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