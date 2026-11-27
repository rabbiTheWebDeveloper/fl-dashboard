import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

function generateShopId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function buildShopSlug(shopName = "", fallbackId = "") {
  const asciiSlug = slugify(String(shopName), { lower: true, strict: true });
  if (asciiSlug) return asciiSlug;

  // Preserve Bengali / Unicode letters & numbers when shop name is non-Latin
  const unicodeSlug = String(shopName)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  if (unicodeSlug) return unicodeSlug;
  return `shop-${fallbackId || generateShopId()}`;
}

const shopSchema = new Schema(
  {
    shopId: {
      type: String,
      unique: true,
      default: generateShopId,
      minlength: 6,
      maxlength: 6,
    },
    shopName: { type: String, required: true, trim: true },
    shopSlug: { type: String, unique: true, index: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false, strict: true }
);

shopSchema.pre("save", function () {
  if (this.isModified("shopName") || !this.shopSlug) {
    this.shopSlug = buildShopSlug(this.shopName, this.shopId);
  }
});

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
export default Shop;
