import { SettingsModel } from "@/model/shopInfo-model";
import { dbConnect } from "@/service/mongo";

async function getSettingsQuery({ userId, shopId }) {
  await dbConnect();
  const theme = await SettingsModel.findOne({ userId, shopId }).lean();
  if (!theme) {
    return {
      message: "Settings not found.",
      status: 404,
      data: null,
    };
  }
  return {
    message: "Settings retrieved successfully.",
    status: 200,
    data: JSON.parse(JSON.stringify(theme)),
  };
}

export { getSettingsQuery };
