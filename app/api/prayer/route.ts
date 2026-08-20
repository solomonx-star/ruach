import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { PrayerRequest } from "@/models/PrayerRequest";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  request: z.string().min(5),
  anonymous: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await connectDB();
    await PrayerRequest.create(data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const requests = await PrayerRequest.find().sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(requests);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, prayed } = await req.json();
  await connectDB();
  await PrayerRequest.findByIdAndUpdate(id, { prayed });
  return NextResponse.json({ ok: true });
}
