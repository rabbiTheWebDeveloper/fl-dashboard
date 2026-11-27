import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/adminAuth";
import { getAdminPaymentListQuery } from "@/queries/admin";
import PaymentListClient from "./_component/PaymentListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment List & Transactions | AMARDokan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPaymentListPage() {
  const admin = await getServerAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const data = await getAdminPaymentListQuery();
  return <PaymentListClient admin={admin} initialData={data} />;
}
