import type { Metadata } from "next";
import AdminPrayersClient from "./AdminPrayersClient";

export const metadata: Metadata = { title: "Prayer Requests — Admin" };

export default function AdminPrayersPage() {
  return <AdminPrayersClient />;
}
