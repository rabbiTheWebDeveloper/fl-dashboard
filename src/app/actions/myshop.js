"use server";
import { themeQuery } from "@/queries/theme";
import { revalidatePath } from "next/cache";

export async function myshopThemeColorUpdateQuaryAction(data) {
  try {
    const response = await themeQuery(data);
    // revalidatePath(`/registration`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
