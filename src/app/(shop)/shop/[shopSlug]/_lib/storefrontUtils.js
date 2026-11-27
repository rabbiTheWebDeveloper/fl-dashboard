/* ─── Shared Storefront Theme, Pricing & Cart Utilities ─── */

export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
export const CART_EVENT_NAME = "amardokan-cart-updated";

export function parseHex(hex) {
  const clean = String(hex || "#7c3aed").replace("#", "").trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16) || 0,
      g: parseInt(clean[1] + clean[1], 16) || 0,
      b: parseInt(clean[2] + clean[2], 16) || 0,
    };
  }
  return {
    r: parseInt(clean.slice(0, 2), 16) || 124,
    g: parseInt(clean.slice(2, 4), 16) || 58,
    b: parseInt(clean.slice(4, 6), 16) || 237,
  };
}

export function rgba(hex, alpha = 1) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isDarkHex(hex) {
  const { r, g, b } = parseHex(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.42;
}

export function buildStorePalette(theme = {}) {
  const palette = {
    primary: theme.primary || "#7c3aed",
    secondary: theme.secondary || "#06b6d4",
    background: theme.background || "#ffffff",
    text: theme.text || "#0f172a",
    muted: theme.muted || "#64748b",
    accent: theme.accent || "#10b981",
    banner: theme.banner || "#f5f3ff",
    footer: theme.footer || "#0f172a",
  };
  const isDarkBg = isDarkHex(palette.background);
  return {
    ...palette,
    isDarkBg,
    surfaceBg: isDarkBg ? rgba("#ffffff", 0.05) : "#ffffff",
    subtleBg: isDarkBg ? rgba("#ffffff", 0.03) : rgba(palette.primary, 0.04),
    borderCol: isDarkBg ? rgba("#ffffff", 0.12) : "rgba(15, 23, 42, 0.09)",
  };
}

export function formatPrice(amount) {
  return `৳${Math.max(0, Math.round(Number(amount) || 0)).toLocaleString("en-IN")}`;
}

export function formatBdtAscii(amount) {
  return `BDT ${Math.max(0, Math.round(Number(amount) || 0)).toLocaleString("en-IN")}`;
}

export function formatVariantLabel(variantOrCombo) {
  if (!variantOrCombo) return "";
  if (typeof variantOrCombo === "string") return variantOrCombo.trim();

  if (typeof variantOrCombo.combination === "string" && variantOrCombo.combination.trim()) {
    return variantOrCombo.combination.trim();
  }

  const mapSource =
    variantOrCombo.values && typeof variantOrCombo.values === "object"
      ? variantOrCombo.values
      : variantOrCombo.combination && typeof variantOrCombo.combination === "object"
      ? variantOrCombo.combination
      : typeof variantOrCombo === "object" && !("price" in variantOrCombo)
      ? variantOrCombo
      : null;

  if (!mapSource) return "";
  const entries = Object.entries(mapSource).filter(
    ([, val]) => val !== undefined && val !== null && String(val).trim() !== ""
  );
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

export function getProductPricing(product, selectedVariant = null) {
  const baseRegular =
    selectedVariant && Number(selectedVariant.price) > 0
      ? Number(selectedVariant.price)
      : Number(product?.regularPrice) || 0;

  const discountVal = Number(product?.discountValue) || 0;
  let finalPrice = baseRegular;
  let savings = 0;
  let badgeLabel = "";

  if (discountVal > 0 && baseRegular > 0) {
    if (product?.discountType === "percentage") {
      savings = Math.round((baseRegular * discountVal) / 100);
      finalPrice = Math.max(0, baseRegular - savings);
      badgeLabel = `-${discountVal}%`;
    } else {
      savings = Math.min(baseRegular, Math.round(discountVal));
      finalPrice = Math.max(0, baseRegular - savings);
      badgeLabel = `-৳${savings}`;
    }
  } else if (
    !selectedVariant &&
    Number(product?.discountedPrice) > 0 &&
    Number(product.discountedPrice) < baseRegular
  ) {
    finalPrice = Math.round(Number(product.discountedPrice));
    savings = baseRegular - finalPrice;
    badgeLabel = `-৳${savings}`;
  }

  return {
    regularPrice: baseRegular,
    finalPrice,
    savings,
    hasDiscount: savings > 0,
    badgeLabel,
  };
}

export function getStoreWhatsappUrl(socialLinks, contactPhone) {
  if (socialLinks?.whatsapp) {
    const raw = String(socialLinks.whatsapp).trim();
    if (raw.startsWith("http")) return raw;
    const digits = raw.replace(/\D/g, "");
    return digits
      ? `https://wa.me/${digits.startsWith("88") ? digits : `88${digits}`}`
      : "";
  }
  if (contactPhone) {
    const digits = String(contactPhone).replace(/\D/g, "");
    return digits
      ? `https://wa.me/${digits.startsWith("88") ? digits : `88${digits}`}`
      : "";
  }
  return "";
}

/* ─── Cart Storage Helpers ─── */
export function getCartStorageKey(shopId) {
  return `amardokan_cart_${shopId}`;
}

export function readStoreCart(shopId) {
  if (typeof window === "undefined" || !shopId) return [];
  try {
    const raw = localStorage.getItem(getCartStorageKey(shopId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoreCart(shopId, items) {
  if (typeof window === "undefined" || !shopId) return;
  try {
    localStorage.setItem(getCartStorageKey(shopId), JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(CART_EVENT_NAME, { detail: { shopId, items } })
    );
  } catch {
    // ignore quota errors
  }
}

export function addItemToStoreCart(shopId, product, variantIdx = 0, qty = 1) {
  const current = readStoreCart(shopId);
  const hasVariants =
    Array.isArray(product?.variants) && product.variants.length > 0;
  const chosenVariant = hasVariants
    ? product.variants[variantIdx] || product.variants[0]
    : null;

  const maxStock = chosenVariant
    ? Number(chosenVariant.quantity ?? product.availableQuantity ?? 99)
    : Number(product?.availableQuantity ?? 99);

  if (maxStock <= 0) {
    return { ok: false, message: "Sorry, this product is currently out of stock.", cart: current };
  }

  const pricing = getProductPricing(product, chosenVariant);
  const variantLabel = chosenVariant ? formatVariantLabel(chosenVariant) : "";
  const cartKey = `${product._id}::${chosenVariant?._id || variantIdx || "base"}`;

  const existing = current.find((i) => i.cartKey === cartKey);
  let nextCart;
  if (existing) {
    const nextQty = Math.min(maxStock, existing.quantity + Math.max(1, qty));
    nextCart = current.map((i) =>
      i.cartKey === cartKey ? { ...i, quantity: nextQty } : i
    );
  } else {
    nextCart = [
      ...current,
      {
        cartKey,
        productId: product._id,
        productCode: chosenVariant?.productCode || product.productCode || "",
        variantIndex: hasVariants ? variantIdx : 0,
        variantLabel,
        productName: product.productName,
        image:
          chosenVariant?.image?.url ||
          product?.mainImage?.url ||
          product?.galleryImages?.[0]?.url ||
          "",
        regularPrice: pricing.regularPrice,
        unitPrice: pricing.finalPrice,
        quantity: Math.min(maxStock, Math.max(1, qty)),
        maxStock,
        deliveryCharge: product.deliveryCharge || "paid",
      },
    ];
  }

  writeStoreCart(shopId, nextCart);
  return { ok: true, cart: nextCart };
}

export function computeCartTotals(cart = [], delivery = {}, deliveryZone = "insideDhaka") {
  let regularSubtotal = 0;
  let discountedSubtotal = 0;
  let totalItems = 0;
  let allFreeShipping = cart.length > 0;

  for (const item of cart) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    regularSubtotal += (Number(item.regularPrice) || 0) * qty;
    discountedSubtotal += (Number(item.unitPrice) || 0) * qty;
    totalItems += qty;
    if (item.deliveryCharge !== "free") {
      allFreeShipping = false;
    }
  }

  let zoneFee = Number(delivery.deliveryChargeInside ?? 60);
  if (deliveryZone === "subarea") {
    zoneFee = Number(delivery.deliveryChargeSubarea ?? 90);
  } else if (deliveryZone === "outsideDhaka") {
    zoneFee = Number(delivery.deliveryChargeOutside ?? 120);
  }

  const baseShipping =
    delivery.shippingStatus === false || allFreeShipping ? 0 : zoneFee;

  const shippingCost = cart.length > 0 ? baseShipping : 0;
  const totalDiscount = Math.max(0, regularSubtotal - discountedSubtotal);
  const grandTotal = discountedSubtotal + shippingCost;

  return {
    totalItems,
    regularSubtotal,
    discountedSubtotal,
    totalDiscount,
    shippingCost,
    allFreeShipping,
    grandTotal,
  };
}
