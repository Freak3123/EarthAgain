import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRegEvent extends Document {
  title: string;
  date: Date;
  time: string;
  description: string;
  speakers: string[]; 
}

const regEventSchema = new Schema<IRegEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: false, trim: true, default: "To be announced" },
    description: { type: String, required: true, trim: true },
    speakers: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true }
);

export const RegEvent: Model<IRegEvent> =
  mongoose.models.RegEvent || mongoose.model<IRegEvent>("RegEvent", regEventSchema);
