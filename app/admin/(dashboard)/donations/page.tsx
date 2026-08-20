import type { Metadata } from "next";
import AdminDonationsClient from "./AdminDonationsClient";

export const metadata: Metadata = { title: "Donations — Admin" };

export default function AdminDonationsPage() {
  return <AdminDonationsClient />;
}
