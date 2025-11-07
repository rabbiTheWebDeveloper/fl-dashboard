import { getAllProductQuary } from "@/queries/product";
import ProductList from "./_component/ProductList";
import { userInfo } from "@/lib";

const page = async () => {
  const productlist = await getAllProductQuary(await userInfo());

  return (
    <>
      <ProductList productlist={productlist} />
    </>
  );
};

export default page;
