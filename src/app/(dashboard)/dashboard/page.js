import React from "react";
import Dashboard from "./_component/Dashboard";
import { userInfo } from "@/lib";
import { getOrderDashboardStats, getRecentOrderUserQuery, getTopSellingProducts } from "@/queries/order";

const page = async () => {
  const user = await userInfo();
  const recentOrderList = await getRecentOrderUserQuery(user);
  const topSellingProducts = await getTopSellingProducts(user);
  const orderDashboardStats = await getOrderDashboardStats(user);
  console.log("Recent Orders:", orderDashboardStats);
  return (
    <>
      <Dashboard recentOrderList={recentOrderList} topSellingProducts={topSellingProducts} orderDashboardStats={orderDashboardStats} />
    </>
  );
};

export default page;
