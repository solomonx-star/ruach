import type { Metadata } from "next";
import AdminResourcesClient from "./AdminResourcesClient";

export const metadata: Metadata = { title: "Resources — Admin" };

export default function AdminResourcesPage() {
  return <AdminResourcesClient />;
}
