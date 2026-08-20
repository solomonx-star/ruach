import type { Metadata } from "next";
import VolunteerClient from "./VolunteerClient";

export const metadata: Metadata = { title: "Volunteer & Prayer" };

export default function VolunteerPage() {
  return <VolunteerClient />;
}
