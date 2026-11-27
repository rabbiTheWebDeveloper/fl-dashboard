import { NextResponse } from "next/server";
import { getStorefrontProductDetailQuery } from "@/queries/storefront";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { shopSlug, productId } = await params;
    const data = await getStorefrontProductDetailQuery(shopSlug, productId);

    if (!data || !data.store) {
      return NextResponse.json(
        { status: 404, success: false, message: "Store not found." },
        { status: 404 }
      );
    }

    if (!data.product) {
      return NextResponse.json(
        { status: 404, success: false, message: "Product not found in this store." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load product details.",
      },
      { status: 500 }
    );
  }
}
