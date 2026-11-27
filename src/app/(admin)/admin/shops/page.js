import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { listAllShopsAdminQuery } from "@/queries/admin";
import AdminShopsClient from "./_component/AdminShopsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Merchant Stores | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminShopsPage() {
  const admin = await getServerAdminSession();
  if (!admin) redirect("/admin/login");

  const shops = await listAllShopsAdminQuery();
  return <AdminShopsClient initialShops={shops} />;
}
