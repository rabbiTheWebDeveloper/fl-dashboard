import { dbConnect } from "@/service/mongo";
import { ProductModel } from "@/model/product-model";

async function getAllProductQuary({ shopId, userId }) {
  await dbConnect();
  try {
    const categories = await ProductModel.find({ shopId, userId })
      .populate({ path: "categoryId", select: "name", as: "category" })
      .sort({
        createdAt: -1,
      });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch categories");
  }
}

async function getAllProductUserQuary({ shopId, userId }) {
  await dbConnect();
  try {
    const categories = await ProductModel.find({ shopId, userId })
      .sort({ createdAt: -1 })
      .select("name _id")
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch categories");
  }
}

export { getAllProductQuary, getAllProductUserQuary };
