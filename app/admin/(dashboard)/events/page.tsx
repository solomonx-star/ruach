import type { Metadata } from "next";
import AdminEventsClient from "./AdminEventsClient";

export const metadata: Metadata = { title: "Events — Admin" };

export default function AdminEventsPage() {
  return <AdminEventsClient />;
}
