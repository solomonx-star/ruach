import mongoose, { Schema, model, models } from "mongoose";

export interface IDonation {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  amount: number;
  currency: string;
  purpose: string;
  type: "one-time" | "recurring";
  method: "stripe" | "paypal";
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  receiptSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    purpose: { type: String, required: true },
    type: { type: String, enum: ["one-time", "recurring"], default: "one-time" },
    method: { type: String, enum: ["stripe", "paypal"], required: true },
    stripePaymentIntentId: String,
    paypalOrderId: String,
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    receiptSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Donation = models.Donation ?? model<IDonation>("Donation", DonationSchema);
