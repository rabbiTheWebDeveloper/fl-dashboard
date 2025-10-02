import { getAllCategoriesUserQuary } from "@/queries/categories";
import AddProduct from "./_component/AddProduct";
import { userInfo } from "@/lib";

export default async function AddProductPage() {
  const getData = await getAllCategoriesUserQuary(await userInfo());
  console.log("Categories for product addition:", getData);
  
  return (
    <>
      <AddProduct />
    </>
  );
}
