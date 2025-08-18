import mongoose, { Schema, Document, models } from "mongoose";

/* ---------------- Volunteer Schema ---------------- */
export interface IVolunteer extends Document {
  name: string;
  email: string;
  phone: string;
  age: string;
  skills: string[];
  availability: string;
  createdAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: {
      type: String,
      required: true,
      enum: ["under-18", "18-25", "26-35", "36-50", "above-50"],
    },
    skills: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      required: true,
      enum: [
        "few-hours-week",
        "few-hours-month",
        "weekends",
        "flexible",
        "full-time",
      ],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

/* ---------------- Partner Schema ---------------- */
export interface IPartner extends Document {
  organizationName: string;
  organizationType: string;
  description: string;
  contactName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;
  partnershipTypes: string[];
  proposal: string;
  createdAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    organizationName: { type: String, required: true, trim: true },
    organizationType: {
      type: String,
      required: true,
      enum: [
        "ngo",
        "corporate",
        "educational",
        "government",
        "media",
        "other",
      ],
    },
    description: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    contactDesignation: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    partnershipTypes: { type: [String], default: [] },
    proposal: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

/* ---------------- Exports ---------------- */
export const Volunteer =
  models.Volunteer || mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);

export const Partner =
  models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);
