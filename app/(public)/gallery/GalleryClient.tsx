"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  title: string;
  caption?: string;
  url: string;
  type: "photo" | "video";
  category: string;
}

export default function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const items = initialItems;
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const photos = items.filter((i) => i.type === "photo");
  const videos = items.filter((i) => i.type === "video");
  const categories = ["All", ...new Set(photos.map((i) => i.category))];
  const filteredPhotos = filter === "All" ? photos : photos.filter((i) => i.category === filter);

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Gallery</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-7">Photos &amp; video</h1>

      {items.length === 0 ? (
        <p className="text-[#6B7683] text-[16px]">No gallery items yet. Check back soon.</p>
      ) : (
        <>
          {/* Filters */}
          {categories.length > 1 && (
            <div className="flex gap-2.5 flex-wrap mb-[30px]">
              {categories.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-[family-name:var(--font-montserrat)] text-[13.5px] font-medium px-[18px] py-2.5 rounded-full border transition-colors ${
                    filter === f
                      ? "bg-[#0A3D62] border-[#0A3D62] text-white"
                      : "border-[#DDD5C5] text-[#5A6572] hover:border-[#0A3D62] hover:text-[#0A3D62]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Photo grid */}
          {filteredPhotos.length > 0 && (
            <div className="grid grid-cols-3 auto-rows-[196px] gap-[14px] mb-[52px]">
              {filteredPhotos.map((g) => (
                <button
                  key={g._id}
                  type="button"
                  onClick={() => setLightbox(g)}
                  aria-label={`View ${g.caption ?? g.title}`}
                  className="relative bg-[#0A3D62] rounded-lg overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
                >
                  <Image src={g.url} alt={g.caption ?? g.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Video gallery */}
          {videos.length > 0 && (
            <>
              <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62] mb-5">Video gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {videos.map((v) => (
                  <div key={v._id} className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
                    <div className="relative h-[180px]">
                      <Image src={v.url} alt={v.caption ?? v.title} fill className="object-cover" />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="w-14 h-14 rounded-full border-[1.5px] border-[#D4AF37] bg-[rgba(7,42,68,.6)] grid place-items-center text-[#D4AF37] text-[18px]">
                          ▶
                        </div>
                      </div>
                    </div>
                    <div className="px-[22px] pt-5 pb-6">
                      <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[17px] text-[#0A3D62]">{v.title}</div>
                      {v.caption && <div className="text-[13.5px] text-[#8A7A55] mt-1">{v.caption}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption ?? lightbox.title}
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => { if (e.key === "Escape") setLightbox(null); }}
          tabIndex={-1}
          className="fixed inset-0 z-[80] bg-[rgba(7,42,68,.92)] grid place-items-center p-14 outline-none"
        >
          <div className="w-full max-w-[1020px] bg-[#0A3D62] border border-[#2D5E80] rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[560px]">
              <Image src={lightbox.url} alt={lightbox.caption ?? lightbox.title} fill className="object-cover" />
            </div>
            <div className="px-6 py-[18px] flex justify-between items-center text-[#D6E4EE] text-[14px]">
              <span>{lightbox.caption ?? lightbox.title}</span>
              <button type="button" onClick={() => setLightbox(null)} className="text-[#8FB0C6] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
                Press Esc or click to close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
