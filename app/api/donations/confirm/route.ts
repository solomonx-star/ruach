import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Donation } from "@/models/Donation";
import { z } from "zod";

const schema = z.object({
  paymentIntentId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().default("usd"),
  purpose: z.string().min(1),
  type: z.enum(["one-time", "recurring"]),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    await Donation.create({
      name: data.name,
      email: data.email,
      amount: Math.round(data.amount * 100),
      currency: data.currency,
      purpose: data.purpose,
      type: data.type,
      method: "stripe",
      stripePaymentIntentId: data.paymentIntentId,
      status: "pending",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
