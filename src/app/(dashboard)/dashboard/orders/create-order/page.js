import React from "react";
import CreateOrder from "../_component/CreateOrder";
import { getAllProductOrderUserQuary } from "@/queries/product";
import { userInfo } from "@/lib";

const page = async () => {
  const productlist = await getAllProductOrderUserQuary(await userInfo());
  console.log(productlist);
  return (
    <>
      <CreateOrder productlist={productlist} />
    </>
  );
};

export default page;
