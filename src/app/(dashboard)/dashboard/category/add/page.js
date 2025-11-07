import { getUser, getUserId } from "@/lib/auth";
import CategoryFrom from "./_component/CategoryFrom";
import { userInfo } from "@/lib";

export default async function AddCategoryPage() {
    const user = await userInfo();
  return <CategoryFrom user={user} />;
}
