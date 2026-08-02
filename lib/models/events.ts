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
  featured: boolean;
  /** Which AdminUser created this (string, not ObjectId — the bootstrap
   *  superadmin has a synthetic "env:<username>" id, not a real Mongo id). */
  createdByAdminUserId: string | null;
  /** Sub-sites this ALSO appears on, in addition to (or instead of) the main site. */
  siteIds: mongoose.Types.ObjectId[];
  /** Whether this appears on the main site's public /events page. */
  showOnMainSite: boolean;
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
    featured: { type: Boolean, default: false },
    createdByAdminUserId: { type: String, default: null },
    siteIds: { type: [Schema.Types.ObjectId], ref: "Site", default: [] },
    showOnMainSite: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
