import { userInfo } from "@/lib";
import UpdateCategory from "../_component/UpdateCategory";
import { getShopCategoryByIDQuery } from "@/queries/categories";

const page = async ({ searchParams }) => {
  const { id } = await searchParams;
  const user = await userInfo();
  const category = await getShopCategoryByIDQuery(id);
  return (
    <>
      <UpdateCategory user={user} category={category} categoryId={id} />
    </>
  );
};

export default page;
