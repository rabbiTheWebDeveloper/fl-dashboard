import { userInfo } from "@/lib";
import CustomizeTheme from "../_component/CustomizeTheme";

const page = async () => {
  const user = await userInfo();
  console.log("User info in theme page:", user);
  return (
    <>
      <CustomizeTheme user={user} />
    </>
  );
};

export default page;
