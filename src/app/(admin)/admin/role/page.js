import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getAdminRoleMatrixQuery } from "@/queries/admin";
import AdminRoleClient from "./_component/AdminRoleClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "RBAC Role Matrix & Permissions | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminRolePage() {
  const admin = await getServerAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const data = await getAdminRoleMatrixQuery();
  return <AdminRoleClient currentAdmin={admin} initialData={data} />;
}
