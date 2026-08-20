import type { Metadata } from "next";
import AdminNewsletterClient from "./AdminNewsletterClient";

export const metadata: Metadata = { title: "Newsletter — Admin" };

export default function AdminNewsletterPage() {
  return <AdminNewsletterClient />;
}
