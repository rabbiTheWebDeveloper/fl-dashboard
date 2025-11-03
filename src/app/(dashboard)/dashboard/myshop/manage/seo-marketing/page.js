import { userInfo } from "@/lib";
import SeoMarketing from "../_component/SeoMarketing";
import { getSeoMarketingQuery } from "@/queries/seoMarketing";

const page = async () => {
  const user = await userInfo();
  const settings = await getSeoMarketingQuery(user);
  return (
    <>
      <SeoMarketing user={user} settings={settings?.data} />
    </>
  );
};

export default page;
