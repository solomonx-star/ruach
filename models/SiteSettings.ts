import mongoose, { Schema, models } from "mongoose";

export interface ISiteSettings {
  _id: string;
  heroImageUrl?: string;
  heroImagePublicId?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    _id: { type: String },
    heroImageUrl: { type: String },
    heroImagePublicId: { type: String },
  },
  { _id: false }
);

export const SiteSettings =
  models.SiteSettings ?? mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
