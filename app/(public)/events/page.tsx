import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import EventsClient from "./EventsClient";

export const metadata: Metadata = { title: "Events" };

interface EventItem {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  address?: string;
  imageUrl?: string;
  flyerUrl?: string;
  registrationRequired: boolean;
  registrationUrl?: string;
  googleMapsUrl?: string;
}

export default async function EventsPage() {
  let events: EventItem[] = [];
  try {
    await connectDB();
    const raw = await Event.find({ published: true }).sort({ date: 1 }).lean();
    events = JSON.parse(JSON.stringify(raw));
  } catch {
    // DB unavailable — render empty state
  }
  return <EventsClient initialEvents={events} />;
}
