import { userInfo } from "@/lib";
import { getMerchantSubscriptionOverviewQuery } from "@/queries/billing";
import Subscription from "../_component/Subscription";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Monthly Subscription & Plans | AMARDokan",
};

export default async function SubscriptionPage() {
  const user = await userInfo();
  const data = await getMerchantSubscriptionOverviewQuery({
    userId: user?.userId || null,
    shopId: user?.shopId || null,
  });

  return <Subscription initialData={data} />;
}
