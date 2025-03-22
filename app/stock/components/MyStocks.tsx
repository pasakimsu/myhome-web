"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Stock {
  symbol: string;
  name: string;
}

const stockList: Stock[] = [
  { symbol: "005930.KQ", name: "삼성전자" },
  { symbol: "035720.KQ", name: "카카오" },
  { symbol: "005380.KQ", name: "현대차" },
];

export default function MyStocks() {
  const [prices, setPrices] = useState<{ [symbol: string]: number }>({});
  const [quantities, setQuantities] = useState<{ [symbol: string]: number }>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = stockList.map((s) => s.symbol).join(",");
        const response = await axios.get(
          `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
        );
        const data = response.data.quoteResponse.result;

        const priceMap: { [symbol: string]: number } = {};
        data.forEach((item: any) => {
          priceMap[item.symbol] = item.regularMarketPrice;
        });

        setPrices(priceMap);
      } catch (error) {
        console.error("❌ 주가 가져오기 오류:", error);
      }
    };

    fetchPrices();
  }, []);

  const handleQuantityChange = (symbol: string, value: string) => {
    const quantity = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setQuantities((prev) => ({ ...prev, [symbol]: quantity }));
  };

  const calculateValue = (symbol: string) => {
    const price = prices[symbol] || 0;
    const quantity = quantities[symbol] || 0;
    return price * quantity;
  };

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg text-white w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">📊 내 보유 주식 현황</h2>
      <table className="w-full border border-gray-600 text-center">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2 border border-gray-600">종목명</th>
            <th className="p-2 border border-gray-600">현재 주가</th>
            <th className="p-2 border border-gray-600">보유 수량</th>
            <th className="p-2 border border-gray-600">평가 금액</th>
          </tr>
        </thead>
        <tbody>
          {stockList.map(({ symbol, name }) => (
            <tr key={symbol}>
              <td className="p-2 border border-gray-600">{name}</td>
              <td className="p-2 border border-gray-600">
                {prices[symbol] !== undefined ? `${prices[symbol].toLocaleString()} 원` : "로딩 중..."}
              </td>
              <td className="p-2 border border-gray-600">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="bg-gray-700 text-white p-1 rounded w-20 text-center"
                  value={quantities[symbol] || ""}
                  onChange={(e) => handleQuantityChange(symbol, e.target.value)}
                />
              </td>
              <td className="p-2 border border-gray-600">
                {calculateValue(symbol).toLocaleString()} 원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
