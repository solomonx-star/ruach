"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface PostItem {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogContent({ posts }: { posts: PostItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const categories = [...new Set(posts.map((p) => p.category))];
  const [featured, ...rest] = filtered;
  const isSearching = query.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
      <div>
        {/* Featured post — hidden while searching */}
        {!isSearching && featured && (
          <Link href={`/blog/${featured.slug}`} className="block bg-white border border-[#EFE7D8] rounded-lg overflow-hidden mb-[30px] hover:border-[#D4AF37] transition-colors">
            {featured.imageUrl ? (
              <div className="relative w-full h-[320px]">
                <Image src={featured.imageUrl} alt={featured.title} fill priority sizes="(max-width: 1024px) 100vw, calc(100vw - 400px)" className="object-cover" />
              </div>
            ) : (
              <div className="h-[320px] bg-[#0A3D62]" />
            )}
            <div className="px-[34px] pt-8 pb-9">
              <div className="flex gap-3 items-center mb-[14px]">
                <span className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#D4AF37]">{featured.category}</span>
                {featured.publishedAt && (
                  <span className="text-[13.5px] text-[#9AA5AF]">
                    {new Date(featured.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
              <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[31px] leading-[1.24] text-[#0A3D62] mb-[14px]">{featured.title}</h2>
              <p className="text-[16.5px] leading-[1.75] text-[#5A6572] mb-[22px]">{featured.excerpt}</p>
              <span className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-[22px] py-3 rounded-md border-[1.5px] border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white transition-colors inline-block">
                Read more
              </span>
            </div>
          </Link>
        )}

        {/* Search results or rest of list */}
        {isSearching && filtered.length === 0 ? (
          <p className="text-[#6B7683] text-[16px]">No results for &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid gap-4">
            {(isSearching ? filtered : rest).map((p) => (
              <Link
                key={p._id}
                href={`/blog/${p.slug}`}
                className="bg-white border border-[#EFE7D8] rounded-lg px-7 py-[26px] grid grid-cols-[1fr_150px] gap-[26px] items-center hover:border-[#D4AF37] transition-colors"
              >
                <div>
                  <div className="flex gap-3 items-center mb-[10px]">
                    <span className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.14em] uppercase text-[#8A7A55]">{p.category}</span>
                    {p.publishedAt && (
                      <span className="text-[13px] text-[#9AA5AF]">
                        {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[20px] leading-[1.35] text-[#0A3D62] mb-2">{p.title}</div>
                  <p className="text-[15px] leading-[1.7] text-[#6B7683]">{p.excerpt}</p>
                </div>
                {p.imageUrl ? (
                  <div className="relative h-[110px] w-full rounded-md overflow-hidden">
                    <Image src={p.imageUrl} alt={p.title} fill sizes="150px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-[110px] bg-[#0A3D62] rounded-md" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="grid gap-[22px]">
        <div className="bg-white border border-[#EFE7D8] rounded-lg px-[26px] py-6">
          <label htmlFor="blog-search" className="block font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8A7A55] mb-3">
            Search
          </label>
          <input
            id="blog-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full font-[family-name:var(--font-open-sans)] text-[14.5px] px-[14px] py-3 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {categories.length > 0 && (
          <div className="bg-white border border-[#EFE7D8] rounded-lg px-[26px] pt-6 pb-7">
            <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#8A7A55] mb-4">Categories</div>
            <div className="grid gap-[11px]">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setQuery(c)}
                  className={`flex justify-between text-[15px] pb-[10px] border-b border-[#F1EADC] text-left transition-colors hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${query === c ? "text-[#0A3D62] font-semibold" : "text-[#2C3641]"}`}
                >
                  <span>{c}</span>
                </button>
              ))}
            </div>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-3 text-[13px] text-[#8A7A55] hover:text-[#0A3D62] transition-colors focus:outline-none focus-visible:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        <div className="bg-[#0A3D62] rounded-lg px-[26px] py-7 text-white">
          <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#D4AF37] mb-3">Prayer wall</div>
          <p className="text-[15px] leading-[1.7] text-[#C6D8E5] mb-[18px]">
            Submit a request — publicly or anonymously — and our intercessors will pray this week.
          </p>
          <Link href="/volunteer#prayer" className="block w-full font-[family-name:var(--font-montserrat)] font-semibold text-[14px] py-[13px] rounded-md border-[1.5px] border-[#D4AF37] text-white text-center hover:bg-[#D4AF37] hover:text-[#0A3D62] transition-colors">
            Send a prayer request
          </Link>
        </div>
      </aside>
    </div>
  );
}
