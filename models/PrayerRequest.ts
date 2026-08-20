import mongoose, { Schema, model, models } from "mongoose";

export interface IPrayerRequest {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  request: string;
  anonymous: boolean;
  prayed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrayerRequestSchema = new Schema<IPrayerRequest>(
  {
    name: String,
    email: String,
    request: { type: String, required: true },
    anonymous: { type: Boolean, default: false },
    prayed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PrayerRequest = models.PrayerRequest ?? model<IPrayerRequest>("PrayerRequest", PrayerRequestSchema);
