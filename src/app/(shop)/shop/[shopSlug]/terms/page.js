import Link from "next/link";
import { ArrowLeft, FileCheck2 } from "lucide-react";
import { getStorefrontShellBySlugQuery } from "@/queries/storefront";
import StorefrontChrome from "../_component/StorefrontChrome";
import { buildStorePalette, formatPrice, rgba } from "../_lib/storefrontUtils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug } = await params;
  const store = await getStorefrontShellBySlugQuery(shopSlug);
  if (!store) return { title: "Terms & Conditions | AMARDokan" };
  return {
    title: `Terms & Conditions — ${store.shop.shopName}`,
    description: `Read the ordering, Cash on Delivery, shipping, and replacement terms for ${store.shop.shopName}.`,
  };
}

export default async function StoreTermsPage({ params }) {
  const { shopSlug } = await params;
  const store = await getStorefrontShellBySlugQuery(shopSlug);

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-extrabold">Store Not Found</h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Browse All Stores
          </Link>
        </div>
      </div>
    );
  }

  const { shop, shopInfo, merchant, theme = {}, delivery = {} } = store;
  const palette = buildStorePalette(theme);
  const contactPhone = shopInfo?.phone || merchant?.phone || "";
  const contactEmail = shopInfo?.email || merchant?.email || "";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: `By browsing and placing an order on ${shop.shopName} (/shop/${shop.shopSlug}), you agree to abide by these Terms & Conditions. Please review your selected items, variant options, quantity, and delivery address carefully before confirming your order.`,
    },
    {
      title: "2. Pricing & Product Availability",
      body: `All prices on ${shop.shopName} are listed in Bangladeshi Taka (৳ / BDT). Promotional discounts apply while stocks last. In the rare event an ordered item or variant becomes unavailable, our support team will notify you immediately by phone to offer an alternative or cancel the order without any charge.`,
    },
    {
      title: "3. Order Verification & Cash on Delivery (COD)",
      body: `Orders placed via Cash on Delivery may be verified via a quick confirmation phone call to your provided mobile number prior to dispatch. Full payment in cash is collected by the courier delivery agent when handing over your parcel.`,
    },
    {
      title: "4. Delivery Zones, Charges & Estimated Timelines",
      body: `Standard delivery charges are ${formatPrice(
        delivery.deliveryChargeInside ?? 60
      )} Inside Dhaka and ${formatPrice(
        delivery.deliveryChargeOutside ?? 120
      )} Outside Dhaka (unless an item qualifies for Free Shipping). Estimated delivery times are 24–48 hours Inside Dhaka and 2–4 business days Outside Dhaka, subject to courier schedules and weather/traffic conditions.`,
    },
    {
      title: "5. Parcel Inspection, Return & Replacement Policy",
      body: `We strongly encourage checking your parcel in the presence of the delivery agent. If you receive a damaged, defective, or incorrect product/variant, please notify ${shop.shopName} within 48 hours of receipt with your Invoice # and clear photo/unboxing video proof so we can arrange a prompt replacement or return.`,
    },
    {
      title: "6. Order Cancellation",
      body: `You may request an order cancellation free of charge at any time before your parcel has been dispatched to the courier. Repeated refusal of confirmed doorstep COD parcels may restrict future Cash on Delivery eligibility.`,
    },
    {
      title: "7. Store Support & Contact",
      body: `For any questions regarding these Terms & Conditions, order tracking, or exchange requests, please contact ${shop.shopName}${
        contactPhone ? ` at ${contactPhone}` : ""
      }${contactEmail ? ` or email ${contactEmail}` : ""}${
        shopInfo?.shopAddress ? ` (${shopInfo.shopAddress})` : ""
      }.`,
    },
  ];

  return (
    <StorefrontChrome
      store={store}
      activePage="terms"
      breadcrumbs={[{ label: "Terms & Conditions" }]}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div
          style={{
            backgroundColor: palette.banner,
            border: `1px solid ${rgba(palette.primary, 0.18)}`,
          }}
          className="rounded-3xl p-6 sm:p-9 space-y-2.5"
        >
          <span
            style={{
              backgroundColor: rgba(palette.primary, 0.14),
              color: palette.primary,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
          >
            <FileCheck2 className="w-3.5 h-3.5" /> Store Policies
          </span>
          <h1
            className="text-2xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: palette.text }}
          >
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: palette.muted }}>
            Applicable to all purchases made at <strong>{shop.shopName}</strong>.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <section
              key={idx}
              style={{
                backgroundColor: palette.surfaceBg,
                border: `1px solid ${palette.borderCol}`,
              }}
              className="rounded-2xl p-5 sm:p-6 space-y-2 shadow-2xs"
            >
              <h2
                className="text-base sm:text-lg font-extrabold"
                style={{ color: palette.text }}
              >
                {sec.title}
              </h2>
              <p
                className="text-xs sm:text-sm leading-relaxed bangla-text"
                style={{ color: palette.muted }}
              >
                {sec.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </StorefrontChrome>
  );
}
