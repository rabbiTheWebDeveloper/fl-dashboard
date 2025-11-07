import CategoryContainer from "./_component/CategoryContainer";
import { getAllCategoriesQuary } from "@/queries/categories";
import { userInfo } from "@/lib";

export default async function CategoryPage() {
  // ✅ Get user info
  const user = await userInfo();

  // ✅ Fetch categories for that user
  const categoryList = await getAllCategoriesQuary(user);

  // ✅ Return clean JSX (no extra semicolon or fragment needed)
  return <CategoryContainer categoryList={categoryList} />;
}
