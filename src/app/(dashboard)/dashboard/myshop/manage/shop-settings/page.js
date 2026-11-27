import { getSettingsQuery } from "@/queries/shopInfo";
import ShopInfo from "../_component/ShopInfo";
import { userInfo } from "@/lib";

export const metadata = {
  title: "Shop Settings",
};

export default async function ShopSettingsPage() {
  const user = await userInfo();
  const settings = await getSettingsQuery(user);

  return <ShopInfo user={user} settings={settings?.data} />;
}
