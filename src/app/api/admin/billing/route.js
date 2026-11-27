import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  createBillingInvoiceAdminQuery,
  listAllBillingAdminQuery,
  updateBillingStatusAdminQuery,
} from "@/queries/admin";

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
    const data = await listAllBillingAdminQuery();
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load billing records.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    const body = await request.json();
    if (!body?.shopId) {
      return NextResponse.json(
        { status: 400, success: false, message: "Target shopId is required." },
        { status: 400 }
      );
    }

    const invoice = await createBillingInvoiceAdminQuery(body);
    revalidatePath("/admin/billing");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: `Invoice ${invoice.invoiceNumber} generated.`,
        data: invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to create invoice.",
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
    if (!body?.invoiceId || !body?.status) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "invoiceId and status are required.",
        },
        { status: 400 }
      );
    }

    const updated = await updateBillingStatusAdminQuery(
      body.invoiceId,
      body.status,
      body.verificationNote || "",
      auth.admin.id
    );
    revalidatePath("/admin/billing");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: `Invoice marked ${body.status}.`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update invoice.",
      },
      { status: 400 }
    );
  }
}
