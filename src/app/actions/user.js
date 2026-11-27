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

export async function registrationAction(data) {
  try {
    const response = await registerUserAndShopQuery(data);
    revalidatePath(`/registration`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function verifyEmailAction(email, code) {
  try {
    const response = await verifyEmailQuary(email, code);
    // revalidatePath(`/registration`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function resendVerificationEmailAction(email) {
  try {
    const response = await resendVerificationEmailQuary(email);
    // revalidatePath(`/registration`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function loginUserQuaryAction(data) {
  try {
    const response = await loginUserQuary(data);
    return response;
  } catch (error) {
    console.error("Login action error:", error);
    return {
      status: false,
      code: "SERVER_ERROR",
      message:
        error?.message || "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    };
  }
}



export async function userPasswordChangeAction(data) {
  try {
    const response = await changePasswordQuery(data);
    // revalidatePath(`/registration`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function requestPasswordResetAction(email) {
  try {
    return await requestPasswordResetQuery(email);
  } catch (error) {
    console.error("Request password reset action error:", error);
    return {
      status: false,
      code: "SERVER_ERROR",
      message:
        error?.message || "কোড পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।",
    };
  }
}

export async function resetPasswordAction(data) {
  try {
    return await resetPasswordWithCodeQuery(data);
  } catch (error) {
    console.error("Reset password action error:", error);
    return {
      status: false,
      code: "SERVER_ERROR",
      message:
        error?.message ||
        "পাসওয়ার্ড পরিবর্তন করা যায়নি। দয়া করে আবার চেষ্টা করুন।",
    };
  }
}
