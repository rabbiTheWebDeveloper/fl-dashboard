import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  deleteAdminUserQuery,
  updateAdminUserQuery,
} from "@/queries/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
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
    const { id } = await params;
    const body = await request.json();

    if (body?.role === "superadmin" && auth.admin.role !== "superadmin") {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "Only a Superadmin can assign the Superadmin role.",
        },
        { status: 403 }
      );
    }

    const updated = await updateAdminUserQuery(id, body);
    revalidatePath("/admin/users");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Admin account updated successfully.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update admin user.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
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
    const { id } = await params;
    const result = await deleteAdminUserQuery(id, auth.admin.id);
    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Admin account removed successfully.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to delete admin user.",
      },
      { status: 400 }
    );
  }
}
