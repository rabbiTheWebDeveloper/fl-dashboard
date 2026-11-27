import Shop from "@/model/shop.model";
import { UserModel } from "@/model/user-model";
// default export or named export

import { dbConnect } from "@/service/mongo";
import {
  sendPasswordResetEmail,
  sendVerifyEmail,
  sendWelcomeEmail,
} from "@/utlis/mail";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import slugify from "slugify";
import jwt from "jsonwebtoken";
import { DomainModel } from "@/model/domain-model";
import { ShopInfoModel } from "@/model/shopInfo-model";

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
}
async function registerUserAndShopQuery(data) {
  await dbConnect();

  const fullName = data?.fullName?.trim();
  const shopName = data?.shopName?.trim();
  const email = data?.email?.trim().toLowerCase();
  const phone = data?.phone?.replace(/\s/g, "").trim();
  const password = data?.password;

  if (!fullName || !shopName || !email || !phone || !password) {
    return {
      status: 400,
      success: false,
      code: "MISSING_FIELDS",
      message: "সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।",
    };
  }

  // Check if user exists (separate email vs phone for clear error message)
  const existingEmail = await UserModel.findOne({ email }).lean();
  if (existingEmail) {
    return {
      status: 409,
      success: false,
      code: "EMAIL_EXISTS",
      message: "এই ইমেইল ঠিকানাটি ইতিমধ্যে নিবন্ধিত আছে।",
    };
  }

  const existingPhone = await UserModel.findOne({ phone }).lean();
  if (existingPhone) {
    return {
      status: 409,
      success: false,
      code: "PHONE_EXISTS",
      message: "এই ফোন নম্বরটি ইতিমধ্যে নিবন্ধিত আছে।",
    };
  }

  // Check if shop exists
  const shopSlug = slugify(shopName, { lower: true, strict: true });
  if (!shopSlug) {
    return {
      status: 400,
      success: false,
      code: "INVALID_SHOP_NAME",
      message: "দোকানের নাম সঠিক নয়। অনুগ্রহ করে ইংরেজি বা বৈধ নাম ব্যবহার করুন।",
    };
  }

  const existingShop = await Shop.findOne({ shopSlug }).lean();
  if (existingShop) {
    return {
      status: 409,
      success: false,
      code: "SHOP_EXISTS",
      message: "এই দোকানের নামটি ইতিমধ্যে ব্যবহৃত হয়েছে। অন্য নাম চেষ্টা করুন।",
    };
  }

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

  let emailSent = true;
  try {
    await sendVerifyEmail({ toEmail: email, fullName, code, expiry });
  } catch (error) {
    emailSent = false;
    console.error("Verification email send failed:", error?.message || error);
  }

  return {
    status: 200,
    success: true,
    emailSent,
    message: emailSent
      ? "রেজিস্ট্রেশন সফল হয়েছে। ভেরিফিকেশন কোডের জন্য আপনার ইমেইল চেক করুন।"
      : "অ্যাকাউন্ট তৈরি হয়েছে, তবে ভেরিফিকেশন ইমেইল পাঠানো যায়নি। ভেরিফিকেশন পৃষ্ঠা থেকে আবার কোড পাঠান।",
    data: {
      emailVerified: user.emailVerified,
      email: user.email,
    },
  };
}

async function getUser(rawEmail) {
  try {
    const email = rawEmail?.trim().toLowerCase();
    if (!email) {
      return {
        status: false,
        message: "ইমেইল ঠিকানা প্রদান করা হয়নি।",
      };
    }

    await dbConnect();
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return {
        status: false,
        message: "ইউজার খুঁজে পাওয়া যায়নি।",
      };
    }

    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      status: true,
    };
  } catch (error) {
    console.error("getUser error:", error);
    return {
      status: false,
      message: "সার্ভারে সমস্যা হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।",
    };
  }
}

async function verifyEmailQuary(rawEmail, rawCode) {
  await dbConnect();

  const email = rawEmail?.trim().toLowerCase();
  const code = String(rawCode ?? "").trim();

  if (!email || !code) {
    return {
      success: false,
      code: "MISSING_FIELDS",
      message: "ইমেইল এবং ভেরিফিকেশন কোড প্রয়োজন।",
    };
  }

  // 1️⃣ Find user
  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    };
  }

  // 2️⃣ Check if already verified
  if (user.emailVerified) {
    return { success: true, message: "ইমেইল ইতিমধ্যে ভেরিফাই করা হয়েছে।" };
  }

  // 3️⃣ Validate code & expiry
  if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
    return {
      success: false,
      code: "EXPIRED_CODE",
      message: "ভেরিফিকেশন কোডের মেয়াদ শেষ হয়ে গেছে। নতুন কোড পাঠান।",
    };
  }

  if (user.emailVerificationCode !== code) {
    return {
      success: false,
      code: "INVALID_CODE",
      message: "ভেরিফিকেশন কোডটি সঠিক নয়।",
    };
  }

  // 4️⃣ Update verification
  user.emailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  try {
    await sendWelcomeEmail({
      toEmail: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error("Welcome email send failed:", error?.message || error);
  }

  return { success: true, message: "ইমেইল সফলভাবে ভেরিফাই হয়েছে।" };
}

async function resendVerificationEmailQuary(rawEmail) {
  await dbConnect();

  const email = rawEmail?.trim().toLowerCase();
  if (!email) {
    return {
      success: false,
      code: "INVALID_EMAIL",
      message: "সঠিক ইমেইল ঠিকানা প্রয়োজন।",
    };
  }

  // 1️⃣ Find user
  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    };
  }

  // 2️⃣ Already verified?
  if (user.emailVerified) {
    return { success: true, message: "ইমেইল ইতিমধ্যে ভেরিফাই করা হয়েছে।" };
  }

  // 3️⃣ Generate new code & expiry
  const code = generateVerificationCode();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  // 4️⃣ Update user
  user.emailVerificationCode = code;
  user.emailVerificationExpires = expiry;
  await user.save();

  // 5️⃣ Send email again
  await sendVerifyEmail({
    toEmail: user.email,
    fullName: user.fullName,
    code,
    expiry,
  });

  return { success: true, message: "নতুন ভেরিফিকেশন কোড আপনার ইমেইলে পাঠানো হয়েছে।" };
}

async function loginUserQuary(credentials) {
  await dbConnect();

  const email = credentials?.email?.trim().toLowerCase();
  const password = credentials?.password;
  const rememberMe = Boolean(credentials?.rememberMe);

  if (!email || !password) {
    return {
      status: false,
      code: "MISSING_CREDENTIALS",
      message: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন।",
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("Server authentication configuration is missing.");
  }

  // 1️⃣ Find user
  const user = await UserModel.findOne({ email })
    .populate("shops", "shopId shopName shopSlug") // only select necessary fields
    .lean();
  if (!user) {
    return {
      status: false,
      code: "USER_NOT_FOUND",
      message: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    };
  }

  // 2️⃣ Check if email is verified
  if (!user.emailVerified) {
    return {
      status: false,
      code: "EMAIL_NOT_VERIFIED",
      email: user.email,
      message: "আপনার ইমেইল এখনো ভেরিফাই করা হয়নি। দয়া করে ইমেইল ভেরিফাই করুন।",
    };
  }

  // 3️⃣ Compare password
  if (!user.password) {
    return {
      status: false,
      code: "INVALID_CREDENTIALS",
      message: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      status: false,
      code: "INVALID_CREDENTIALS",
      message: "পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
    };
  }

  // 4️⃣ Generate JWT token
  const userRole = user.role || "merchant";
  const token = jwt.sign(
    { id: user._id, email: user.email, role: userRole },
    jwtSecret,
    { expiresIn: rememberMe ? "7d" : "1d" }
  );

  const primaryShop =
    Array.isArray(user.shops) && user.shops.length > 0 ? user.shops[0] : null;

  const [domain, shopInfo] = primaryShop?._id
    ? await Promise.all([
        DomainModel.findOne(
          { userId: user._id, shopId: primaryShop._id },
          { domain_name: 1, domain_status: 1, _id: 0 }
        ).lean(),
        ShopInfoModel.findOne(
          { userId: user._id, shopId: primaryShop._id },
          { companyLogo: 1, _id: 0 }
        ).lean(),
      ])
    : [null, null];

  // 5️⃣ Return user info + token
  return JSON.parse(
    JSON.stringify({
      status: true,
      message: "লগইন সফল হয়েছে",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: userRole,
        shops: primaryShop,
        domain: domain?.domain_name || null,
        shopLogo: shopInfo?.companyLogo?.url || null,
      },
    })
  );
}
async function changePasswordQuery({ userId, oldPassword, newPassword }) {
  await dbConnect();

  if (!userId || !oldPassword || !newPassword) {
    return {
      status: false,
      code: "MISSING_FIELDS",
      message: "সব তথ্য সঠিকভাবে পূরণ করুন।",
    };
  }

  if (newPassword.length < 6) {
    return {
      status: false,
      code: "WEAK_PASSWORD",
      message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    };
  }

  // 1️⃣ Find user
  const user = await UserModel.findById(userId);
  if (!user) {
    return {
      status: false,
      code: "USER_NOT_FOUND",
      message: "ইউজার খুঁজে পাওয়া যায়নি।",
    };
  }

  // 2️⃣ Verify old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return {
      status: false,
      code: "INVALID_OLD_PASSWORD",
      message: "বর্তমান পাসওয়ার্ড সঠিক নয়।",
    };
  }

  // 3️⃣ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4️⃣ Update password
  user.password = hashedPassword;
  await user.save();

  return {
    status: true,
    message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।",
  };
}

function hashResetCode(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}

async function requestPasswordResetQuery(rawEmail) {
  await dbConnect();

  const email = rawEmail?.trim().toLowerCase();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return {
      status: false,
      code: "INVALID_EMAIL",
      message: "সঠিক ইমেইল ঠিকানা প্রদান করুন।",
    };
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      status: false,
      code: "USER_NOT_FOUND",
      message: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    };
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetPasswordCode = hashResetCode(code);
  user.resetPasswordExpires = expiry;
  await user.save();

  await sendPasswordResetEmail({
    toEmail: user.email,
    fullName: user.fullName,
    code,
  });

  return {
    status: true,
    email: user.email,
    message: "পাসওয়ার্ড রিসেট কোড আপনার ইমেইলে পাঠানো হয়েছে।",
  };
}

async function resetPasswordWithCodeQuery({ email: rawEmail, code, newPassword }) {
  await dbConnect();

  const email = rawEmail?.trim().toLowerCase();
  const trimmedCode = String(code ?? "").trim();

  if (!email || !trimmedCode || !newPassword) {
    return {
      status: false,
      code: "MISSING_FIELDS",
      message: "সব তথ্য সঠিকভাবে পূরণ করুন।",
    };
  }

  if (newPassword.length < 6) {
    return {
      status: false,
      code: "WEAK_PASSWORD",
      message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    };
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      status: false,
      code: "USER_NOT_FOUND",
      message: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    };
  }

  if (
    !user.resetPasswordCode ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < new Date()
  ) {
    return {
      status: false,
      code: "EXPIRED_CODE",
      message: "রিসেট কোডের মেয়াদ শেষ হয়ে গেছে। দয়া করে নতুন কোড পাঠান।",
    };
  }

  const incomingHash = Buffer.from(hashResetCode(trimmedCode), "hex");
  const storedHash = Buffer.from(user.resetPasswordCode, "hex");
  const isCodeValid =
    incomingHash.length === storedHash.length &&
    crypto.timingSafeEqual(incomingHash, storedHash);

  if (!isCodeValid) {
    return {
      status: false,
      code: "INVALID_CODE",
      message: "ভেরিফিকেশন কোডটি সঠিক নয়।",
    };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return {
    status: true,
    message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।",
  };
}

export {
  registerUserAndShopQuery,
  getUser,
  verifyEmailQuary,
  resendVerificationEmailQuary,
  loginUserQuary,
  changePasswordQuery,
  requestPasswordResetQuery,
  resetPasswordWithCodeQuery,
};
