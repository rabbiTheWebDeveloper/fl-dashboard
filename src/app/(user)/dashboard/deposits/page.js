import { depositeQuery } from "@/queries/deposite";
import DepositPage from "./_component/DepositPage";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic'

const page = async () => {
  const cookieStore = await cookies();
  const cookieUser = cookieStore.get("user");
  const user = JSON.parse(cookieUser.value);
  let getdepositeList;
  if (user._id) {
    getdepositeList = await depositeQuery.getFromDB(user._id);
  } else {
    console.log("User not found");
  }
  return (
    <>
      <DepositPage getdepositeList={getdepositeList} />
    </>
  );
};

export default page;
