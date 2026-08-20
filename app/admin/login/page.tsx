import type { Metadata } from "next";
import AdminLoginClient from "./AdminLoginClient";

export const metadata: Metadata = { title: "Admin Login | RUACH Global" };

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
