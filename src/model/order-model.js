import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema(
  {
    cardId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CardOrderModel =
  mongoose.models.card_order ?? mongoose.model("card_order", orderSchema);
