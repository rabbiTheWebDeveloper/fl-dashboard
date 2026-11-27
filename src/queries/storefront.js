import Shop from "@/model/shop.model";
import { UserModel } from "@/model/user-model";
import { ShopInfoModel } from "@/model/shopInfo-model";
import { ThemeModel } from "@/model/theme-model";
import Category from "@/model/category-model";
import { ProductModel } from "@/model/product-model";
import { SliderModel } from "@/model/slider";
import { BannerModel } from "@/model/banner-model";
import { SocialLinkModel } from "@/model/socialLink-model";
import { deliveryModel } from "@/model/delivery-model";
import { dbConnect } from "@/service/mongo";

export const DEFAULT_STORE_THEME = {
  primary: "#7c3aed",
  secondary: "#06b6d4",
  background: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  accent: "#10b981",
  banner: "#f5f3ff",
  footer: "#0f172a",
  layoutPosition: "top-filter",
  productGridCols: 4,
  productCardStyle: "modern",
  cardContentAlign: "left",
  sectionOrder: ["hero", "categories", "featured", "banners", "allProducts"],
};

function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Resolve complete merchant, shop, theme, categories, products, sliders, banners,
 * social links, and shipping config by `shopSlug` (or 6-digit `shopId` fallback).
 */
export async function getStorefrontBySlugQuery(
  rawSlug,
  { category, search, featuredOnly } = {}
) {
  if (!rawSlug) return null;
  await dbConnect();

  let decodedSlug = String(rawSlug).trim();
  try {
    decodedSlug = decodeURIComponent(decodedSlug).trim();
  } catch {
    // keep raw if malformed percent-encoding
  }

  const normalizedSlug = decodedSlug.toLowerCase();

  // Match by shopSlug (exact or lowercase) or 6-digit shopId fallback
  const shop = await Shop.findOne({
    $or: [
      { shopSlug: decodedSlug },
      { shopSlug: normalizedSlug },
      { shopId: decodedSlug },
    ],
  }).lean();

  if (!shop) return null;

  const shopId = shop._id;
  const userId = shop.owner;

  const productFilter = {
    shopId,
    userId,
    isActive: { $ne: false },
  };

  if (featuredOnly) {
    productFilter.isFeatured = true;
  }

  if (search && String(search).trim()) {
    const escaped = String(search)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    productFilter.productName = { $regex: escaped, $options: "i" };
  }

  const [
    merchant,
    shopInfo,
    themeDoc,
    categories,
    allProducts,
    sliderDoc,
    bannerDoc,
    socialLinks,
    delivery,
  ] = await Promise.all([
    UserModel.findById(userId)
      .select("fullName email phone avatar role")
      .lean(),
    ShopInfoModel.findOne({ shopId, userId }).lean(),
    ThemeModel.findOne({ shopId, userId }).lean(),
    Category.find({ shopId, userId, status: "active" })
      .select("name image status")
      .sort({ createdAt: -1 })
      .lean(),
    ProductModel.find(productFilter)
      .populate({ path: "categoryId", select: "name image" })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean(),
    SliderModel.findOne({ shopId, userId }).select("images url").lean(),
    BannerModel.findOne({ shopId, userId }).select("images url").lean(),
    SocialLinkModel.findOne({ shopId, userId })
      .select("facebook instagram twitter linkedin youtube whatsapp")
      .lean(),
    deliveryModel.findOne({ shopId, userId }).lean(),
  ]);

  // Optional category filter by ID or name
  const products = category
    ? allProducts.filter(
        (p) =>
          String(p?.categoryId?._id || "") === String(category) ||
          String(p?.categoryId?.name || "").toLowerCase() ===
            String(category).toLowerCase()
      )
    : allProducts;

  const featuredProducts = products.filter((p) => Boolean(p.isFeatured));

  const mergedTheme = {
    ...DEFAULT_STORE_THEME,
    ...(themeDoc || {}),
    sectionOrder:
      Array.isArray(themeDoc?.sectionOrder) && themeDoc.sectionOrder.length > 0
        ? themeDoc.sectionOrder
        : DEFAULT_STORE_THEME.sectionOrder,
  };

  return serialize({
    userId: String(userId),
    shopId: String(shopId),
    shop: {
      _id: shop._id,
      shopId: shop.shopId,
      shopName: shop.shopName,
      shopSlug: shop.shopSlug,
      createdAt: shop.createdAt,
    },
    merchant: merchant
      ? {
          id: merchant._id,
          fullName: merchant.fullName,
          email: merchant.email,
          phone: merchant.phone,
          avatar: merchant.avatar || "",
        }
      : null,
    shopInfo: shopInfo || null,
    theme: mergedTheme,
    categories: categories || [],
    products: products || [],
    featuredProducts:
      featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4),
    sliders: sliderDoc?.images || [],
    banners: bannerDoc?.images || [],
    socialLinks: socialLinks || null,
    delivery: {
      deliveryChargeInside: delivery?.deliveryChargeInside ?? 60,
      deliveryChargeOutside: delivery?.deliveryChargeOutside ?? 120,
      deliveryChargeSubarea: delivery?.deliveryChargeSubarea ?? 90,
      shippingStatus: delivery?.shippingStatus ?? true,
    },
  });
}

/**
 * List public active stores for `/shop` marketplace directory & `/api/shop`.
 */
export async function getAllPublicShopsQuery() {
  await dbConnect();

  const shops = await Shop.find({})
    .sort({ createdAt: -1 })
    .limit(48)
    .lean();

  if (shops.length === 0) return [];

  const shopIds = shops.map((s) => s._id);

  const [shopInfos, themes, productCounts] = await Promise.all([
    ShopInfoModel.find({ shopId: { $in: shopIds } })
      .select("shopId companyLogo websiteTitle shopInfo shopAddress")
      .lean(),
    ThemeModel.find({ shopId: { $in: shopIds } })
      .select("shopId primary secondary accent")
      .lean(),
    ProductModel.aggregate([
      { $match: { shopId: { $in: shopIds }, isActive: { $ne: false } } },
      { $group: { _id: "$shopId", count: { $sum: 1 } } },
    ]),
  ]);

  const infoMap = Object.fromEntries(
    shopInfos.map((i) => [String(i.shopId), i])
  );
  const themeMap = Object.fromEntries(
    themes.map((t) => [String(t.shopId), t])
  );
  const countMap = Object.fromEntries(
    productCounts.map((c) => [String(c._id), c.count])
  );

  return serialize(
    shops.map((s) => {
      const sid = String(s._id);
      const info = infoMap[sid];
      const th = themeMap[sid];
      return {
        _id: sid,
        userId: String(s.owner),
        shopId: s.shopId,
        shopName: s.shopName,
        shopSlug: s.shopSlug || s.shopId,
        logo: info?.companyLogo?.url || "",
        tagline: info?.shopInfo || info?.websiteTitle || "",
        address: info?.shopAddress || "",
        productCount: countMap[sid] || 0,
        primaryColor: th?.primary || "#7c3aed",
        secondaryColor: th?.secondary || "#06b6d4",
      };
    })
  );
}
