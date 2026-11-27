import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { listAllMerchantsAdminQuery } from "@/queries/admin";
import AdminMerchantsClient from "./_component/AdminMerchantsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Merchants Directory | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMerchantsPage() {
  const admin = await getServerAdminSession();
  if (!admin) redirect("/admin/login");

  const merchants = await listAllMerchantsAdminQuery();
  return <AdminMerchantsClient initialMerchants={merchants} />;
}
