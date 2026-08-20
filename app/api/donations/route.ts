import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Donation } from "@/models/Donation";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().default("usd"),
  purpose: z.string().min(1),
  type: z.enum(["one-time", "recurring"]),
  method: z.enum(["stripe", "paypal"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await connectDB();

    if (data.method === "stripe") {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100),
        currency: data.currency,
        metadata: { purpose: data.purpose, type: data.type, name: data.name, email: data.email },
      });

      const donation = await Donation.create({
        ...data,
        amount: Math.round(data.amount * 100),
        stripePaymentIntentId: intent.id,
        status: "pending",
      });

      return NextResponse.json({ clientSecret: intent.client_secret, donationId: donation._id });
    }

    return NextResponse.json({ error: "Unsupported method" }, { status: 400 });
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
  const donations = await Donation.find().sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(donations);
}
