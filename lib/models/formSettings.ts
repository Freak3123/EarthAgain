import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Singleton document controlling whether public submission forms accept
 * entries. `masterLive` is a site-wide override: a form only accepts
 * submissions when masterLive AND its own per-category flag are both true.
 */
export interface IFormSettings extends Document {
  masterLive: boolean;
  registration: boolean;
  volunteer: boolean;
  partner: boolean;
  chapter: boolean;
  panchayat: boolean;
}

const formSettingsSchema = new Schema<IFormSettings>(
  {
    masterLive: { type: Boolean, default: true },
    registration: { type: Boolean, default: true },
    volunteer: { type: Boolean, default: true },
    partner: { type: Boolean, default: true },
    chapter: { type: Boolean, default: true },
    panchayat: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FormSettings: Model<IFormSettings> =
  mongoose.models.FormSettings ||
  mongoose.model<IFormSettings>("FormSettings", formSettingsSchema);
