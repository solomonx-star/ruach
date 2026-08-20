import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import { Donation } from "@/models/Donation";
import { sendDonationReceipt } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    await connectDB();
    const donation = await Donation.findOneAndUpdate(
      { stripePaymentIntentId: intent.id },
      { status: "completed" },
      { new: true }
    );
    if (donation && !donation.receiptSent) {
      await sendDonationReceipt({
        to: donation.email,
        name: donation.name,
        amount: donation.amount,
        currency: donation.currency,
        purpose: donation.purpose,
        type: donation.type,
      }).catch(console.error);
      await Donation.findByIdAndUpdate(donation._id, { receiptSent: true });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    await connectDB();
    await Donation.findOneAndUpdate(
      { stripePaymentIntentId: intent.id },
      { status: "failed" }
    );
  }

  return NextResponse.json({ received: true });
}
