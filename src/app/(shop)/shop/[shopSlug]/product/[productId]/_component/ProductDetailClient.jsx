/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  HeartHandshake,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  RefreshCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  addItemToStoreCart,
  buildStorePalette,
  formatPrice,
  formatVariantLabel,
  getProductPricing,
  getStoreWhatsappUrl,
  rgba,
} from "../../../_lib/storefrontUtils";

export default function ProductDetailClient({
  store,
  product,
  relatedProducts = [],
}) {
  const router = useRouter();
  const { shopId, shop, merchant, shopInfo, theme = {}, socialLinks, delivery = {} } = store;

  const palette = useMemo(() => buildStorePalette(theme), [theme]);
  const baseHref = `/shop/${encodeURIComponent(shop.shopSlug || shop.shopId)}`;

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants]
  );

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const activeVariant =
    variants.length > 0 ? variants[selectedVariantIdx] || variants[0] : null;

  const gallery = useMemo(() => {
    const urls = [
      activeVariant?.image?.url,
      product?.mainImage?.url,
      ...(product?.galleryImages || []).map((g) => g?.url),
      ...variants.map((v) => v?.image?.url),
    ].filter(Boolean);
    return [...new Set(urls)];
  }, [activeVariant?.image?.url, product?.mainImage?.url, product?.galleryImages, variants]);

  const [selectedImage, setSelectedImage] = useState(gallery[0] || "");

  const currentImage = selectedImage && gallery.includes(selectedImage)
    ? selectedImage
    : gallery[0] || "";

  const pricing = useMemo(
    () => getProductPricing(product, activeVariant),
    [product, activeVariant]
  );

  const availableStock = activeVariant
    ? Number(activeVariant.quantity ?? product?.availableQuantity ?? 0)
    : Number(product?.availableQuantity ?? 0);

  const outOfStock = availableStock <= 0;
  const skuCode = activeVariant?.productCode || product?.productCode || "";

  const contactPhone = shopInfo?.phone || merchant?.phone || "";
  const whatsappBase = useMemo(
    () => getStoreWhatsappUrl(socialLinks, contactPhone),
    [socialLinks, contactPhone]
  );

  const whatsappProductLink = useMemo(() => {
    if (!whatsappBase) return "";
    const vText = activeVariant ? ` (${formatVariantLabel(activeVariant)})` : "";
    const msg = encodeURIComponent(
      `Hello ${shop.shopName}, I want to order "${product.productName}"${vText} — Qty: ${quantity} — Price: ${formatPrice(
        pricing.finalPrice * quantity
      )}.`
    );
    return `${whatsappBase}${whatsappBase.includes("?") ? "&" : "?"}text=${msg}`;
  }, [whatsappBase, activeVariant, shop.shopName, product.productName, quantity, pricing.finalPrice]);

  const handleAddToCart = (goToCheckout = false) => {
    const res = addItemToStoreCart(shopId, product, selectedVariantIdx, quantity);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    if (goToCheckout) {
      router.push(`${baseHref}/checkout`);
    } else {
      toast.success(`Added ${quantity} × "${product.productName}" to your bag!`);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    } catch {
      toast.info("Share this page URL from your browser bar.");
    }
  };

  const insideFee =
    product.deliveryCharge === "free"
      ? 0
      : Number(product?.deliveryCharges?.dhaka || delivery.deliveryChargeInside || 60);
  const outsideFee =
    product.deliveryCharge === "free"
      ? 0
      : Number(
          product?.deliveryCharges?.outsideDhaka ||
            delivery.deliveryChargeOutside ||
            120
        );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
      {/* ─── Main 2-Column Product Hero ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Product Media Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3.5 lg:sticky lg:top-24">
          <div
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-sm group"
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${rgba(
                    palette.primary,
                    0.14
                  )}, ${rgba(palette.secondary, 0.14)})`,
                }}
              >
                <ShoppingBag
                  className="w-16 h-16 opacity-60"
                  style={{ color: palette.primary }}
                />
                <span className="text-sm font-semibold opacity-70">
                  {product.productName}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {pricing.hasDiscount && (
                <span
                  style={{ backgroundColor: palette.secondary }}
                  className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-md"
                >
                  {pricing.badgeLabel} OFF
                </span>
              )}
              {product.deliveryCharge === "free" && (
                <span
                  style={{ backgroundColor: palette.accent }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-md"
                >
                  <Truck className="w-3.5 h-3.5" /> Free Delivery
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Share product"
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:scale-105 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => {
                const isSelected = currentImage === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    style={
                      isSelected
                        ? {
                            borderColor: palette.primary,
                            boxShadow: `0 0 0 2px ${rgba(palette.primary, 0.25)}`,
                          }
                        : { borderColor: palette.borderCol }
                    }
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                      isSelected ? "scale-[1.02]" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.productName} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product Info, Variants & Order Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            {/* Category + Stock + SKU Row */}
            <div className="flex flex-wrap items-center gap-2">
              {product?.categoryId?.name && (
                <Link
                  href={`${baseHref}?category=${encodeURIComponent(
                    product.categoryId._id
                  )}`}
                  style={{
                    backgroundColor: rgba(palette.primary, 0.12),
                    color: palette.primary,
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold hover:opacity-85 transition bangla-text"
                >
                  {product.categoryId.name}
                </Link>
              )}

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  outOfStock
                    ? "bg-rose-500/15 text-rose-600"
                    : availableStock <= 5
                    ? "bg-amber-500/15 text-amber-600"
                    : "bg-emerald-500/15 text-emerald-600"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {outOfStock
                  ? "Out of Stock"
                  : availableStock <= 5
                  ? `Hurry! Only ${availableStock} left`
                  : `In Stock (${availableStock} available)`}
              </span>

              {skuCode && (
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: palette.subtleBg,
                    color: palette.muted,
                  }}
                >
                  SKU: {skuCode}
                </span>
              )}
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug bangla-text"
              style={{ color: palette.text }}
            >
              {product.productName}
            </h1>

            {/* Price Card */}
            <div
              style={{
                backgroundColor: palette.subtleBg,
                border: `1px solid ${rgba(palette.primary, 0.16)}`,
              }}
              className="rounded-2xl p-4 flex flex-wrap items-baseline justify-between gap-4"
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                  style={{ color: palette.primary }}
                >
                  {formatPrice(pricing.finalPrice)}
                </span>
                {pricing.hasDiscount && (
                  <>
                    <span
                      className="text-base sm:text-lg line-through opacity-65"
                      style={{ color: palette.muted }}
                    >
                      {formatPrice(pricing.regularPrice)}
                    </span>
                    <span
                      style={{ backgroundColor: palette.secondary }}
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                    >
                      Save {formatPrice(pricing.savings)}
                    </span>
                  </>
                )}
              </div>

              <span
                className="inline-flex items-center gap-1 text-xs font-bold"
                style={{ color: palette.accent }}
              >
                <BadgeCheck className="w-4 h-4" /> Cash on Delivery Ready
              </span>
            </div>

            {product.shortDescription && (
              <p
                className="text-sm sm:text-base leading-relaxed bangla-text"
                style={{ color: palette.muted }}
              >
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Variants Selector */}
          {variants.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-extrabold uppercase tracking-wider"
                  style={{ color: palette.text }}
                >
                  Select Variant / Option
                </label>
                {activeVariant && (
                  <span
                    className="text-xs font-semibold"
                    style={{ color: palette.primary }}
                  >
                    {formatVariantLabel(activeVariant)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {variants.map((v, idx) => {
                  const label = formatVariantLabel(v) || `Option ${idx + 1}`;
                  const active = idx === selectedVariantIdx;
                  const vOut = Number(v.quantity ?? 1) <= 0;
                  return (
                    <button
                      key={v._id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                        if (v?.image?.url) setSelectedImage(v.image.url);
                      }}
                      style={
                        active
                          ? {
                              backgroundColor: palette.primary,
                              color: "#ffffff",
                              borderColor: palette.primary,
                            }
                          : {
                              backgroundColor: palette.surfaceBg,
                              color: palette.text,
                              borderColor: palette.borderCol,
                            }
                      }
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                        active ? "shadow-md scale-[1.02]" : "hover:opacity-85"
                      } ${vOut ? "opacity-50 line-through" : ""}`}
                    >
                      {label}
                      {Number(v.price) > 0 && (
                        <span className="ml-1.5 opacity-80 text-[11px]">
                          ({formatPrice(getProductPricing(product, v).finalPrice)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + Primary CTAs */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-4">
              <span
                className="text-xs font-extrabold uppercase tracking-wider"
                style={{ color: palette.text }}
              >
                Quantity
              </span>
              <div
                style={{
                  backgroundColor: palette.surfaceBg,
                  border: `1px solid ${palette.borderCol}`,
                }}
                className="inline-flex items-center rounded-xl p-1"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-base font-extrabold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(Math.max(1, availableStock || 99), q + 1)
                    )
                  }
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-semibold" style={{ color: palette.muted }}>
                Total:{" "}
                <strong style={{ color: palette.primary }}>
                  {formatPrice(pricing.finalPrice * quantity)}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => handleAddToCart(true)}
                style={{
                  backgroundColor: outOfStock ? palette.muted : palette.primary,
                }}
                className="h-13 px-6 rounded-2xl text-white text-sm sm:text-base font-extrabold shadow-lg inline-flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                {outOfStock ? "Out of Stock" : "Order Now — Cash on Delivery"}
              </button>

              <button
                type="button"
                disabled={outOfStock}
                onClick={() => handleAddToCart(false)}
                style={{
                  backgroundColor: rgba(palette.primary, 0.12),
                  color: palette.primary,
                  border: `1px solid ${rgba(palette.primary, 0.25)}`,
                }}
                className="h-13 px-6 rounded-2xl text-sm sm:text-base font-extrabold inline-flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Bag
              </button>
            </div>

            {whatsappProductLink && (
              <a
                href={whatsappProductLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  borderColor: rgba(palette.accent, 0.35),
                  backgroundColor: rgba(palette.accent, 0.08),
                  color: palette.accent,
                }}
                className="w-full h-11 rounded-2xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Quick Order or Ask on WhatsApp
              </a>
            )}
          </div>

          {/* Shipping & Guarantee Box */}
          <div
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="rounded-2xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between py-1">
              <span className="inline-flex items-center gap-2 font-semibold" style={{ color: palette.text }}>
                <Truck className="w-4 h-4" style={{ color: palette.primary }} />
                Inside Dhaka Delivery
              </span>
              <strong style={{ color: palette.primary }}>
                {insideFee === 0 ? "Free" : formatPrice(insideFee)}
              </strong>
            </div>
            <div
              className="flex items-center justify-between py-1 border-t"
              style={{ borderColor: palette.borderCol }}
            >
              <span className="inline-flex items-center gap-2 font-semibold" style={{ color: palette.text }}>
                <Truck className="w-4 h-4" style={{ color: palette.secondary }} />
                Outside Dhaka Delivery
              </span>
              <strong style={{ color: palette.text }}>
                {outsideFee === 0 ? "Free" : formatPrice(outsideFee)}
              </strong>
            </div>
            <div
              className="flex items-center justify-between py-1 border-t"
              style={{ borderColor: palette.borderCol }}
            >
              <span className="inline-flex items-center gap-2 font-semibold" style={{ color: palette.text }}>
                <HeartHandshake className="w-4 h-4" style={{ color: palette.accent }} />
                Payment Method
              </span>
              <span className="font-bold" style={{ color: palette.accent }}>
                Cash on Delivery (100% Safe)
              </span>
            </div>
            <div
              className="flex items-center justify-between py-1 border-t"
              style={{ borderColor: palette.borderCol }}
            >
              <span className="inline-flex items-center gap-2 font-semibold" style={{ color: palette.text }}>
                <RefreshCcw className="w-4 h-4" style={{ color: palette.primary }} />
                Easy Replacement
              </span>
              <Link
                href={`${baseHref}/terms`}
                className="font-semibold underline"
                style={{ color: palette.muted }}
              >
                See Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Product Description & Shipping Tabs ─── */}
      <section
        style={{
          backgroundColor: palette.surfaceBg,
          border: `1px solid ${palette.borderCol}`,
        }}
        className="rounded-3xl p-5 sm:p-8 space-y-5"
      >
        <div
          className="flex items-center gap-2 border-b pb-3 overflow-x-auto no-scrollbar"
          style={{ borderColor: palette.borderCol }}
        >
          {[
            { id: "description", label: "Product Details" },
            { id: "specs", label: "Specifications" },
            { id: "shipping", label: "Delivery & Return Info" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={
                  active
                    ? {
                        backgroundColor: palette.primary,
                        color: "#ffffff",
                      }
                    : { color: palette.muted }
                }
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "description" && (
          <div
            className="prose max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line bangla-text"
            style={{ color: palette.text }}
          >
            {product.longDescription ||
              product.shortDescription ||
              `${product.productName} — offered directly by ${shop.shopName} with strict quality inspection prior to dispatch.`}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {[
              { label: "Product Name", value: product.productName },
              { label: "Product Code / SKU", value: skuCode || "Standard" },
              {
                label: "Category",
                value: product?.categoryId?.name || "General",
              },
              {
                label: "Availability",
                value: outOfStock
                  ? "Out of Stock"
                  : `${availableStock} units available`,
              },
              {
                label: "Variants",
                value:
                  variants.length > 0
                    ? `${variants.length} configurations`
                    : "Standard Edition",
              },
              { label: "Seller", value: shop.shopName },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: palette.subtleBg,
                  border: `1px solid ${palette.borderCol}`,
                }}
                className="rounded-xl p-3.5 flex items-center justify-between gap-4"
              >
                <span style={{ color: palette.muted }} className="font-medium">
                  {row.label}
                </span>
                <strong style={{ color: palette.text }} className="text-right bangla-text">
                  {row.value}
                </strong>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div
              style={{
                backgroundColor: palette.subtleBg,
                border: `1px solid ${palette.borderCol}`,
              }}
              className="rounded-2xl p-4 space-y-1.5"
            >
              <p className="font-extrabold flex items-center gap-2" style={{ color: palette.text }}>
                <Truck className="w-4 h-4" style={{ color: palette.primary }} />
                Fast Dispatch
              </p>
              <p style={{ color: palette.muted }}>
                Inside Dhaka typically arrives within 24–48 hours; Outside Dhaka within 2–4 business days.
              </p>
            </div>
            <div
              style={{
                backgroundColor: palette.subtleBg,
                border: `1px solid ${palette.borderCol}`,
              }}
              className="rounded-2xl p-4 space-y-1.5"
            >
              <p className="font-extrabold flex items-center gap-2" style={{ color: palette.text }}>
                <PackageCheck className="w-4 h-4" style={{ color: palette.accent }} />
                Doorstep Verification
              </p>
              <p style={{ color: palette.muted }}>
                Pay cash upon receiving your parcel. Please check parcel packaging in front of the delivery agent.
              </p>
            </div>
            <div
              style={{
                backgroundColor: palette.subtleBg,
                border: `1px solid ${palette.borderCol}`,
              }}
              className="rounded-2xl p-4 space-y-1.5"
            >
              <p className="font-extrabold flex items-center gap-2" style={{ color: palette.text }}>
                <ShieldCheck className="w-4 h-4" style={{ color: palette.secondary }} />
                Easy Exchange
              </p>
              <p style={{ color: palette.muted }}>
                Received a damaged or incorrect variant? Contact {shop.shopName} within 48 hours for prompt replacement.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ─── Related Products Section ─── */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: palette.secondary }}
              >
                <Sparkles className="w-3.5 h-3.5" /> You May Also Like
              </span>
              <h2
                className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5"
                style={{ color: palette.text }}
              >
                Related Products
              </h2>
            </div>
            <Link
              href={baseHref}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold hover:opacity-80"
              style={{ color: palette.primary }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((rel) => {
              const relPrice = getProductPricing(rel);
              const relImg =
                rel?.mainImage?.url ||
                rel?.galleryImages?.[0]?.url ||
                rel?.variants?.[0]?.image?.url ||
                "";
              return (
                <Link
                  key={rel._id}
                  href={`${baseHref}/product/${encodeURIComponent(rel._id)}`}
                  style={{
                    backgroundColor: palette.surfaceBg,
                    border: `1px solid ${palette.borderCol}`,
                  }}
                  className="group rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {relImg ? (
                      <img
                        src={relImg}
                        alt={rel.productName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag
                          className="w-8 h-8 opacity-40"
                          style={{ color: palette.primary }}
                        />
                      </div>
                    )}
                    {relPrice.hasDiscount && (
                      <span
                        style={{ backgroundColor: palette.secondary }}
                        className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                      >
                        {relPrice.badgeLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <h3
                      className="text-sm font-bold line-clamp-2 bangla-text"
                      style={{ color: palette.text }}
                    >
                      {rel.productName}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-base font-extrabold"
                        style={{ color: palette.primary }}
                      >
                        {formatPrice(relPrice.finalPrice)}
                      </span>
                      {relPrice.hasDiscount && (
                        <span
                          className="text-xs line-through opacity-60"
                          style={{ color: palette.muted }}
                        >
                          {formatPrice(relPrice.regularPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
