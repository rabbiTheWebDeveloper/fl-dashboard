import { userInfo } from "@/lib";
import UpdateProduct from "../_component/UpdateProduct";
import { getShopProductByIDQuery } from "@/queries/product";
import { getAllCategoriesUserQuary } from "@/queries/categories";

export default async function UpdateProductPage({ searchParams }) {
  const [{ id }, user] = await Promise.all([searchParams, userInfo()]);
  const [product, categories] = await Promise.all([
    getShopProductByIDQuery(id),
    getAllCategoriesUserQuary(user),
  ]);

  return (
    <UpdateProduct
      user={user}
      product={product}
      categories={categories}
      productId={id}
    />
  );
}
