"use client";

import { useEffect, useState } from "react";

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  interests: string[];
  availability: string[];
  skills?: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
};

export default function AdminVolunteersClient() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selected, setSelected] = useState<Volunteer | null>(null);

  useEffect(() => {
    fetch("/api/volunteer")
      .then((r) => r.json())
      .then((data) => setVolunteers(Array.isArray(data) ? data : []))
      .catch(() => setVolunteers([]));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/volunteer`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setVolunteers((prev) => prev.map((v) => v._id === id ? { ...v, status } : v));
    if (selected?._id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  return (
    <div className="p-8">
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62] mb-6">Volunteers</h1>
      <div className="grid grid-cols-[1fr_380px] gap-5 items-start">
        <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_100px_80px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
            <div>Name</div><div>City</div><div>Date</div><div>Status</div>
          </div>
          {volunteers.length === 0 && (
            <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No volunteer registrations yet.</div>
          )}
          {volunteers.map((v) => (
            <div key={v._id} onClick={() => setSelected(v)} className={`grid grid-cols-[1fr_140px_100px_80px] gap-4 px-6 py-4 border-t border-[#F1EADC] cursor-pointer transition-colors ${selected?._id === v._id ? "bg-[#FDF6E4]" : "hover:bg-[#FBF8F1]"}`}>
              <div>
                <div className="font-[family-name:var(--font-montserrat)] text-[14px] text-[#0A3D62]">{v.name}</div>
                <div className="text-[12.5px] text-[#9AA5AF]">{v.email}</div>
              </div>
              <div className="text-[13.5px] text-[#5A6572] self-center">{v.city ?? "—"}</div>
              <div className="text-[12.5px] text-[#9AA5AF] self-center">{new Date(v.createdAt).toLocaleDateString()}</div>
              <div className="self-center">
                <span className={`text-[11px] font-[family-name:var(--font-montserrat)] font-semibold px-2 py-0.5 rounded-full ${statusColors[v.status]}`}>{v.status}</span>
              </div>
            </div>
          ))}
        </div>

        {selected ? (
          <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 sticky top-8">
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62] mb-1">{selected.name}</div>
            <div className="text-[13.5px] text-[#8A7A55] mb-4">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</div>
            {(selected.interests ?? []).length > 0 && (
              <div className="mb-3">
                <div className="font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-wider text-[#8A7A55] mb-2">Interests</div>
                <div className="flex flex-wrap gap-1.5">{(selected.interests ?? []).map((i) => <span key={i} className="text-[12.5px] border border-[#E6DFD1] bg-[#FBF8F1] rounded-full px-3 py-1 text-[#0A3D62]">{i}</span>)}</div>
              </div>
            )}
            {(selected.availability ?? []).length > 0 && (
              <div className="mb-3">
                <div className="font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-wider text-[#8A7A55] mb-2">Availability</div>
                <div className="text-[13.5px] text-[#5A6572]">{(selected.availability ?? []).join(", ")}</div>
              </div>
            )}
            {selected.skills && (
              <div className="mb-5">
                <div className="font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-wider text-[#8A7A55] mb-2">Skills</div>
                <p className="text-[13.5px] text-[#5A6572]">{selected.skills}</p>
              </div>
            )}
            <div>
              <div className="font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-wider text-[#8A7A55] mb-2">Update status</div>
              <div className="flex flex-wrap gap-2">
                {["pending", "contacted", "active", "inactive"].map((s) => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)} className={`text-[12.5px] font-[family-name:var(--font-montserrat)] font-semibold px-3 py-1.5 rounded-md transition-colors ${selected.status === s ? "bg-[#0A3D62] text-white" : "border border-[#E6DFD1] text-[#5A6572] hover:border-[#0A3D62]"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 text-center text-[14px] text-[#9AA5AF]">Select a volunteer to view details</div>
        )}
      </div>
    </div>
  );
}
