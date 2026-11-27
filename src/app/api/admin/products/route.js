import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  deleteProductAdminQuery,
  listAllProductsAdminQuery,
  updateProductAdminQuery,
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
    const products = await listAllProductsAdminQuery();
    return NextResponse.json(
      { status: 200, success: true, count: products.length, data: products },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load products.",
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
    if (!body?.productId) {
      return NextResponse.json(
        { status: 400, success: false, message: "productId is required." },
        { status: 400 }
      );
    }

    const updated = await updateProductAdminQuery(body.productId, body);
    revalidatePath("/admin/products");
    revalidatePath("/shop", "layout");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Product listing updated.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update product.",
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
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { status: 400, success: false, message: "productId is required." },
        { status: 400 }
      );
    }

    const result = await deleteProductAdminQuery(productId);
    revalidatePath("/admin/products");
    revalidatePath("/shop", "layout");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Product removed from platform.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to remove product.",
      },
      { status: 400 }
    );
  }
}
