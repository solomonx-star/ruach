"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function AdminNewsletterClient() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch(() => setSubscribers([]));
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Newsletter subscribers</h1>
          <p className="text-[14px] text-[#8A7A55] mt-1">{subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => {
            const csv = ["Name,Email,Date"].concat(subscribers.map((s) => `${s.name},${s.email},${new Date(s.createdAt).toLocaleDateString()}`)).join("\n");
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
            a.download = "subscribers.csv";
            a.click();
          }}
          className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-4 py-2.5 rounded-md border border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_240px_120px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
          <div>Name</div><div>Email</div><div>Subscribed</div>
        </div>
        {subscribers.length === 0 && (
          <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No subscribers yet.</div>
        )}
        {subscribers.map((s) => (
          <div key={s._id} className="grid grid-cols-[1fr_240px_120px] gap-4 px-6 py-4 border-t border-[#F1EADC] items-center">
            <div className="font-[family-name:var(--font-montserrat)] text-[14px] text-[#0A3D62]">{s.name}</div>
            <div className="text-[13.5px] text-[#5A6572]">{s.email}</div>
            <div className="text-[12.5px] text-[#9AA5AF]">{new Date(s.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
