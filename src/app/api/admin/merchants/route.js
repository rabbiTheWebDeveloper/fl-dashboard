import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  deleteMerchantAdminQuery,
  listAllMerchantsAdminQuery,
  updateMerchantAdminQuery,
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
    const merchants = await listAllMerchantsAdminQuery();
    return NextResponse.json(
      { status: 200, success: true, count: merchants.length, data: merchants },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load merchants.",
      },
      { status: 500 }
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
    if (!body?.merchantId) {
      return NextResponse.json(
        { status: 400, success: false, message: "merchantId is required." },
        { status: 400 }
      );
    }

    const updated = await updateMerchantAdminQuery(body.merchantId, body);
    revalidatePath("/admin/merchants");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Merchant updated successfully.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update merchant.",
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
    const merchantId = searchParams.get("merchantId");
    if (!merchantId) {
      return NextResponse.json(
        { status: 400, success: false, message: "merchantId is required." },
        { status: 400 }
      );
    }

    const result = await deleteMerchantAdminQuery(merchantId);
    revalidatePath("/admin/merchants");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Merchant account removed.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to delete merchant.",
      },
      { status: 400 }
    );
  }
}
