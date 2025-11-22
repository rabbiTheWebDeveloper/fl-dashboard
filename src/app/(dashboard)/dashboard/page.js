import React from "react";
import Dashboard from "./_component/Dashboard";
import { userInfo } from "@/lib";
import { getRecentOrderUserQuery } from "@/queries/order";

const page = async () => {
  const user = await userInfo();
  const recentOrderList = await getRecentOrderUserQuery(user);
  console.log("Recent Orders:", recentOrderList);
  return (
    <>
      <Dashboard recentOrderList={recentOrderList} />
    </>
  );
};

export default page;
