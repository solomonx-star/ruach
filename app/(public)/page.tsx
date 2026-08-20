import type { Metadata } from "next";
import Link from "next/link";
import NewsletterWidget from "@/components/home/NewsletterWidget";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Event";

export const metadata: Metadata = {
  title: "RUACH Global Inc. — Carrying the breath of God to the nations",
};

interface EventItem {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  registrationRequired: boolean;
}

export default async function HomePage() {
  let events: EventItem[] = [];
  try {
    await connectDB();
    const raw = await Event.find({ published: true, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3)
      .lean();
    events = JSON.parse(JSON.stringify(raw));
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[640px] bg-[#072A44] overflow-hidden">
        <div className="absolute inset-0 opacity-60 bg-[#0A3D62]" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg,rgba(7,42,68,.94) 0%,rgba(7,42,68,.78) 46%,rgba(7,42,68,.25) 100%)" }}
        />
        <div className="relative max-w-[1200px] mx-auto px-7 h-full flex flex-col justify-center">
          <div className="max-w-[660px]">
            <div className="flex items-center gap-3 mb-[22px]">
              <span className="w-11 h-[2px] bg-[#D4AF37]" />
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.22em] uppercase text-[#D4AF37]">
                Ruach Global Inc.
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-[clamp(38px,5vw,62px)] leading-[1.06] tracking-[-0.02em] text-white mb-[22px]">
              Carrying the breath of God to the nations.
            </h1>
            <p className="text-[18.5px] leading-[1.65] text-[#D6E4EE] mb-9 max-w-[560px]">
              We exist to preach the gospel, disciple believers, raise leaders and serve our communities — locally in our city and across the mission field.
            </p>
            <div className="flex gap-[14px] flex-wrap">
              <Link href="/about" className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[30px] py-[15px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
                Learn More
              </Link>
              <Link href="/donate" className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[30px] py-[15px] rounded-md border-[1.5px] border-[#D4AF37] text-white hover:bg-[rgba(212,175,55,.16)] transition-colors">
                Donate
              </Link>
              <Link href="/events" className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[30px] py-[15px] rounded-md border-[1.5px] border-[rgba(255,255,255,.4)] text-white hover:border-white transition-colors">
                Upcoming Events
              </Link>
              <Link href="/contact" className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[30px] py-[15px] rounded-md border-[1.5px] border-[rgba(255,255,255,.4)] text-white hover:border-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white border-b border-[#EFE7D8]">
        <div className="max-w-[1200px] mx-auto px-7 py-16">
          <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-[18px]">
            Our Mission
          </div>
          <p className="font-[family-name:var(--font-montserrat)] font-medium italic text-[29px] leading-[1.42] text-[#0A3D62] mb-[26px] max-w-[760px]">
            &ldquo;To awaken every generation to the person of Jesus Christ — through Spirit-filled worship, sound teaching, compassionate outreach and the raising of leaders who serve the nations.&rdquo;
          </p>
          <p className="text-[16.5px] leading-[1.75] text-[#4A5561] max-w-[720px]">
            RUACH Global Inc. is a faith-based, non-profit ministry serving members and neighbours through weekly gatherings, youth programs, community outreach and international missions. Whether you are visiting for the first time or partnering with us from another continent, there is a place for you here.
          </p>
        </div>
      </section>

      {/* Upcoming events + Newsletter */}
      <section className="max-w-[1200px] mx-auto px-7 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-14">
          <div>
            <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-3">
              Upcoming
            </div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[34px] text-[#0A3D62] mb-[26px]">
              Next on the calendar
            </h2>

            {events.length === 0 ? (
              <p className="text-[#6B7683] text-[16px]">No upcoming events. Check back soon.</p>
            ) : (
              <div className="grid gap-[14px]">
                {events.map((e) => {
                  const d = new Date(e.date);
                  const month = d.toLocaleString("en-US", { month: "short" });
                  const day = String(d.getDate());
                  const meta = `${e.time} · ${e.location}${e.address ? ", " + e.address : ""}`;
                  return (
                    <div key={e._id} className="bg-white border border-[#EFE7D8] border-l-[3px] border-l-[#D4AF37] rounded-lg px-[26px] py-[22px] grid grid-cols-[78px_1fr_auto] gap-[26px] items-center">
                      <div className="text-center border-r border-[#EFE7D8] pr-5">
                        <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.14em] uppercase text-[#8A7A55]">{month}</div>
                        <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[30px] text-[#0A3D62] leading-[1.1]">{day}</div>
                      </div>
                      <div>
                        <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[19px] text-[#0A3D62] mb-[7px]">{e.title}</div>
                        <div className="text-[14.5px] text-[#6B7683]">{meta}</div>
                      </div>
                      <div className="flex gap-2.5">
                        <Link href="/events" className="font-[family-name:var(--font-montserrat)] font-semibold text-[13px] px-[18px] py-[11px] rounded-md border-[1.5px] border-[#D4AF37] text-[#0A3D62] hover:bg-[#D4AF37] transition-colors">
                          {e.registrationRequired ? "Register" : "View"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <NewsletterWidget />
        </div>
      </section>

      {/* Donation CTA */}
      <section className="bg-[#0A3D62] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-7 py-[78px]">
          <div className="max-w-[660px]">
            <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#D4AF37] mb-4">
              Partner with us
            </div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[40px] leading-[1.16] text-white mb-[18px]">
              Your giving sends the gospel further than you can travel.
            </h2>
            <p className="text-[17px] leading-[1.7] text-[#C6D8E5] mb-[30px]">
              One-time or recurring, designated to the fund of your choice. Receipts are emailed automatically for your records.
            </p>
            <div className="flex gap-[14px] flex-wrap">
              <Link href="/donate" className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[30px] py-[15px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
                Give now
              </Link>
              <Link href="/volunteer" className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[30px] py-[15px] rounded-md border-[1.5px] border-[rgba(255,255,255,.45)] text-white hover:border-white transition-colors">
                Volunteer instead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
