import { cookies } from "next/headers";
import CategoryContainer from "./_component/CategoryContainer";
import { getAllCategoriesQuary } from "@/queries/categories";
import { userInfo } from "@/lib";

export default async function CategoryPage() {
  // const user = await cookies().get("user")?.value;
  // if (!user) return null;
  // const { shops } = JSON.parse(user);
  // if (!shops) return null;
  const category = await getAllCategoriesQuary(await userInfo());
  // console.log("Fetching categories...", category);
  return <CategoryContainer category={category} />;
}
