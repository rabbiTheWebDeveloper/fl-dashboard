import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AdminUserModel } from "@/model/admin-user-model";
import { dbConnect } from "@/service/mongo";

export const ALLOWED_ADMIN_ROLES = new Set([
  "superadmin",
  "user-admin",
  "moderator",
  "support",
  "admin",
]);

export function isAdminRoleName(role) {
  return ALLOWED_ADMIN_ROLES.has(String(role || "").toLowerCase());
}

/**
 * Verify admin JWT from Next.js server cookies (used in `/admin/*` Server Components).
 */
export async function getServerAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token || !process.env.JWT_SECRET) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id || !isAdminRoleName(decoded.role)) {
      return null;
    }

    await dbConnect();
    const adminDoc = await AdminUserModel.findById(decoded.id)
      .select("-password")
      .lean();

    if (!adminDoc || adminDoc.status !== "active") {
      return null;
    }

    return JSON.parse(
      JSON.stringify({
        id: String(adminDoc._id),
        fullName: adminDoc.fullName,
        email: adminDoc.email,
        phone: adminDoc.phone || "",
        role: adminDoc.role,
        permissions: adminDoc.permissions || [],
        department: adminDoc.department || "Platform Operations",
      })
    );
  } catch {
    return null;
  }
}

/**
 * Verify admin JWT from either `Authorization: Bearer <token>` or `token` cookie
 * inside `/api/admin/*` route handlers.
 */
export async function verifyAdminApiRequest(
  request,
  { requireManageUsers = false } = {}
) {
  try {
    let token = "";
    const authHeader = request?.headers?.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    }

    if (!token || !process.env.JWT_SECRET) {
      return {
        ok: false,
        status: 401,
        message: "Unauthorized: Missing admin authentication token.",
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id || !isAdminRoleName(decoded.role)) {
      return {
        ok: false,
        status: 403,
        message: "Forbidden: Admin privileges required.",
      };
    }

    await dbConnect();
    const adminDoc = await AdminUserModel.findById(decoded.id)
      .select("-password")
      .lean();

    if (!adminDoc || adminDoc.status !== "active") {
      return {
        ok: false,
        status: 403,
        message: "Forbidden: Admin account is inactive or not found.",
      };
    }

    if (
      requireManageUsers &&
      !["superadmin", "user-admin"].includes(adminDoc.role)
    ) {
      return {
        ok: false,
        status: 403,
        message:
          "Forbidden: Only Superadmin or User-Admin roles can manage admin users.",
      };
    }

    return {
      ok: true,
      admin: {
        id: String(adminDoc._id),
        fullName: adminDoc.fullName,
        email: adminDoc.email,
        role: adminDoc.role,
        permissions: adminDoc.permissions || [],
      },
    };
  } catch {
    return {
      ok: false,
      status: 401,
      message: "Session expired or invalid token. Please sign in again.",
    };
  }
}
