import { getAllOrderUserQuary } from "@/queries/order";
import Orders from "./_component/Orders";
import { userInfo } from "@/lib";

const OrderPage = async () => {
  const orderlist = await getAllOrderUserQuary(await userInfo());
  return (
    <>
      <Orders orderlist={orderlist} />
    </>
  );
};

export default OrderPage;
