import mongoose from "mongoose";
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
import { OrderModel } from "@/model/order-model";
import { CustomerModel } from "@/model/customer-model";
import { shopVisitorModel } from "@/model/shopVisitor-model";
import { visitorCountModel } from "@/model/visitorCount-model";
import { VisitorCountDayModel } from "@/model/visitorCountDay-model";
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

  // Non-blocking Bangladesh (UTC+6) visitor telemetry for `/admin/visitor`
  (async () => {
    try {
      const now = new Date();
      const bdNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const bdDate = bdNow.toISOString().slice(0, 10);
      const bdHour = bdNow.getUTCHours();
      const sidStr = String(shopId);

      await Promise.all([
        visitorCountModel.findOneAndUpdate(
          { date: bdDate },
          { $inc: { dailyCount: 1, totalCount: 1 } },
          { upsert: true }
        ),
        VisitorCountDayModel.findOneAndUpdate(
          { date: bdDate },
          {
            $inc: {
              totalCount: 1,
              [`hourlyCounts.${bdHour}.count`]: 1,
            },
          },
          { upsert: true }
        ),
        shopVisitorModel.findOneAndUpdate(
          { shopId: sidStr, date: bdDate, type: "storefront" },
          {
            $inc: {
              totalCount: 1,
              [`hourlyCounts.${bdHour}.count`]: 1,
            },
          },
          { upsert: true }
        ),
      ]);
    } catch {
      // never block storefront rendering on telemetry errors
    }
  })();

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

/**
 * Resolve lightweight storefront shell (shop, merchant, shopInfo, theme, categories,
 * socialLinks, delivery, productCount) for Checkout, Thank-You, About, Terms, Privacy.
 */
export async function getStorefrontShellBySlugQuery(rawSlug) {
  if (!rawSlug) return null;
  await dbConnect();

  let decodedSlug = String(rawSlug).trim();
  try {
    decodedSlug = decodeURIComponent(decodedSlug).trim();
  } catch {
    // keep raw
  }
  const normalizedSlug = decodedSlug.toLowerCase();

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

  // Non-blocking Bangladesh (UTC+6) visitor telemetry for `/admin/visitor`
  (async () => {
    try {
      const now = new Date();
      const bdNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const bdDate = bdNow.toISOString().slice(0, 10);
      const bdHour = bdNow.getUTCHours();
      const sidStr = String(shopId);

      await Promise.all([
        visitorCountModel.findOneAndUpdate(
          { date: bdDate },
          { $inc: { dailyCount: 1, totalCount: 1 } },
          { upsert: true }
        ),
        VisitorCountDayModel.findOneAndUpdate(
          { date: bdDate },
          {
            $inc: {
              totalCount: 1,
              [`hourlyCounts.${bdHour}.count`]: 1,
            },
          },
          { upsert: true }
        ),
        shopVisitorModel.findOneAndUpdate(
          { shopId: sidStr, date: bdDate, type: "storefront" },
          {
            $inc: {
              totalCount: 1,
              [`hourlyCounts.${bdHour}.count`]: 1,
            },
          },
          { upsert: true }
        ),
      ]);
    } catch {
      // never block storefront rendering on telemetry errors
    }
  })();

  const [
    merchant,
    shopInfo,
    themeDoc,
    categories,
    socialLinks,
    delivery,
    productCount,
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
    SocialLinkModel.findOne({ shopId, userId })
      .select("facebook instagram twitter linkedin youtube whatsapp")
      .lean(),
    deliveryModel.findOne({ shopId, userId }).lean(),
    ProductModel.countDocuments({ shopId, userId, isActive: { $ne: false } }),
  ]);

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
    productCount: productCount || 0,
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
 * Fetch single product detail + related products scoped strictly to `shopSlug`.
 */
export async function getStorefrontProductDetailQuery(rawSlug, productParam) {
  const store = await getStorefrontShellBySlugQuery(rawSlug);
  if (!store || !productParam) return null;

  let decodedParam = String(productParam).trim();
  try {
    decodedParam = decodeURIComponent(decodedParam).trim();
  } catch {
    // keep raw
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(decodedParam);
  const productQuery = {
    shopId: store.shopId,
    userId: store.userId,
    isActive: { $ne: false },
    ...(isObjectId
      ? { $or: [{ _id: decodedParam }, { productCode: decodedParam }] }
      : { productCode: decodedParam }),
  };

  const product = await ProductModel.findOne(productQuery)
    .populate({ path: "categoryId", select: "name image" })
    .lean();

  if (!product) return { store, product: null, relatedProducts: [] };

  const relatedFilter = {
    shopId: store.shopId,
    userId: store.userId,
    isActive: { $ne: false },
    _id: { $ne: product._id },
  };

  let relatedProducts = [];
  if (product?.categoryId?._id) {
    relatedProducts = await ProductModel.find({
      ...relatedFilter,
      categoryId: product.categoryId._id,
    })
      .populate({ path: "categoryId", select: "name image" })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .lean();
  }

  if (relatedProducts.length < 4) {
    const excludeIds = [product._id, ...relatedProducts.map((p) => p._id)];
    const fallbackMore = await ProductModel.find({
      ...relatedFilter,
      _id: { $nin: excludeIds },
    })
      .populate({ path: "categoryId", select: "name image" })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4 - relatedProducts.length)
      .lean();
    relatedProducts = [...relatedProducts, ...fallbackMore];
  }

  return serialize({
    store,
    product,
    relatedProducts,
  });
}

/**
 * Fetch order & itemized invoice details scoped strictly to `shopSlug` (`shop._id`).
 */
export async function getStorefrontOrderInvoiceQuery(rawSlug, orderId) {
  const store = await getStorefrontShellBySlugQuery(rawSlug);
  if (!store) return null;

  if (!orderId || !mongoose.Types.ObjectId.isValid(String(orderId).trim())) {
    return { store, order: null };
  }

  const orderDoc = await OrderModel.findOne({
    _id: String(orderId).trim(),
    shopId: store.shopId,
  })
    .populate({
      path: "customer",
      model: CustomerModel,
      select: "customerName customerPhone customerAddress customerNote",
    })
    .lean();

  if (!orderDoc) {
    return { store, order: null };
  }

  const productIds = Array.isArray(orderDoc.productId)
    ? orderDoc.productId.map(String)
    : [];

  const productDocs =
    productIds.length > 0
      ? await ProductModel.find({ _id: { $in: productIds } })
          .select(
            "productName productCode mainImage regularPrice discountType discountValue discountedPrice variants"
          )
          .lean()
      : [];

  const productMap = Object.fromEntries(
    productDocs.map((p) => [String(p._id), p])
  );

  const items = productIds.map((pid, idx) => {
    const prod = productMap[pid] || null;
    const qty = Math.max(1, Number(orderDoc.quantity?.[idx] ?? 1));
    const varRef = orderDoc.variationId?.[idx];
    let chosenVariant = null;

    if (prod && Array.isArray(prod.variants) && prod.variants.length > 0) {
      if (typeof varRef === "number" && prod.variants[varRef]) {
        chosenVariant = prod.variants[varRef];
      } else if (varRef) {
        chosenVariant =
          prod.variants.find((v) => String(v._id) === String(varRef)) || null;
      }
    }

    const baseRegular =
      chosenVariant && Number(chosenVariant.price) > 0
        ? Number(chosenVariant.price)
        : Number(prod?.regularPrice || 0);

    const discountVal = Number(prod?.discountValue || 0);
    let unitPrice = baseRegular;
    if (discountVal > 0 && baseRegular > 0) {
      unitPrice =
        prod?.discountType === "percentage"
          ? Math.max(0, Math.round(baseRegular - (baseRegular * discountVal) / 100))
          : Math.max(0, Math.round(baseRegular - discountVal));
    } else if (
      !chosenVariant &&
      Number(prod?.discountedPrice) > 0 &&
      Number(prod.discountedPrice) < baseRegular
    ) {
      unitPrice = Math.round(Number(prod.discountedPrice));
    }

    let variantLabel = "";
    if (chosenVariant) {
      if (typeof chosenVariant.combination === "string" && chosenVariant.combination.trim()) {
        variantLabel = chosenVariant.combination.trim();
      } else if (chosenVariant.values && typeof chosenVariant.values === "object") {
        variantLabel = Object.entries(chosenVariant.values)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" · ");
      } else if (
        chosenVariant.combination &&
        typeof chosenVariant.combination === "object"
      ) {
        variantLabel = Object.entries(chosenVariant.combination)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" · ");
      }
    }

    return {
      productId: pid,
      productName: prod?.productName || "Ordered Product",
      productCode: chosenVariant?.productCode || prod?.productCode || "",
      variantLabel,
      image: chosenVariant?.image?.url || prod?.mainImage?.url || "",
      quantity: qty,
      regularPrice: baseRegular,
      unitPrice,
      lineTotal: unitPrice * qty,
    };
  });

  const computedSubtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const shippingCost = Number(orderDoc.shipping_cost ?? 0);
  const discount = Number(orderDoc.discount ?? 0);
  const discountedTotal = Number(orderDoc.discounted_total ?? computedSubtotal);
  const grandTotal = Number(
    orderDoc.grand_total ?? discountedTotal + shippingCost
  );

  return serialize({
    store,
    order: {
      _id: String(orderDoc._id),
      invoiceNo: `INV-${String(orderDoc._id).slice(-8).toUpperCase()}`,
      createdAt: orderDoc.createdAt,
      status: orderDoc.status || "pending",
      orderType: orderDoc.orderType || "website",
      deliveryLocation: orderDoc.deliveryLocation || "insideDhaka",
      customer: {
        customerName: orderDoc.customer?.customerName || "Valued Customer",
        customerPhone: orderDoc.customer?.customerPhone || "",
        customerAddress: orderDoc.customer?.customerAddress || "",
        customerNote: orderDoc.customer?.customerNote || "",
      },
      items,
      subtotal: discountedTotal,
      discount,
      shippingCost,
      advanced: Number(orderDoc.advanced ?? 0),
      due: Number(orderDoc.due ?? grandTotal),
      grandTotal,
    },
  });
}
