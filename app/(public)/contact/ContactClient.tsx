"use client";

import { useState } from "react";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pForm, setPForm] = useState({ name: "", email: "", request: "" });
  const [anon, setAnon] = useState(false);
  const [pDone, setPDone] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [pError, setPError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError("Please check your details and try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Unable to send. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitPrayer(e: React.FormEvent) {
    e.preventDefault();
    setPLoading(true);
    setPError(null);
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pForm, anonymous: anon }),
      });
      if (!res.ok) {
        setPError("Something went wrong. Please try again.");
        return;
      }
      setPDone(true);
    } catch {
      setPError("Unable to send. Check your connection and try again.");
    } finally {
      setPLoading(false);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Contact</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-10">Talk to a real person</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-[34px] items-start mb-16">
        {/* Contact form */}
        <div className="bg-white border border-[#EFE7D8] rounded-lg px-[38px] py-9 pb-10">
          {done ? (
            <div>
              <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[20px] text-[#0A3D62] mb-2">Message received!</div>
              <p className="text-[15.5px] text-[#5A6572]">We&apos;ll reply within two business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-[18px] mb-[18px]">
                {[
                  { label: "Name", key: "name", type: "text", placeholder: "Your name" },
                  { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Phone number", key: "phone", type: "tel", placeholder: "Phone number" },
                  { label: "Subject", key: "subject", type: "text", placeholder: "What is this about?" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]" htmlFor={`contact-${f.key}`}>{f.label}</label>
                    <input
                      id={`contact-${f.key}`}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-[26px]">
                <label htmlFor="contact-message" className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]">Message</label>
                <textarea
                  id="contact-message"
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full h-[150px] font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] resize-vertical focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              {error && (
                <p role="alert" className="text-[13.5px] text-red-600 mb-4">{error}</p>
              )}
              <div className="flex items-center gap-[18px]">
                <button
                  type="submit"
                  disabled={loading}
                  className="font-[family-name:var(--font-montserrat)] font-semibold text-[14.5px] px-8 py-[15px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send message"}
                </button>
                <span className="text-[13.5px] text-[#9AA5AF]">We reply within two business days</span>
              </div>
            </form>
          )}
        </div>

        {/* Info sidebar */}
        <div className="rounded-lg border border-[#E6DFD1] bg-[#F4EFE4] p-7">
          <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8A7A55] mb-3">Reach us</div>
          <div className="grid gap-2 text-[14.5px]">
            <a href="tel:+10000000000" className="text-[#5A6572] hover:text-[#0A3D62] transition-colors">+1 (000) 000-0000</a>
            <a href="mailto:admin@ruachglobal.org" className="text-[#5A6572] hover:text-[#0A3D62] transition-colors">admin@ruachglobal.org</a>
          </div>
        </div>
      </div>

      {/* Prayer Request */}
      <div id="prayer" className="bg-[#0A3D62] rounded-xl px-10 py-12">
        <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.18em] uppercase text-[#D4AF37] mb-3">Prayer Request</div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-white mb-3">We will pray with you</h2>
        <p className="text-[15.5px] text-[#C6D8E5] mb-8 max-w-[540px]">Requests go only to our intercessory team. Submit anonymously if you prefer.</p>

        {pDone ? (
          <p className="text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-semibold text-[15px]">Your request has been received. We are praying.</p>
        ) : (
          <form onSubmit={submitPrayer} className="grid gap-3 max-w-[560px]">
            <div>
              <label htmlFor="prayer-name" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Name</label>
              <input
                id="prayer-name"
                placeholder="Optional"
                value={pForm.name}
                onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label htmlFor="prayer-email" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Email</label>
              <input
                id="prayer-email"
                type="email"
                placeholder="you@example.com"
                value={pForm.email}
                onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
                className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label htmlFor="prayer-request" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Your request</label>
              <textarea
                id="prayer-request"
                placeholder="Share what's on your heart…"
                value={pForm.request}
                onChange={(e) => setPForm({ ...pForm, request: e.target.value })}
                className="w-full h-[118px] font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] resize-vertical focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <label className="flex items-center gap-[11px] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={anon}
                onChange={(e) => setAnon(e.target.checked)}
                className="sr-only"
              />
              <span aria-hidden="true" className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[#D4AF37] grid place-items-center shrink-0 text-[#0A3D62] text-[12px] ${anon ? "bg-[#D4AF37]" : "bg-transparent"}`}>
                {anon ? "✓" : ""}
              </span>
              <span className="text-[14.5px] text-[#D6E4EE]">Submit anonymously</span>
            </label>
            {pError && <p role="alert" className="text-[13px] text-red-300">{pError}</p>}
            <button
              type="submit"
              disabled={pLoading}
              className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] py-[14px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors mt-1 disabled:opacity-60"
            >
              {pLoading ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
