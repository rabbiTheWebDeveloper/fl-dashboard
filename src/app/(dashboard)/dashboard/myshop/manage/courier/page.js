import { userInfo } from "@/lib";
import { getCourierSettings } from "@/queries/courier";
import Courier from "../_component/Courier";

export default async function CourierPage() {
  const user = await userInfo();
  const courierSettings = await getCourierSettings({
    userId: user?.userId,
    shopId: user?.shopId,
  });

  return <Courier user={user} courierSettings={courierSettings} />;
}
