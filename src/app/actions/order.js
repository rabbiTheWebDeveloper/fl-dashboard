"use server";
import { updateMultipleOrderStatus, updateOrderStatus } from "@/queries/order";
import { revalidatePath } from "next/cache";

export async function updateMultipleOrderStatusAction(data) {
  try {
    const response = await updateMultipleOrderStatus(data);
    // revalidatePath(`/admin/card-orders`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function updateOrderStatusAction(data) {
  try {
    const response = await updateOrderStatus(data);
    // revalidatePath(`/admin/card-orders`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
