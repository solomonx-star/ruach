import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().optional(),
  author: z.string().min(1),
  published: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");
  if (published !== "true") {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const query = published === "true" ? { published: true } : {};
  const posts = await Post.find(query).sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const slug = slugify(data.title);
    const post = await Post.create({
      ...data,
      slug,
      publishedAt: data.published ? new Date() : undefined,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
