import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  listAllOrdersAdminQuery,
  updateOrderAdminQuery,
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
    const orders = await listAllOrdersAdminQuery();
    return NextResponse.json(
      { status: 200, success: true, count: orders.length, data: orders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load orders.",
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
    if (!body?.orderId || !body?.status) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "orderId and status are required.",
        },
        { status: 400 }
      );
    }

    const updated = await updateOrderAdminQuery(body.orderId, body.status);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: `Order status updated to ${body.status}.`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update order.",
      },
      { status: 400 }
    );
  }
}
