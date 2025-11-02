import { ThemeModel } from "@/model/theme-model";
import { dbConnect } from "@/service/mongo";

export async function themeQuery(data) {
  await dbConnect();

  const { userId, shopId, ...themeFields } = data;

  if (!shopId) throw new Error("Shop ID is required");

  const result = await ThemeModel.findOneAndUpdate(
    { userId, shopId },
    {
      $set: {
        userId,
        shopId,
        ...themeFields, // ✅ spread all color fields properly
        lastUpdatedBy: userId,
        updatedAt: new Date(),
      },
    },
    { new: true, upsert: true }
  );

  return {
    message: "Theme saved successfully.",
    status: 200,
    data: JSON.parse(JSON.stringify(result)),
  };
}

export { themeQuery };
