import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/ogg"];
const ALLOWED_RAW = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "ruach";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File exceeds 50 MB limit" }, { status: 413 });

  const mime = file.type;
  let resourceType: "image" | "video" | "raw";
  if (ALLOWED_IMAGE.includes(mime)) resourceType = "image";
  else if (ALLOWED_VIDEO.includes(mime)) resourceType = "video";
  else if (ALLOWED_RAW.includes(mime)) resourceType = "raw";
  else return NextResponse.json({ error: "File type not allowed" }, { status: 415 });

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadToCloudinary(buffer, folder, resourceType);
    return NextResponse.json({ url: result.url, publicId: result.publicId, bytes: result.bytes });
  } catch {
    return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
  }
}
