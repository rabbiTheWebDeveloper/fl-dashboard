import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getStorefrontShellBySlugQuery } from "@/queries/storefront";
import StorefrontChrome from "../_component/StorefrontChrome";
import { buildStorePalette, rgba } from "../_lib/storefrontUtils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug } = await params;
  const store = await getStorefrontShellBySlugQuery(shopSlug);
  if (!store) return { title: "Privacy Policy | AMARDokan" };
  return {
    title: `Privacy Policy — ${store.shop.shopName}`,
    description: `How ${store.shop.shopName} collects, protects, and uses customer information for order fulfillment.`,
  };
}

export default async function StorePrivacyPolicyPage({ params }) {
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

  const { shop, shopInfo, merchant, theme = {} } = store;
  const palette = buildStorePalette(theme);
  const contactPhone = shopInfo?.phone || merchant?.phone || "";
  const contactEmail = shopInfo?.email || merchant?.email || "";

  const policies = [
    {
      title: "1. Information We Collect",
      body: `When you place an order at ${shop.shopName}, we collect only the essential details needed to process and deliver your purchase: your Full Name, Mobile Number, Delivery Address, and any optional Order Notes you provide during checkout.`,
    },
    {
      title: "2. How We Use Your Information",
      body: `Your contact and address details are used strictly to verify your order, generate your official invoice, coordinate parcel delivery, and provide customer support or warranty/replacement assistance.`,
    },
    {
      title: "3. Courier & Third-Party Disclosure",
      body: `We share your recipient name, delivery address, phone number, and Cash-on-Delivery payable amount exclusively with trusted logistics/courier partners to complete doorstep delivery. ${shop.shopName} never sells or rents your personal information to third-party advertisers.`,
    },
    {
      title: "4. Local Browser Storage & Cookies",
      body: `Our storefront uses browser local storage solely to keep your shopping bag items saved while you browse ${shop.shopName} and complete checkout. No sensitive payment card data is stored in your browser.`,
    },
    {
      title: "5. Data Security & Retention",
      body: `Order records and invoices are stored securely on protected infrastructure so you and the merchant can reference past purchases for support, accounting, and replacement requests.`,
    },
    {
      title: "6. Your Privacy Rights & Contact",
      body: `You may request updates or corrections to your delivery details prior to dispatch by contacting ${shop.shopName}${
        contactPhone ? ` at ${contactPhone}` : ""
      }${contactEmail ? ` or via email at ${contactEmail}` : ""}.`,
    },
  ];

  return (
    <StorefrontChrome
      store={store}
      activePage="privacy"
      breadcrumbs={[{ label: "Privacy Policy" }]}
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
              backgroundColor: rgba(palette.accent, 0.15),
              color: palette.accent,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Data Protection
          </span>
          <h1
            className="text-2xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: palette.text }}
          >
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: palette.muted }}>
            How <strong>{shop.shopName}</strong> safeguards your personal and delivery information.
          </p>
        </div>

        <div className="space-y-4">
          {policies.map((sec, idx) => (
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
