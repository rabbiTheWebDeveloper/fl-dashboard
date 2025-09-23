import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    telegramId: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    status: {
      required: true,
      type: Boolean,
      default: true,
    },
    balance: {
      required: true,
      type: Number,
      default: 0,
    },
    account_active_payment: {
      required: true,
      type: String,
      default: "unpaid",
      enum: ["pending", "paid", "unpaid"],
    },
    password: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// Create indexes for better query performance
userSchema.index({ telegramId: 1 });

export const userModel =
  mongoose.models.users ?? mongoose.model("users", userSchema);
