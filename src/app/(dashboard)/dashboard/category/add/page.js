import { getUser, getUserId } from "@/lib/auth";
import CategoryFrom from "./_component/CategoryFrom";

export default async function AddCategoryPage() {
  const userInfo = await getUser();
  const token=getUserId();
  console.log("User ID:", token);
  console.log("User Info:", userInfo);
  return <CategoryFrom />;
}
