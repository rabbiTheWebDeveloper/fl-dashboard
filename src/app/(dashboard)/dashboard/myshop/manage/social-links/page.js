import { getSocialLinkQuery } from "@/queries/socialLink";
import SocialLink from "../_component/SocialLink";
import { userInfo } from "@/lib";

const page = async () => {
  const user = await userInfo();
  const socialLinkInfo = await getSocialLinkQuery(user);
//   console.log("socialLinkInfo:", socialLinkInfo);
  return (
    <>
      <SocialLink user={user} socialLinkInfo={socialLinkInfo?.data} />
    </>
  );
};

export default page;
