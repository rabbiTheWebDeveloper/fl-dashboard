import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getAdminDomainsQuery } from "@/queries/admin";
import AdminDomainClient from "./_component/AdminDomainClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Custom Domains & DNS Routing | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDomainPage() {
  const admin = await getServerAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const data = await getAdminDomainsQuery();
  return <AdminDomainClient admin={admin} initialData={data} />;
}
