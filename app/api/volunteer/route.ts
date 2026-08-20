import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Volunteer } from "@/models/Volunteer";
import { sendVolunteerNotification } from "@/lib/email";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  interests: z.array(z.string()).default([]),
  availability: z.array(z.string()).default([]),
  skills: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await connectDB();
    await Volunteer.create(data);
    await sendVolunteerNotification(data).catch(console.error);

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
  const volunteers = await Volunteer.find().sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(volunteers);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  await connectDB();
  await Volunteer.findByIdAndUpdate(id, { status });
  return NextResponse.json({ ok: true });
}
