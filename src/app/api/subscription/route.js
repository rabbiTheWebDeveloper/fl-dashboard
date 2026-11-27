import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { userInfo } from "@/lib";
import {
  getMerchantSubscriptionOverviewQuery,
  subscribeMerchantMonthlyPlanQuery,
  updateMerchantSubscriptionPreferencesQuery,
} from "@/queries/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await userInfo();
    const data = await getMerchantSubscriptionOverviewQuery({
      userId: user?.userId || null,
      shopId: user?.shopId || null,
    });
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load subscription details.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await userInfo();
    const body = await request.json();

    const userId = user?.userId || body?.userId;
    const shopId = user?.shopId || body?.shopId;

    if (!userId || !shopId) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "Please sign in to subscribe to a monthly plan.",
        },
        { status: 401 }
      );
    }

    const result = await subscribeMerchantMonthlyPlanQuery({
      ...body,
      userId,
      shopId,
    });

    revalidatePath("/subscription");
    revalidatePath("/dashboard/billings");
    revalidatePath("/admin/payment-list");

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: body?.payNow
          ? `${result.planName} monthly subscription activated!`
          : `Monthly invoice generated for ${result.planName}.`,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Subscription request failed.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request) {
  try {
    const user = await userInfo();
    const body = await request.json();
    const userId = user?.userId || body?.userId;

    if (!userId) {
      return NextResponse.json(
        { status: 401, success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const updated = await updateMerchantSubscriptionPreferencesQuery({
      ...body,
      userId,
    });
    revalidatePath("/subscription");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Subscription preferences updated.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update subscription.",
      },
      { status: 400 }
    );
  }
}
