"use client";

import { useState } from "react";
import Image from "next/image";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface EventItem {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  address?: string;
  imageUrl?: string;
  flyerUrl?: string;
  registrationRequired: boolean;
  registrationUrl?: string;
  googleMapsUrl?: string;
}

function buildCalendarCells(year: number, month: number, today: Date, events: EventItem[]) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : -1;

  const eventsByDay: Record<number, string[]> = {};
  events.forEach((e) => {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e.title);
    }
  });

  const cells: { day: string; label: string; hasEvent: boolean; isToday: boolean }[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: "", label: "", hasEvent: false, isToday: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const labels = eventsByDay[day] ?? [];
    cells.push({ day: String(day), label: labels[0] ?? "", hasEvent: labels.length > 0, isToday: day === todayDay });
  }
  return cells;
}

function RegisterLink({ event, size = "md" }: { event: EventItem; size?: "sm" | "md" }) {
  if (!event.registrationRequired) return null;
  const href = event.registrationUrl || "/contact";
  const label = event.registrationUrl ? "Register" : "Register (contact us)";
  const cls =
    size === "sm"
      ? "font-[family-name:var(--font-montserrat)] font-semibold text-[13px] px-[18px] py-[11px] rounded-md border-[1.5px] border-[#D4AF37] text-[#0A3D62] hover:bg-[#D4AF37] transition-colors"
      : "font-[family-name:var(--font-montserrat)] font-semibold text-[14px] py-[13px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors text-center block";
  return (
    <a href={href} target={event.registrationUrl ? "_blank" : undefined} rel={event.registrationUrl ? "noopener noreferrer" : undefined} className={cls}>
      {label}
    </a>
  );
}

export default function EventsClient({ initialEvents }: { initialEvents: EventItem[] }) {
  const events = initialEvents;

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const upcoming = events.filter((e) => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events.filter((e) => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featured = upcoming[0] ?? null;

  const cells = buildCalendarCells(calYear, calMonth, now, events);
  const monthLabel = new Date(calYear, calMonth).toLocaleString("en-US", { month: "long", year: "numeric" });

  function prevMonth() {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Events</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-10">What&apos;s coming up</h1>

      {events.length === 0 ? (
        <p className="text-[#6B7683] text-[16px]">No events at this time. Check back soon.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Calendar */}
            <div className="bg-white border border-[#EFE7D8] rounded-lg px-8 py-[30px]">
              <div className="flex items-center justify-between mb-[22px]">
                <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[22px] text-[#0A3D62]">{monthLabel}</div>
                <div className="flex gap-2">
                  <button onClick={prevMonth} aria-label="Previous month" className="w-[34px] h-[34px] rounded-md border border-[#DDD5C5] text-[#0A3D62] hover:border-[#0A3D62] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">‹</button>
                  <button onClick={nextMonth} aria-label="Next month" className="w-[34px] h-[34px] rounded-md border border-[#DDD5C5] text-[#0A3D62] hover:border-[#0A3D62] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">›</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-[6px] mb-2">
                {weekdays.map((d) => (
                  <div key={d} className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#9AA5AF] text-center pb-[6px]">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-[6px]">
                {cells.map((c, i) => (
                  <div
                    key={i}
                    className={`min-h-[74px] rounded-md border p-2 ${c.isToday ? "bg-[#EBF4FB] border-[#0A3D62] ring-1 ring-[#0A3D62]" : c.hasEvent ? "bg-[#FDF6E4] border-[#D4AF37]" : "bg-white border-[#F1EADC]"}`}
                  >
                    <div className={`font-[family-name:var(--font-montserrat)] text-[13px] font-medium ${c.day ? (c.isToday ? "text-[#0A3D62] font-bold" : c.hasEvent ? "text-[#0A3D62]" : "text-[#6B7683]") : "text-[#DDD5C5]"}`}>
                      {c.day}
                    </div>
                    {c.label && <div className="text-[11.5px] leading-[1.35] text-[#0A3D62] mt-1 truncate">{c.label}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="grid gap-[22px]">
              {/* Featured event */}
              {featured ? (
                <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
                  {featured.imageUrl ? (
                    <div className="relative w-full h-[190px]">
                      <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-[190px] bg-[#0A3D62]" />
                  )}
                  <div className="px-[26px] pt-6 pb-7">
                    <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#D4AF37] mb-[10px]">Featured</div>
                    <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[21px] text-[#0A3D62] mb-3">{featured.title}</div>
                    <div className="grid gap-[7px] text-[14.5px] text-[#5A6572] mb-[18px]">
                      <div>{new Date(featured.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" })}</div>
                      <div>{featured.time}</div>
                      {featured.location && <div>{featured.location}{featured.address ? `, ${featured.address}` : ""}</div>}
                    </div>
                    {featured.googleMapsUrl && (
                      <div className="h-[150px] rounded-md border border-[#E6DFD1] bg-gradient-to-b from-[#F4EFE4] to-[#EDE6D7] grid place-items-center text-[#8A7A55] text-[13.5px] mb-[18px]">
                        <a href={featured.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A3D62] transition-colors">View on Google Maps</a>
                      </div>
                    )}
                    <div className="grid gap-2.5">
                      <RegisterLink event={featured} size="md" />
                      {featured.flyerUrl && (
                        <a href={featured.flyerUrl} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-montserrat)] font-medium text-[14px] py-[13px] rounded-md border border-[#DDD5C5] text-[#5A6572] hover:border-[#0A3D62] hover:text-[#0A3D62] transition-colors text-center block">
                          Download flyer (PDF)
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#EFE7D8] rounded-lg px-[26px] py-7">
                  <p className="text-[15px] text-[#6B7683]">No upcoming events at this time.</p>
                </div>
              )}

              {/* Past events */}
              {past.length > 0 && (
                <div className="bg-white border border-[#EFE7D8] rounded-lg px-7 py-[26px]">
                  <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8A7A55] mb-4">Past events</div>
                  <div className="grid gap-[14px]">
                    {past.slice(0, 4).map((e) => (
                      <div key={e._id} className="flex justify-between gap-4 pb-[13px] border-b border-[#F1EADC]">
                        <div className="text-[15px] text-[#2C3641]">{e.title}</div>
                        <div className="text-[13.5px] text-[#9AA5AF] whitespace-nowrap">
                          {new Date(e.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* All upcoming events */}
          {upcoming.length > 0 && (
            <div className="mt-12">
              <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62] mb-[22px]">All upcoming events</h2>
              <div className="grid gap-[14px]">
                {upcoming.map((e) => {
                  const d = new Date(e.date);
                  const month = d.toLocaleString("en-US", { month: "short" });
                  const day = String(d.getDate());
                  return (
                    <div key={e._id} className="bg-white border border-[#EFE7D8] border-l-[3px] border-l-[#D4AF37] rounded-lg px-[26px] py-[22px] grid grid-cols-[78px_1fr_auto] gap-[26px] items-center">
                      <div className="text-center border-r border-[#EFE7D8] pr-5">
                        <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.14em] uppercase text-[#8A7A55]">{month}</div>
                        <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[30px] text-[#0A3D62] leading-[1.1]">{day}</div>
                      </div>
                      <div>
                        <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[19px] text-[#0A3D62] mb-[7px]">{e.title}</div>
                        <div className="text-[14.5px] text-[#6B7683]">{e.time} · {e.location}{e.address ? `, ${e.address}` : ""}</div>
                      </div>
                      <div className="flex gap-2.5">
                        <RegisterLink event={e} size="sm" />
                        {e.flyerUrl && (
                          <a href={e.flyerUrl} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-montserrat)] font-medium text-[13px] px-4 py-[11px] rounded-md border border-[#DDD5C5] text-[#5A6572] hover:border-[#0A3D62] hover:text-[#0A3D62] transition-colors">
                            Flyer (PDF)
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
