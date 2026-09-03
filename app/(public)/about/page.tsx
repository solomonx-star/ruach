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

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="flex items-center gap-3 mb-[18px]">
        <span className="w-[34px] h-[2px] bg-[#D4AF37]" />
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55]">About Us</span>
      </div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] leading-[1.12] text-[#0A3D62] mb-5 max-w-[760px]">
        Faith in action. Hope for every community.
      </h1>
      <p className="text-[17.5px] leading-[1.75] text-[#4A5561] max-w-[720px] mb-14">
        Ruach Global Inc. is a Christian nonprofit ministry rooted in prayer and guided by the Holy Spirit. We are committed to serving people with compassion and dignity while inspiring hope and meaningful change in communities locally and around the world.
      </p>

      {/* Mission statement */}
      <div className="bg-[#0A3D62] rounded-xl px-10 py-12 mb-14">
        <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.18em] uppercase text-[#D4AF37] mb-4">Our Mission</div>
        <blockquote className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] leading-[1.35] text-white max-w-[760px]">
          Ruach Global exists to demonstrate the love of Jesus Christ by serving underserved people and communities, restoring hope, creating opportunities, and empowering individuals to build brighter futures.
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

      {/* Our story */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[30px] text-[#0A3D62] mb-5">Our story</h2>
        <p className="text-[16px] leading-[1.8] text-[#4A5561] mb-5 max-w-[720px]">
          Ruach Global was born from a desire to share the love of Jesus Christ while responding to the needs of people and communities. Our vision extends beyond traditional ministry walls—we seek to bring hope, support, and meaningful opportunities wherever God leads us.
        </p>
        <p className="text-[16px] leading-[1.8] text-[#4A5561] max-w-[720px]">
          As Ruach Global continues to grow, we remain committed to serving with compassion, operating with integrity, and helping people move toward brighter and more sustainable futures.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-[#F4EFE4] rounded-xl px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[22px] text-[#0A3D62] mb-2">Ready to get involved?</div>
          <p className="text-[15px] text-[#5A6572]">Volunteer, give, pray, or simply reach out — there&apos;s a place for you here.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/contact" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-3 rounded-md bg-[#0A3D62] text-white hover:bg-[#0D4E7D] transition-colors whitespace-nowrap">
            Get in touch
          </Link>
          <Link href="/volunteer" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-3 rounded-md border border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white transition-colors whitespace-nowrap">
            Get involved
          </Link>
        </div>
      </div>
    </div>
  );
}
