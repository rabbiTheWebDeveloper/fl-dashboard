import Domain from "../_component/Domain";
import { userInfo } from "@/lib";
import { getDomainQuery } from "@/queries/domain";

const page = async () => {
  const user = await userInfo();
  const domainInfo = await getDomainQuery(user);

  return (
    <>
      <Domain domainInfo={domainInfo?.data} user={user} />
    </>
  );
};

export default page;
