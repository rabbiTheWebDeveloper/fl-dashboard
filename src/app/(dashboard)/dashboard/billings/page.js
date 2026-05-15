import { userInfo } from "@/lib";
import { getBillingsForShop, getBillingSummary } from "@/queries/billing";
import BillingPage from "../_component/Billing";

export const metadata = { title: "Billing & Invoices" };

export default async function Page() {
  const user = await userInfo();
  const [billings, summary] = await Promise.all([
    getBillingsForShop({ userId: user?.userId, shopId: user?.shopId }),
    getBillingSummary({ userId: user?.userId, shopId: user?.shopId }),
  ]);

  return <BillingPage billings={billings} summary={summary} user={user} />;
}