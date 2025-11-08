import { userInfo } from "@/lib";
import UpdateProduct from "../_component/UpdateProduct";
import { getShopProductByIDQuery } from "@/queries/product";
import { getAllCategoriesUserQuary } from "@/queries/categories";

const page = async ({ searchParams }) => {
  const { id } = await searchParams;
  const user = await userInfo();
  const product = await getShopProductByIDQuery(id);
  const categories = await getAllCategoriesUserQuary(user);
  return (
    <>
      <UpdateProduct user={user} product={product} categories={categories} productId={id} />
    </>
  );
};

export default page;
