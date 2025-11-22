"use server";

import {
  cardOrderQuery,
  updateMultipleOrderStatus,
  updateOrderStatus,
} from "@/queries/order";
import { revalidatePath } from "next/cache";

export async function createCardOrderAction(data) {
  try {
    const response = await cardOrderQuery.createFromDB(data);
    if (response) {
      revalidatePath(`/dashboard/market`);
    }
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

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

export async function deleteDepositeAction(data) {
  try {
    const response = await depositeQuery.deleteFromDB(data);
    revalidatePath(`/admin/cards`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
