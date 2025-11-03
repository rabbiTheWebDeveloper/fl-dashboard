import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopAddress: {
      type: String,
      required: true,
      trim: true,
    },
    businessEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6,15}$/, "Invalid phone number"],
    },
    defaultDeliveryLocation: {
      type: String,
      default: "",
      trim: true,
    },
    companyLogo: {
      url: { type: String, default: "" }, // Store CDN / S3 URL
      publicId: { type: String, default: "" }, // Optional for Cloudinary or S3
    },
    favicon: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    shopInfo: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    websiteTitle: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

export const SettingsModel =
  mongoose.models.Settings ?? mongoose.model("Settings", SettingsSchema);
