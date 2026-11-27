import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  deleteAdminPaymentRecordQuery,
  getAdminPaymentListQuery,
  recordAdminPaymentQuery,
} from "@/queries/admin";
import {
  generateMonthlyBillings,
  markOverdueBillings,
} from "@/queries/billing";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const data = await getAdminPaymentListQuery();
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load platform payment list.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();

    // Optional automated billing cycle trigger from Admin Payment List UI
    if (body?.action === "run_billing_cycle") {
      if (!["superadmin", "user-admin"].includes(auth.admin.role)) {
        return NextResponse.json(
          {
            status: 403,
            success: false,
            message: "Only Superadmin or User-Admin can run the billing cycle.",
          },
          { status: 403 }
        );
      }

      const overdueMarked = await markOverdueBillings();
      const { created, errors } = await generateMonthlyBillings();
      revalidatePath("/admin/payment-list");
      revalidatePath("/admin/billing");
      revalidatePath("/admin");

      return NextResponse.json(
        {
          status: 200,
          success: true,
          message: `Billing cycle completed: ${created} new invoice(s) generated, ${overdueMarked} marked overdue.`,
          data: { overdueMarked, created, errors },
        },
        { status: 200 }
      );
    }

    const record = await recordAdminPaymentQuery(body);
    revalidatePath("/admin/payment-list");
    revalidatePath("/admin/billing");
    revalidatePath("/admin/merchants");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: `Payment record ${record.invoiceNumber} saved (${record.status}).`,
        data: record,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to record payment.",
      },
      { status: 400 }
    );
  }
}

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
    if (!body?.billingId) {
      return NextResponse.json(
        { status: 400, success: false, message: "billingId is required." },
        { status: 400 }
      );
    }

    const updated = await recordAdminPaymentQuery({
      ...body,
      verifiedBy: auth.admin.id,
    });
    revalidatePath("/admin/payment-list");
    revalidatePath("/admin/billing");
    revalidatePath("/admin/merchants");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: `Payment ${updated.invoiceNumber} updated to ${updated.status}.`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update payment record.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  const auth = await verifyAdminApiRequest(request, {
    requireManageUsers: true,
  });
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { status: 400, success: false, message: "Payment record id is required." },
        { status: 400 }
      );
    }

    const res = await deleteAdminPaymentRecordQuery(id);
    revalidatePath("/admin/payment-list");
    revalidatePath("/admin/billing");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Payment record deleted.",
        data: res,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to delete payment record.",
      },
      { status: 400 }
    );
  }
}
