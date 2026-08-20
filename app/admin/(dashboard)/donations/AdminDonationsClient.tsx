"use client";

import { useEffect, useState } from "react";

interface Donation {
  _id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  purpose: string;
  type: string;
  method: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminDonationsClient() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    fetch("/api/donations")
      .then((r) => r.json())
      .then((data) => setDonations(Array.isArray(data) ? data : []))
      .catch(() => setDonations([]));
  }, []);

  const total = donations.filter((d) => d.status === "completed").reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Donations</h1>
          <p className="text-[14px] text-[#8A7A55] mt-1">Total received: <strong className="text-[#0A3D62]">${(total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></p>
        </div>
      </div>

      <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_140px_100px_90px_90px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
          <div>Donor</div><div>Amount</div><div>Purpose</div><div>Method</div><div>Type</div><div>Status</div>
        </div>
        {donations.length === 0 && (
          <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No donations yet.</div>
        )}
        {donations.map((d) => (
          <div key={d._id} className="grid grid-cols-[1fr_100px_140px_100px_90px_90px] gap-4 px-6 py-4 border-t border-[#F1EADC] items-center">
            <div>
              <div className="font-[family-name:var(--font-montserrat)] text-[14px] text-[#0A3D62]">{d.name}</div>
              <div className="text-[12.5px] text-[#9AA5AF]">{d.email}</div>
            </div>
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] text-[#0A3D62]">
              ${(d.amount / 100).toFixed(2)}
            </div>
            <div className="text-[13.5px] text-[#5A6572] truncate">{d.purpose}</div>
            <div className="text-[13.5px] text-[#5A6572] capitalize">{d.method}</div>
            <div className="text-[13px] text-[#8A7A55] capitalize">{d.type}</div>
            <div>
              <span className={`text-[11px] font-[family-name:var(--font-montserrat)] font-semibold px-2 py-0.5 rounded-full ${statusColors[d.status]}`}>{d.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
