import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { listAllProductsAdminQuery } from "@/queries/admin";
import AdminProductsClient from "./_component/AdminProductsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catalog Moderation | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const admin = await getServerAdminSession();
  if (!admin) redirect("/admin/login");

  const products = await listAllProductsAdminQuery();
  return <AdminProductsClient initialProducts={products} />;
}
