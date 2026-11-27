import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStorefrontShellBySlugQuery } from "@/queries/storefront";
import StorefrontChrome from "../_component/StorefrontChrome";
import CheckoutClient from "./_component/CheckoutClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug } = await params;
  const store = await getStorefrontShellBySlugQuery(shopSlug);

  if (!store) {
    return { title: "Checkout | AMARDokan" };
  }

  return {
    title: `Checkout — ${store.shop.shopName}`,
    description: `Complete your Cash on Delivery order at ${store.shop.shopName}.`,
  };
}

export default async function StoreCheckoutPage({ params }) {
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

  return (
    <StorefrontChrome
      store={store}
      activePage="checkout"
      breadcrumbs={[{ label: "Checkout" }]}
    >
      <CheckoutClient store={store} />
    </StorefrontChrome>
  );
}
