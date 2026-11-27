import { NextResponse } from "next/server";
import {
  getAllPublicShopsQuery,
  getStorefrontBySlugQuery,
} from "@/queries/storefront";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || searchParams.get("shopSlug");

    if (slug) {
      const data = await getStorefrontBySlugQuery(slug, {
        category: searchParams.get("category") || undefined,
        search: searchParams.get("search") || undefined,
        featuredOnly: searchParams.get("featured") === "true",
      });

      if (!data) {
        return NextResponse.json(
          { status: 404, success: false, message: "Shop not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ status: 200, success: true, data });
    }

    const shops = await getAllPublicShopsQuery();
    return NextResponse.json({
      status: 200,
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error("GET /api/shop error:", error);
    return NextResponse.json(
      { status: 500, success: false, message: "Failed to load shops." },
      { status: 500 }
    );
  }
}
