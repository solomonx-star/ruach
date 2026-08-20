"use client";

import { useState } from "react";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Contact</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-10">Talk to a real person</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-[34px] items-start">
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
        <div className="grid gap-[22px]">
          <div className="rounded-lg border border-[#E6DFD1] bg-[#F4EFE4] p-7 grid gap-5">
            <div>
              <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8A7A55] mb-3">Visit us</div>
              <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[16px] text-[#0A3D62] mb-1">RUACH Global Inc.</div>
              <div className="text-[14.5px] text-[#5A6572] leading-[1.7]">
                123 Ministry Lane<br />
                City, State 00000
              </div>
            </div>
            <div className="border-t border-[#DDD5C5] pt-5 grid gap-2 text-[14.5px]">
              <a href="tel:+10000000000" className="text-[#5A6572] hover:text-[#0A3D62] transition-colors">+1 (000) 000-0000</a>
              <a href="mailto:admin@ruachglobal.org" className="text-[#5A6572] hover:text-[#0A3D62] transition-colors">admin@ruachglobal.org</a>
            </div>
            <div className="border-t border-[#DDD5C5] pt-5">
              <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8A7A55] mb-2">Sunday services</div>
              <div className="text-[15px] text-[#0A3D62] font-semibold font-[family-name:var(--font-montserrat)]">9:00 am &amp; 11:00 am</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
