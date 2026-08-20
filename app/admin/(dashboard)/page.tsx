import Link from "next/link";
import { Calendar, Image, FileText, Heart, MessageSquare, Users, HandHeart, Mail } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Donation } from "@/models/Donation";
import { Subscriber } from "@/models/Subscriber";
import { Volunteer } from "@/models/Volunteer";
import { ContactMessage } from "@/models/ContactMessage";

const sections = [
  { label: "Events", href: "/admin/events", icon: Calendar, desc: "Create and manage ministry events" },
  { label: "Gallery", href: "/admin/gallery", icon: Image, desc: "Upload photos and videos" },
  { label: "Blog", href: "/admin/blog", icon: FileText, desc: "Write and publish articles" },
  { label: "Donations", href: "/admin/donations", icon: Heart, desc: "View donation records and reports" },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare, desc: "Read contact form submissions" },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users, desc: "Manage volunteer registrations" },
  { label: "Prayer Requests", href: "/admin/prayers", icon: HandHeart, desc: "Review and respond to requests" },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail, desc: "View and manage subscribers" },
];

export default async function AdminDashboard() {
  let donations = 0, subscribers = 0, volunteers = 0, unreadMessages = 0;
  try {
    await connectDB();
    [donations, subscribers, volunteers, unreadMessages] = await Promise.all([
      Donation.countDocuments({ status: "completed" }),
      Subscriber.countDocuments({ active: true }),
      Volunteer.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
    ]);
  } catch {
    // DB unavailable — show zeros
  }

  const stats = [
    { label: "Total donations", value: donations.toString() },
    { label: "Newsletter subscribers", value: subscribers.toString() },
    { label: "Volunteer registrations", value: volunteers.toString() },
    { label: "Unread messages", value: unreadMessages.toString() },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[32px] text-[#0A3D62]">Dashboard</h1>
        <p className="text-[15px] text-[#5A6572] mt-1">Welcome back. Manage your ministry content below.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#EFE7D8] rounded-lg px-6 py-5">
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#D4AF37]">{s.value}</div>
            <div className="text-[13.5px] text-[#5A6572] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {sections.map(({ label, href, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-[#EFE7D8] rounded-lg px-6 py-6 hover:border-[#D4AF37] transition-colors group"
          >
            <div className="w-10 h-10 rounded-md bg-[#F4EFE4] grid place-items-center mb-4 group-hover:bg-[#FDF6E4] transition-colors">
              <Icon size={20} className="text-[#0A3D62]" />
            </div>
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[16px] text-[#0A3D62] mb-1">{label}</div>
            <div className="text-[13.5px] text-[#6B7683]">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
