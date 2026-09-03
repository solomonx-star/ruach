import type { Metadata } from "next";
import VolunteerClient from "./VolunteerClient";

export const metadata: Metadata = { title: "Get Involved — RUACH Global Inc." };

export default function VolunteerPage() {
  return <VolunteerClient />;
}
