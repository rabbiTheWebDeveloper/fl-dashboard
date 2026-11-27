import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ["admin", "merchant"],
      default: "merchant",
      index: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String  },
    emailVerificationExpires: { type: Date  },
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },
    payment_status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
      index: true,
    },
    next_payment_date: { type: Date, default: null },
    refreshSessions: {
      type: [
        {
          tokenHash: { type: String, required: true },
          expiresAt: { type: Date, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    shops: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shop",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1, role: 1 });

if (
  mongoose.models.User &&
  !mongoose.models.User.schema.path("refreshSessions")
) {
  delete mongoose.models.User;
}

export const UserModel =
  mongoose.models.User ?? mongoose.model("User", userSchema);
