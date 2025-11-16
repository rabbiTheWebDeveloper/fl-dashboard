import { replaceMongoIdInObject } from "@/lib/convertData";
import { CustomerModel } from "@/model/customer-model";
import { OrderModel } from "@/model/order-model";
import { ProductModel } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

async function orderQuery(data) {
  await dbConnect();

  const {
    userId,
    shopId,
    customerName,
    customerPhone,
    customerAddress,
    visitorId,
    customerNote,
    ...orderData
  } = data;

  if (!shopId) throw new Error("Shop ID is required");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create customer
    const customer = await CustomerModel.create(
      [
        {
          customerName,
          customerPhone,
          customerAddress,
          visitorId,
          customerNote,
        },
      ],
      { session }
    );

    // Create order with customer reference
    const result = await OrderModel.create(
      [
        {
          ...orderData,
          customer: customer[0]._id,
          shopId,
          userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      message: "Order created successfully.",
      status: 200,
      data: JSON.parse(JSON.stringify(result[0])),
    };
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`Failed to create order: ${error.message}`);
  } finally {
    session.endSession();
  }
}

const getOrderDetailsQuary = async (id) => {
  await dbConnect();

  const orderDetails = await OrderModel.findById(id)
    .populate({
      path: "customer",
      select: "customerAddress customerPhone customerName",
      as: "category",
    })
    .lean();
  if (!orderDetails) return null;

  // Extract product IDs from order
  const productIds = [...orderDetails.productId] || [];
  // Fetch only ordered products
  const orderedProducts = await ProductModel.find({
    _id: { $in: productIds },
  })
    .select(
      "productName variants mainImage regularPrice discountType discountValue"
    )
    .lean();
  orderDetails.products = orderedProducts;

  return replaceMongoIdInObject(JSON.parse(JSON.stringify(orderDetails)));
};

export { orderQuery, getOrderDetailsQuary };
