"use client";

export default function UtilityBar() {
  return (
    <div className="bg-[#072A44] text-[#CFE0EC] text-[13px] py-[9px] hidden md:block">
      <div className="max-w-[1200px] mx-auto px-7 flex items-center justify-between gap-5">
        <span className="text-[#8FB0C6] text-[12px]">Sunday services: 9:00 am &amp; 11:00 am</span>
        <a href="mailto:admin@ruachglobal.org" className="text-[#8FB0C6] hover:text-[#D4AF37] transition-colors text-[12px]">
          admin@ruachglobal.org
        </a>
      </div>
    </div>
  );
}
