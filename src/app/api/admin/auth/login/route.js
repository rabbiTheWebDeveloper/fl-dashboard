import { NextResponse } from "next/server";
import { getRefreshCookieConfig } from "@/lib/jwtTokens";
import { authenticateAdminAccount } from "@/queries/admin";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = body?.password;
    const rememberMe = Boolean(body?.rememberMe);

    if (!email || !password) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const result = await authenticateAdminAccount({
      email,
      password,
      rememberMe,
    });

    if (!result) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "No admin account found for this email address.",
        },
        { status: 401 }
      );
    }

    if (!result.status) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          code: result.code,
          message: result.message,
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        status: 200,
        success: true,
        ...result,
      },
      { status: 200 }
    );

    if (result.refreshToken) {
      response.cookies.set(
        "refreshToken",
        result.refreshToken,
        getRefreshCookieConfig(result.refreshMaxAge)
      );
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Admin authentication failed.",
      },
      { status: 500 }
    );
  }
}
