import Shop from "@/model/shop.model";
import { UserModel } from "@/model/user-model";
// default export or named export

import { dbConnect } from "@/service/mongo";
import { sendWelcomeEmail } from "@/utlis/mail";
import bcrypt from "bcryptjs";
import slugify from "slugify";

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

  // Create user
  const user = new UserModel({ fullName, email, phone, password: hashedPassword });
  await user.save();

  // Create shop
  const shop = new Shop({ shopName, owner: user._id });
  await shop.save();

  // Link shop to user
  user.shops.push(shop._id);
  await user.save();

  // Send welcome email
  await sendWelcomeEmail({ toEmail: email, fullName, password });

  return {
    user: JSON.parse(JSON.stringify(user)),
    shop: JSON.parse(JSON.stringify(shop))
  };
}

export { registerUserAndShopQuery };
