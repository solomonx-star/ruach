import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/models/Subscriber";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await connectDB();
    await Subscriber.updateOne(
      { email: data.email.toLowerCase() },
      { $set: { name: data.name, active: true } },
      { upsert: true }
    );

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
  const subscribers = await Subscriber.find({ active: true }).sort({ createdAt: -1 });
  return NextResponse.json(subscribers);
}
