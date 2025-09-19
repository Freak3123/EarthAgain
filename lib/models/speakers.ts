import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpeaker extends Document {
  name: string;
  session: string;
  image: string;
  isFeatured?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

const speakerSchema = new Schema<ISpeaker>(
  {
    name: { type: String, required: true },
    session: { type: String, required: true },
    image: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Speakers: Model<ISpeaker> =
  mongoose.models.Speakers || mongoose.model<ISpeaker>("Speakers", speakerSchema);
