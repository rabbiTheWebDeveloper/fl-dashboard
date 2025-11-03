import ShopInfo from "../_component/ShopInfo";
import { userInfo } from "@/lib";

const page = async () => {
  const user = await userInfo();
  return (
    <>
      <ShopInfo user={user} />
    </>
  );
};

export default page;
