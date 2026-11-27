import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";
import { getStorefrontProductDetailQuery } from "@/queries/storefront";
import StorefrontChrome from "../../_component/StorefrontChrome";
import ProductDetailClient from "./_component/ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { shopSlug, productId } = await params;
  const data = await getStorefrontProductDetailQuery(shopSlug, productId);

  if (!data?.store || !data?.product) {
    return {
      title: "Product Not Found | AMARDokan",
      description: "The requested product could not be found.",
    };
  }

  const { store, product } = data;
  const title =
    product.metaTitle || `${product.productName} — ${store.shop.shopName}`;
  const description =
    product.metaDescription ||
    product.shortDescription ||
    `Buy ${product.productName} from ${store.shop.shopName} with Cash on Delivery.`;
  const img = product?.mainImage?.url || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(img ? { images: [{ url: img, alt: product.productName }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { shopSlug, productId } = await params;
  const data = await getStorefrontProductDetailQuery(shopSlug, productId);

  if (!data?.store) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-extrabold">Store Not Found</h1>
          <p className="text-sm text-slate-400">
            We couldn&apos;t locate this store on AMARDokan.
          </p>
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

  const { store, product, relatedProducts } = data;
  const baseHref = `/shop/${encodeURIComponent(store.shop.shopSlug || store.shop.shopId)}`;

  if (!product) {
    return (
      <StorefrontChrome
        store={store}
        breadcrumbs={[{ label: "Product Not Found" }]}
      >
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <PackageX className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold">Product Unavailable</h1>
          <p className="text-sm opacity-75">
            This item may have been removed or is no longer active in{" "}
            <strong>{store.shop.shopName}</strong>.
          </p>
          <Link
            href={baseHref}
            style={{ backgroundColor: store.theme?.primary || "#7c3aed" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
          </Link>
        </div>
      </StorefrontChrome>
    );
  }

  const crumbs = [
    ...(product?.categoryId?.name
      ? [
          {
            label: product.categoryId.name,
            href: `${baseHref}?category=${encodeURIComponent(product.categoryId._id)}`,
          },
        ]
      : []),
    { label: product.productName },
  ];

  return (
    <StorefrontChrome store={store} breadcrumbs={crumbs}>
      <ProductDetailClient
        store={store}
        product={product}
        relatedProducts={relatedProducts}
      />
    </StorefrontChrome>
  );
}
