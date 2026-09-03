import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { z } from "zod";

const SETTINGS_ID = "global";

const schema = z.object({
  heroImageUrl: z.string().url().optional(),
  heroImagePublicId: z.string().optional(),
});

export async function GET() {
  await connectDB();
  const settings = await SiteSettings.findById(SETTINGS_ID).lean();
  return NextResponse.json(settings ?? {});
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const settings = await SiteSettings.findByIdAndUpdate(
      SETTINGS_ID,
      { $set: data },
      { upsert: true, new: true }
    );
    return NextResponse.json(settings);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
