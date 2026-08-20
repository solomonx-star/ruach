import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { GalleryItem } from "@/models/GalleryItem";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  caption: z.string().optional(),
  url: z.string().url(),
  publicId: z.string().min(1),
  type: z.enum(["photo", "video"]).default("photo"),
  category: z.string().default("General"),
  eventTag: z.string().optional(),
  order: z.number().default(0),
  published: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");
  if (all) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  await connectDB();
  const query: Record<string, unknown> = all ? {} : { published: true };
  if (type) query.type = type;
  if (category && category !== "All") query.category = category;
  const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const item = await GalleryItem.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
