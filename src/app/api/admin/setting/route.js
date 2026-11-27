import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  changeAdminPasswordQuery,
  getPlatformSettingsQuery,
  updateOwnAdminProfileQuery,
  updatePlatformSettingsQuery,
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
    const settings = await getPlatformSettingsQuery();
    return NextResponse.json(
      { status: 200, success: true, data: settings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to load platform settings.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();

    if (body?.action === "change_password") {
      await changeAdminPasswordQuery({
        adminId: auth.admin.id,
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      });
      return NextResponse.json(
        {
          status: 200,
          success: true,
          message: "Your admin password has been updated successfully.",
        },
        { status: 200 }
      );
    }

    if (body?.action === "update_profile") {
      const updatedAdmin = await updateOwnAdminProfileQuery(
        auth.admin.id,
        body
      );
      revalidatePath("/admin/setting");
      revalidatePath("/admin/settings");
      return NextResponse.json(
        {
          status: 200,
          success: true,
          message: "Admin profile updated.",
          data: updatedAdmin,
        },
        { status: 200 }
      );
    }

    if (!["superadmin", "user-admin"].includes(auth.admin.role)) {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message:
            "Only Superadmin or User-Admin roles can modify global platform settings.",
        },
        { status: 403 }
      );
    }

    const updated = await updatePlatformSettingsQuery(body, auth.admin.id);
    revalidatePath("/admin/setting");
    revalidatePath("/admin/settings");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Platform settings saved successfully.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to save settings.",
      },
      { status: 400 }
    );
  }
}

export const PATCH = PUT;
