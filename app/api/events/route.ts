import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
  endDate: z.string().optional(),
  time: z.string().min(1),
  location: z.string().min(1),
  address: z.string().optional(),
  category: z.string().default("General"),
  imageUrl: z.string().optional(),
  flyerUrl: z.string().optional(),
  registrationRequired: z.boolean().default(false),
  registrationUrl: z.string().optional(),
  googleMapsUrl: z.string().optional(),
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
  const events = await Event.find(query).sort({ date: 1 });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const event = await Event.create({ ...data, date: new Date(data.date) });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
