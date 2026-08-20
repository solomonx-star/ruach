import mongoose, { Schema, model, models } from "mongoose";

export type UserRole = "admin" | "editor" | "volunteer-coordinator" | "content-manager" | "visitor";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["admin", "editor", "volunteer-coordinator", "content-manager", "visitor"], default: "visitor" },
    image: String,
    emailVerified: Date,
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);
