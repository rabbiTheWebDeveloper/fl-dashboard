import { dbConnect } from "@/service/mongo";

const { DomainModel } = require("@/model/domain-model");

export async function domainQuery(data) {
  await dbConnect();

  const { userId, shopId, domain_name } = data;

  if (!domain_name) throw new Error("Domain name is required");

  const result = await DomainModel.findOneAndUpdate(
    { domain_name }, // find by domain name
    { $set: { userId, shopId, domain_name } }, // update these fields
    { new: true, upsert: true } // create if not exist (upsert)
  );

  return {
    message: "Domain saved successfully.",
    status: 200,
    data: result,
  };
}

export { domainQuery };
