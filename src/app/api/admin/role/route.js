import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  getAdminRoleMatrixQuery,
  updateAdminRoleMatrixQuery,
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
    const data = await getAdminRoleMatrixQuery();
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load RBAC role matrix.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
    const body = await request.json();
    const result = await updateAdminRoleMatrixQuery(body, auth.admin.id);
    revalidatePath("/admin/role");
    revalidatePath("/admin/users");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: body?.syncExistingUsers
          ? `Role matrix saved and synced to ${result.syncedCount} staff account(s).`
          : "Role permission templates saved.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to save role matrix.",
      },
      { status: 400 }
    );
  }
}
