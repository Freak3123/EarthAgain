import mongoose, { Schema, Document, models } from "mongoose";

/* ---------------- Chapter Schema ---------------- */
export interface IChapter extends Document {
  name: string;
  phone: string;
  email: string;
  website?: string;
  socialLink: string;
  type: string;
  entityName?: string;
  instituteName?: string;
  createdAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    website: { type: String, trim: true },
    socialLink: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["local-entity", "college-chapter"],
    },
    // Only set when type is "local-entity" — defaults to the applicant's name
    entityName: { type: String, trim: true },
    // Only set when type is "college-chapter"
    instituteName: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

/* ---------------- Exports ---------------- */
export const Chapter =
  models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);
