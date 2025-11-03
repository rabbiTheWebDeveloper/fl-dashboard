import { dbConnect } from "@/service/mongo";

const { DomainModel } = require("@/model/domain-model");

export async function domainQuery(data) {
  await dbConnect();

  const { userId, shopId, ...otherFields } = data;

  if (!domain_name) throw new Error("Domain name is required");
  if (!shopId) throw new Error("Shop ID is required");

  const result = await DomainModel.findOneAndUpdate(
    { userId, shopId },
    {
      $set: {
        userId,
        shopId,
        ...otherFields, // ✅ spread all  fields properly
      },
    },
    { new: true, upsert: true }
  );
  return {
    message: "Domain saved successfully.",
    status: 200,
    data: result,
  };
}

export { domainQuery };
