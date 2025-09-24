"use server";

import {
  loginUserQuary,
  registerUserAndShopQuery,
  resendVerificationEmailQuary,
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
    // revalidatePath(`/registration`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
