import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getAdminAnalyticsQuery } from "@/queries/admin";
import AdminAnalyticsClient from "./_component/AdminAnalyticsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Platform Analytics | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const admin = await getServerAdminSession();
  if (!admin) redirect("/admin/login");

  const analytics = await getAdminAnalyticsQuery();
  return <AdminAnalyticsClient data={analytics} />;
}
