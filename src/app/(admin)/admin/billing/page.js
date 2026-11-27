import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { listAllBillingAdminQuery } from "@/queries/admin";
import AdminBillingClient from "./_component/AdminBillingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SaaS Billing & Subscriptions | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBillingPage() {
  const admin = await getServerAdminSession();
  if (!admin) redirect("/admin/login");

  const data = await listAllBillingAdminQuery();
  return (
    <AdminBillingClient
      initialInvoices={data.invoices}
      shops={data.shops}
    />
  );
}
