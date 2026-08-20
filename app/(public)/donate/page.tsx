import type { Metadata } from "next";
import DonateClient from "./DonateClient";

export const metadata: Metadata = { title: "Give" };

export default function DonatePage() {
  return <DonateClient />;
}
