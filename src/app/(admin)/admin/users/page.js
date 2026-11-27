import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { listAdminUsersQuery } from "@/queries/admin";
import AdminUsersClient from "./_component/AdminUsersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Users & RBAC Roles | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage({ searchParams }) {
  const [admin, sp] = await Promise.all([
    getServerAdminSession(),
    searchParams,
  ]);

  if (!admin) {
    redirect("/admin/login");
  }

  const users = await listAdminUsersQuery();
  return (
    <AdminUsersClient
      currentAdmin={admin}
      initialUsers={users}
      openCreateInitially={sp?.create === "1"}
    />
  );
}
