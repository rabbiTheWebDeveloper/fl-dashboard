import { getSettingsQuery } from "@/queries/shopInfo";
import ShopInfo from "../_component/ShopInfo";
import { userInfo } from "@/lib";

const page = async () => {
  const user = await userInfo();
  const settings = await getSettingsQuery(user);

  return (
    <>
      <ShopInfo user={user} settings={settings?.data} />
    </>
  );
};

export default page;
