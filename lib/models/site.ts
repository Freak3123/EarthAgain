import mongoose, { Schema, Document, models } from "mongoose";

/* ---------------- Site Schema ---------------- */
/* One document per sub-site. Holds both draft and published content.
   See docs/rbac-subsites-design.md §1/§5. */

export type BlockType =
  | "hero"
  | "highlight"
  | "about"
  | "featured"
  | "events"
  | "blog"
  | "team"
  | "newsletter"
  | "contact";

export interface IBlock {
  /** Stable client-generated id, unique within the site (used for React keys / reorder). */
  id: string;
  type: BlockType;
  hidden: boolean;
  /** Fields specific to the section type; shape validated in the block registry, not here. */
  data: Record<string, unknown>;
}

export interface ISiteSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  accent: string;
  nav: { label: string; href: string }[];
  footer: Record<string, unknown>;
  socials: { platform: string; url: string }[];
}

export interface ISite extends Document {
  slug: string;
  status: "active" | "suspended";
  chapterId: mongoose.Types.ObjectId;
  adminUserId: mongoose.Types.ObjectId;
  settings: ISiteSettings;
  draft: { blocks: IBlock[] };
  published: { blocks: IBlock[] } | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "hero",
        "highlight",
        "about",
        "featured",
        "events",
        "blog",
        "team",
        "newsletter",
        "contact",
      ],
    },
    hidden: { type: Boolean, default: false },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISiteSettings>(
  {
    brandName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    accent: { type: String, default: "#16a34a" },
    nav: {
      type: [{ label: String, href: String, _id: false }],
      default: [],
    },
    footer: { type: Schema.Types.Mixed, default: {} },
    socials: {
      type: [{ platform: String, url: String, _id: false }],
      default: [],
    },
  },
  { _id: false }
);

const SiteSchema = new Schema<ISite>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    adminUserId: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    settings: { type: SettingsSchema, default: () => ({}) },
    draft: {
      type: { blocks: { type: [BlockSchema], default: [] } },
      default: () => ({ blocks: [] }),
    },
    published: {
      type: { blocks: { type: [BlockSchema], default: [] } },
      default: null,
    },
    publishedAt: { type: Date, default: null },
  },
  { versionKey: false, timestamps: true }
);

export const Site =
  models.Site || mongoose.model<ISite>("Site", SiteSchema);
