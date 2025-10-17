import { OrderModel } from "@/model/order-model";
import { ProductModel } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";

async function createOrderFromDB(data) {
  await dbConnect();

  try {
    const {
      customer_name,
      phone,
      address,
      delivery_location,
      userId,
      shopId,
      productId,
      variantId,
    } = data;

    // ✅ Get Product Info
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    let price = product.price || 0;

    // ✅ If variantId exists, use variant price instead
    if (variantId) {
      const variant = await VariantModel.findById(variantId);
      if (variant && variant.price) {
        price = variant.price;
      }
    }

    // ✅ Calculate totals
    const grand_total = price;
    const discounted_total = price; // if you have discounts, modify later
    const discount = 0;
    const advanced = 0;
    const due = grand_total - advanced;
    const shipping_cost = 0;
    const cod = false;

    // ✅ Create new order
    const newOrder = new OrderModel({
      order_no: `ORD-${Date.now()}`,
      customer_name,
      phone,
      address,
      delivery_location,
      userId,
      shopId,
      productId,
      variantId: variantId || null,
      grand_total,
      discounted_total,
      discount,
      advanced,
      due,
      shipping_cost,
      cod,
    });

    const order = await newOrder.save();

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Order creation failed:", error);
    throw new Error("Failed to create order");
  }
}

async function getAllOrderQuary({ shopId, userId }) {
  await dbConnect();
  try {
    const categories = await OrderModel.find({ shopId, userId }).sort({
      createdAt: -1,
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch categories");
  }
}

export { createOrderFromDB, getAllOrderQuary };
