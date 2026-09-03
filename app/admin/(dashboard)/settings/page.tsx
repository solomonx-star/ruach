import type { Metadata } from "next";
import AdminSettingsClient from "./AdminSettingsClient";

export const metadata: Metadata = { title: "Site Settings — Admin" };

export default function SettingsPage() {
  return <AdminSettingsClient />;
}
