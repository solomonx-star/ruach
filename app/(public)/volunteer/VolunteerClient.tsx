"use client";

import { useState } from "react";
import Link from "next/link";

const interestOptions = ["Ushering", "Worship team", "Media & sound", "Children", "Youth", "Outreach", "Missions", "Hospitality", "Transport"];
const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Event days only"];

const ways = [
  {
    title: "Volunteer",
    desc: "Serve with our team in outreach, worship, media, children, youth, hospitality, and more. Fill out the registration form below.",
    cta: "Register below",
    href: "#volunteer-form",
  },
  {
    title: "Partner with Ruach",
    desc: "Stand with us as a ministry partner — praying, giving, or connecting your networks to support the work God has called us to.",
    cta: "Get in touch",
    href: "/contact",
  },
  {
    title: "Support missions & outreach",
    desc: "Help fund mission trips, community outreach, and evangelism efforts that bring the love of Christ to underserved communities.",
    cta: "Give now",
    href: "/donate",
  },
  {
    title: "Pray with or for us",
    desc: "Submit a prayer request or join our intercessory team. Prayer is the foundation of everything we do.",
    cta: "Send a prayer request",
    href: "/contact#prayer",
  },
  {
    title: "Give financially",
    desc: "Your generosity sends the gospel further. Give one-time or recurring to support the ministry and its global reach.",
    cta: "Donate",
    href: "/donate",
  },
  {
    title: "Receive updates",
    desc: "Stay connected with what God is doing through Ruach Global. Sign up for our newsletter to receive ministry news and prayer points.",
    cta: "Subscribe",
    href: "#newsletter",
  },
];

export default function VolunteerClient() {
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [vDone, setVDone] = useState(false);
  const [vLoading, setVLoading] = useState(false);
  const [vError, setVError] = useState<string | null>(null);
  const [vForm, setVForm] = useState({ name: "", email: "", phone: "", city: "", address: "", skills: "" });

  const [nName, setNName] = useState("");
  const [nEmail, setNEmail] = useState("");
  const [nLoading, setNLoading] = useState(false);
  const [nDone, setNDone] = useState(false);
  const [nError, setNError] = useState<string | null>(null);

  function toggleInterest(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }
  function toggleAvailability(a: string) {
    setAvailability((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  async function submitVolunteer(e: React.FormEvent) {
    e.preventDefault();
    setVLoading(true);
    setVError(null);
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...vForm, interests, availability }),
      });
      if (!res.ok) {
        setVError("Something went wrong. Please try again.");
        return;
      }
      setVDone(true);
    } catch {
      setVError("Unable to submit. Check your connection and try again.");
    } finally {
      setVLoading(false);
    }
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!nName || !nEmail) return;
    setNLoading(true);
    setNError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nName, email: nEmail }),
      });
      if (!res.ok) {
        setNError("Couldn't subscribe. Please try again.");
        return;
      }
      setNDone(true);
    } catch {
      setNError("Couldn't subscribe. Please try again.");
    } finally {
      setNLoading(false);
    }
  }

  const volFields = [
    { label: "Full name", key: "name", placeholder: "First and last name" },
    { label: "Email", key: "email", placeholder: "you@example.com" },
    { label: "Phone", key: "phone", placeholder: "Phone number" },
    { label: "City", key: "city", placeholder: "City" },
  ] as const;

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="flex items-center gap-3 mb-[18px]">
        <span className="w-[34px] h-[2px] bg-[#D4AF37]" />
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55]">Get Involved</span>
      </div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] leading-[1.12] text-[#0A3D62] mb-5 max-w-[700px]">
        There&apos;s a place for you at Ruach Global.
      </h1>
      <p className="text-[17.5px] leading-[1.75] text-[#4A5561] max-w-[680px] mb-14">
        Whether you want to serve, give, pray, or simply stay connected — here are the ways you can be part of what God is doing through this ministry.
      </p>

      {/* Ways to get involved */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
        {ways.map((w) => (
          <div key={w.title} className="border border-[#EFE7D8] rounded-xl p-7 bg-white flex flex-col">
            <div className="w-[38px] h-[3px] bg-[#D4AF37] mb-5 rounded-full" />
            <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[19px] text-[#0A3D62] mb-3">{w.title}</div>
            <p className="text-[14.5px] leading-[1.7] text-[#4A5561] flex-1 mb-6">{w.desc}</p>
            <Link
              href={w.href}
              className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-3 rounded-md border-[1.5px] border-[#D4AF37] text-[#0A3D62] hover:bg-[#D4AF37] transition-colors text-center"
            >
              {w.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Volunteer registration form */}
      <div id="volunteer-form" className="mb-20">
        <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-3">Volunteer</div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[34px] text-[#0A3D62] mb-3">Register to serve</h2>
        <p className="text-[16px] leading-[1.75] text-[#4A5561] mb-8 max-w-[640px]">Tell us where you&apos;d like to serve. A coordinator will follow up within a week.</p>

        <div className="bg-white border border-[#EFE7D8] rounded-lg px-[38px] py-9 pb-10 max-w-[760px]">
          {vDone ? (
            <p className="text-[#0A3D62] font-[family-name:var(--font-montserrat)] font-semibold text-[16px]">Thank you! We&apos;ll be in touch soon.</p>
          ) : (
            <form onSubmit={submitVolunteer}>
              <div className="grid grid-cols-2 gap-[18px] mb-6">
                {volFields.map((f) => (
                  <div key={f.key}>
                    <label htmlFor={`vol-${f.key}`} className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]">{f.label}</label>
                    <input
                      id={`vol-${f.key}`}
                      placeholder={f.placeholder}
                      value={vForm[f.key]}
                      onChange={(e) => setVForm({ ...vForm, [f.key]: e.target.value })}
                      className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label htmlFor="vol-address" className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]">Address</label>
                  <input
                    id="vol-address"
                    placeholder="Street address"
                    value={vForm.address}
                    onChange={(e) => setVForm({ ...vForm, address: e.target.value })}
                    className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <fieldset className="mb-6">
                <legend className="font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[10px]">Areas of interest</legend>
                <div className="flex flex-wrap gap-[9px]">
                  {interestOptions.map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={interests.includes(i)}
                      onClick={() => toggleInterest(i)}
                      className={`text-[13.5px] border rounded-full px-[15px] py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-1 ${interests.includes(i) ? "border-[#D4AF37] bg-[#FDF6E4] text-[#0A3D62]" : "border-[#E6DFD1] bg-[#FBF8F1] text-[#0A3D62] hover:border-[#D4AF37]"}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mb-6">
                <legend className="font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[10px]">Availability</legend>
                <div className="flex border border-[#E6DFD1] rounded-md overflow-hidden w-max">
                  {availabilityOptions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={availability.includes(a)}
                      onClick={() => toggleAvailability(a)}
                      className={`font-[family-name:var(--font-montserrat)] text-[13.5px] px-5 py-[11px] border-r border-[#E6DFD1] last:border-r-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-inset ${availability.includes(a) ? "bg-[#F4EFE4] text-[#0A3D62]" : "bg-[#FBF8F1] text-[#5A6572] hover:bg-[#F4EFE4] hover:text-[#0A3D62]"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mb-7">
                <label htmlFor="vol-skills" className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]">Skills &amp; experience</label>
                <textarea
                  id="vol-skills"
                  placeholder="Music, teaching, media, logistics, nursing, translation…"
                  value={vForm.skills}
                  onChange={(e) => setVForm({ ...vForm, skills: e.target.value })}
                  className="w-full h-24 font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] resize-vertical focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {vError && <p role="alert" className="text-[13.5px] text-red-600 mb-4">{vError}</p>}

              <button
                type="submit"
                disabled={vLoading}
                className="font-[family-name:var(--font-montserrat)] font-semibold text-[14.5px] px-8 py-[15px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60"
              >
                {vLoading ? "Submitting…" : "Submit registration"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Newsletter sign-up */}
      <div id="newsletter" className="bg-[#0A3D62] rounded-xl px-10 py-12">
        <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.18em] uppercase text-[#D4AF37] mb-3">Stay connected</div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-white mb-3">Receive updates from Ruach Global</h2>
        <p className="text-[15.5px] text-[#C6D8E5] mb-8 max-w-[540px]">Get ministry news, prayer points, and event updates delivered to your inbox.</p>
        {nDone ? (
          <p className="text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-semibold text-[15px]">You&apos;re subscribed — thank you!</p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-wrap gap-3 items-end max-w-[560px]">
            <div className="flex-1 min-w-[180px]">
              <label className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Name</label>
              <input
                placeholder="Your name"
                value={nName}
                onChange={(e) => setNName(e.target.value)}
                className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={nEmail}
                onChange={(e) => setNEmail(e.target.value)}
                className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={nLoading}
                className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-7 py-[13px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60"
              >
                {nLoading ? "Signing up…" : "Sign up"}
              </button>
            </div>
            {nError && <p role="alert" className="w-full text-[13px] text-red-300">{nError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
