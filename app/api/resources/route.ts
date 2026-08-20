import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Resource } from "@/models/Resource";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  note: z.string().optional(),
  type: z.string().min(1),
  fileUrl: z.string().url(),
  publicId: z.string().min(1),
  fileSize: z.string().optional(),
  category: z.string().default("General"),
  published: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");
  if (all) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const query = all ? {} : { published: true };
  const resources = await Resource.find(query).sort({ createdAt: -1 });
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const resource = await Resource.create(data);
    return NextResponse.json(resource, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
