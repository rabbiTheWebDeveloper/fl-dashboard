import React from "react";
import Delivery from "../_component/Delivery";
import { userInfo } from "@/lib";
import { getdeliveryQuery } from "@/queries/delivery";

const page = async () => {
  const user = await userInfo();
  const deliveryInfo = await getdeliveryQuery(user);
  console.log("User info in delivery page:", deliveryInfo);
  return (
    <>
      <Delivery user={user} deliveryInfo={deliveryInfo} />
    </>
  );
};

export default page;
