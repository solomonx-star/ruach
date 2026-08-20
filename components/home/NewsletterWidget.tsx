"use client";

import { useState } from "react";

export default function NewsletterWidget() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        setError("Couldn't subscribe. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Couldn't subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="bg-[#0A3D62] rounded-lg px-[30px] py-[34px] text-white self-start">
      <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.18em] uppercase text-[#D4AF37] mb-[14px]">
        Newsletter
      </div>
      <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[23px] leading-[1.3] mb-3">
        Get the monthly mission update
      </div>
      <p className="text-[14.5px] leading-[1.7] text-[#C6D8E5] mb-[22px]">
        Field reports, prayer points and event dates — once a month, nothing more.
      </p>
      {done ? (
        <p className="text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-semibold">
          You&apos;re subscribed — thank you!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-2.5">
          <label htmlFor="newsletter-name" className="sr-only">Full name</label>
          <input
            id="newsletter-name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
          />
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
          />
          {error && <p role="alert" className="text-[12.5px] text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] py-[14px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors mt-1 disabled:opacity-60"
          >
            {loading ? "Subscribing…" : "Subscribe"}
          </button>
          <div className="text-[12.5px] text-[#8FB0C6]">Unsubscribe anytime.</div>
        </form>
      )}
    </aside>
  );
}
