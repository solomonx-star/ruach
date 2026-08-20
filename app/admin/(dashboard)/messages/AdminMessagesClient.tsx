"use client";

import { useEffect, useState } from "react";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, []);

  async function selectMessage(m: Message) {
    setSelected(m);
    if (!m.read) {
      await fetch(`/api/contact/${m._id}`, { method: "PATCH" });
      setMessages((prev) => prev.map((msg) => msg._id === m._id ? { ...msg, read: true } : msg));
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62] mb-6">Contact messages</h1>
      <div className="grid grid-cols-[1fr_400px] gap-5 items-start">
        <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_180px_110px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
            <div>From</div><div>Subject</div><div>Date</div>
          </div>
          {messages.length === 0 && (
            <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No messages yet.</div>
          )}
          {messages.map((m) => (
            <button
              key={m._id}
              type="button"
              onClick={() => selectMessage(m)}
              className={`w-full text-left grid grid-cols-[1fr_180px_110px] gap-4 px-6 py-4 border-t border-[#F1EADC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4AF37] ${selected?._id === m._id ? "bg-[#FDF6E4]" : "hover:bg-[#FBF8F1]"} ${!m.read ? "font-semibold" : ""}`}
            >
              <div>
                <div className="font-[family-name:var(--font-montserrat)] text-[14px] text-[#0A3D62]">{m.name}</div>
                <div className="text-[12.5px] text-[#9AA5AF] font-normal">{m.email}</div>
              </div>
              <div className="text-[13.5px] text-[#5A6572] truncate self-center font-normal">{m.subject}</div>
              <div className="text-[12.5px] text-[#9AA5AF] self-center font-normal">{new Date(m.createdAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 sticky top-8">
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62] mb-1">{selected.subject}</div>
            <div className="text-[13.5px] text-[#8A7A55] mb-5">{selected.name} · {selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</div>
            <p className="text-[15px] leading-[1.75] text-[#4A5561] whitespace-pre-wrap">{selected.message}</p>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="mt-6 inline-block font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
              Reply by email
            </a>
          </div>
        ) : (
          <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 text-center text-[14px] text-[#9AA5AF]">
            Select a message to read it
          </div>
        )}
      </div>
    </div>
  );
}
