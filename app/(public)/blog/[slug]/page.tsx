import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";

export const metadata: Metadata = { title: "Blog Post" };

interface PostDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  publishedAt?: string;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: PostDetail | null = null;
  try {
    await connectDB();
    const raw = await Post.findOne({ slug, published: true }).lean();
    post = raw ? JSON.parse(JSON.stringify(raw)) : null;
  } catch {
    // DB unavailable
  }

  if (!post) {
    return (
      <div className="max-w-[860px] mx-auto px-7 py-16 pb-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#8A7A55] text-[14px] font-[family-name:var(--font-montserrat)] mb-8 hover:text-[#0A3D62] transition-colors">
          ← Back to Blog
        </Link>
        <p className="text-[#6B7683] text-[16px]">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto px-7 py-16 pb-6">
      <Link href="/blog" className="inline-flex items-center gap-2 text-[#8A7A55] text-[14px] font-[family-name:var(--font-montserrat)] mb-8 hover:text-[#0A3D62] transition-colors">
        ← Back to Blog
      </Link>
      <div className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.16em] uppercase text-[#D4AF37] mb-3">{post.category}</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[40px] leading-[1.15] text-[#0A3D62] mb-4">
        {post.title}
      </h1>
      <div className="flex gap-[18px] text-[14px] text-[#9AA5AF] mb-8">
        <span>{post.author}</span>
        {post.publishedAt && (
          <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
        )}
      </div>
      {post.imageUrl && (
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
          <Image src={post.imageUrl} alt={post.title} fill priority sizes="(max-width: 860px) 100vw, 860px" className="object-cover" />
        </div>
      )}
      <div
        className="prose max-w-none text-[#4A5561] leading-[1.8] text-[17px]"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    </div>
  );
}
