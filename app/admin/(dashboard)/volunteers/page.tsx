import type { Metadata } from "next";
import AdminVolunteersClient from "./AdminVolunteersClient";

export const metadata: Metadata = { title: "Volunteers — Admin" };

export default function AdminVolunteersPage() {
  return <AdminVolunteersClient />;
}
