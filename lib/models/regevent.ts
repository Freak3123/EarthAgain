import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRegEvent extends Document {
  title: string;
  date: Date;
  description: string;
  speakers: string[]; // using array in case of multiple speakers
}

const regEventSchema = new Schema<IRegEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    speakers: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true }
);

export const RegEvent: Model<IRegEvent> =
  mongoose.models.RegEvent || mongoose.model<IRegEvent>("RegEvent", regEventSchema);
