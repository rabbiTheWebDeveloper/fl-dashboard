import mongoose, { Schema } from "mongoose";

const BillingSchema = new Schema(
  {
    // Who this bill belongs to
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    // Invoice metadata
    invoiceNumber: { type: String, unique: true, required: true },
    invoiceTitle: { type: String, default: "Monthly Platform Fee" },

    // Billing period
    billingPeriodStart: { type: Date, required: true },
    billingPeriodEnd: { type: Date, required: true },
    dueDate: { type: Date, required: true },

    // Amounts
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "BDT" },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalDue: { type: Number, required: true },

    // Status (includes Send-Money TrxID verification states)
    status: {
      type: String,
      enum: [
        "unpaid",
        "pending_verification",
        "paid",
        "overdue",
        "rejected",
        "cancelled",
      ],
      default: "unpaid",
      index: true,
    },

    // Payment Gateway & Send-Money Verification Info
    paidAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    paymentMethod: { type: String, default: "" },
    senderNumber: { type: String, default: "", trim: true },
    receiverNumber: { type: String, default: "01726278251", trim: true },
    transactionId: { type: String, default: "", trim: true, index: true },
    verificationNote: { type: String, default: "" },

    // Plan info snapshot
    planName: { type: String, default: "Basic" },
    planPrice: { type: Number, default: 0 },

    // Notes
    notes: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

BillingSchema.index({ userId: 1, status: 1 });
BillingSchema.index({ shopId: 1, createdAt: -1 });

if (
  mongoose.models.Billing &&
  !mongoose.models.Billing.schema.path("senderNumber")
) {
  delete mongoose.models.Billing;
}

export const BillingModel =
  mongoose.models.Billing ?? mongoose.model("Billing", BillingSchema);
