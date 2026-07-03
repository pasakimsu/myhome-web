"use client";

import {
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "@/lib/firebase";

export interface SearchDonationsRef {
  refreshSearch: () => void;
}

interface DonationData {
  id: string;
  date: string;
  name: string;
  reason: string;
  amount: number;
  sentAmount?: number | null;
  sentDate?: string | null;
  type?: "sent" | "received";
}

// 숫자를 한글로 변환 (필요시 사용 가능하도록 유틸 유지)
const numberToKorean = (num: number): string => {
  if (num === 0) return "0원";
  const units = ["", "만", "억", "조"];
  let result = "";
  let unitIndex = 0;
  let tempNum = num;
  while (tempNum > 0) {
    const part = tempNum % 10000;
    if (part > 0) result = `${part.toLocaleString()}${units[unitIndex]} ` + result;
    tempNum = Math.floor(tempNum / 10000);
    unitIndex++;
  }
  return result.trim() + "원";
};

// 개별 카드 컴포넌트를 외부로 분리하여 포커스 끊김 문제 해결
const DonationCard = ({
  item,
  listType,
  editingId,
  editForm,
  setEditForm,
  onStartEdit,
  onUpdate,
  onDelete,
  onCancelEdit
}: {
  item: DonationData,
  listType: "received" | "sent",
  editingId: string | null,
  editForm: any,
  setEditForm: (f: any) => void,
  onStartEdit: (item: DonationData, listType: "received" | "sent") => void,
  onUpdate: (id: string, listType: "received" | "sent") => void,
  onDelete: (id: string, listType: "received" | "sent") => void,
  onCancelEdit: () => void
}) => {
  const isEditing = editingId === item.id;

  if (isEditing) {
    return (
      <div className="bg-[#4a3f37] w-full p-4 rounded-xl border border-beigeLight/50 mb-3 space-y-2 text-left shadow-lg">
        <label className="text-[10px] text-gray-400 block px-1">날짜</label>
        <input
          type="date"
          value={editForm.date}
          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
          className="w-full p-3 rounded-lg bg-gray-800 text-white text-sm border border-brownBorder focus:ring-1 focus:ring-beigeLight outline-none"
        />
        <label className="text-[10px] text-gray-400 block px-1">이름</label>
        <input
          type="text"
          value={editForm.name}
          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
          className="w-full p-3 rounded-lg bg-gray-800 text-white text-sm border border-brownBorder focus:ring-1 focus:ring-beigeLight outline-none"
          placeholder="이름"
        />
        <label className="text-[10px] text-gray-400 block px-1">사유</label>
        <input
          type="text"
          value={editForm.reason}
          onChange={(e) => setEditForm({...editForm, reason: e.target.value})}
          className="w-full p-3 rounded-lg bg-gray-800 text-white text-sm border border-brownBorder focus:ring-1 focus:ring-beigeLight outline-none"
          placeholder="사유"
        />
        <label className="text-[10px] text-gray-400 block px-1">금액</label>
        <input
          type="text"
          value={editForm.amount}
          onChange={(e) => {
            const numeric = e.target.value.replace(/[^\d]/g, "");
            setEditForm({...editForm, amount: numeric ? Number(numeric).toLocaleString() : ""});
          }}
          className="w-full p-3 rounded-lg bg-gray-800 text-white text-sm border border-brownBorder focus:ring-1 focus:ring-beigeLight outline-none"
          placeholder="금액"
        />
        <div className="flex gap-2 pt-2">
          <button onClick={() => onUpdate(item.id, listType)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-xs font-bold transition active:scale-95 shadow-md">확인</button>
          <button onClick={onCancelEdit} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg text-xs font-bold transition active:scale-95 shadow-md">취소</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#4a3f37] w-full p-5 rounded-2xl border border-brownBorder/30 mb-4 shadow-md text-left transition-all hover:border-brownBorder/60 group">
      <div className="space-y-1.5 mb-4">
        <p className="text-gray-400 font-medium text-[10px] tracking-wider uppercase">📅 {item.date}</p>
        <p className="text-white font-black text-base">👤 {item.name}</p>
        <p className="text-gray-300 text-sm">📝 {item.reason}</p>
        <div className="pt-1">
          <p className={`font-black text-lg ${listType === 'received' ? 'text-beigeLight' : 'text-[#86b5a7]'}`}>
            {listType === 'received' ? '📥' : '📤'} {(listType === 'received' ? item.amount : item.sentAmount || 0).toLocaleString()}원
          </p>
          <p className="text-[10px] text-gray-500 font-bold">{numberToKorean(listType === 'received' ? item.amount : (item.sentAmount || 0))}</p>
        </div>
      </div>
      <div className="flex gap-2 pt-4 border-t border-white/5">
        <button
          onClick={() => onStartEdit(item, listType)}
          className="flex-1 py-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-600 text-white text-xs font-bold transition active:scale-95 border border-white/5"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(item.id, listType)}
          className="flex-1 py-2.5 rounded-xl bg-rose-900/30 hover:bg-rose-800/50 text-rose-300 text-xs font-bold transition active:scale-95 border border-rose-900/20"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

const SearchDonations = forwardRef<SearchDonationsRef>((_, ref) => {
  const [searchName, setSearchName] = useState<string>("");
  const [receivedResults, setReceivedResults] = useState<DonationData[]>([]);
  const [sentResults, setSentResults] = useState<DonationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    name: "",
    reason: "",
    amount: "",
  });

  const refreshSearch = async (isAll = false) => {
    if (!isAll && !searchName.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const userId = localStorage.getItem("userId") || "donations";
      let allResults: DonationData[] = [];

      if (isAll) {
        const snapshot = await getDocs(collection(db, userId));
        allResults = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DonationData, "id">),
        }));
      } else {
        const q = query(
          collection(db, userId),
          where("nameKeywords", "array-contains", searchName.trim())
        );
        const snapshot = await getDocs(q);
        allResults = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DonationData, "id">),
        }));
      }

      setReceivedResults(allResults.filter(item => (item.amount || 0) > 0));
      setSentResults(allResults.filter(item => (item.sentAmount || 0) > 0));

    } catch (error) {
      console.error("❌ 검색 오류:", error);
      alert("❌ 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshSearch: () => refreshSearch(false),
  }));

  const handleFullDelete = async (id: string, listType: "received" | "sent") => {
    if (!confirm("정말로 이 부조금 항목을 완전히 삭제할까요?")) return;

    try {
      const userId = localStorage.getItem("userId") || "donations";
      await deleteDoc(doc(db, userId, id));

      if (listType === "received") {
        setReceivedResults(prev => prev.filter(item => item.id !== id));
      } else {
        setSentResults(prev => prev.filter(item => item.id !== id));
      }
      alert("✅ 항목이 삭제되었습니다.");
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  const startEdit = (item: DonationData, listType: "received" | "sent") => {
    setEditingId(item.id);
    const amount = listType === "received" ? item.amount : (item.sentAmount || 0);
    setEditForm({
      date: item.date,
      name: item.name,
      reason: item.reason,
      amount: amount.toLocaleString(),
    });
  };

  const handleUpdate = async (id: string, listType: "received" | "sent") => {
    try {
      const userId = localStorage.getItem("userId") || "donations";
      const amountValue = Number(editForm.amount.replace(/,/g, ""));

      const updateData: any = {
        date: editForm.date,
        name: editForm.name,
        reason: editForm.reason,
      };

      if (listType === "received") {
        updateData.amount = amountValue;
      } else {
        updateData.sentAmount = amountValue;
        updateData.sentDate = editForm.date;
      }

      await updateDoc(doc(db, userId, id), updateData);

      alert("✅ 수정되었습니다.");
      setEditingId(null);
      refreshSearch(true);
    } catch (error) {
      console.error("❌ 수정 실패:", error);
      alert("❌ 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 w-full">
      <div className="w-full max-w-md space-y-4 mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="이름으로 검색"
            className="flex-1 p-4 border border-brownBorder rounded-2xl bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-beigeLight shadow-inner transition-all"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refreshSearch(false)}
          />
          <button
            onClick={() => refreshSearch(false)}
            className={`px-8 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${
              searchName ? "bg-beigeLight text-darkText" : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!searchName || loading}
          >
            {loading ? "..." : "검색"}
          </button>
        </div>
        {typeof window !== "undefined" && localStorage.getItem("userId") === "admin" && (
          <button
            onClick={() => refreshSearch(true)}
            className="w-full py-4 bg-[#4F7A6E] hover:bg-[#5d8b7d] text-white font-black rounded-2xl shadow-lg transition active:scale-95 text-sm uppercase tracking-wide border border-[#4F7A6E]/30"
          >
            📂 전체 내역 불러오기 (보낸 내역 포함)
          </button>
        )}
      </div>

      {hasSearched && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-beigeLight font-black flex items-center gap-2 text-base">
                📥 입금 (받은 내역)
              </h3>
              <span className="text-[10px] bg-beigeLight/10 text-beigeLight px-2 py-1 rounded-full font-bold">{receivedResults.length}건</span>
            </div>
            <div className="min-h-[150px] space-y-2">
              {receivedResults.length > 0 ? (
                receivedResults.map((item) => (
                  <DonationCard
                    key={item.id}
                    item={item}
                    listType="received"
                    editingId={editingId}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onStartEdit={startEdit}
                    onUpdate={handleUpdate}
                    onDelete={handleFullDelete}
                    onCancelEdit={() => setEditingId(null)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-black/10 rounded-3xl border-2 border-dashed border-gray-700/50">
                  <p className="text-gray-600 text-xs font-bold">입금 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[#86b5a7] font-black flex items-center gap-2 text-base">
                📤 출금 (보낸 내역)
              </h3>
              <span className="text-[10px] bg-[#4F7A6E]/20 text-[#86b5a7] px-2 py-1 rounded-full font-bold">{sentResults.length}건</span>
            </div>
            <div className="min-h-[150px] space-y-2">
              {sentResults.length > 0 ? (
                sentResults.map((item) => (
                  <DonationCard
                    key={item.id}
                    item={item}
                    listType="sent"
                    editingId={editingId}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onStartEdit={startEdit}
                    onUpdate={handleUpdate}
                    onDelete={handleFullDelete}
                    onCancelEdit={() => setEditingId(null)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-black/10 rounded-3xl border-2 border-dashed border-gray-700/50">
                  <p className="text-gray-600 text-xs font-bold">출금 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
});

export default SearchDonations;
SearchDonations.displayName = "SearchDonations";
