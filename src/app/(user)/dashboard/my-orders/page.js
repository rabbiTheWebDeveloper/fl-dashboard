import { cardOrderQuery } from "@/queries/order";
import { cookies } from "next/headers";
import React from "react";
import MyOrders from "./_component/MyOrders";
export const dynamic = 'force-dynamic'

const MyOrdersPage = async () => {
  const cookieStore = await cookies();
  const cookieUser = cookieStore.get("user");
  const user = JSON.parse(cookieUser.value);
  // console.log(user._id);
  let myorderCard;
  if (user._id) {
    myorderCard = await cardOrderQuery.getFromDB(user._id);
    // console.log(getAffiliateReports);
  } else {
    console.log("User not found");
  }

  return (
    <>
      <MyOrders orders={myorderCard} />
    </>
  );
};

export default MyOrdersPage;
