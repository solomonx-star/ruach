import mongoose, { Schema, model, models } from "mongoose";

export interface IEvent {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  time: string;
  location: string;
  address?: string;
  category: string;
  imageUrl?: string;
  flyerUrl?: string;
  registrationRequired: boolean;
  registrationUrl?: string;
  googleMapsUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: Date,
    time: { type: String, required: true },
    location: { type: String, required: true },
    address: String,
    category: { type: String, default: "General" },
    imageUrl: String,
    flyerUrl: String,
    registrationRequired: { type: Boolean, default: false },
    registrationUrl: String,
    googleMapsUrl: String,
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Event = models.Event ?? model<IEvent>("Event", EventSchema);
