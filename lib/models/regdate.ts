import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * A registration day that exists on its own, independent of any session.
 *
 * Registration dates were previously derived from reg events, so "only dates"
 * registration could not offer a day until at least one session existed on it.
 * These fill that gap and merge with the event-derived days on the form.
 */
export interface IRegDate extends Document {
  date: Date;
  note?: string;
}

const regDateSchema = new Schema<IRegDate>(
  {
    // Stored at midday UTC so the calendar day is the same in every timezone —
    // midnight would slide to the previous day west of Greenwich.
    date: { type: Date, required: true, unique: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const RegDate: Model<IRegDate> =
  mongoose.models.RegDate || mongoose.model<IRegDate>("RegDate", regDateSchema);
