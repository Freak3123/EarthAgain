import mongoose, { Schema, Document, models } from "mongoose";

export interface IRegistration extends Document {
  name: string;
  email: string;
  phone: string;
  age: string;
  district: string;
  registrationDays: string[];
  occupation?: string;
  interests: string[];
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
    occupation: {
      type: String,
      default: "",
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Registration =
  models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
