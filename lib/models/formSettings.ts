import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Singleton document controlling whether public submission forms accept
 * entries. `masterLive` is a site-wide override: a form only accepts
 * submissions when masterLive AND its own per-category flag are both true.
 */
export interface IFormSettings extends Document {
  masterLive: boolean;
  registration: boolean;
  volunteer: boolean;
  partner: boolean;
  chapter: boolean;
  panchayat: boolean;
  /**
   * "dates-events": registrants pick days, then individual sessions.
   * "dates": registrants pick days only and attend everything scheduled that
   * day — the sessions are resolved from the day at read time.
   */
  registrationMode: "dates" | "dates-events";
  /** Site-wide venue printed on confirmation emails; blank omits the line. */
  venue: string;
  /**
   * Hides every session from the public registration form and its confirmation
   * email, without deleting anything. Registration then behaves as whole-day
   * ("dates") registration regardless of registrationMode.
   */
  regEventsHidden: boolean;
}

const formSettingsSchema = new Schema<IFormSettings>(
  {
    masterLive: { type: Boolean, default: true },
    registration: { type: Boolean, default: true },
    volunteer: { type: Boolean, default: true },
    partner: { type: Boolean, default: true },
    chapter: { type: Boolean, default: true },
    panchayat: { type: Boolean, default: true },
    registrationMode: {
      type: String,
      enum: ["dates", "dates-events"],
      default: "dates-events",
    },
    venue: { type: String, default: "Swosti Premium, Bhubaneswar" },
    regEventsHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FormSettings: Model<IFormSettings> =
  mongoose.models.FormSettings ||
  mongoose.model<IFormSettings>("FormSettings", formSettingsSchema);
