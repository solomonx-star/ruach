import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — RUACH Global Inc.",
  description: "Learn about RUACH Global Inc. — our mission, values and history.",
};

const pillars = [
  { title: "Prayer", desc: "Intercession is the foundation of everything we do. Our prayer teams gather weekly, interceding for the congregation, the nation and the nations." },
  { title: "Teaching", desc: "We are committed to expository, Word-centred teaching that equips believers to live with purpose and clarity in every season." },
  { title: "Community", desc: "From small groups to large gatherings, we build deep, lasting relationships across generations and backgrounds." },
  { title: "Missions", desc: "We send and support workers into unreached communities locally and internationally, believing every person deserves to hear the Gospel." },
];

const leadership = [
  { name: "Rev. Emmanuel Kanu", title: "Senior Pastor & Founder" },
  { name: "Pastor Grace Kanu", title: "Women's Ministry Director" },
  { name: "Elder Samuel Okafor", title: "Board Chairman" },
  { name: "Min. David Asante", title: "Worship & Arts Director" },
];

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="flex items-center gap-3 mb-[18px]">
        <span className="w-[34px] h-[2px] bg-[#D4AF37]" />
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55]">About Us</span>
      </div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] leading-[1.12] text-[#0A3D62] mb-5 max-w-[760px]">
        A ministry built on prayer, teaching and presence in the community.
      </h1>
      <p className="text-[17.5px] leading-[1.75] text-[#4A5561] max-w-[720px] mb-14">
        RUACH Global Inc. is a faith-based, non-profit ministry serving members and neighbours through weekly gatherings, youth programs, community outreach and international missions.
      </p>

      {/* Mission statement */}
      <div className="bg-[#0A3D62] rounded-xl px-10 py-12 mb-14">
        <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.18em] uppercase text-[#D4AF37] mb-4">Our Mission</div>
        <blockquote className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] leading-[1.35] text-white max-w-[760px]">
          &ldquo;To glorify God by making disciples of all nations — raising Spirit-filled believers who transform their communities through love, service and the power of the Gospel.&rdquo;
        </blockquote>
      </div>

      {/* Four pillars */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[30px] text-[#0A3D62] mb-8">What we stand for</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="border border-[#EFE7D8] rounded-xl p-6 bg-white">
              <div className="w-[38px] h-[3px] bg-[#D4AF37] mb-4 rounded-full" />
              <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[17px] text-[#0A3D62] mb-3">{p.title}</div>
              <p className="text-[14.5px] leading-[1.7] text-[#4A5561]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
        <div>
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[30px] text-[#0A3D62] mb-5">Our story</h2>
          <p className="text-[16px] leading-[1.8] text-[#4A5561] mb-5">
            RUACH Global Inc. was founded with a simple conviction: that the local church is the hope of the world. What began as a small prayer gathering has grown into a vibrant ministry touching lives across the city and beyond.
          </p>
          <p className="text-[16px] leading-[1.8] text-[#4A5561] mb-5">
            Over the years we have planted outreach points, sent mission teams to West Africa and the Caribbean, launched a youth discipleship programme and established a community resource centre serving hundreds of families each year.
          </p>
          <p className="text-[16px] leading-[1.8] text-[#4A5561]">
            We are a non-denominational, Spirit-led community — welcoming people from every background and every season of faith.
          </p>
        </div>
        <div className="bg-[#F4EFE4] rounded-xl p-8">
          <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-[20px] text-[#0A3D62] mb-6">By the numbers</h3>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: "15+", label: "Years in ministry" },
              { n: "12", label: "Nations reached" },
              { n: "3,000+", label: "Lives served annually" },
              { n: "40+", label: "Active volunteers" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-[family-name:var(--font-montserrat)] font-bold text-[36px] text-[#D4AF37]">{s.n}</div>
                <div className="text-[13.5px] text-[#5A6572]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[30px] text-[#0A3D62] mb-8">Leadership</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          {leadership.map((l) => (
            <div key={l.name} className="border border-[#EFE7D8] rounded-xl p-6 bg-white text-center">
              <div className="w-[72px] h-[72px] rounded-full bg-[#0A3D62] mx-auto mb-4 grid place-items-center font-[family-name:var(--font-montserrat)] font-bold text-[24px] text-[#D4AF37]">
                {l.name.charAt(0)}
              </div>
              <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[15px] text-[#0A3D62] mb-1">{l.name}</div>
              <div className="text-[13px] text-[#8A7A55]">{l.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#F4EFE4] rounded-xl px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[22px] text-[#0A3D62] mb-2">Ready to get involved?</div>
          <p className="text-[15px] text-[#5A6572]">Join us for a Sunday service, explore our ministries, or reach out — we&apos;d love to connect.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/contact" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-3 rounded-md bg-[#0A3D62] text-white hover:bg-[#0D4E7D] transition-colors whitespace-nowrap">
            Get in touch
          </Link>
          <Link href="/ministries" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-3 rounded-md border border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white transition-colors whitespace-nowrap">
            Our ministries
          </Link>
        </div>
      </div>
    </div>
  );
}
