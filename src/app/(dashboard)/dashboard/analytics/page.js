import { userInfo } from "@/lib";
import { getDashboardData } from "@/queries/dashboardStats";
import AnalyticsClient from "../_component/Analytics";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }) {
  const user = await userInfo();
  const params = await searchParams;
  const dateFrom = params?.dateFrom || null;
  const dateTo   = params?.dateTo   || null;

  const data = await getDashboardData({
    userId: user?.userId,
    shopId: user?.shopId,
    dateFrom,
    dateTo,
  });

  return <AnalyticsClient data={data} />;
}