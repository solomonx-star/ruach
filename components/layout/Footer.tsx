"use client";

import Link from "next/link";
import { useState } from "react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
];

const involvedLinks = [
  { label: "Volunteer", href: "/volunteer" },
  { label: "Donate", href: "/donate" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
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
    <footer className="bg-[#072A44] text-[#C6D8E5] mt-[72px]">
      <div className="max-w-[1200px] mx-auto px-7 pt-[62px] pb-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-[52px]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-[18px]">
            <div className="w-[38px] h-[38px] border-[1.5px] border-[#D4AF37] rounded-full grid place-items-center text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-bold text-[15px]">
              R
            </div>
            <div className="font-[family-name:var(--font-montserrat)] font-bold text-[16px] tracking-[.02em] text-white">
              RUACH GLOBAL INC.
            </div>
          </div>
          <p className="text-[14.5px] leading-[1.75] mb-[18px] max-w-[300px]">
            A faith-based non-profit ministry — worship, discipleship, outreach and missions.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8FB0C6] mb-4">
            Quick links
          </div>
          <div className="grid gap-[11px] text-[14.5px]">
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#D4AF37] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Get involved */}
        <div>
          <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8FB0C6] mb-4">
            Get involved
          </div>
          <div className="grid gap-[11px] text-[14.5px]">
            {involvedLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#D4AF37] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8FB0C6] mb-4">
            Newsletter
          </div>
          {done ? (
            <p className="text-[14.5px] text-[#D4AF37]">You&apos;re subscribed — thank you!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="grid gap-2.5">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-[family-name:var(--font-open-sans)] text-[14px] px-[13px] py-3 rounded-md border border-[#2D5E80] bg-[#0A3D62] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-[family-name:var(--font-open-sans)] text-[14px] px-[13px] py-3 rounded-md border border-[#2D5E80] bg-[#0A3D62] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
              />
              {error && <p role="alert" className="text-[12.5px] text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] py-3 rounded-md border-[1.5px] border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-[#0A3D62] transition-colors disabled:opacity-60"
              >
                {loading ? "Signing up…" : "Sign up"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-[#14456B]">
        <div className="max-w-[1200px] mx-auto px-7 py-5 flex flex-col sm:flex-row justify-between gap-5 text-[13.5px] text-[#8FB0C6]">
          <span>© {new Date().getFullYear()} RUACH Global Inc. All rights reserved.</span>
          <div className="flex gap-[22px]">
            <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Use</Link>
            <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
