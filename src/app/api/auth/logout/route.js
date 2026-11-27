import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revokeRefreshTokenQuery } from "@/queries/authTokens";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    let rawRefresh = "";
    try {
      const body = await request.json();
      if (body?.refreshToken) rawRefresh = String(body.refreshToken).trim();
    } catch {
      // ignore empty body
    }

    if (!rawRefresh) {
      const cookieStore = await cookies();
      rawRefresh = cookieStore.get("refreshToken")?.value || "";
    }

    if (rawRefresh) {
      await revokeRefreshTokenQuery(rawRefresh);
    }

    const response = NextResponse.json(
      { status: 200, success: true, message: "Signed out and session revoked." },
      { status: 200 }
    );

    response.cookies.delete("refreshToken");
    response.cookies.delete("token");
    response.cookies.delete("user");
    response.cookies.delete("role");

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Logout failed.",
      },
      { status: 500 }
    );
  }
}
