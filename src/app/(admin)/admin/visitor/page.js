import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getAdminVisitorAnalyticsQuery } from "@/queries/admin";
import AdminVisitorClient from "./_component/AdminVisitorClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visitor & Storefront Traffic | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminVisitorPage() {
  const admin = await getServerAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const data = await getAdminVisitorAnalyticsQuery();
  return <AdminVisitorClient initialData={data} />;
}
