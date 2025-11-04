
import Setting from "../_component/Setting";
import { getUserInfo } from "@/lib";

const page = async () => {
    const user = await getUserInfo();
    console.log("Current User in Settings Page:", user);
  return (
    <>
      <Setting user={user} />
    </>
  );
};

export default page;
