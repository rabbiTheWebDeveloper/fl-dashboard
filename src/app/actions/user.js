"use server";

import { registerUserAndShopQuery } from "@/queries/user";
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
