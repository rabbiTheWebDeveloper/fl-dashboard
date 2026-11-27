import { NextResponse } from "next/server";
import { getStorefrontBySlugQuery } from "@/queries/storefront";

export async function GET(request, { params }) {
  try {
    const { shopSlug } = await params;
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const data = await getStorefrontBySlugQuery(shopSlug, {
      category,
      search,
      featuredOnly,
    });

    if (!data) {
      return NextResponse.json(
        {
          status: 404,
          success: false,
          message: `No shop found for slug "${shopSlug}".`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Storefront data retrieved successfully.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/shop/[shopSlug] error:", error);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Failed to retrieve shop information.",
      },
      { status: 500 }
    );
  }
}
