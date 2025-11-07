
import CategoryContainer from "./_component/CategoryContainer";
import { getAllCategoriesQuary } from "@/queries/categories";
import { userInfo } from "@/lib";

export default async function CategoryPage() {
  const category = await getAllCategoriesQuary(await userInfo());
  return <CategoryContainer category={category} />;
}
