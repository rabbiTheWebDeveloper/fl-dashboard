import { NextResponse } from "next/server";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { getAdminVisitorAnalyticsQuery } from "@/queries/admin";

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
    const data = await getAdminVisitorAnalyticsQuery();
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load visitor analytics.",
      },
      { status: 500 }
    );
  }
}
