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

export interface IBlockBorder {
  enabled: boolean;
  color: string;
  /** Border thickness in pixels. */
  width: number;
}

export interface IBlockStyle {
  border: IBlockBorder;
}

export interface IBlock {
  /** Stable client-generated id, unique within the site (used for React keys / reorder). */
  id: string;
  type: BlockType;
  hidden: boolean;
  /** Fields specific to the section type; shape validated in the block registry, not here. */
  data: Record<string, unknown>;
  /**
   * Cross-cutting presentation options (currently just an optional section
   * border), applied generically by the registry rather than per-renderer.
   * Optional: blocks created before this field existed are read via .lean()
   * (which skips Mongoose's default-hydration), so callers must treat this
   * as possibly absent rather than relying on the schema default.
   */
  style?: IBlockStyle;
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

const BlockBorderSchema = new Schema<IBlockBorder>(
  {
    enabled: { type: Boolean, default: false },
    color: { type: String, default: "#16a34a" },
    width: { type: Number, default: 2 },
  },
  { _id: false }
);

const BlockStyleSchema = new Schema<IBlockStyle>(
  { border: { type: BlockBorderSchema, default: () => ({}) } },
  { _id: false }
);

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
    style: { type: BlockStyleSchema, default: () => ({}) },
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
