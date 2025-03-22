// ✅ app/api/stocks/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const stockCodes = [
  { code: "005930", name: "삼성전자" },
  { code: "017670", name: "SK텔레콤" },
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
