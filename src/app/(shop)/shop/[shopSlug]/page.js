import Link from "next/link";
import { ArrowLeft, PlusCircle, SearchX, Store } from "lucide-react";
import { getStorefrontBySlugQuery } from "@/queries/storefront";
import StorefrontClient from "./_component/StorefrontClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug } = await params;
  const store = await getStorefrontBySlugQuery(shopSlug);

  if (!store) {
    return {
      title: "Store Not Found | AMARDokan",
      description: "The requested online store could not be found on AMARDokan.",
    };
  }

  const title =
    store.shopInfo?.websiteTitle ||
    `${store.shop.shopName} — Official Online Store`;
  const description =
    store.shopInfo?.description ||
    store.shopInfo?.shopInfo ||
    `Shop authentic products from ${store.shop.shopName} with fast delivery and Cash on Delivery.`;
  const logoUrl = store.shopInfo?.companyLogo?.url || undefined;
  const faviconUrl = store.shopInfo?.favicon?.url || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(logoUrl ? { images: [{ url: logoUrl, alt: store.shop.shopName }] } : {}),
    },
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
  };
}

export default async function ShopStorefrontPage({ params, searchParams }) {
  const [{ shopSlug }, sp] = await Promise.all([params, searchParams]);
  const store = await getStorefrontBySlugQuery(shopSlug);

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30 mb-5">
            <SearchX className="w-8 h-8 text-white" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-400/25 px-3 py-1 text-xs font-semibold text-rose-300 mb-3">
            404 · Store Not Found
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            We couldn&apos;t find this shop
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            No store matched slug{" "}
            <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">
              {decodeURIComponent(String(shopSlug || ""))}
            </code>
            . Please double-check the store URL or explore active shops below.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:opacity-95 transition"
            >
              <Store className="w-4 h-4" />
              Browse Stores
            </Link>
            <Link
              href="/registration"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Open Your Shop
            </Link>
          </div>

          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to AMARDokan Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StorefrontClient
      store={store}
      initialCategory={typeof sp?.category === "string" ? sp.category : "all"}
      initialSearch={typeof sp?.q === "string" ? sp.q : ""}
    />
  );
}
