import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AdminUserModel } from "@/model/admin-user-model";
import { UserModel } from "@/model/user-model";
import Shop from "@/model/shop.model";
import { DomainModel } from "@/model/domain-model";
import { ShopInfoModel } from "@/model/shopInfo-model";
import { dbConnect } from "@/service/mongo";
import {
  MAX_ACTIVE_REFRESH_SESSIONS,
  getRefreshCookieConfig,
  hashRefreshToken,
  isRoleAdmin,
  signAccessToken,
  signRefreshToken,
  verifyRefreshTokenJwt,
} from "@/lib/jwtTokens";

function pruneAndAppendSession(existingSessions = [], newSession) {
  const now = new Date();
  const valid = (Array.isArray(existingSessions) ? existingSessions : []).filter(
    (s) => s?.tokenHash && s?.expiresAt && new Date(s.expiresAt) > now
  );
  const combined = [...valid, newSession];
  return combined.slice(-MAX_ACTIVE_REFRESH_SESSIONS);
}

export async function issueAdminSessionTokens(
  adminId,
  { rememberMe = false } = {}
) {
  await dbConnect();
  const admin = await AdminUserModel.findById(adminId);
  if (!admin || admin.status !== "active") {
    throw new Error("Admin account is inactive or unavailable.");
  }

  const payload = {
    id: admin._id,
    email: admin.email,
    role: admin.role,
    accountType: "admin",
  };

  const accessToken = signAccessToken(payload);
  const {
    token: refreshToken,
    expiresAt,
    maxAgeSeconds,
  } = signRefreshToken(payload, { rememberMe });

  admin.refreshSessions = pruneAndAppendSession(admin.refreshSessions, {
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    createdAt: new Date(),
  });
  admin.lastLoginAt = new Date();
  await admin.save();

  return {
    token: accessToken,
    refreshToken,
    refreshMaxAge: maxAgeSeconds,
    user: {
      id: String(admin._id),
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone || "",
      role: admin.role,
      permissions: admin.permissions || [],
      department: admin.department || "Platform Operations",
      isAdmin: true,
    },
  };
}

export async function issueMerchantSessionTokens(
  userId,
  { rememberMe = false } = {}
) {
  await dbConnect();
  // Ensure Shop model is registered before populate
  void Shop;
  const userDoc = await UserModel.findById(userId).populate(
    "shops",
    "shopId shopName shopSlug"
  );
  if (!userDoc) {
    throw new Error("User account not found.");
  }

  const userRole = userDoc.role || "merchant";
  const payload = {
    id: userDoc._id,
    email: userDoc.email,
    role: userRole,
    accountType: "merchant",
  };

  const accessToken = signAccessToken(payload);
  const {
    token: refreshToken,
    expiresAt,
    maxAgeSeconds,
  } = signRefreshToken(payload, { rememberMe });

  userDoc.refreshSessions = pruneAndAppendSession(userDoc.refreshSessions, {
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    createdAt: new Date(),
  });
  await userDoc.save();

  const primaryShop =
    Array.isArray(userDoc.shops) && userDoc.shops.length > 0
      ? userDoc.shops[0]
      : null;

  const [domain, shopInfo] = primaryShop?._id
    ? await Promise.all([
        DomainModel.findOne(
          { userId: userDoc._id, shopId: primaryShop._id },
          { domain_name: 1, domain_status: 1, _id: 0 }
        ).lean(),
        ShopInfoModel.findOne(
          { userId: userDoc._id, shopId: primaryShop._id },
          { companyLogo: 1, _id: 0 }
        ).lean(),
      ])
    : [null, null];

  return JSON.parse(
    JSON.stringify({
      token: accessToken,
      refreshToken,
      refreshMaxAge: maxAgeSeconds,
      user: {
        id: String(userDoc._id),
        fullName: userDoc.fullName,
        email: userDoc.email,
        phone: userDoc.phone,
        role: userRole,
        shops: primaryShop,
        domain: domain?.domain_name || null,
        shopLogo: shopInfo?.companyLogo?.url || null,
      },
    })
  );
}

export async function rotateRefreshTokenQuery(rawRefreshToken) {
  if (!rawRefreshToken) {
    return {
      ok: false,
      status: 401,
      code: "MISSING_REFRESH_TOKEN",
      message: "Refresh token is required.",
    };
  }

  let decoded;
  try {
    decoded = verifyRefreshTokenJwt(rawRefreshToken);
  } catch {
    return {
      ok: false,
      status: 401,
      code: "INVALID_REFRESH_TOKEN",
      message: "Refresh token is invalid or expired.",
    };
  }

  await dbConnect();
  const incomingHash = hashRefreshToken(rawRefreshToken);
  const now = new Date();
  const rememberMe = Boolean(decoded.rememberMe);
  const isAdminAccount =
    decoded.accountType === "admin" ||
    (decoded.accountType !== "merchant" && isRoleAdmin(decoded.role));

  if (isAdminAccount) {
    const admin = await AdminUserModel.findById(decoded.id);
    if (!admin || admin.status !== "active") {
      return {
        ok: false,
        status: 403,
        code: "ACCOUNT_INACTIVE",
        message: "Admin account is inactive or unavailable.",
      };
    }

    const sessions = Array.isArray(admin.refreshSessions)
      ? admin.refreshSessions
      : [];
    const matched = sessions.find(
      (s) => s.tokenHash === incomingHash && new Date(s.expiresAt) > now
    );

    if (!matched) {
      return {
        ok: false,
        status: 401,
        code: "REFRESH_SESSION_REVOKED",
        message: "Refresh session expired or already rotated. Please sign in again.",
      };
    }

    admin.refreshSessions = sessions.filter((s) => s.tokenHash !== incomingHash);
    await admin.save();

    const issued = await issueAdminSessionTokens(admin._id, { rememberMe });
    return {
      ok: true,
      status: 200,
      accountType: "admin",
      ...issued,
    };
  }

  const userDoc = await UserModel.findById(decoded.id);
  if (!userDoc || !userDoc.emailVerified) {
    return {
      ok: false,
      status: 403,
      code: "ACCOUNT_INACTIVE",
      message: "User account is unavailable or unverified.",
    };
  }

  const sessions = Array.isArray(userDoc.refreshSessions)
    ? userDoc.refreshSessions
    : [];
  const matched = sessions.find(
    (s) => s.tokenHash === incomingHash && new Date(s.expiresAt) > now
  );

  if (!matched) {
    return {
      ok: false,
      status: 401,
      code: "REFRESH_SESSION_REVOKED",
      message: "Refresh session expired or already rotated. Please sign in again.",
    };
  }

  userDoc.refreshSessions = sessions.filter((s) => s.tokenHash !== incomingHash);
  await userDoc.save();

  const issued = await issueMerchantSessionTokens(userDoc._id, { rememberMe });
  return {
    ok: true,
    status: 200,
    accountType: "merchant",
    ...issued,
  };
}

export async function revokeRefreshTokenQuery(rawRefreshToken) {
  if (!rawRefreshToken) return { revoked: false };
  try {
    const decoded = verifyRefreshTokenJwt(rawRefreshToken);
    const targetHash = hashRefreshToken(rawRefreshToken);
    await dbConnect();

    if (decoded.accountType === "admin" || isRoleAdmin(decoded.role)) {
      await AdminUserModel.findByIdAndUpdate(decoded.id, {
        $pull: { refreshSessions: { tokenHash: targetHash } },
      });
    } else {
      await UserModel.findByIdAndUpdate(decoded.id, {
        $pull: { refreshSessions: { tokenHash: targetHash } },
      });
    }
    return { revoked: true };
  } catch {
    return { revoked: false };
  }
}

export async function handleRefreshTokenHttpRequest(request) {
  try {
    let incomingRefresh = "";

    try {
      const body = await request.json();
      if (body?.refreshToken) {
        incomingRefresh = String(body.refreshToken).trim();
      }
    } catch {
      // empty body is normal when relying on HttpOnly cookie
    }

    if (!incomingRefresh) {
      const headerToken = request.headers.get("x-refresh-token");
      if (headerToken) incomingRefresh = headerToken.trim();
    }

    if (!incomingRefresh) {
      const cookieStore = await cookies();
      incomingRefresh = cookieStore.get("refreshToken")?.value || "";
    }

    const rotated = await rotateRefreshTokenQuery(incomingRefresh);
    if (!rotated.ok) {
      const errRes = NextResponse.json(
        {
          status: rotated.status,
          success: false,
          code: rotated.code,
          message: rotated.message,
        },
        { status: rotated.status }
      );
      errRes.cookies.delete("refreshToken");
      return errRes;
    }

    const response = NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Access token refreshed.",
        token: rotated.token,
        refreshToken: rotated.refreshToken,
        user: rotated.user,
      },
      { status: 200 }
    );

    response.cookies.set(
      "refreshToken",
      rotated.refreshToken,
      getRefreshCookieConfig(rotated.refreshMaxAge)
    );

    const clientCookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rotated.refreshMaxAge,
    };
    response.cookies.set("token", rotated.token, clientCookieOpts);
    response.cookies.set(
      "user",
      JSON.stringify(rotated.user),
      clientCookieOpts
    );
    response.cookies.set("role", rotated.user?.role || "", clientCookieOpts);

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to refresh token.",
      },
      { status: 500 }
    );
  }
}
