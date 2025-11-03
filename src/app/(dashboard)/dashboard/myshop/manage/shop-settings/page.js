import { getSettingsQuery } from "@/queries/shopInfo";
import ShopInfo from "../_component/ShopInfo";
import { userInfo } from "@/lib";

const page = async () => {
  const user = await userInfo();
  const settings = await getSettingsQuery(user);
  console.log("settings data:", settings);
  return (
    <>
      <ShopInfo user={user} settings={settings} />
    </>
  );
};

export default page;
