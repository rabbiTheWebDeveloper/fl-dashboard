import { userInfo } from "@/lib";
import { getAllProductOrderUserQuary } from "@/queries/product";
import CreateOrder from "../_component/CreateOrder";

export default async function CreateOrderPage() {
  const user = await userInfo();
  const productlist = await getAllProductOrderUserQuary(user);
  return <CreateOrder productlist={productlist} user={user} />;
}
