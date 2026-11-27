import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getAdminOverviewStatsQuery } from "@/queries/admin";
import AdminOverviewClient from "./_component/AdminOverviewClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Executive Admin Dashboard | AMARDokan",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const admin = await getServerAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const stats = await getAdminOverviewStatsQuery();
  return <AdminOverviewClient admin={admin} initialStats={stats} />;
}
