import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { GalleryItem } from "@/models/GalleryItem";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = { title: "Gallery" };

interface GalleryItemData {
  _id: string;
  title: string;
  caption?: string;
  url: string;
  type: "photo" | "video";
  category: string;
}

export default async function GalleryPage() {
  let items: GalleryItemData[] = [];
  try {
    await connectDB();
    const raw = await GalleryItem.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
    items = JSON.parse(JSON.stringify(raw));
  } catch {
    // DB unavailable — render empty state
  }
  return <GalleryClient initialItems={items} />;
}
