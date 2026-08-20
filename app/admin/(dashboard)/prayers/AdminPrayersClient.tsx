"use client";

import { useEffect, useState } from "react";

interface PrayerRequest {
  _id: string;
  name?: string;
  email?: string;
  request: string;
  anonymous: boolean;
  prayed: boolean;
  createdAt: string;
}

export default function AdminPrayersClient() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);

  useEffect(() => {
    fetch("/api/prayer")
      .then((r) => r.json())
      .then((data) => setPrayers(Array.isArray(data) ? data : []))
      .catch(() => setPrayers([]));
  }, []);

  async function togglePrayed(id: string, prayed: boolean) {
    await fetch(`/api/prayer`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, prayed: !prayed }) });
    setPrayers((prev) => prev.map((p) => p._id === id ? { ...p, prayed: !prayed } : p));
  }

  return (
    <div className="p-8">
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62] mb-6">Prayer Requests</h1>
      <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_100px_80px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
          <div>Request</div><div>From</div><div>Date</div><div>Prayed</div>
        </div>
        {prayers.length === 0 && (
          <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No prayer requests yet.</div>
        )}
        {prayers.map((p) => (
          <div key={p._id} className="grid grid-cols-[1fr_160px_100px_80px] gap-4 px-6 py-4 border-t border-[#F1EADC] items-start">
            <p className="text-[14px] text-[#2C3641] leading-[1.65]">{p.request}</p>
            <div className="text-[13px] text-[#6B7683]">
              {p.anonymous ? <span className="text-[#9AA5AF] italic">Anonymous</span> : p.name ?? "—"}
            </div>
            <div className="text-[12.5px] text-[#9AA5AF]">{new Date(p.createdAt).toLocaleDateString()}</div>
            <button
              onClick={() => togglePrayed(p._id, p.prayed)}
              className={`text-[12px] font-[family-name:var(--font-montserrat)] font-semibold px-3 py-1 rounded-full transition-colors ${p.prayed ? "bg-green-100 text-green-700" : "border border-[#E6DFD1] text-[#9AA5AF] hover:border-green-300 hover:text-green-600"}`}
            >
              {p.prayed ? "Prayed ✓" : "Mark prayed"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
