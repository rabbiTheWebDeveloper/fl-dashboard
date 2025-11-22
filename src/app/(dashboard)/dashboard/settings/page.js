
import Setting from "../_component/Setting";
import { getUserInfo } from "@/lib";

const page = async () => {
    const user = await getUserInfo();
  
  return (
    <>
      <Setting user={user} />
    </>
  );
};

export default page;
