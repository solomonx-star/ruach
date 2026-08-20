import mongoose, { Schema, model, models } from "mongoose";

export interface IPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: String,
    author: { type: String, required: true },
    published: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

export const Post = models.Post ?? model<IPost>("Post", PostSchema);
