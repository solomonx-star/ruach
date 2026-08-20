"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[rgba(251,248,241,.94)] backdrop-blur-[10px] border-b border-[#E6DFD1]">
      <div className="max-w-[1200px] mx-auto px-7 py-[14px] flex items-center gap-7">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mr-auto shrink-0">
          <div className="w-10 h-10 border-[1.5px] border-[#D4AF37] rounded-full grid place-items-center text-[#0A3D62] font-[family-name:var(--font-montserrat)] font-bold text-[16px]">
            R
          </div>
          <div className="leading-[1.15]">
            <div className="font-[family-name:var(--font-montserrat)] font-bold text-[17px] tracking-[.02em] text-[#0A3D62]">
              RUACH GLOBAL
            </div>
            <div className="text-[11px] tracking-[.16em] uppercase text-[#8A7A55]">
              Inc. · Spirit · Mission
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-[family-name:var(--font-montserrat)] text-[13.5px] font-medium tracking-[.01em] px-3 py-[9px] rounded-md transition-colors ${
                  active
                    ? "bg-[#F1EADC] text-[#0A3D62]"
                    : "text-[#5A6572] hover:bg-[#F1EADC] hover:text-[#0A3D62]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/donate"
          className="hidden lg:block font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-[22px] py-[11px] rounded-md border-[1.5px] border-[#D4AF37] text-[#0A3D62] hover:bg-[#D4AF37] transition-colors shrink-0"
        >
          Donate
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 text-[#0A3D62]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-[#E6DFD1] bg-[#FBF8F1] px-7 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`font-[family-name:var(--font-montserrat)] text-[14px] font-medium px-3 py-2.5 rounded-md transition-colors ${
                  active ? "bg-[#F1EADC] text-[#0A3D62]" : "text-[#5A6572] hover:bg-[#F1EADC] hover:text-[#0A3D62]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className="mt-2 font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-3 py-2.5 rounded-md border-[1.5px] border-[#D4AF37] text-[#0A3D62] text-center hover:bg-[#D4AF37] transition-colors"
          >
            Donate
          </Link>
        </div>
      )}
    </header>
  );
}
