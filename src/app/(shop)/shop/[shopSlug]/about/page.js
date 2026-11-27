import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Boxes,
  HeartHandshake,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { getStorefrontShellBySlugQuery } from "@/queries/storefront";
import StorefrontChrome from "../_component/StorefrontChrome";
import {
  buildStorePalette,
  formatPrice,
  getStoreWhatsappUrl,
  rgba,
} from "../_lib/storefrontUtils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug } = await params;
  const store = await getStorefrontShellBySlugQuery(shopSlug);
  if (!store) return { title: "About Us | AMARDokan" };
  return {
    title: `About Us — ${store.shop.shopName}`,
    description:
      store.shopInfo?.description ||
      `Learn more about ${store.shop.shopName}, our quality commitment, and nationwide Cash on Delivery service.`,
  };
}

export default async function StoreAboutPage({ params }) {
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

  const { shop, merchant, shopInfo, theme = {}, categories = [], socialLinks, delivery = {}, productCount = 0 } = store;
  const palette = buildStorePalette(theme);
  const baseHref = `/shop/${encodeURIComponent(shop.shopSlug || shop.shopId)}`;
  const contactPhone = shopInfo?.phone || merchant?.phone || "";
  const contactEmail = shopInfo?.email || merchant?.email || "";
  const whatsappUrl = getStoreWhatsappUrl(socialLinks, contactPhone);

  return (
    <StorefrontChrome
      store={store}
      activePage="about"
      breadcrumbs={[{ label: "About Us" }]}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Hero Story Card */}
        <section
          style={{
            backgroundColor: palette.banner,
            border: `1px solid ${rgba(palette.primary, 0.18)}`,
          }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12"
        >
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: palette.primary }}
          />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span
              style={{
                backgroundColor: rgba(palette.primary, 0.14),
                color: palette.primary,
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" /> Official Merchant Story
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight bangla-text"
              style={{ color: palette.text }}
            >
              About {shop.shopName}
            </h1>
            <p
              className="text-sm sm:text-base leading-relaxed whitespace-pre-line bangla-text"
              style={{ color: palette.muted }}
            >
              {shopInfo?.description ||
                shopInfo?.shopInfo ||
                `Welcome to ${shop.shopName}! We are dedicated to bringing authentic, carefully inspected products to shoppers across Bangladesh with transparent pricing, responsive customer care, and convenient Cash on Delivery.`}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href={baseHref}
                style={{ backgroundColor: palette.primary }}
                className="px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md inline-flex items-center gap-2 hover:opacity-95 transition"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    borderColor: rgba(palette.accent, 0.35),
                    color: palette.accent,
                  }}
                  className="px-5 py-3 rounded-xl border text-sm font-bold inline-flex items-center gap-2 hover:opacity-85 transition"
                >
                  <MessageCircle className="w-4 h-4" /> Message Us
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Quick Store Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Boxes,
              label: "Active Products",
              value: `${productCount}+`,
              color: palette.primary,
            },
            {
              icon: Layers,
              label: "Curated Categories",
              value: `${categories.length || 1}+`,
              color: palette.secondary,
            },
            {
              icon: Truck,
              label: "Inside Dhaka Fee",
              value: formatPrice(delivery.deliveryChargeInside ?? 60),
              color: palette.accent,
            },
            {
              icon: BadgeCheck,
              label: "Merchant Status",
              value: "Verified Store",
              color: palette.primary,
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: palette.surfaceBg,
                  border: `1px solid ${palette.borderCol}`,
                }}
                className="rounded-2xl p-5 space-y-2 shadow-2xs"
              >
                <div
                  style={{
                    backgroundColor: rgba(stat.color, 0.12),
                    color: stat.color,
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p
                  className="text-xl sm:text-2xl font-extrabold"
                  style={{ color: palette.text }}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-semibold" style={{ color: palette.muted }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        {/* Core Values */}
        <section className="space-y-5">
          <h2
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: palette.text }}
          >
            Why Customers Trust {shop.shopName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Award,
                title: "100% Quality Checked",
                desc: "Every item goes through a manual quality and packaging inspection before being handed over to our courier partner.",
                color: palette.primary,
              },
              {
                icon: HeartHandshake,
                title: "Safe Cash on Delivery",
                desc: "Shop with complete peace of mind — order online in seconds and pay in cash when the parcel reaches your address.",
                color: palette.accent,
              },
              {
                icon: ShieldCheck,
                title: "Responsive Support",
                desc: "Need sizing advice, variant details, or delivery updates? Reach out directly by phone or WhatsApp.",
                color: palette.secondary,
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: palette.surfaceBg,
                    border: `1px solid ${palette.borderCol}`,
                  }}
                  className="rounded-3xl p-6 space-y-3 shadow-xs"
                >
                  <div
                    style={{
                      backgroundColor: rgba(pillar.color, 0.12),
                      color: pillar.color,
                    }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3
                    className="text-base sm:text-lg font-extrabold"
                    style={{ color: palette.text }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: palette.muted }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact & Location Card */}
        <section
          style={{
            backgroundColor: palette.surfaceBg,
            border: `1px solid ${palette.borderCol}`,
          }}
          className="rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
        >
          <div className="space-y-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider"
              style={{ color: palette.primary }}
            >
              <Store className="w-3.5 h-3.5" /> Get in Touch
            </span>
            <h2
              className="text-xl sm:text-2xl font-extrabold"
              style={{ color: palette.text }}
            >
              Store Contact & Address
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: palette.muted }}>
              Have a question about an order or product? Contact {shop.shopName} directly using the channels below.
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {shopInfo?.shopAddress && (
              <div
                style={{ backgroundColor: palette.subtleBg }}
                className="p-3.5 rounded-2xl flex items-start gap-3 bangla-text"
              >
                <MapPin
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: palette.primary }}
                />
                <span>{shopInfo.shopAddress}</span>
              </div>
            )}
            {contactPhone && (
              <div
                style={{ backgroundColor: palette.subtleBg }}
                className="p-3.5 rounded-2xl flex items-center gap-3"
              >
                <Phone
                  className="w-4 h-4 shrink-0"
                  style={{ color: palette.accent }}
                />
                <a href={`tel:${contactPhone}`} className="font-bold hover:underline">
                  {contactPhone}
                </a>
              </div>
            )}
            {contactEmail && (
              <div
                style={{ backgroundColor: palette.subtleBg }}
                className="p-3.5 rounded-2xl flex items-center gap-3"
              >
                <Mail
                  className="w-4 h-4 shrink-0"
                  style={{ color: palette.secondary }}
                />
                <a href={`mailto:${contactEmail}`} className="font-semibold hover:underline">
                  {contactEmail}
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </StorefrontChrome>
  );
}
