import mongoose, { Schema, model, models } from "mongoose";

export interface IResource {
  _id: mongoose.Types.ObjectId;
  title: string;
  note?: string;
  type: string;
  fileUrl: string;
  publicId: string;
  fileSize?: string;
  category: string;
  published: boolean;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    note: String,
    type: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileSize: String,
    category: { type: String, default: "General" },
    published: { type: Boolean, default: false },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Resource = models.Resource ?? model<IResource>("Resource", ResourceSchema);
