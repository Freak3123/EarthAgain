import mongoose, { Schema, Document, models } from "mongoose";

/* ---------------- Host Schema ---------------- */
/* Backs the public "Host With Us" form at /host-form */
export interface IHost extends Document {
  firstName: string;
  contact: string;
  email: string;
  organisationName?: string;
  organisationType?: string;
  organisationLink?: string;
  activity?: string;
  createdAt: Date;
}

const HostSchema = new Schema<IHost>(
  {
    firstName: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organisationName: { type: String, trim: true },
    organisationType: { type: String, trim: true },
    organisationLink: { type: String, trim: true },
    activity: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

/* ---------------- Exports ---------------- */
export const Host =
  models.Host || mongoose.model<IHost>("Host", HostSchema);
