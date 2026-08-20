import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ministries — RUACH Global Inc.",
  description: "Explore the ministries of RUACH Global Inc. — worship, youth, outreach, missions and more.",
};

const ministries = [
  {
    name: "Worship & Arts",
    tagline: "Ushering in the presence of God",
    desc: "Our worship team leads the congregation in Spirit-filled praise every Sunday and trains the next generation of musicians, singers and technicians.",
    who: "All ages",
    meets: "Sundays + Thursday rehearsal",
    contact: "worship@ruachglobal.org",
  },
  {
    name: "Youth Ministry",
    tagline: "Raising a generation of purpose",
    desc: "Friday nights, weekend retreats and discipleship tracks designed for teenagers who want to go deeper in faith and leadership.",
    who: "Ages 13–25",
    meets: "Fridays, 7 pm",
    contact: "youth@ruachglobal.org",
  },
  {
    name: "Children's Church",
    tagline: "Faith foundations for little ones",
    desc: "Age-appropriate Bible teaching, crafts and games run in parallel with the main Sunday service so parents can worship freely.",
    who: "Ages 3–12",
    meets: "Sundays during service",
    contact: "children@ruachglobal.org",
  },
  {
    name: "Community Outreach",
    tagline: "Love in action",
    desc: "Weekly food distribution, after-school tutoring and family support services reaching hundreds of households in our local neighbourhood.",
    who: "Open to all volunteers",
    meets: "Saturdays, 9 am",
    contact: "outreach@ruachglobal.org",
  },
  {
    name: "Intercessory Prayer",
    tagline: "Standing in the gap",
    desc: "Early morning and midweek prayer sets — individuals and families interceding for the church, the city and nations.",
    who: "Open to all",
    meets: "Mon & Wed, 6 am",
    contact: "prayer@ruachglobal.org",
  },
  {
    name: "Global Missions",
    tagline: "To the ends of the earth",
    desc: "We partner with missionaries in West Africa, the Caribbean and South-East Asia — sending short-term teams and providing ongoing financial support.",
    who: "Adults 18+",
    meets: "Monthly planning meetings",
    contact: "missions@ruachglobal.org",
  },
];

export default function MinistriesPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Ministries</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-4">Where the work happens</h1>
      <p className="text-[17.5px] leading-[1.75] text-[#4A5561] max-w-[700px] mb-12">
        Every ministry at RUACH Global is a place to belong, serve and grow. Find the one that fits your season.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
        {ministries.map((m) => (
          <div key={m.name} className="border border-[#EFE7D8] rounded-xl p-7 bg-white flex flex-col">
            <div className="w-[38px] h-[3px] bg-[#D4AF37] mb-5 rounded-full" />
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[19px] text-[#0A3D62] mb-1">{m.name}</div>
            <div className="text-[12.5px] text-[#D4AF37] font-[family-name:var(--font-montserrat)] tracking-[.08em] uppercase mb-4">{m.tagline}</div>
            <p className="text-[14.5px] leading-[1.7] text-[#4A5561] mb-5 flex-1">{m.desc}</p>
            <div className="border-t border-[#EFE7D8] pt-4 grid gap-1.5 text-[13px] text-[#6B7683]">
              <div><span className="text-[#8A7A55] font-medium">Who:</span> {m.who}</div>
              <div><span className="text-[#8A7A55] font-medium">Meets:</span> {m.meets}</div>
              <a href={`mailto:${m.contact}`} className="text-[#0A3D62] hover:text-[#D4AF37] transition-colors mt-0.5">{m.contact}</a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0A3D62] rounded-xl px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[22px] text-white mb-2">Not sure where to start?</div>
          <p className="text-[15px] text-[#C6D8E5]">Come to a Sunday service or reach out — we will help you find your place.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/volunteer" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-3 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors whitespace-nowrap">
            Get involved
          </Link>
          <Link href="/contact" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-3 rounded-md border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A3D62] transition-colors whitespace-nowrap">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
