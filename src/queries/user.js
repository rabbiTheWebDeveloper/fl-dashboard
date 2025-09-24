import Shop from "@/model/shop.model";
import { UserModel } from "@/model/user-model";
// default export or named export

import { dbConnect } from "@/service/mongo";
import { sendVerifyEmail, sendWelcomeEmail } from "@/utlis/mail";
import bcrypt from "bcryptjs";
import slugify from "slugify";

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
}
async function registerUserAndShopQuery(data) {
  await dbConnect();

  const { fullName, shopName, email, phone, password } = data;

  // Check if user exists
  const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) throw new Error("Email or phone already exists");

  // Check if shop exists
  const shopSlug = slugify(shopName, { lower: true, strict: true });
  const existingShop = await Shop.findOne({ shopSlug });
  if (existingShop) throw new Error("Shop name already taken");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const code = generateVerificationCode();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  // Create user
  const user = new UserModel({
    fullName,
    email,
    phone,
    password: hashedPassword,
    emailVerificationCode: code,
    emailVerificationExpires: expiry,
  });

  await user.save();

  // Create shop
  const shop = new Shop({ shopName, owner: user._id });
  await shop.save();

  // Link shop to user
  user.shops.push(shop._id);
  await user.save();

  // Send welcome email
  // await sendWelcomeEmail({ toEmail: email, fullName, password });
  await sendVerifyEmail({ toEmail: email, fullName, code, expiry });

  return {
    message: "Please check your email for the verification code.",
    status: 201,
    data: {
      emailVerified: user.emailVerified,
      email: user.email,
    },
  };
}

async function getUser(email) {
  await dbConnect();

  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    return {
      status: false,
      message: "User not found",
    };
  }

  return {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    status: true,
  };
}

export { registerUserAndShopQuery ,getUser };
