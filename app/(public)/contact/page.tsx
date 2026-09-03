import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = { title: "Contact — RUACH Global Inc." };

export default function ContactPage() {
  return <ContactClient />;
}
