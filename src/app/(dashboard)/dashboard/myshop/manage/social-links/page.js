import { getSocialLinkQuery } from "@/queries/socialLink";
import SocialLink from "../_component/SocialLink";
import { userInfo } from "@/lib";

const page = async () => {
  const user = await userInfo();
  const socialLinkInfo = await getSocialLinkQuery(user);

  return (
    <>
      <SocialLink user={user} socialLinkInfo={socialLinkInfo?.data} />
    </>
  );
};

export default page;
