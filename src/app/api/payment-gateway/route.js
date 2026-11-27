import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { recordAdminPaymentQuery } from "@/queries/admin";
import {
  getInvoiceForGatewayCheckoutQuery,
  markBillingPaid,
  subscribeMerchantMonthlyPlanQuery,
} from "@/queries/billing";

export const dynamic = "force-dynamic";

/**
 * GET /api/payment-gateway?invoiceId=...
 * Returns active Send Money gateways (`bKash`, `Nagad`, `Rocket`, `Upay`, `GPay` -> `01726278251`)
 * and optional target invoice details.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId") || "";
    const data = await getInvoiceForGatewayCheckoutQuery(invoiceId);
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load payment gateway.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payment-gateway
 * Submit Send Money (`bKash`, `Nagad`, `Rocket`, `Upay`, `GPay` -> `01726278251`)
 * with `senderNumber` + `transactionId` -> transitions invoice to `pending_verification`.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Case 1: Paying an existing invoice (`billingId` / `invoiceId`)
    const targetBillId = body?.billingId || body?.invoiceId;
    if (targetBillId) {
      const updated = await markBillingPaid({
        billingId: targetBillId,
        paymentMethod: body.paymentMethod || "bKash",
        senderNumber: body.senderNumber || "",
        transactionId: body.transactionId || "",
      });

      revalidatePath("/dashboard/billings");
      revalidatePath("/subscription");
      revalidatePath("/admin/payment-list");
      revalidatePath("/admin/billing");

      return NextResponse.json(
        {
          status: 200,
          success: true,
          message:
            "Transaction ID submitted! Admin will verify and activate your payment shortly.",
          data: updated,
        },
        { status: 200 }
      );
    }

    // Case 2: Creating + submitting a new monthly subscription TrxID
    const created = await subscribeMerchantMonthlyPlanQuery({
      ...body,
      payNow: true,
    });

    revalidatePath("/subscription");
    revalidatePath("/dashboard/billings");
    revalidatePath("/admin/payment-list");
    revalidatePath("/admin/billing");

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message:
          "Subscription TrxID submitted! Awaiting Admin verification.",
        data: created.invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to submit payment TrxID.",
      },
      { status: 400 }
    );
  }
}

/**
 * PATCH /api/payment-gateway
 * Admin-only endpoint to Verify (`paid`) or Reject (`rejected`) a submitted TrxID.
 */
export async function PATCH(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();
    const billingId = body?.billingId || body?.invoiceId;
    const action = body?.action; // "verify" | "reject"

    if (!billingId || !["verify", "reject"].includes(action)) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "billingId and valid action ('verify' or 'reject') are required.",
        },
        { status: 400 }
      );
    }

    const updated = await recordAdminPaymentQuery({
      billingId,
      status: action === "verify" ? "paid" : "rejected",
      verificationNote: body?.verificationNote || "",
      verifiedBy: auth.admin.id,
    });

    revalidatePath("/admin/payment-list");
    revalidatePath("/admin/billing");
    revalidatePath("/admin/merchants");
    revalidatePath("/subscription");
    revalidatePath("/dashboard/billings");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message:
          action === "verify"
            ? `Payment ${updated.invoiceNumber} verified & plan activated!`
            : `Payment ${updated.invoiceNumber} rejected.`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Verification update failed.",
      },
      { status: 400 }
    );
  }
}
