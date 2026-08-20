import type { Metadata } from "next";
import AdminGalleryClient from "./AdminGalleryClient";

export const metadata: Metadata = { title: "Gallery — Admin" };

export default function AdminGalleryPage() {
  return <AdminGalleryClient />;
}
