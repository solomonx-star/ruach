import mongoose, { Schema, model, models } from "mongoose";

export interface ISubscriber {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subscriber = models.Subscriber ?? model<ISubscriber>("Subscriber", SubscriberSchema);
