import { cookies } from "next/headers";
import { AdminUserModel } from "@/model/admin-user-model";
import { dbConnect } from "@/service/mongo";
import {
  hashRefreshToken,
  verifyAccessToken,
  verifyRefreshTokenJwt,
} from "@/lib/jwtTokens";

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
 * Seamlessly falls back to validating an active `HttpOnly` `refreshToken` session
 * if the 1h access `token` just expired, while the client layout rotates the cookies.
 */
export async function getServerAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";
    const refreshToken = cookieStore.get("refreshToken")?.value || "";

    let adminId = null;

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        if (decoded?.id && isAdminRoleName(decoded.role)) {
          adminId = decoded.id;
        }
      } catch {
        // Access token expired; try refreshToken fallback below
      }
    }

    await dbConnect();

    if (!adminId && refreshToken) {
      try {
        const refDecoded = verifyRefreshTokenJwt(refreshToken);
        if (refDecoded?.id && isAdminRoleName(refDecoded.role)) {
          const refHash = hashRefreshToken(refreshToken);
          const now = new Date();
          const candidate = await AdminUserModel.findById(refDecoded.id).lean();
          const validRefresh = (candidate?.refreshSessions || []).some(
            (s) => s.tokenHash === refHash && new Date(s.expiresAt) > now
          );
          if (validRefresh && candidate?.status === "active") {
            return JSON.parse(
              JSON.stringify({
                id: String(candidate._id),
                fullName: candidate.fullName,
                email: candidate.email,
                phone: candidate.phone || "",
                role: candidate.role,
                permissions: candidate.permissions || [],
                department: candidate.department || "Platform Operations",
              })
            );
          }
        }
      } catch {
        return null;
      }
    }

    if (!adminId) return null;

    const adminDoc = await AdminUserModel.findById(adminId)
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
 * inside `/api/admin/*` route handlers (with active `refreshToken` cookie fallback).
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

    const cookieStore = await cookies();
    if (!token) {
      token = cookieStore.get("token")?.value || "";
    }

    let adminDoc = null;

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        if (decoded?.id && isAdminRoleName(decoded.role)) {
          await dbConnect();
          adminDoc = await AdminUserModel.findById(decoded.id)
            .select("-password")
            .lean();
        }
      } catch {
        // Access token expired; check HttpOnly refreshToken below
      }
    }

    if (!adminDoc) {
      const refreshCookie = cookieStore.get("refreshToken")?.value || "";
      if (refreshCookie) {
        try {
          const refDecoded = verifyRefreshTokenJwt(refreshCookie);
          if (refDecoded?.id && isAdminRoleName(refDecoded.role)) {
            await dbConnect();
            const candidate = await AdminUserModel.findById(
              refDecoded.id
            ).lean();
            const refHash = hashRefreshToken(refreshCookie);
            const hasValidSession = (candidate?.refreshSessions || []).some(
              (s) =>
                s.tokenHash === refHash && new Date(s.expiresAt) > new Date()
            );
            if (hasValidSession) {
              adminDoc = candidate;
            }
          }
        } catch {
          // invalid refresh token
        }
      }
    }

    if (!adminDoc) {
      return {
        ok: false,
        status: 401,
        message: "Unauthorized: Invalid or expired admin session.",
      };
    }

    if (adminDoc.status !== "active") {
      return {
        ok: false,
        status: 403,
        message: "Forbidden: Admin account is inactive.",
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
