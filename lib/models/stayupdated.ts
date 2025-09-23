import mongoose, { Schema, Document, models } from "mongoose";

export interface IEmail extends Document {
  email: string;
}

const EmailSchema = new Schema<IEmail>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { versionKey: false }
);

const StayUpdated =
  models.StayUpdated || mongoose.model<IEmail>("StayUpdated", EmailSchema);

export default StayUpdated;
