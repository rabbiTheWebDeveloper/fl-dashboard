/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Flame,
  Globe,
  Grid2x2,
  Grid3x3,
  HeartHandshake,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  PackageCheck,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import { createOrderAction } from "@/app/actions/order";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* ─── Color & Price Utilities ─── */
function parseHex(hex) {
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

function rgba(hex, alpha = 1) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isDarkHex(hex) {
  const { r, g, b } = parseHex(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.42;
}

function formatPrice(amount) {
  return `৳${Math.max(0, Math.round(Number(amount) || 0)).toLocaleString("en-IN")}`;
}

function getProductPricing(product, selectedVariant = null) {
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

import {
  CART_EVENT_NAME,
  formatVariantLabel,
} from "../_lib/storefrontUtils";

const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export default function StorefrontClient({
  store,
  initialCategory = "all",
  initialSearch = "",
}) {
  const router = useRouter();
  const {
    userId,
    shopId,
    shop,
    merchant,
    shopInfo,
    theme = {},
    categories = [],
    products = [],
    featuredProducts = [],
    sliders = [],
    banners = [],
    socialLinks,
    delivery = {},
  } = store;

  // Theme colors & layout position config from `/dashboard/myshop/theme`
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

  const layoutPosition = theme.layoutPosition || "top-filter"; // "top-filter" | "sidebar-left" | "sidebar-right"
  const productGridCols = Number(theme.productGridCols) || 4; // 2 | 3 | 4
  const productCardStyle = theme.productCardStyle || "modern"; // "modern" | "minimal" | "bordered"
  const cardContentAlign = theme.cardContentAlign || "left"; // "left" | "center"
  const baseHref = `/shop/${encodeURIComponent(shop.shopSlug || shop.shopId)}`;

  const sectionOrder = useMemo(() => {
    const valid = ["hero", "categories", "featured", "banners", "allProducts"];
    const incoming = Array.isArray(theme.sectionOrder)
      ? theme.sectionOrder.filter((s) => valid.includes(s))
      : [];
    const merged = [...new Set([...incoming, ...valid])];
    return merged;
  }, [theme.sectionOrder]);

  const isDarkBg = isDarkHex(palette.background);
  const surfaceBg = isDarkBg ? rgba("#ffffff", 0.05) : "#ffffff";
  const subtleBg = isDarkBg ? rgba("#ffffff", 0.03) : rgba(palette.primary, 0.04);
  const borderCol = isDarkBg ? rgba("#ffffff", 0.12) : "rgba(15, 23, 42, 0.09)";

  // Interactive Catalog State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const deferredSearch = useDeferredValue(searchQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Hero Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);

  // Quick-View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeImageUrl, setActiveImageUrl] = useState("");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quickQty, setQuickQty] = useState(1);

  // Cart & Checkout Drawer State
  const storageKey = `amardokan_cart_${shopId}`;
  const [cart, setCart] = useState([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // "cart" | "checkout" | "success"
  const [deliveryZone, setDeliveryZone] = useState("insideDhaka");
  const [customerForm, setCustomerForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerNote: "",
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const catalogRef = useRef(null);

  // Hydrate cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      // ignore storage errors
    } finally {
      setCartHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // ignore quota errors
    }
  }, [cart, cartHydrated, storageKey]);

  // Auto-advance hero slider
  useEffect(() => {
    if (sliders.length <= 1 || sliderPaused) return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length);
    }, 4500);
    return () => clearInterval(id);
  }, [sliders.length, sliderPaused]);

  // Category product counts
  const categoryCountMap = useMemo(() => {
    const counts = {};
    for (const p of products) {
      const cid = String(p?.categoryId?._id || "");
      if (cid) counts[cid] = (counts[cid] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Filtered & sorted catalog products
  const filteredProducts = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();

    const list = products.filter((p) => {
      if (selectedCategory !== "all") {
        const cid = String(p?.categoryId?._id || "");
        const cname = String(p?.categoryId?.name || "").toLowerCase();
        if (
          cid !== String(selectedCategory) &&
          cname !== String(selectedCategory).toLowerCase()
        ) {
          return false;
        }
      }

      if (inStockOnly && Number(p?.availableQuantity ?? 0) <= 0) {
        return false;
      }

      if (q) {
        const nameMatch = String(p?.productName || "")
          .toLowerCase()
          .includes(q);
        const catMatch = String(p?.categoryId?.name || "")
          .toLowerCase()
          .includes(q);
        const codeMatch = String(p?.productCode || "")
          .toLowerCase()
          .includes(q);
        if (!nameMatch && !catMatch && !codeMatch) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === "price-asc") {
      sorted.sort(
        (a, b) => getProductPricing(a).finalPrice - getProductPricing(b).finalPrice
      );
    } else if (sortBy === "price-desc") {
      sorted.sort(
        (a, b) => getProductPricing(b).finalPrice - getProductPricing(a).finalPrice
      );
    } else if (sortBy === "discount") {
      sorted.sort(
        (a, b) => getProductPricing(b).savings - getProductPricing(a).savings
      );
    } else if (sortBy === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }
    return sorted;
  }, [products, selectedCategory, inStockOnly, deferredSearch, sortBy]);

  // Grid Columns class from `/dashboard/myshop/theme`
  const gridColsClass = useMemo(() => {
    if (productGridCols === 2) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";
    }
    if (productGridCols === 3) {
      return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
    }
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  }, [productGridCols]);

  // Cart Calculations
  const cartTotals = useMemo(() => {
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

    const baseShipping =
      delivery.shippingStatus === false || allFreeShipping
        ? 0
        : deliveryZone === "insideDhaka"
        ? Number(delivery.deliveryChargeInside ?? 60)
        : Number(delivery.deliveryChargeOutside ?? 120);

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
  }, [cart, delivery, deliveryZone]);

  // Quick-view helpers
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setSelectedVariantIdx(0);
    setQuickQty(1);
    setActiveImageUrl(
      product?.mainImage?.url ||
        product?.galleryImages?.[0]?.url ||
        product?.variants?.[0]?.image?.url ||
        ""
    );
  };

  const addToCart = (product, variantIdx = 0, qty = 1, openCheckoutNow = false) => {
    const hasVariants =
      Array.isArray(product?.variants) && product.variants.length > 0;
    const chosenVariant = hasVariants
      ? product.variants[variantIdx] || product.variants[0]
      : null;

    const maxStock = chosenVariant
      ? Number(chosenVariant.quantity ?? product.availableQuantity ?? 99)
      : Number(product?.availableQuantity ?? 99);

    if (maxStock <= 0) {
      toast.error("Sorry, this item is currently out of stock.");
      return;
    }

    const pricing = getProductPricing(product, chosenVariant);
    const variantLabel = chosenVariant ? formatVariantLabel(chosenVariant) : "";
    const cartKey = `${product._id}::${chosenVariant?._id || variantIdx || "base"}`;

    let updatedCart = [];
    setCart((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        const nextQty = Math.min(maxStock, existing.quantity + qty);
        updatedCart = prev.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: nextQty } : i
        );
        return updatedCart;
      }
      updatedCart = [
        ...prev,
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
      return updatedCart;
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedCart));
      window.dispatchEvent(
        new CustomEvent(CART_EVENT_NAME, { detail: { shopId, items: updatedCart } })
      );
    } catch {
      // ignore
    }

    if (openCheckoutNow) {
      setQuickViewProduct(null);
      router.push(`${baseHref}/checkout`);
    } else {
      toast.success(`Added "${product.productName}" to your bag!`);
    }
  };

  const updateCartQty = (cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey !== cartKey) return item;
          const next = item.quantity + delta;
          if (next <= 0) return null;
          return {
            ...item,
            quantity: Math.min(item.maxStock || 99, next),
          };
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const scrollToCatalog = (catId = null) => {
    if (catId !== null) setSelectedCategory(catId);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your shopping cart is empty.");
      return;
    }

    const name = customerForm.customerName.trim();
    const phone = customerForm.customerPhone.replace(/[\s-]/g, "").trim();
    const address = customerForm.customerAddress.trim();

    if (name.length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!BD_PHONE_REGEX.test(phone)) {
      toast.error("Please enter a valid Bangladesh mobile number (e.g. 017XXXXXXXX).");
      return;
    }
    if (address.length < 6) {
      toast.error("Please provide your complete delivery address.");
      return;
    }

    setSubmittingOrder(true);
    try {
      const payload = {
        userId,
        shopId,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerNote: customerForm.customerNote.trim(),
        productId: cart.map((item) => item.productId),
        variationId: cart.map((item) => item.variantIndex ?? 0),
        quantity: cart.map((item) => item.quantity),
        orderType: "website",
        deliveryLocation: deliveryZone,
        status: "pending",
        shipping_cost: cartTotals.shippingCost,
        grand_total: cartTotals.grandTotal,
        discounted_total: cartTotals.discountedSubtotal,
        discount: cartTotals.totalDiscount,
        advanced: 0,
        due: cartTotals.grandTotal,
      };

      const res = await createOrderAction(payload);
      const createdId = res?.data?._id || "";
      if (typeof window !== "undefined" && createdId) {
        try {
          sessionStorage.setItem(
            `amardokan_last_order_${createdId}`,
            JSON.stringify({
              _id: createdId,
              invoiceNo: `INV-${String(createdId).slice(-8).toUpperCase()}`,
              createdAt: new Date().toISOString(),
              status: "pending",
              orderType: "website",
              deliveryLocation: deliveryZone,
              customer: {
                customerName: name,
                customerPhone: phone,
                customerAddress: address,
                customerNote: customerForm.customerNote.trim(),
              },
              items: cart.map((i) => ({
                productId: i.productId,
                productName: i.productName,
                productCode: i.productCode || "",
                variantLabel: i.variantLabel || "",
                image: i.image || "",
                quantity: i.quantity,
                regularPrice: i.regularPrice,
                unitPrice: i.unitPrice,
                lineTotal: i.unitPrice * i.quantity,
              })),
              subtotal: cartTotals.discountedSubtotal,
              discount: cartTotals.totalDiscount,
              shippingCost: cartTotals.shippingCost,
              advanced: 0,
              due: cartTotals.grandTotal,
              grandTotal: cartTotals.grandTotal,
            })
          );
        } catch {
          // ignore
        }
      }
      setCart([]);
      setCartOpen(false);
      toast.success("Order placed! Redirecting to your official invoice...");
      router.push(
        `${baseHref}/thank-you${
          createdId ? `?orderId=${encodeURIComponent(createdId)}` : ""
        }`
      );
    } catch (error) {
      toast.error(error?.message || "Could not place order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const contactPhone = shopInfo?.phone || merchant?.phone || "";
  const whatsappUrl = useMemo(() => {
    if (socialLinks?.whatsapp) {
      const raw = String(socialLinks.whatsapp).trim();
      if (raw.startsWith("http")) return raw;
      const digits = raw.replace(/\D/g, "");
      return digits ? `https://wa.me/${digits.startsWith("88") ? digits : `88${digits}`}` : "";
    }
    if (contactPhone) {
      const digits = String(contactPhone).replace(/\D/g, "");
      return digits ? `https://wa.me/${digits.startsWith("88") ? digits : `88${digits}`}` : "";
    }
    return "";
  }, [socialLinks?.whatsapp, contactPhone]);

  /* ─── Product Card Component Driven by Theme Settings ─── */
  const renderProductCard = (product) => {
    const pricing = getProductPricing(product);
    const imgUrl =
      product?.mainImage?.url ||
      product?.galleryImages?.[0]?.url ||
      product?.variants?.[0]?.image?.url ||
      "";
    const outOfStock = Number(product?.availableQuantity ?? 0) <= 0;
    const isCentered = cardContentAlign === "center";
    const hasVariants =
      Array.isArray(product?.variants) && product.variants.length > 0;

    const cardFrameStyle =
      productCardStyle === "bordered"
        ? {
            backgroundColor: surfaceBg,
            border: `2px solid ${rgba(palette.primary, 0.22)}`,
          }
        : productCardStyle === "minimal"
        ? {
            backgroundColor: "transparent",
            border: "1px solid transparent",
          }
        : {
            backgroundColor: surfaceBg,
            border: `1px solid ${borderCol}`,
            boxShadow: isDarkBg
              ? "0 10px 28px -12px rgba(0,0,0,0.45)"
              : "0 10px 28px -14px rgba(15, 23, 42, 0.09)",
          };

    return (
      <article
        key={product._id}
        style={cardFrameStyle}
        className={`group relative flex flex-col rounded-2xl transition-all duration-300 ${
          productCardStyle === "minimal"
            ? "hover:-translate-y-0.5"
            : "hover:-translate-y-1 hover:shadow-xl overflow-hidden"
        }`}
      >
        {/* Image Container */}
        <div
          onClick={() =>
            router.push(`${baseHref}/product/${encodeURIComponent(product._id)}`)
          }
          className={`relative cursor-pointer overflow-hidden ${
            productGridCols === 2 ? "aspect-[4/3]" : "aspect-square"
          } ${
            productCardStyle === "minimal" ? "rounded-2xl" : ""
          } bg-slate-100/80`}
          style={{
            backgroundColor: isDarkBg
              ? rgba("#ffffff", 0.06)
              : rgba(palette.primary, 0.05),
          }}
        >
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={product.productName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2 p-4"
              style={{
                background: `linear-gradient(135deg, ${rgba(
                  palette.primary,
                  0.14
                )}, ${rgba(palette.secondary, 0.14)})`,
              }}
            >
              <ShoppingBag
                className="w-10 h-10 opacity-50"
                style={{ color: palette.primary }}
              />
              <span
                className="text-[11px] font-medium opacity-70 text-center line-clamp-1"
                style={{ color: palette.text }}
              >
                {product.productName}
              </span>
            </div>
          )}

          {/* Top-Left Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {pricing.hasDiscount && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm"
                style={{ backgroundColor: palette.secondary }}
              >
                {pricing.badgeLabel}
              </span>
            )}
            {product.deliveryCharge === "free" && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: palette.accent }}
              >
                <Truck className="w-2.5 h-2.5" /> Free Delivery
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold shadow">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover Quick-View Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            aria-label={`Quick view ${product.productName}`}
            className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-xl bg-white/95 text-slate-900 shadow-md flex items-center justify-center opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-105 z-10"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div
          className={`flex flex-1 flex-col justify-between ${
            productCardStyle === "minimal" ? "pt-3 px-1 pb-1" : "p-3.5 sm:p-4"
          } ${isCentered ? "items-center text-center" : "items-start text-left"}`}
        >
          <div className="w-full space-y-1">
            {product?.categoryId?.name && (
              <p
                className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate"
                style={{ color: palette.muted }}
              >
                {product.categoryId.name}
              </p>
            )}

            <Link
              href={`${baseHref}/product/${encodeURIComponent(product._id)}`}
              className="block text-sm sm:text-[15px] font-bold leading-snug line-clamp-2 hover:opacity-80 transition-opacity bangla-text"
              style={{ color: palette.text }}
            >
              {product.productName}
            </Link>

            {hasVariants && (
              <p
                className="text-[11px] font-medium"
                style={{ color: palette.muted }}
              >
                {product.variants.length} options available
              </p>
            )}
          </div>

          {/* Pricing + Action Footer */}
          <div className="w-full pt-3 mt-2 space-y-2.5">
            <div
              className={`flex items-baseline gap-2 flex-wrap ${
                isCentered ? "justify-center" : "justify-start"
              }`}
            >
              <span
                className="text-base sm:text-lg font-extrabold tracking-tight"
                style={{ color: palette.primary }}
              >
                {formatPrice(pricing.finalPrice)}
              </span>
              {pricing.hasDiscount && (
                <span
                  className="text-xs line-through opacity-65"
                  style={{ color: palette.muted }}
                >
                  {formatPrice(pricing.regularPrice)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-1.5 w-full">
              <button
                type="button"
                disabled={outOfStock}
                onClick={() =>
                  hasVariants
                    ? router.push(
                        `${baseHref}/product/${encodeURIComponent(product._id)}`
                      )
                    : addToCart(product, 0, 1, true)
                }
                style={{
                  backgroundColor: outOfStock
                    ? rgba(palette.muted, 0.25)
                    : palette.primary,
                  color: "#ffffff",
                }}
                className="h-9 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition hover:opacity-95 disabled:cursor-not-allowed shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {outOfStock
                    ? "Sold Out"
                    : hasVariants
                    ? "Select Option"
                    : "Order Now"}
                </span>
              </button>

              <button
                type="button"
                disabled={outOfStock}
                onClick={() =>
                  hasVariants
                    ? openQuickView(product)
                    : addToCart(product, 0, 1, false)
                }
                aria-label={`Add ${product.productName} to cart`}
                style={{
                  backgroundColor: rgba(palette.primary, 0.12),
                  color: palette.primary,
                }}
                className="h-9 w-9 rounded-xl inline-flex items-center justify-center transition hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  /* ─── Storefront Modular Sections (Ordered dynamically via `sectionOrder`) ─── */
  const renderHeroSection = () => {
    if (sliders.length > 0) {
      const current = sliders[activeSlide] || sliders[0];
      return (
        <section
          key="hero"
          onMouseEnter={() => setSliderPaused(true)}
          onMouseLeave={() => setSliderPaused(false)}
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6"
        >
          <div className="relative overflow-hidden rounded-3xl aspect-[16/8] sm:aspect-[21/8] shadow-lg border border-black/5">
            <img
              src={current?.url}
              alt={shop.shopName}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent flex items-center">
              <div className="p-6 sm:p-10 md:p-14 max-w-xl text-white space-y-3 sm:space-y-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow"
                  style={{ backgroundColor: palette.primary }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {shop.shopName}
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight bangla-text">
                  {shopInfo?.websiteTitle || shop.shopName}
                </h1>
                {(shopInfo?.shopInfo || shopInfo?.description) && (
                  <p className="text-xs sm:text-base text-white/85 line-clamp-2 bangla-text">
                    {shopInfo?.shopInfo || shopInfo?.description}
                  </p>
                )}
                <div className="pt-1 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToCatalog()}
                    style={{ backgroundColor: palette.primary }}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg inline-flex items-center gap-2 hover:opacity-95 transition"
                  >
                    Shop Collection <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {sliders.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide(
                      (prev) => (prev - 1 + sliders.length) % sliders.length
                    )
                  }
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % sliders.length)
                  }
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeSlide ? "w-6 bg-white" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      );
    }

    // Dynamic Theme Hero Banner when no custom slider images are uploaded
    const heroSpotProduct = featuredProducts[0] || products[0] || null;
    const isBannerDark = isDarkHex(palette.banner);
    const heroText = isBannerDark ? "#ffffff" : palette.text;
    const heroSubText = isBannerDark ? "rgba(255,255,255,0.75)" : palette.muted;

    return (
      <section key="hero" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div
          style={{
            backgroundColor: palette.banner,
            border: `1px solid ${rgba(palette.primary, 0.18)}`,
          }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12"
        >
          {/* Ambient Brand Glows */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: palette.primary }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: palette.secondary }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 items-center">
            <div className="space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm"
                style={{
                  backgroundColor: rgba(palette.primary, 0.14),
                  color: isBannerDark ? "#ffffff" : palette.primary,
                }}
              >
                <BadgeCheck className="w-4 h-4" />
                Official Verified Store · Cash on Delivery Available
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] bangla-text"
                style={{ color: heroText }}
              >
                {shopInfo?.websiteTitle || shop.shopName}
              </h1>

              <p
                className="text-sm sm:text-base max-w-xl leading-relaxed bangla-text"
                style={{ color: heroSubText }}
              >
                {shopInfo?.shopInfo ||
                  shopInfo?.description ||
                  `Discover handpicked quality products from ${shop.shopName}. Fast nationwide doorstep delivery with hassle-free Cash on Delivery.`}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToCatalog()}
                  style={{ backgroundColor: palette.primary }}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg inline-flex items-center gap-2 hover:opacity-95 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Now ({products.length})
                </button>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      borderColor: rgba(palette.primary, 0.3),
                      color: heroText,
                    }}
                    className="px-5 py-3 rounded-xl text-sm font-semibold border inline-flex items-center gap-2 hover:opacity-85 transition"
                  >
                    <MessageCircle className="w-4 h-4" style={{ color: palette.accent }} />
                    Chat with Seller
                  </a>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs font-semibold" style={{ color: heroSubText }}>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-4 h-4" style={{ color: palette.accent }} />
                  Inside Dhaka {formatPrice(delivery.deliveryChargeInside ?? 60)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" style={{ color: palette.primary }} />
                  Pay After Receiving
                </span>
                {categories.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="w-4 h-4" style={{ color: palette.secondary }} />
                    {categories.length} Categories
                  </span>
                )}
              </div>
            </div>

            {/* Hero Spotlight Product Card */}
            {heroSpotProduct && (
              <Link
                href={`${baseHref}/product/${encodeURIComponent(heroSpotProduct._id)}`}
                style={{
                  backgroundColor: isBannerDark
                    ? rgba("#ffffff", 0.08)
                    : "rgba(255,255,255,0.9)",
                  border: `1px solid ${rgba(palette.primary, 0.2)}`,
                }}
                className="cursor-pointer group rounded-2xl p-4 shadow-xl backdrop-blur-md flex items-center gap-4 hover:scale-[1.01] transition-transform"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  {heroSpotProduct?.mainImage?.url ? (
                    <img
                      src={heroSpotProduct.mainImage.url}
                      alt={heroSpotProduct.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: rgba(palette.primary, 0.15) }}
                    >
                      <Flame className="w-8 h-8" style={{ color: palette.primary }} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: palette.secondary }}
                  >
                    <Flame className="w-3 h-3" /> Top Pick
                  </span>
                  <h2
                    className="text-sm sm:text-base font-bold line-clamp-2 bangla-text"
                    style={{ color: heroText }}
                  >
                    {heroSpotProduct.productName}
                  </h2>
                  <p
                    className="text-lg font-extrabold"
                    style={{ color: palette.primary }}
                  >
                    {formatPrice(getProductPricing(heroSpotProduct).finalPrice)}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: palette.accent }}
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderCategoriesSection = () => {
    if (categories.length === 0) return null;
    // When desktop sidebar mode is active, still show compact swipeable pills on mobile/tablet
    const wrapperVisibility =
      layoutPosition === "top-filter" ? "block" : "block lg:hidden";

    return (
      <section
        key="categories"
        className={`max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 ${wrapperVisibility}`}
      >
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-5 rounded-full"
              style={{ backgroundColor: palette.primary }}
            />
            <h2
              className="text-base sm:text-lg font-extrabold tracking-tight"
              style={{ color: palette.text }}
            >
              Shop by Category
            </h2>
          </div>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-semibold hover:underline"
              style={{ color: palette.primary }}
            >
              View All ({products.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          <button
            type="button"
            onClick={() => scrollToCatalog("all")}
            style={
              selectedCategory === "all"
                ? { backgroundColor: palette.primary, color: "#ffffff" }
                : {
                    backgroundColor: surfaceBg,
                    color: palette.text,
                    border: `1px solid ${borderCol}`,
                  }
            }
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-xs"
          >
            <Grid2x2 className="w-4 h-4" />
            All Products
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {products.length}
            </span>
          </button>

          {categories.map((cat) => {
            const active = String(selectedCategory) === String(cat._id);
            const count = categoryCountMap[String(cat._id)] || 0;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => scrollToCatalog(String(cat._id))}
                style={
                  active
                    ? { backgroundColor: palette.primary, color: "#ffffff" }
                    : {
                        backgroundColor: surfaceBg,
                        color: palette.text,
                        border: `1px solid ${borderCol}`,
                      }
                }
                className="shrink-0 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition hover:opacity-90 shadow-xs bangla-text"
              >
                {cat?.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                ) : (
                  <Tag className="w-3.5 h-3.5 opacity-75" />
                )}
                <span>{cat.name}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] opacity-75 bg-black/10">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  const renderFeaturedSection = () => {
    if (featuredProducts.length === 0 || deferredSearch.trim()) return null;
    return (
      <section key="featured" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mb-1"
              style={{ color: palette.secondary }}
            >
              <Flame className="w-3.5 h-3.5" /> Featured Picks
            </span>
            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ color: palette.text }}
            >
              Trending in {shop.shopName}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => scrollToCatalog("all")}
            className="text-xs sm:text-sm font-bold inline-flex items-center gap-1 hover:opacity-80"
            style={{ color: palette.primary }}
          >
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className={`grid ${gridColsClass} gap-3.5 sm:gap-5`}>
          {featuredProducts.slice(0, productGridCols).map(renderProductCard)}
        </div>
      </section>
    );
  };

  const renderBannersSection = () => {
    return (
      <section key="banners" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 space-y-5">
        {banners.length > 0 && (
          <div
            className={`grid gap-4 ${
              banners.length === 1
                ? "grid-cols-1"
                : banners.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-3"
            }`}
          >
            {banners.slice(0, 3).map((b, i) => (
              <div
                key={b._id || i}
                onClick={() => scrollToCatalog()}
                className="cursor-pointer group overflow-hidden rounded-2xl aspect-[16/7] border border-black/5 shadow-sm"
              >
                <img
                  src={b.url}
                  alt={`${shop.shopName} promotional banner ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Store Trust & Delivery Strip */}
        <div
          style={{
            backgroundColor: subtleBg,
            border: `1px solid ${rgba(palette.primary, 0.14)}`,
          }}
          className="rounded-2xl p-4 sm:p-5 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              icon: Truck,
              title: "Fast Home Delivery",
              desc: `Inside Dhaka ${formatPrice(
                delivery.deliveryChargeInside ?? 60
              )} · Outside ${formatPrice(delivery.deliveryChargeOutside ?? 120)}`,
              color: palette.primary,
            },
            {
              icon: HeartHandshake,
              title: "Cash on Delivery",
              desc: "Inspect your parcel at your doorstep",
              color: palette.accent,
            },
            {
              icon: PackageCheck,
              title: "100% Authentic",
              desc: `Direct from ${shop.shopName}`,
              color: palette.secondary,
            },
            {
              icon: ShieldCheck,
              title: "Dedicated Support",
              desc: contactPhone || "Instant order confirmation",
              color: palette.primary,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: rgba(item.color, 0.13),
                    color: item.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs sm:text-sm font-bold truncate"
                    style={{ color: palette.text }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[11px] sm:text-xs leading-snug mt-0.5 line-clamp-2"
                    style={{ color: palette.muted }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderSidebarPanel = () => (
    <aside className="hidden lg:block">
      <div
        style={{
          backgroundColor: surfaceBg,
          border: `1px solid ${borderCol}`,
        }}
        className="sticky top-24 rounded-2xl p-4 space-y-5 shadow-xs"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: palette.text }}
            >
              <Filter className="w-3.5 h-3.5" style={{ color: palette.primary }} />
              Categories
            </h3>
            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-[11px] font-semibold hover:underline"
                style={{ color: palette.primary }}
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              style={
                selectedCategory === "all"
                  ? {
                      backgroundColor: rgba(palette.primary, 0.12),
                      color: palette.primary,
                    }
                  : { color: palette.text }
              }
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition hover:opacity-85"
            >
              <span>All Products</span>
              <span className="text-[11px] opacity-75">{products.length}</span>
            </button>

            {categories.map((cat) => {
              const active = String(selectedCategory) === String(cat._id);
              const count = categoryCountMap[String(cat._id)] || 0;
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(String(cat._id))}
                  style={
                    active
                      ? {
                          backgroundColor: rgba(palette.primary, 0.12),
                          color: palette.primary,
                        }
                      : { color: palette.text }
                  }
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition hover:opacity-85 bangla-text"
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="text-[11px] opacity-70 shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: borderCol }}>
          <label className="flex items-center justify-between cursor-pointer text-xs font-semibold" style={{ color: palette.text }}>
            <span>In-Stock Items Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ accentColor: palette.primary }}
              className="w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>
    </aside>
  );

  const renderAllProductsSection = () => {
    const activeCatObj = categories.find(
      (c) => String(c._id) === String(selectedCategory)
    );
    const hasSidebar =
      layoutPosition === "sidebar-left" || layoutPosition === "sidebar-right";

    const catalogGrid = (
      <div className="min-w-0 flex-1">
        {/* Filter & Sort Toolbar */}
        <div
          style={{
            backgroundColor: surfaceBg,
            border: `1px solid ${borderCol}`,
          }}
          className="rounded-2xl p-3.5 sm:p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className="text-base sm:text-xl font-extrabold tracking-tight bangla-text"
              style={{ color: palette.text }}
            >
              {activeCatObj ? activeCatObj.name : "All Products"}
            </h2>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: rgba(palette.primary, 0.12),
                color: palette.primary,
              }}
            >
              {filteredProducts.length} items
            </span>

            {(selectedCategory !== "all" || searchQuery.trim() || inStockOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setInStockOnly(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg hover:opacity-80"
                style={{
                  backgroundColor: rgba(palette.secondary, 0.12),
                  color: palette.secondary,
                }}
              >
                <RotateCcw className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {!hasSidebar && (
              <label
                className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-2.5 py-1.5 rounded-xl border"
                style={{ borderColor: borderCol, color: palette.text }}
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: palette.primary }}
                  className="rounded"
                />
                In Stock
              </label>
            )}

            <div className="relative flex items-center">
              <SlidersHorizontal
                className="w-3.5 h-3.5 absolute left-3 pointer-events-none"
                style={{ color: palette.muted }}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                style={{
                  backgroundColor: surfaceBg,
                  color: palette.text,
                  border: `1px solid ${borderCol}`,
                }}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className={`grid ${gridColsClass} gap-3.5 sm:gap-5`}>
            {filteredProducts.map(renderProductCard)}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: surfaceBg,
              border: `1px dashed ${rgba(palette.primary, 0.3)}`,
            }}
            className="rounded-3xl py-16 px-6 text-center space-y-3"
          >
            <div
              className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: rgba(palette.primary, 0.12),
                color: palette.primary,
              }}
            >
              <Package className="w-7 h-7" />
            </div>
            <h3
              className="text-lg font-bold"
              style={{ color: palette.text }}
            >
              {products.length === 0
                ? "New products arriving soon!"
                : "No matching products found"}
            </h3>
            <p
              className="text-xs sm:text-sm max-w-md mx-auto"
              style={{ color: palette.muted }}
            >
              {products.length === 0
                ? `${shop.shopName} is setting up their catalog. Check back shortly or contact the store directly.`
                : "Try clearing your search keyword or switching to All Categories."}
            </p>
            {products.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setInStockOnly(false);
                }}
                style={{ backgroundColor: palette.primary }}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>
    );

    return (
      <section
        key="allProducts"
        ref={catalogRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-16 scroll-mt-20"
      >
        {layoutPosition === "sidebar-left" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            {renderSidebarPanel()}
            {catalogGrid}
          </div>
        ) : layoutPosition === "sidebar-right" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
            {catalogGrid}
            {renderSidebarPanel()}
          </div>
        ) : (
          catalogGrid
        )}
      </section>
    );
  };

  const sectionRenderers = {
    hero: renderHeroSection,
    categories: renderCategoriesSection,
    featured: renderFeaturedSection,
    banners: renderBannersSection,
    allProducts: renderAllProductsSection,
  };

  // Quick-view computed state
  const qvVariants = Array.isArray(quickViewProduct?.variants)
    ? quickViewProduct.variants
    : [];
  const qvActiveVariant =
    qvVariants.length > 0
      ? qvVariants[selectedVariantIdx] || qvVariants[0]
      : null;
  const qvPricing = quickViewProduct
    ? getProductPricing(quickViewProduct, qvActiveVariant)
    : null;
  const qvGallery = useMemo(() => {
    if (!quickViewProduct) return [];
    const urls = [
      quickViewProduct?.mainImage?.url,
      ...(quickViewProduct?.galleryImages || []).map((g) => g?.url),
      ...qvVariants.map((v) => v?.image?.url),
    ].filter(Boolean);
    return [...new Set(urls)];
  }, [quickViewProduct, qvVariants]);

  const qvStock = qvActiveVariant
    ? Number(qvActiveVariant.quantity ?? quickViewProduct?.availableQuantity ?? 0)
    : Number(quickViewProduct?.availableQuantity ?? 0);

  return (
    <div
      style={{
        backgroundColor: palette.background,
        color: palette.text,
      }}
      className="min-h-screen flex flex-col selection:bg-violet-600 selection:text-white"
    >
      {/* ─── Top Announcement Bar ─── */}
      <div
        style={{ backgroundColor: palette.primary }}
        className="text-white text-[11px] sm:text-xs font-medium py-2 px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <p className="truncate flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              Welcome to <strong>{shop.shopName}</strong> · Cash on Delivery Across Bangladesh!
            </span>
          </p>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3" /> {contactPhone}
              </a>
            )}
            <span className="opacity-80">Shop ID: #{shop.shopId}</span>
          </div>
        </div>
      </div>

      {/* ─── Sticky Storefront Header ─── */}
      <header
        style={{
          backgroundColor: isDarkBg
            ? rgba(palette.background, 0.88)
            : "rgba(255, 255, 255, 0.9)",
          borderBottom: `1px solid ${borderCol}`,
        }}
        className="sticky top-0 z-40 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[70px] flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo + Name */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0 group"
          >
            {shopInfo?.companyLogo?.url ? (
              <img
                src={shopInfo.companyLogo.url}
                alt={shop.shopName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-black/10 shrink-0"
              />
            ) : (
              <div
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0"
              >
                {String(shop.shopName || "S").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-extrabold text-sm sm:text-lg tracking-tight truncate bangla-text"
                  style={{ color: palette.text }}
                >
                  {shop.shopName}
                </span>
                <BadgeCheck
                  className="w-4 h-4 shrink-0"
                  style={{ color: palette.primary }}
                />
              </div>
              <p
                className="text-[10px] sm:text-xs truncate"
                style={{ color: palette.muted }}
              >
                {products.length} Products · Fast Delivery
              </p>
            </div>
          </button>

          {/* Instant Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative items-center">
            <Search
              className="w-4 h-4 absolute left-3.5 pointer-events-none"
              style={{ color: palette.muted }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${shop.shopName}...`}
              style={{
                backgroundColor: subtleBg,
                color: palette.text,
                border: `1px solid ${borderCol}`,
              }}
              className="w-full h-10 pl-10 pr-8 rounded-xl text-sm outline-none focus:ring-2 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <nav className="hidden xl:flex items-center gap-1 mr-1">
              <Link
                href={`${baseHref}/about`}
                style={{ color: palette.text }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-75 transition"
              >
                About
              </Link>
              <Link
                href={`${baseHref}/terms`}
                style={{ color: palette.text }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-75 transition"
              >
                Terms
              </Link>
              <Link
                href={`${baseHref}/privacy-policy`}
                style={{ color: palette.text }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-75 transition"
              >
                Privacy
              </Link>
            </nav>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Support"
                style={{
                  backgroundColor: rgba(palette.accent, 0.12),
                  color: palette.accent,
                }}
                className="w-10 h-10 rounded-xl hidden sm:inline-flex items-center justify-center hover:opacity-85 transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                setCheckoutStep(cart.length > 0 ? "cart" : "cart");
                setCartOpen(true);
              }}
              style={{ backgroundColor: palette.primary }}
              className="relative h-10 px-3.5 sm:px-4 rounded-xl text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md hover:opacity-95 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">
                {cartTotals.totalItems > 0
                  ? formatPrice(cartTotals.discountedSubtotal)
                  : "Cart"}
              </span>
              <span
                style={{ backgroundColor: palette.secondary }}
                className="min-w-5 h-5 px-1.5 rounded-full text-[11px] font-extrabold inline-flex items-center justify-center text-white"
              >
                {cartTotals.totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative flex items-center">
            <Search
              className="w-4 h-4 absolute left-3.5 pointer-events-none"
              style={{ color: palette.muted }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search products in ${shop.shopName}...`}
              style={{
                backgroundColor: subtleBg,
                color: palette.text,
                border: `1px solid ${borderCol}`,
              }}
              className="w-full h-9 pl-9 pr-8 rounded-xl text-xs outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 opacity-60"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Dynamic Ordered Storefront Sections ─── */}
      <div className="flex-1">
        {sectionOrder.map((sectionKey) => {
          const fn = sectionRenderers[sectionKey];
          return fn ? fn() : null;
        })}
      </div>

      {/* ─── Mobile Sticky Checkout Bar ─── */}
      {cartTotals.totalItems > 0 && !cartOpen && (
        <div className="fixed bottom-3 inset-x-3 z-30 sm:hidden">
          <Link
            href={`${baseHref}/checkout`}
            style={{ backgroundColor: palette.primary }}
            className="w-full rounded-2xl p-3.5 text-white shadow-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <span
                style={{ backgroundColor: palette.secondary }}
                className="w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center"
              >
                {cartTotals.totalItems}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold leading-none">
                  {formatPrice(cartTotals.discountedSubtotal)}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5">
                  Tap for Cash on Delivery
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-white/15 px-3 py-1.5 rounded-xl">
              Checkout <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      )}

      {/* ─── Themed Storefront Footer ─── */}
      <footer
        style={{ backgroundColor: palette.footer }}
        className="text-white/90 mt-auto pt-12 pb-20 sm:pb-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {shopInfo?.companyLogo?.url ? (
                <img
                  src={shopInfo.companyLogo.url}
                  alt={shop.shopName}
                  className="w-10 h-10 rounded-xl object-cover bg-white"
                />
              ) : (
                <div
                  style={{ backgroundColor: palette.primary }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white"
                >
                  {String(shop.shopName || "S").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-extrabold text-white bangla-text">
                  {shop.shopName}
                </h3>
                <p className="text-xs text-white/60">Shop Slug: /{shop.shopSlug}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed bangla-text">
              {shopInfo?.description ||
                shopInfo?.shopInfo ||
                `Thank you for shopping with ${shop.shopName}. Quality products delivered right to your doorstep.`}
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Store Pages
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <Link href={`${baseHref}/about`} className="hover:text-white hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/checkout`} className="hover:text-white hover:underline">
                  Checkout & Bag
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/terms`} className="hover:text-white hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/privacy-policy`} className="hover:text-white hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Contact & Location
            </h4>
            {shopInfo?.shopAddress && (
              <p className="text-xs sm:text-sm text-white/80 flex items-start gap-2 bangla-text">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/60" />
                <span>{shopInfo.shopAddress}</span>
              </p>
            )}
            {contactPhone && (
              <p className="text-xs sm:text-sm text-white/80 flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-white/60" />
                <a href={`tel:${contactPhone}`} className="hover:underline">
                  {contactPhone}
                </a>
              </p>
            )}
            {(shopInfo?.email || merchant?.email) && (
              <p className="text-xs sm:text-sm text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-white/60" />
                <span>{shopInfo?.email || merchant?.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Connect & Delivery
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                >
                  Facebook
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                >
                  Instagram
                </a>
              )}
              {socialLinks?.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                >
                  YouTube
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <p className="text-xs text-white/65">
              Inside Dhaka:{" "}
              <strong className="text-white">
                {formatPrice(delivery.deliveryChargeInside ?? 60)}
              </strong>{" "}
              · Outside Dhaka:{" "}
              <strong className="text-white">
                {formatPrice(delivery.deliveryChargeOutside ?? 120)}
              </strong>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <p>
            &copy; {new Date().getFullYear()} {shop.shopName}. All rights reserved.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition"
          >
            <Store className="w-3.5 h-3.5" /> Powered by{" "}
            <strong className="text-white">AMARDokan</strong>
          </Link>
        </div>
      </footer>

      {/* ─── Product Quick-View Modal ─── */}
      <Dialog
        open={Boolean(quickViewProduct)}
        onOpenChange={(open) => {
          if (!open) setQuickViewProduct(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl bg-white text-slate-900 border-slate-200 max-h-[90vh] overflow-y-auto">
          {quickViewProduct && qvPricing && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gallery Side */}
              <div className="p-4 sm:p-5 bg-slate-50 flex flex-col gap-3">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/80">
                  {activeImageUrl ? (
                    <img
                      src={activeImageUrl}
                      alt={quickViewProduct.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag
                        className="w-12 h-12"
                        style={{ color: palette.primary }}
                      />
                    </div>
                  )}
                </div>

                {qvGallery.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {qvGallery.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageUrl(url)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                          activeImageUrl === url
                            ? "scale-105"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        style={
                          activeImageUrl === url
                            ? { borderColor: palette.primary }
                            : undefined
                        }
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details Side */}
              <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <DialogHeader className="text-left space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {quickViewProduct?.categoryId?.name && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: rgba(palette.primary, 0.12),
                            color: palette.primary,
                          }}
                        >
                          {quickViewProduct.categoryId.name}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          qvStock > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {qvStock > 0 ? `${qvStock} in stock` : "Out of Stock"}
                      </span>
                    </div>

                    <DialogTitle className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug pt-1 bangla-text">
                      {quickViewProduct.productName}
                    </DialogTitle>
                    {quickViewProduct.productCode && (
                      <DialogDescription className="text-xs text-slate-400">
                        SKU: {quickViewProduct.productCode}
                      </DialogDescription>
                    )}
                  </DialogHeader>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="text-2xl font-extrabold"
                      style={{ color: palette.primary }}
                    >
                      {formatPrice(qvPricing.finalPrice)}
                    </span>
                    {qvPricing.hasDiscount && (
                      <>
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(qvPricing.regularPrice)}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: palette.secondary }}
                        >
                          Save {formatPrice(qvPricing.savings)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {(quickViewProduct.shortDescription ||
                    quickViewProduct.longDescription) && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4 bangla-text">
                      {quickViewProduct.shortDescription ||
                        quickViewProduct.longDescription}
                    </p>
                  )}

                  {/* Variant Selector */}
                  {qvVariants.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-bold text-slate-700">
                        Choose Option:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {qvVariants.map((v, idx) => {
                          const label =
                            formatVariantLabel(v.combination) ||
                            `Option ${idx + 1}`;
                          const selected = idx === selectedVariantIdx;
                          return (
                            <button
                              key={v._id || idx}
                              type="button"
                              onClick={() => {
                                setSelectedVariantIdx(idx);
                                if (v?.image?.url) setActiveImageUrl(v.image.url);
                              }}
                              style={
                                selected
                                  ? {
                                      backgroundColor: palette.primary,
                                      color: "#ffffff",
                                      borderColor: palette.primary,
                                    }
                                  : undefined
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                selected
                                  ? "shadow-xs"
                                  : "border-slate-200 text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Picker */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-700">
                      Quantity
                    </span>
                    <div className="inline-flex items-center rounded-xl border border-slate-200 p-1">
                      <button
                        type="button"
                        onClick={() => setQuickQty((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold">
                        {quickQty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickQty((q) => Math.min(Math.max(1, qvStock), q + 1))
                        }
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={qvStock <= 0}
                    onClick={() =>
                      addToCart(
                        quickViewProduct,
                        selectedVariantIdx,
                        quickQty,
                        false
                      )
                    }
                    style={{
                      backgroundColor: rgba(palette.primary, 0.12),
                      color: palette.primary,
                    }}
                    className="h-11 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    disabled={qvStock <= 0}
                    onClick={() =>
                      addToCart(
                        quickViewProduct,
                        selectedVariantIdx,
                        quickQty,
                        true
                      )
                    }
                    style={{ backgroundColor: palette.primary }}
                    className="h-11 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md inline-flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-40"
                  >
                    <Zap className="w-4 h-4" />
                    Order Now (COD)
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Slide-Over Cart & 1-Step Cash on Delivery Sheet ─── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 bg-white text-slate-900 flex flex-col border-l border-slate-200"
        >
          <SheetHeader className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between pr-6">
              <div>
                <SheetTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShoppingBag
                    className="w-4 h-4"
                    style={{ color: palette.primary }}
                  />
                  {checkoutStep === "success"
                    ? "Order Confirmed"
                    : checkoutStep === "checkout"
                    ? "Cash on Delivery Checkout"
                    : `Your Shopping Bag (${cartTotals.totalItems})`}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 mt-0.5">
                  {shop.shopName}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* 1) Order Confirmed Receipt View */}
          {checkoutStep === "success" && completedOrder ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: palette.accent }}
              >
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Thank You, {completedOrder.customerName}!
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Your order has been placed
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {shop.shopName} has received your order and will call{" "}
                  <strong>{completedOrder.customerPhone}</strong> shortly to confirm dispatch.
                </p>
              </div>

              <div className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Reference</span>
                  <span className="font-mono font-bold text-slate-900">
                    #{String(completedOrder.orderId).slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items Ordered</span>
                  <span className="font-bold text-slate-900">
                    {completedOrder.itemCount} pcs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-bold text-emerald-600">
                    Cash on Delivery
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-800">Payable on Delivery</span>
                  <span
                    className="font-extrabold"
                    style={{ color: palette.primary }}
                  >
                    {formatPrice(completedOrder.grandTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCompletedOrder(null);
                  setCheckoutStep("cart");
                  setCartOpen(false);
                }}
                style={{ backgroundColor: palette.primary }}
                className="w-full h-11 rounded-xl text-sm font-bold text-white shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: rgba(palette.primary, 0.1),
                  color: palette.primary,
                }}
              >
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Your bag is empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse {shop.shopName} and tap &ldquo;Order Now&rdquo; or the cart icon on any item.
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                style={{ backgroundColor: palette.primary }}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white"
              >
                Explore Products
              </button>
            </div>
          ) : checkoutStep === "cart" ? (
            /* 2) Cart Review View */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartKey}
                    className="flex gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 bangla-text">
                          {item.productName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.cartKey)}
                          aria-label="Remove item"
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantLabel && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.variantLabel}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span
                          className="text-sm font-extrabold"
                          style={{ color: palette.primary }}
                        >
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>

                        <div className="inline-flex items-center rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.cartKey, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.cartKey, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartTotals.totalItems} items)</span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(cartTotals.discountedSubtotal)}
                    </span>
                  </div>
                  {cartTotals.totalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount Saved</span>
                      <span>-{formatPrice(cartTotals.totalDiscount)}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`${baseHref}/checkout`}
                  onClick={() => setCartOpen(false)}
                  style={{ backgroundColor: palette.primary }}
                  className="w-full h-11 rounded-xl text-sm font-bold text-white shadow-md inline-flex items-center justify-center gap-2 hover:opacity-95"
                >
                  Proceed to Checkout Page <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            /* 3) 1-Step Cash on Delivery Form */
            <form
              onSubmit={handlePlaceOrder}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Bag (
                  {cartTotals.totalItems} items)
                </button>

                {/* Delivery Zone Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Select Delivery Area *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        id: "insideDhaka",
                        title: "Inside Dhaka",
                        fee: cartTotals.allFreeShipping
                          ? 0
                          : Number(delivery.deliveryChargeInside ?? 60),
                      },
                      {
                        id: "outsideDhaka",
                        title: "Outside Dhaka",
                        fee: cartTotals.allFreeShipping
                          ? 0
                          : Number(delivery.deliveryChargeOutside ?? 120),
                      },
                    ].map((zone) => {
                      const active = deliveryZone === zone.id;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => setDeliveryZone(zone.id)}
                          style={
                            active
                              ? {
                                  borderColor: palette.primary,
                                  backgroundColor: rgba(palette.primary, 0.07),
                                }
                              : undefined
                          }
                          className={`p-3 rounded-xl border text-left transition ${
                            active
                              ? "border-2"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              {zone.title}
                            </span>
                            {active && (
                              <Check
                                className="w-3.5 h-3.5"
                                style={{ color: palette.primary }}
                              />
                            )}
                          </div>
                          <p
                            className="text-xs font-extrabold mt-1"
                            style={{ color: palette.primary }}
                          >
                            {zone.fee === 0 ? "Free" : formatPrice(zone.fee)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name (আপনার নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.customerName}
                      onChange={(e) =>
                        setCustomerForm((p) => ({
                          ...p,
                          customerName: e.target.value,
                        }))
                      }
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Number (মোবাইল নম্বর) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerForm.customerPhone}
                      onChange={(e) =>
                        setCustomerForm((p) => ({
                          ...p,
                          customerPhone: e.target.value,
                        }))
                      }
                      placeholder="017XXXXXXXX"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Delivery Address (সম্পূর্ণ ঠিকানা) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customerForm.customerAddress}
                      onChange={(e) =>
                        setCustomerForm((p) => ({
                          ...p,
                          customerAddress: e.target.value,
                        }))
                      }
                      placeholder="House, Road, Area, Thana, District"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Order Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerForm.customerNote}
                      onChange={(e) =>
                        setCustomerForm((p) => ({
                          ...p,
                          customerNote: e.target.value,
                        }))
                      }
                      placeholder="Any special delivery instruction..."
                      className="w-full h-9 px-3.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Summary Box */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(cartTotals.discountedSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-slate-900">
                      {cartTotals.shippingCost === 0
                        ? "Free"
                        : formatPrice(cartTotals.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                    <span className="font-extrabold text-slate-900">
                      Total (Cash on Delivery)
                    </span>
                    <span
                      className="font-extrabold"
                      style={{ color: palette.primary }}
                    >
                      {formatPrice(cartTotals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-white">
                <button
                  type="submit"
                  disabled={submittingOrder}
                  style={{ backgroundColor: palette.primary }}
                  className="w-full h-12 rounded-xl text-sm font-extrabold text-white shadow-lg inline-flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-60"
                >
                  {submittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Order · {formatPrice(cartTotals.grandTotal)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
