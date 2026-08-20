import mongoose, { Schema, model, models } from "mongoose";

export interface IGalleryItem {
  _id: mongoose.Types.ObjectId;
  title: string;
  caption?: string;
  url: string;
  publicId: string;
  type: "photo" | "video";
  category: string;
  eventTag?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true },
    caption: String,
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ["photo", "video"], default: "photo" },
    category: { type: String, default: "General" },
    eventTag: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GalleryItem = models.GalleryItem ?? model<IGalleryItem>("GalleryItem", GalleryItemSchema);
