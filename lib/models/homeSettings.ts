import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Singleton document for the editable bits of the public home page — currently
 * just the hero countdown's target instant, set from the superadmin console.
 */
export interface IHomeSettings extends Document {
  countdownTarget: Date;
}

const homeSettingsSchema = new Schema<IHomeSettings>(
  {
    countdownTarget: { type: Date, required: true },
  },
  { timestamps: true }
);

export const HomeSettings: Model<IHomeSettings> =
  mongoose.models.HomeSettings ||
  mongoose.model<IHomeSettings>("HomeSettings", homeSettingsSchema);
