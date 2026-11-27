import { buildMetadata } from "@/lib/seo";
import { getAllPublicShopsQuery } from "@/queries/storefront";
import ShopDirectoryClient from "./_component/ShopDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Online Store Directory — Explore Verified Shops",
  description:
    "Discover verified AMARDokan merchant storefronts, browse live product catalogs, and shop with Cash on Delivery.",
  path: "/shop",
});

export default async function ShopDirectoryPage() {
  const shops = await getAllPublicShopsQuery();
  return <ShopDirectoryClient shops={shops} />;
}
