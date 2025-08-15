import mongoose, { Document, Model, Schema } from "mongoose";


export interface IEvent extends Document {
  title: string;
  date: Date;
  time: string;
  location: string;
  district: string;
  type: string;
  attendees: string; 
  description: string;
  image: string;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    district: { type: String, required: true },
    type: { type: String, required: true },
    attendees: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
