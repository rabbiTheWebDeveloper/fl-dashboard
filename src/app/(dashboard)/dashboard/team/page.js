
import ManageUsers from "../_component/ManageUsers";
import { getUserInfo } from "@/lib";

const page = async () => {
  const user = await getUserInfo();
  return (
    <>
      <ManageUsers user={user} />
    </>
  );
};

export default page;
