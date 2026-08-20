import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import BlogContent from "./BlogContent";

export const metadata: Metadata = { title: "News & Blog" };

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

export default async function BlogPage() {
  let posts: PostItem[] = [];
  try {
    await connectDB();
    const raw = await Post.find({ published: true }).sort({ publishedAt: -1 }).lean();
    posts = JSON.parse(JSON.stringify(raw));
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">News &amp; Blog</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-10">Announcements, mission updates and teaching</h1>
      {posts.length === 0 ? (
        <p className="text-[#6B7683] text-[16px]">No posts yet. Check back soon.</p>
      ) : (
        <BlogContent posts={posts} />
      )}
    </div>
  );
}
