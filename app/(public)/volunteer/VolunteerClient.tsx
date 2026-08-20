"use client";

import { useState } from "react";

const interestOptions = ["Ushering", "Worship team", "Media & sound", "Children", "Youth", "Outreach", "Missions", "Hospitality", "Transport"];
const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Event days only"];

export default function VolunteerClient() {
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [anon, setAnon] = useState(false);
  const [vDone, setVDone] = useState(false);
  const [pDone, setPDone] = useState(false);
  const [vLoading, setVLoading] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [vError, setVError] = useState<string | null>(null);
  const [pError, setPError] = useState<string | null>(null);

  const [vForm, setVForm] = useState({ name: "", email: "", phone: "", city: "", address: "", skills: "" });
  const [pForm, setPForm] = useState({ name: "", email: "", request: "" });

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

  async function submitPrayer(e: React.FormEvent) {
    e.preventDefault();
    setPLoading(true);
    setPError(null);
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pForm, anonymous: anon }),
      });
      if (!res.ok) {
        setPError("Something went wrong. Please try again.");
        return;
      }
      setPDone(true);
    } catch {
      setPError("Unable to send. Check your connection and try again.");
    } finally {
      setPLoading(false);
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
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Get Involved</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-10" id="volunteer">
        Serve with us, or let us pray with you
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-[34px] items-start">
        {/* Volunteer form */}
        <div className="bg-white border border-[#EFE7D8] rounded-lg px-[38px] py-9 pb-10">
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[26px] text-[#0A3D62] mb-2">Volunteer registration</h2>
          <p className="text-[15.5px] leading-[1.7] text-[#6B7683] mb-7">Tell us where you would like to serve. A coordinator will follow up within a week.</p>

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

        {/* Prayer */}
        <div className="bg-[#0A3D62] rounded-lg px-8 py-[34px] pb-[38px] text-white" id="prayer">
          <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.18em] uppercase text-[#D4AF37] mb-[14px]">Prayer Request</div>
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[24px] mb-[10px]">We will pray with you</h2>
          <p className="text-[14.5px] leading-[1.7] text-[#C6D8E5] mb-6">Requests go only to our intercessory team. Submit anonymously if you prefer.</p>

          {pDone ? (
            <p className="text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-semibold">Your request has been received. We are praying.</p>
          ) : (
            <form onSubmit={submitPrayer} className="grid gap-3">
              <div>
                <label htmlFor="prayer-name" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Name</label>
                <input
                  id="prayer-name"
                  placeholder="Optional"
                  value={pForm.name}
                  onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                  className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label htmlFor="prayer-email" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Email</label>
                <input
                  id="prayer-email"
                  type="email"
                  placeholder="you@example.com"
                  value={pForm.email}
                  onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
                  className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label htmlFor="prayer-request" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.1em] uppercase text-[#8FB0C6] mb-1.5">Your request</label>
                <textarea
                  id="prayer-request"
                  placeholder="Share what's on your heart…"
                  value={pForm.request}
                  onChange={(e) => setPForm({ ...pForm, request: e.target.value })}
                  className="w-full h-[118px] font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-[13px] rounded-md border border-[#2D5E80] bg-[#072A44] text-white placeholder:text-[#8FB0C6] resize-vertical focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <label className="flex items-center gap-[11px] cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={anon}
                  onChange={(e) => setAnon(e.target.checked)}
                  className="sr-only"
                />
                <span aria-hidden="true" className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[#D4AF37] grid place-items-center shrink-0 text-[#0A3D62] text-[12px] ${anon ? "bg-[#D4AF37]" : "bg-transparent"}`}>
                  {anon ? "✓" : ""}
                </span>
                <span className="text-[14.5px] text-[#D6E4EE]">Submit anonymously</span>
              </label>
              {pError && <p role="alert" className="text-[13px] text-red-300">{pError}</p>}
              <button
                type="submit"
                disabled={pLoading}
                className="font-[family-name:var(--font-montserrat)] font-semibold text-[14px] py-[14px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors mt-1 disabled:opacity-60"
              >
                {pLoading ? "Sending…" : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
