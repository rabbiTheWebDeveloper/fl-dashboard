import { getAllOrderUserQuary } from "@/queries/order";
import Orders from "./_component/Orders";
import { userInfo } from "@/lib";

const OrderPage = async () => {
  const orderlist = await getAllOrderUserQuary(await userInfo());
  console.log(orderlist);
  return (
    <>
      <Orders orderlist={orderlist} />
    </>
  );
};

export default OrderPage;
