import Dashboard from "./_component/Dashboard";
import { userInfo } from "@/lib";
import { getDashboardData } from "@/queries/dashboardStats";

export const dynamic = "force-dynamic";

const page = async ({ searchParams }) => {
  const params = await searchParams;
  const user = await userInfo();

  const data = await getDashboardData({
    ...user,
    dateFrom: params?.from  || null,
    dateTo:   params?.to    || null,
  });

  return <Dashboard data={data} />;
};

export default page;
