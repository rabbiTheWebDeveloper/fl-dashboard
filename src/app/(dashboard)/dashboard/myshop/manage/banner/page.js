import { userInfo } from "@/lib";
import Banner from "../_component/Banner";
import { getBannerQuery } from "@/queries/banner";

const page = async () => {
  const user = await userInfo();
  const banner = await getBannerQuery(user);
  return (
    <>
      <Banner user={user} banner={banner} />
    </>
  );
};

export default page;
