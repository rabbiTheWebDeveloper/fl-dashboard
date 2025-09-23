import { DepositeModel } from "@/model/deposite-model";
import { userModel } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

async function createFromDB(data) {
  await dbConnect();
  const newSetting = await DepositeModel.create(data);
  return JSON.parse(JSON.stringify(newSetting));
  // return replaceMongoIdInArray(categories);
}

async function getFromDB(id) {
  await dbConnect();
  const categories = await DepositeModel.find({ userId: id })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(categories));
}

async function getAllFromDB() {
  await dbConnect();
  const categories = await DepositeModel.find({})
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(categories));
}
async function deleteFromDB(id) {
  await dbConnect();
  const categories = await DepositeModel.findByIdAndDelete(id).lean();
  return JSON.parse(JSON.stringify(categories));
}

async function updateFromDB(id, data) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await userModel.findById(data.userId).session(session);
    if (!user) throw new Error("User not found");

    const deposite = await DepositeModel.findById(id).session(session);
    if (!deposite) throw new Error("Deposit not found");

    const updatedDeposite = await DepositeModel.findByIdAndUpdate(id, data, {
      new: true,
      session,
    });

    if (!updatedDeposite) throw new Error("Failed to update deposit");
    if (
      (updatedDeposite.status === "completed" ||
        updatedDeposite.status === "approved") &&
      deposite.status !== "completed" &&
      deposite.status !== "approved"
    ) {
      user.balance += deposite.amount_usd;
      await user.save({ session });
    } else if (
      (deposite.status === "completed" || deposite.status === "approved") &&
      updatedDeposite.status !== "completed" &&
      updatedDeposite.status !== "approved"
    ) {
      user.balance -= deposite.amount_usd;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();

    return JSON.parse(JSON.stringify(updatedDeposite));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction error:", error.message);
    throw error;
  }
}

export const depositeQuery = {
  createFromDB,
  getAllFromDB,
  getFromDB,
  deleteFromDB,
  updateFromDB,
};
