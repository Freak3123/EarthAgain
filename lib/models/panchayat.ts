import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClimatePanchayat extends Document {
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  constituency: string;
  location: string;
  expectedAttendees?: "10-25" | "25-50" | "50-100" | "100+";
  preferredDate?: Date;
  localIssues?: string;
  experience?: string;
  supportNeeded?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClimatePanchayatSchema: Schema<IClimatePanchayat> = new Schema(
  {
    organizerName: {
      type: String,
      required: true,
      trim: true,
    },
    organizerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    organizerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    constituency: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    expectedAttendees: {
      type: String,
      enum: ["10-25", "25-50", "50-100", "100+"],
      default: null,
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    localIssues: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    supportNeeded: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClimatePanchayat: Model<IClimatePanchayat> =
  mongoose.models.ClimatePanchayat ||
  mongoose.model<IClimatePanchayat>("ClimatePanchayat", ClimatePanchayatSchema);

export default ClimatePanchayat;
