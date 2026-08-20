import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "editor", "volunteer-coordinator", "content-manager", "visitor"]).default("visitor"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Only admins can assign privileged roles; self-registration is visitor-only
    if (data.role !== "visitor") {
      const session = await auth();
      const callerRole = (session?.user as { role?: string } | undefined)?.role;
      if (callerRole !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await connectDB();
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashed });

    return NextResponse.json({ id: user._id, name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
