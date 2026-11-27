import Dashboard from "./_component/Dashboard";
import { getUserInfo, userInfo } from "@/lib";
import { getDashboardData } from "@/queries/dashboardStats";

export const dynamic = "force-dynamic";

const page = async ({ searchParams }) => {
  const [params, user, fullUser] = await Promise.all([
    searchParams,
    userInfo(),
    getUserInfo(),
  ]);

  const data = await getDashboardData({
    ...user,
    dateFrom: params?.from || null,
    dateTo: params?.to || null,
  });

  const shopSlug =
    fullUser?.shops?.shopSlug || fullUser?.shops?.shopId || "";

  return <Dashboard data={data} shopSlug={shopSlug} />;
};

export default page;
