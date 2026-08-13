// models/Blog.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  /** Short description — drives the card preview and the page's SEO metadata. */
  excerpt: string;
  /** The article body, as sanitised HTML from the admin's rich-text editor. */
  content: string;
  author: string;
  date: Date;
  readTime: string;
  category: string;
  /** Primary image: shown on the card, and at the top of the opened article. */
  image: string;
  /** Optional extra images, shown as a gallery below the article content. */
  images: string[];
  featured: boolean;
  /** Which AdminUser created this (string, not ObjectId — the bootstrap
   *  superadmin has a synthetic "env:<username>" id, not a real Mongo id). */
  createdByAdminUserId: string | null;
  /** Sub-sites this ALSO appears on, in addition to (or instead of) the main site. */
  siteIds: mongoose.Types.ObjectId[];
  /** Whether this appears on the main site's public /blog page. */
  showOnMainSite: boolean;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    // Not required: posts written before the content field existed have none,
    // and must stay loadable and editable.
    content: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    createdByAdminUserId: { type: String, default: null },
    siteIds: { type: [Schema.Types.ObjectId], ref: "Site", default: [] },
    showOnMainSite: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
