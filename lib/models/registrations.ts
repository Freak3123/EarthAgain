import mongoose, { Schema, Document, models } from "mongoose";
import { RegEvent } from "@/lib/models/regevent";

export interface IRegistration extends Document {
  name: string;
  email: string;
  phone: string;
  age: string;
  district: string;
  registrationDays: string[];
  selectedEvents: mongoose.Types.ObjectId[];
  /**
   * How this person registered. "dates" means they signed up for whole days
   * and `selectedEvents` is empty by design — their sessions are resolved from
   * the day when read. Recorded per registration so flipping the admin toggle
   * never rewrites what earlier registrants actually chose.
   */
  registrationMode: "dates" | "dates-events";
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: String,
      required: true,
      enum: ["under-18", "18-25", "26-35", "36-50", "above-50"],
    },
    district: {
      type: String,
      required: true,
      enum: [
        "bhubaneswar",
        "cuttack",
        "puri",
        "berhampur",
        "rourkela",
        "sambalpur",
        "other",
      ],
    },
    registrationDays: {
      type: [String],
      default: ["6 Oct 2025", "7 Oct 2025", "8 Oct 2025"],
    },
    selectedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "RegEvent",
      },
    ],
    registrationMode: {
      type: String,
      enum: ["dates", "dates-events"],
      default: "dates-events",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Registration =
  models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
