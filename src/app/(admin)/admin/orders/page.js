import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { listAllOrdersAdminQuery } from "@/queries/admin";
import AdminOrdersClient from "./_component/AdminOrdersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Global Orders Monitor | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  const admin = await getServerAdminSession();
  if (!admin) redirect("/admin/login");

  const orders = await listAllOrdersAdminQuery();
  return <AdminOrdersClient initialOrders={orders} />;
}
