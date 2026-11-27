import { dbConnect } from "@/service/mongo";
import { ProductModel } from "@/model/product-model";

async function getAllProductQuary({ shopId, userId } = {}) {
  if (!shopId || !userId) return [];
  await dbConnect();
  try {
    const products = await ProductModel.find({ shopId, userId })
      .select(
        "productName productCode categoryId regularPrice availableQuantity isActive mainImage createdAt"
      )
      .populate({ path: "categoryId", select: "name" })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products");
  }
}

async function getAllProductUserQuary({ shopId, userId } = {}) {
  if (!shopId || !userId) return [];
  await dbConnect();
  try {
    const products = await ProductModel.find({ shopId, userId })
      .sort({ createdAt: -1 })
      .select("name productName _id")
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products");
  }
}

async function getAllProductOrderUserQuary({ shopId, userId } = {}) {
  if (!shopId || !userId) return [];
  await dbConnect();
  try {
    const products = await ProductModel.find({ shopId, userId })
      .sort({ createdAt: -1 })
      .select(
        "productName _id variants mainImage regularPrice discountType discountValue"
      )
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products");
  }
}

async function getShopProductByIDQuery(id) {
  await dbConnect();
  const product = await ProductModel.findById(id).lean();
  if (!product) {
    return {
      message: "Product not found.",
      status: 404,
      data: null,
    };
  }

  return JSON.parse(JSON.stringify(product));
}

export {
  getAllProductQuary,
  getAllProductUserQuary,
  getShopProductByIDQuery,
  getAllProductOrderUserQuary,
};
