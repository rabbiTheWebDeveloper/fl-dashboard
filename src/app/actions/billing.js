"use server";

import { revalidatePath } from "next/cache";
import {
  createBillingForShop,
  generateMonthlyBillings,
  markBillingPaid,
  subscribeMerchantMonthlyPlanQuery,
  updateMerchantSubscriptionPreferencesQuery,
} from "@/queries/billing";

export async function generateMonthlyBillingsAction() {
  try {
    const result = await generateMonthlyBillings();
    revalidatePath("/dashboard/billings");
    revalidatePath("/subscription");
    revalidatePath("/admin/payment-list");
    return { success: true, ...result };
  } catch (error) {
    throw new Error(error.message || "Failed to generate billings");
  }
}

export async function createManualBillingAction({ userId, shopId, planName }) {
  try {
    const bill = await createBillingForShop({ userId, shopId, planName });
    revalidatePath("/dashboard/billings");
    revalidatePath("/subscription");
    revalidatePath("/admin/payment-list");
    return { success: true, data: bill };
  } catch (error) {
    throw new Error(error.message || "Failed to create billing");
  }
}

export async function markBillingPaidAction({
  billingId,
  paymentMethod,
  transactionId,
}) {
  try {
    const result = await markBillingPaid({
      billingId,
      paymentMethod,
      transactionId,
    });
    revalidatePath("/dashboard/billings");
    revalidatePath("/subscription");
    revalidatePath("/admin/payment-list");
    return { success: true, data: result };
  } catch (error) {
    throw new Error(error.message || "Failed to mark as paid");
  }
}

export async function subscribeMonthlyPlanAction(payload) {
  try {
    const result = await subscribeMerchantMonthlyPlanQuery(payload);
    revalidatePath("/subscription");
    revalidatePath("/dashboard/billings");
    revalidatePath("/admin/payment-list");
    revalidatePath("/admin/billing");
    revalidatePath("/admin/merchants");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Could not process monthly subscription.",
    };
  }
}

export async function updateSubscriptionPreferenceAction(payload) {
  try {
    const result = await updateMerchantSubscriptionPreferencesQuery(payload);
    revalidatePath("/subscription");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to update subscription preference.",
    };
  }
}
