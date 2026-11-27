"use server";

import {
  changePasswordQuery,
  loginUserQuary,
  registerUserAndShopQuery,
  requestPasswordResetQuery,
  resendVerificationEmailQuary,
  resetPasswordWithCodeQuery,
  verifyEmailQuary,
} from "@/queries/user";
import { revalidatePath } from "next/cache";

const KNOWN_MAIL_CODES = new Set([
  "MAIL_CONFIG_ERROR",
  "MAIL_AUTH_ERROR",
  "MAIL_CONNECTION_ERROR",
  "MAIL_SEND_ERROR",
]);

function formatAuthServerError(error, fallbackMessage) {
  if (error?.code && KNOWN_MAIL_CODES.has(error.code)) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (error?.code === 11000) {
    const keyField = Object.keys(error?.keyPattern || error?.keyValue || {})[0];
    if (keyField === "email") {
      return {
        code: "EMAIL_EXISTS",
        message: "এই ইমেইল ঠিকানাটি ইতিমধ্যে নিবন্ধিত আছে।",
      };
    }
    if (keyField === "phone") {
      return {
        code: "PHONE_EXISTS",
        message: "এই ফোন নম্বরটি ইতিমধ্যে নিবন্ধিত আছে।",
      };
    }
    if (keyField === "shopSlug" || keyField === "shopName") {
      return {
        code: "SHOP_EXISTS",
        message: "এই দোকানের নামটি ইতিমধ্যে ব্যবহৃত হয়েছে।",
      };
    }
    return {
      code: "DUPLICATE_ENTRY",
      message: "এই তথ্যটি ইতিমধ্যে ব্যবহৃত হয়েছে।",
    };
  }

  if (error?.name === "ValidationError") {
    const firstMsg = Object.values(error.errors || {})[0]?.message;
    return {
      code: "VALIDATION_ERROR",
      message: firstMsg || "প্রদত্ত তথ্য সঠিক নয়। অনুগ্রহ করে যাচাই করুন।",
    };
  }

  if (
    error?.name === "MongoNetworkError" ||
    error?.name === "MongooseServerSelectionError" ||
    error?.name === "MongoServerSelectionError"
  ) {
    return {
      code: "DB_CONNECTION_ERROR",
      message: "ডাটাবেস সার্ভারে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
    };
  }

  return {
    code: "SERVER_ERROR",
    message: fallbackMessage,
  };
}

export async function registrationAction(data) {
  try {
    const response = await registerUserAndShopQuery(data);
    if (response?.status === 200) {
      revalidatePath(`/registration`);
    }
    return response;
  } catch (error) {
    console.error("Registration action error:", error);
    const formatted = formatAuthServerError(
      error,
      "রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      status: 500,
      success: false,
      ...formatted,
    };
  }
}

export async function verifyEmailAction(email, code) {
  try {
    return await verifyEmailQuary(email, code);
  } catch (error) {
    console.error("Verify email action error:", error);
    const formatted = formatAuthServerError(
      error,
      "ভেরিফিকেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      success: false,
      ...formatted,
    };
  }
}

export async function resendVerificationEmailAction(email) {
  try {
    return await resendVerificationEmailQuary(email);
  } catch (error) {
    console.error("Resend verification email action error:", error);
    const formatted = formatAuthServerError(
      error,
      "কোড পুনরায় পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      success: false,
      ...formatted,
    };
  }
}

export async function loginUserQuaryAction(data) {
  try {
    return await loginUserQuary(data);
  } catch (error) {
    console.error("Login action error:", error);
    const formatted = formatAuthServerError(
      error,
      "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      status: false,
      ...formatted,
    };
  }
}

export async function userPasswordChangeAction(data) {
  try {
    return await changePasswordQuery(data);
  } catch (error) {
    console.error("Change password action error:", error);
    const formatted = formatAuthServerError(
      error,
      "পাসওয়ার্ড পরিবর্তন করা যায়নি। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      status: false,
      ...formatted,
    };
  }
}

export async function requestPasswordResetAction(email) {
  try {
    return await requestPasswordResetQuery(email);
  } catch (error) {
    console.error("Request password reset action error:", error);
    const formatted = formatAuthServerError(
      error,
      "কোড পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      status: false,
      ...formatted,
    };
  }
}

export async function resetPasswordAction(data) {
  try {
    return await resetPasswordWithCodeQuery(data);
  } catch (error) {
    console.error("Reset password action error:", error);
    const formatted = formatAuthServerError(
      error,
      "পাসওয়ার্ড পরিবর্তন করা যায়নি। দয়া করে আবার চেষ্টা করুন।"
    );
    return {
      status: false,
      ...formatted,
    };
  }
}
