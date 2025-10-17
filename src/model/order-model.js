import mongoose, { Schema } from "mongoose";

const fraudInfoSchema = new Schema({
  fraud_entry: { type: String, default: "0" },
  fraud_delivery: { type: String, default: "0" },
  fraud_return: { type: String, default: "0" },
  fraud_report: { type: Number, default: 0 },
  fraud_processing: { type: Boolean, default: false },
});

const orderSchema = new Schema(
  {
    order_no: { type: String, required: true },
    order_tracking_code: { type: String },
    order_type: {
      type: String,
      enum: ["landing", "website", "phone", "social", "other"],
      default: "landing",
    },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },

    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    delivery_location: { type: String },
    order_status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "completed",
        "delivered",
        "cancelled",
        "return",
      ],
      default: "pending",
    },

    cod: { type: Boolean, default: false },
    grand_total: { type: Number, required: true },
    discounted_total: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discount_type: {
      type: String,
      enum: ["amount", "percent"],
      default: "amount",
    },
    advanced: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    courier_note: { type: String },
    invoice_note: { type: String },
    order_note: { type: String },
    courier_entry: { type: Boolean, default: false },
    tracking_code: { type: String },
    consignment_id: { type: String },
    courier_status: { type: String },
    courier_provider: { type: String },
    pending_date: { type: Date },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },
    fraud_info: fraudInfoSchema,
  },
  { timestamps: true, versionKey: false }
);
export const OrderModel =
  mongoose.models.Order ?? mongoose.model("Order", orderSchema);
