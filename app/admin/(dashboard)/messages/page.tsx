import type { Metadata } from "next";
import AdminMessagesClient from "./AdminMessagesClient";

export const metadata: Metadata = { title: "Messages — Admin" };

export default function AdminMessagesPage() {
  return <AdminMessagesClient />;
}
