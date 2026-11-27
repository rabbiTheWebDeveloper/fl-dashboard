import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStorefrontOrderInvoiceQuery } from "@/queries/storefront";
import StorefrontChrome from "../_component/StorefrontChrome";
import ThankYouInvoiceClient from "./_component/ThankYouInvoiceClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug } = await params;
  const data = await getStorefrontOrderInvoiceQuery(shopSlug, null);

  return {
    title: data?.store
      ? `Order Confirmed & Invoice — ${data.store.shop.shopName}`
      : "Order Confirmed | AMARDokan",
    robots: { index: false, follow: false },
  };
}

export default async function StoreThankYouPage({ params, searchParams }) {
  const [{ shopSlug }, sp] = await Promise.all([params, searchParams]);
  const orderId = typeof sp?.orderId === "string" ? sp.orderId : "";
  const data = await getStorefrontOrderInvoiceQuery(shopSlug, orderId);

  if (!data?.store) {
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
      store={data.store}
      breadcrumbs={[{ label: "Order Confirmation & Invoice" }]}
    >
      <ThankYouInvoiceClient
        store={data.store}
        serverOrder={data.order}
        orderId={orderId}
      />
    </StorefrontChrome>
  );
}
