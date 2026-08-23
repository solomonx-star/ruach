import mongoose, { Schema, model, models } from "mongoose";

export interface IVolunteer {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  interests: string[];
  availability: string[];
  skills?: string;
  status: "pending" | "contacted" | "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    interests: { type: [String], default: [] },
    availability: { type: [String], default: [] },
    skills: String,
    status: { type: String, enum: ["pending", "contacted", "active", "inactive"], default: "pending" },
  },
  { timestamps: true }
);

export const Volunteer = models.Volunteer ?? model<IVolunteer>("Volunteer", VolunteerSchema);
