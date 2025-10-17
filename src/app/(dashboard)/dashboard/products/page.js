import { getAllProductQuary } from "@/queries/product";
import ProductList from "./_component/ProductList";
import { userInfo } from "@/lib";

const page = async () => {
  const category = await getAllProductQuary(await userInfo());
  // console.log(category);
  return (
    <>
      <ProductList productlist={category} />
    </>
  );
};

export default page;
