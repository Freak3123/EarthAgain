import mongoose, { Document, Model, Schema } from "mongoose";

export interface IClimatePanchayat extends Document {
  title: string;
  date: Date;
  time: string;
  location: string;
  organizerName: string;
  attendees: string; 
  description: string;
  image: string;
  featured: boolean;
}

const ClimatePanchayatSchema = new Schema<IClimatePanchayat>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    organizerName: { type: String, required: true },
    attendees: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ClimatePanchayatEvent: Model<IClimatePanchayat> =
  mongoose.models.ClimatePanchayatEvent || mongoose.model<IClimatePanchayat>("ClimatePanchayatEvent", ClimatePanchayatSchema);
