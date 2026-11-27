import { ShopInfoModel } from "@/model/shopInfo-model";
import { dbConnect } from "@/service/mongo";

async function getSettingsQuery({ userId, shopId } = {}) {
  if (!userId || !shopId) {
    return {
      message: "Missing shop or user context.",
      status: 400,
      data: null,
    };
  }

  try {
    await dbConnect();
    const info = await ShopInfoModel.findOne({ userId, shopId }).lean();
    if (!info) {
      return {
        message: "Settings not found.",
        status: 404,
        data: null,
      };
    }
    return {
      message: "Settings retrieved successfully.",
      status: 200,
      data: JSON.parse(JSON.stringify(info)),
    };
  } catch (error) {
    console.error("getSettingsQuery error:", error);
    return {
      message: "Failed to load shop settings.",
      status: 500,
      data: null,
    };
  }
}

export { getSettingsQuery };
