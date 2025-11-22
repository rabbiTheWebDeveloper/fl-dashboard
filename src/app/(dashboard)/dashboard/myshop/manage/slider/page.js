import { userInfo } from "@/lib";
import Slider from "../_component/Slider";
import { getSliderQuery } from "@/queries/slider";

const page = async () => {
  const user = await userInfo();
  const slider = await getSliderQuery(user);

  return (
    <>
      <Slider user={user} sliderData={slider?.data} />
    </>
  );
};

export default page;
