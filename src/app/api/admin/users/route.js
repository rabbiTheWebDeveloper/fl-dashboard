import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { createAdminUserQuery, listAdminUsersQuery } from "@/queries/admin";

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
    const users = await listAdminUsersQuery();
    return NextResponse.json(
      { status: 200, success: true, count: users.length, data: users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to list admin users.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    const requestedRole = body?.role || "user-admin";

    // Only superadmin can mint another superadmin
    if (requestedRole === "superadmin" && auth.admin.role !== "superadmin") {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "Only a Superadmin can create another Superadmin account.",
        },
        { status: 403 }
      );
    }

    const created = await createAdminUserQuery({
      ...body,
      role: requestedRole,
      createdBy: auth.admin.id,
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: `Admin account (${created.role}) created successfully.`,
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to create admin user.",
      },
      { status: 400 }
    );
  }
}
