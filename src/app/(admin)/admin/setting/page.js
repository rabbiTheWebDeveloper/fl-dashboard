import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getPlatformSettingsQuery } from "@/queries/admin";
import AdminSettingClient from "./_component/AdminSettingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "System & Platform Settings | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSettingPage() {
  const admin = await getServerAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const settings = await getPlatformSettingsQuery();
  return <AdminSettingClient admin={admin} initialSettings={settings} />;
}
