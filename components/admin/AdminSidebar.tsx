"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Calendar, Image, FileText, Heart,
  MessageSquare, Users, HandHeart, Mail, UserCog, LogOut, BookOpen,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Resources", href: "/admin/resources", icon: BookOpen },
  { label: "Donations", href: "/admin/donations", icon: Heart },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Prayer Requests", href: "/admin/prayers", icon: HandHeart },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Users", href: "/admin/users", icon: UserCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-[#072A44] min-h-screen flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-[#14456B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border-[1.5px] border-[#D4AF37] rounded-full grid place-items-center text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-bold text-[14px]">R</div>
          <div>
            <div className="font-[family-name:var(--font-montserrat)] font-bold text-[14px] text-white">RUACH GLOBAL</div>
            <div className="text-[11px] text-[#8FB0C6]">Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-[10px] rounded-md mb-0.5 text-[14px] font-[family-name:var(--font-montserrat)] font-medium transition-colors ${
                active ? "bg-[#0A3D62] text-white" : "text-[#8FB0C6] hover:bg-[#0A3D62] hover:text-white"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#14456B]">
        <Link href="/" className="flex items-center gap-3 px-3 py-[10px] rounded-md text-[14px] text-[#8FB0C6] hover:text-white font-[family-name:var(--font-montserrat)] mb-0.5 transition-colors">
          ← View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-[10px] rounded-md text-[14px] text-[#8FB0C6] hover:text-white font-[family-name:var(--font-montserrat)] transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
