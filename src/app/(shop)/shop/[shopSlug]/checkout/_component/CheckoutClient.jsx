/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { createOrderAction } from "@/app/actions/order";
import {
  BD_PHONE_REGEX,
  CART_EVENT_NAME,
  buildStorePalette,
  computeCartTotals,
  formatPrice,
  readStoreCart,
  rgba,
  writeStoreCart,
} from "../../_lib/storefrontUtils";

export default function CheckoutClient({ store }) {
  const router = useRouter();
  const { userId, shopId, shop, theme = {}, delivery = {} } = store;

  const palette = useMemo(() => buildStorePalette(theme), [theme]);
  const baseHref = `/shop/${encodeURIComponent(shop.shopSlug || shop.shopId)}`;

  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState("insideDhaka");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerNote: "",
  });

  useEffect(() => {
    setCart(readStoreCart(shopId));
    setHydrated(true);
    const onSync = (e) => {
      if (!e?.detail?.shopId || e.detail.shopId === shopId) {
        setCart(readStoreCart(shopId));
      }
    };
    window.addEventListener(CART_EVENT_NAME, onSync);
    return () => window.removeEventListener(CART_EVENT_NAME, onSync);
  }, [shopId]);

  const totals = useMemo(
    () => computeCartTotals(cart, delivery, deliveryZone),
    [cart, delivery, deliveryZone]
  );

  const updateQty = (cartKey, delta) => {
    const next = cart
      .map((item) => {
        if (item.cartKey !== cartKey) return item;
        const q = item.quantity + delta;
        if (q <= 0) return null;
        return { ...item, quantity: Math.min(item.maxStock || 99, q) };
      })
      .filter(Boolean);
    setCart(next);
    writeStoreCart(shopId, next);
  };

  const removeItem = (cartKey) => {
    const next = cart.filter((i) => i.cartKey !== cartKey);
    setCart(next);
    writeStoreCart(shopId, next);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const name = form.customerName.trim();
    const phone = form.customerPhone.replace(/[\s-]/g, "").trim();
    const address = form.customerAddress.trim();

    if (name.length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!BD_PHONE_REGEX.test(phone)) {
      toast.error("Please enter a valid Bangladesh mobile number (e.g. 017XXXXXXXX).");
      return;
    }
    if (address.length < 6) {
      toast.error("Please provide your complete street/area delivery address.");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please accept the store Terms & Conditions to place your order.");
      return;
    }

    setSubmitting(true);
    try {
      // OrderModel enum accepts "cash" | "insideDhaka" | "outsideDhaka"
      const mappedLocation =
        deliveryZone === "insideDhaka" ? "insideDhaka" : "outsideDhaka";
      const zoneNote =
        deliveryZone === "subarea"
          ? `[Dhaka Sub-Area] ${form.customerNote.trim()}`.trim()
          : form.customerNote.trim();

      const payload = {
        userId,
        shopId,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerNote: zoneNote,
        productId: cart.map((i) => i.productId),
        variationId: cart.map((i) => i.variantIndex ?? 0),
        quantity: cart.map((i) => i.quantity),
        orderType: "website",
        deliveryLocation: mappedLocation,
        status: "pending",
        shipping_cost: totals.shippingCost,
        grand_total: totals.grandTotal,
        discounted_total: totals.discountedSubtotal,
        discount: totals.totalDiscount,
        advanced: 0,
        due: totals.grandTotal,
      };

      const res = await createOrderAction(payload);
      const createdId = res?.data?._id || "";

      // Save instant client receipt snapshot for immediate invoice download fallback
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
              deliveryLocation: mappedLocation,
              customer: {
                customerName: name,
                customerPhone: phone,
                customerAddress: address,
                customerNote: zoneNote,
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
              subtotal: totals.discountedSubtotal,
              discount: totals.totalDiscount,
              shippingCost: totals.shippingCost,
              advanced: 0,
              due: totals.grandTotal,
              grandTotal: totals.grandTotal,
            })
          );
        } catch {
          // ignore storage quota errors
        }
      }

      writeStoreCart(shopId, []);
      setCart([]);
      toast.success("Order confirmed! Generating your invoice...");
      router.push(
        `${baseHref}/thank-you${
          createdId ? `?orderId=${encodeURIComponent(createdId)}` : ""
        }`
      );
    } catch (error) {
      toast.error(error?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 h-96 rounded-3xl bg-slate-200/50 animate-pulse" />
        <div className="lg:col-span-5 h-96 rounded-3xl bg-slate-200/50 animate-pulse" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: rgba(palette.primary, 0.12),
            color: palette.primary,
          }}
        >
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: palette.text }}>
          Your shopping bag is empty
        </h1>
        <p className="text-sm" style={{ color: palette.muted }}>
          Add products from <strong>{shop.shopName}</strong> to proceed to Cash on Delivery checkout.
        </p>
        <Link
          href={baseHref}
          style={{ backgroundColor: palette.primary }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  const zones = [
    {
      id: "insideDhaka",
      title: "Inside Dhaka City",
      eta: "24–48 Hours",
      fee: totals.allFreeShipping
        ? 0
        : Number(delivery.deliveryChargeInside ?? 60),
    },
    ...(Number(delivery.deliveryChargeSubarea) > 0
      ? [
          {
            id: "subarea",
            title: "Dhaka Sub-Area",
            eta: "2–3 Days",
            fee: totals.allFreeShipping
              ? 0
              : Number(delivery.deliveryChargeSubarea ?? 90),
          },
        ]
      : []),
    {
      id: "outsideDhaka",
      title: "Outside Dhaka",
      eta: "2–4 Days",
      fee: totals.allFreeShipping
        ? 0
        : Number(delivery.deliveryChargeOutside ?? 120),
    },
  ];

  return (
    <form
      onSubmit={handleSubmitOrder}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: palette.text }}
          >
            Secure Cash on Delivery Checkout
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: palette.muted }}>
            Fill in your delivery details below — pay cash only when your order arrives.
          </p>
        </div>
        <Link
          href={baseHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold hover:underline"
          style={{ color: palette.primary }}
        >
          <ArrowLeft className="w-4 h-4" /> Add More Items
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* ─── Left Column: Customer Info, Zone & Payment (7 cols) ─── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Contact & Shipping Address */}
          <div
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="rounded-3xl p-5 sm:p-7 space-y-5 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                style={{ backgroundColor: palette.primary }}
                className="w-7 h-7 rounded-lg text-white text-xs font-extrabold flex items-center justify-center"
              >
                1
              </span>
              <h2
                className="text-base sm:text-lg font-extrabold"
                style={{ color: palette.text }}
              >
                Recipient & Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: palette.text }}>
                  <User className="w-3.5 h-3.5" style={{ color: palette.primary }} />
                  Full Name (আপনার নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerName: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  style={{
                    backgroundColor: palette.subtleBg,
                    color: palette.text,
                    border: `1px solid ${palette.borderCol}`,
                  }}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none focus:ring-2 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: palette.text }}>
                  <Phone className="w-3.5 h-3.5" style={{ color: palette.primary }} />
                  Mobile Number (মোবাইল নম্বর) *
                </label>
                <input
                  type="tel"
                  required
                  value={form.customerPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerPhone: e.target.value }))
                  }
                  placeholder="017XXXXXXXX"
                  style={{
                    backgroundColor: palette.subtleBg,
                    color: palette.text,
                    border: `1px solid ${palette.borderCol}`,
                  }}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none focus:ring-2 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: palette.text }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: palette.primary }} />
                Complete Delivery Address (সম্পূর্ণ ঠিকানা) *
              </label>
              <textarea
                rows={3}
                required
                value={form.customerAddress}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerAddress: e.target.value }))
                }
                placeholder="House / Flat #, Road #, Area, Thana / Upazila, District"
                style={{
                  backgroundColor: palette.subtleBg,
                  color: palette.text,
                  border: `1px solid ${palette.borderCol}`,
                }}
                className="w-full p-3.5 rounded-xl text-sm outline-none focus:ring-2 transition resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold block" style={{ color: palette.text }}>
                Delivery Note (Optional)
              </label>
              <input
                type="text"
                value={form.customerNote}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerNote: e.target.value }))
                }
                placeholder="Landmark, preferred delivery time, or gift note..."
                style={{
                  backgroundColor: palette.subtleBg,
                  color: palette.text,
                  border: `1px solid ${palette.borderCol}`,
                }}
                className="w-full h-10 px-4 rounded-xl text-xs sm:text-sm outline-none"
              />
            </div>
          </div>

          {/* Step 2: Delivery Area */}
          <div
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                style={{ backgroundColor: palette.primary }}
                className="w-7 h-7 rounded-lg text-white text-xs font-extrabold flex items-center justify-center"
              >
                2
              </span>
              <h2
                className="text-base sm:text-lg font-extrabold"
                style={{ color: palette.text }}
              >
                Select Delivery Zone
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 ${
                zones.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
              } gap-3`}
            >
              {zones.map((z) => {
                const active = deliveryZone === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setDeliveryZone(z.id)}
                    style={
                      active
                        ? {
                            borderColor: palette.primary,
                            backgroundColor: rgba(palette.primary, 0.08),
                          }
                        : {
                            borderColor: palette.borderCol,
                            backgroundColor: palette.subtleBg,
                          }
                    }
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      active ? "shadow-xs" : "hover:opacity-90"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs sm:text-sm font-extrabold"
                        style={{ color: palette.text }}
                      >
                        {z.title}
                      </span>
                      {active && (
                        <Check
                          className="w-4 h-4 shrink-0"
                          style={{ color: palette.primary }}
                        />
                      )}
                    </div>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: palette.muted }}
                    >
                      Est. {z.eta}
                    </p>
                    <p
                      className="text-base font-extrabold mt-2"
                      style={{ color: palette.primary }}
                    >
                      {z.fee === 0 ? "Free Shipping" : formatPrice(z.fee)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                style={{ backgroundColor: palette.primary }}
                className="w-7 h-7 rounded-lg text-white text-xs font-extrabold flex items-center justify-center"
              >
                3
              </span>
              <h2
                className="text-base sm:text-lg font-extrabold"
                style={{ color: palette.text }}
              >
                Payment Method
              </h2>
            </div>

            <div
              style={{
                borderColor: palette.accent,
                backgroundColor: rgba(palette.accent, 0.08),
              }}
              className="rounded-2xl border-2 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: palette.accent }}
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0"
                >
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className="text-sm font-extrabold"
                    style={{ color: palette.text }}
                  >
                    Cash on Delivery (পণ্য হাতে পেয়ে মূল্য পরিশোধ)
                  </p>
                  <p className="text-xs" style={{ color: palette.muted }}>
                    No advance online payment required. Pay the courier in cash upon delivery.
                  </p>
                </div>
              </div>
              <CheckCircle2
                className="w-5 h-5 shrink-0"
                style={{ color: palette.accent }}
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ accentColor: palette.primary }}
                className="mt-0.5 w-4 h-4 rounded"
              />
              <span style={{ color: palette.muted }}>
                I agree to the{" "}
                <Link
                  href={`${baseHref}/terms`}
                  target="_blank"
                  className="font-bold underline"
                  style={{ color: palette.primary }}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href={`${baseHref}/privacy-policy`}
                  target="_blank"
                  className="font-bold underline"
                  style={{ color: palette.primary }}
                >
                  Privacy Policy
                </Link>{" "}
                of {shop.shopName}.
              </span>
            </label>
          </div>
        </div>

        {/* ─── Right Column: Sticky Order Summary (5 cols) ─── */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="rounded-3xl p-5 sm:p-6 space-y-5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-base sm:text-lg font-extrabold flex items-center gap-2"
                style={{ color: palette.text }}
              >
                <ShoppingBag
                  className="w-4 h-4"
                  style={{ color: palette.primary }}
                />
                Order Summary
              </h2>
              <span
                style={{
                  backgroundColor: rgba(palette.primary, 0.12),
                  color: palette.primary,
                }}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              >
                {totals.totalItems} pcs
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartKey}
                  style={{
                    backgroundColor: palette.subtleBg,
                    border: `1px solid ${palette.borderCol}`,
                  }}
                  className="flex gap-3 p-3 rounded-2xl"
                >
                  <Link
                    href={`${baseHref}/product/${encodeURIComponent(
                      item.productId
                    )}`}
                    className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0"
                  >
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
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`${baseHref}/product/${encodeURIComponent(
                          item.productId
                        )}`}
                        className="text-xs sm:text-sm font-bold line-clamp-1 hover:underline bangla-text"
                        style={{ color: palette.text }}
                      >
                        {item.productName}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartKey)}
                        aria-label="Remove item"
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variantLabel && (
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: palette.muted }}
                      >
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

                      <div
                        style={{ borderColor: palette.borderCol }}
                        className="inline-flex items-center rounded-lg border"
                      >
                        <button
                          type="button"
                          onClick={() => updateQty(item.cartKey, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-black/5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.cartKey, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-black/5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div
              style={{ borderColor: palette.borderCol }}
              className="pt-4 border-t space-y-2 text-xs sm:text-sm"
            >
              <div className="flex justify-between">
                <span style={{ color: palette.muted }}>Items Subtotal</span>
                <span className="font-bold" style={{ color: palette.text }}>
                  {formatPrice(totals.discountedSubtotal)}
                </span>
              </div>

              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Product Discount Saved</span>
                  <span>-{formatPrice(totals.totalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span style={{ color: palette.muted }} className="inline-flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Delivery Fee
                </span>
                <span className="font-bold" style={{ color: palette.text }}>
                  {totals.shippingCost === 0
                    ? "Free"
                    : formatPrice(totals.shippingCost)}
                </span>
              </div>

              <div
                style={{ borderColor: palette.borderCol }}
                className="flex justify-between items-baseline pt-3 border-t text-base sm:text-lg"
              >
                <span className="font-extrabold" style={{ color: palette.text }}>
                  Total Payable
                </span>
                <span
                  className="text-xl font-extrabold"
                  style={{ color: palette.primary }}
                >
                  {formatPrice(totals.grandTotal)}
                </span>
              </div>
            </div>

            {/* Submit Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: palette.primary }}
              className="w-full h-13 rounded-2xl text-white text-sm sm:text-base font-extrabold shadow-lg inline-flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirming Order...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Place Order · {formatPrice(totals.grandTotal)}
                </>
              )}
            </button>

            <p
              className="text-[11px] text-center flex items-center justify-center gap-1.5"
              style={{ color: palette.muted }}
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: palette.accent }} />
              Instant official invoice download available on the next screen
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
