import { getAllCategoriesUserQuary } from "@/queries/categories";
import AddProduct from "./_component/AddProduct";
import { userInfo } from "@/lib";

export default async function AddProductPage() {
  const userInfos = (await userInfo()) || {}; // fallback {}
  const categories = await getAllCategoriesUserQuary(userInfos);
  if (!userInfos) return;

  return (
    <>
      <AddProduct categories={categories} userInfos={userInfos} />
    </>
  );
}
