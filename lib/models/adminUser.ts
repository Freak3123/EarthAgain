import mongoose, { Schema, Document, models } from "mongoose";

/* ---------------- AdminUser Schema ---------------- */
/* Backs role-based access control. See docs/rbac-subsites-design.md §1/§2. */
export type AdminRole = "superadmin" | "subadmin";

export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  role: AdminRole;
  /** The sub-site this admin owns. Null for superadmins. */
  siteId: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["superadmin", "subadmin"],
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const AdminUser =
  models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
