import mongoose, { Schema } from "mongoose";

const DEFAULT_SECTION_ORDER = [
  "hero",
  "categories",
  "featured",
  "banners",
  "allProducts",
];

const ThemeSchema = new mongoose.Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    // Color Tokens
    primary: { type: String, default: "#7c3aed" },
    secondary: { type: String, default: "#06b6d4" },
    background: { type: String, default: "#ffffff" },
    text: { type: String, default: "#0f172a" },
    muted: { type: String, default: "#64748b" },
    accent: { type: String, default: "#10b981" },
    banner: { type: String, default: "#f5f3ff" },
    footer: { type: String, default: "#0f172a" },

    // Storefront Layout & Product Positioning
    layoutPosition: {
      type: String,
      enum: ["top-filter", "sidebar-left", "sidebar-right"],
      default: "top-filter",
    },
    productGridCols: {
      type: Number,
      enum: [2, 3, 4],
      default: 4,
    },
    productCardStyle: {
      type: String,
      enum: ["modern", "minimal", "bordered"],
      default: "modern",
    },
    cardContentAlign: {
      type: String,
      enum: ["left", "center"],
      default: "left",
    },
    sectionOrder: {
      type: [String],
      default: () => [...DEFAULT_SECTION_ORDER],
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

// Refresh model in dev HMR if schema fields changed
if (mongoose.models.Theme && !mongoose.models.Theme.schema.path("layoutPosition")) {
  delete mongoose.models.Theme;
}

export const ThemeModel =
  mongoose.models.Theme ?? mongoose.model("Theme", ThemeSchema);
