import crypto from "crypto";
import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_EXPIRES_IN = "1h";
export const REFRESH_TOKEN_SHORT_DAYS = 7;
export const REFRESH_TOKEN_LONG_DAYS = 30;
export const MAX_ACTIVE_REFRESH_SESSIONS = 5;

const ADMIN_ROLE_SET = new Set([
  "superadmin",
  "user-admin",
  "moderator",
  "support",
  "admin",
]);

export function isRoleAdmin(role) {
  return ADMIN_ROLE_SET.has(String(role || "").toLowerCase());
}

export function getAccessSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Server JWT_SECRET configuration is missing.");
  }
  return secret;
}

export function getRefreshSecret() {
  if (process.env.JWT_REFRESH_SECRET) {
    return process.env.JWT_REFRESH_SECRET;
  }
  const baseSecret = getAccessSecret();
  return crypto
    .createHmac("sha256", baseSecret)
    .update("amardokan-jwt-refresh-secret-v1")
    .digest("hex");
}

export function hashRefreshToken(rawToken) {
  return crypto
    .createHash("sha256")
    .update(String(rawToken || ""))
    .digest("hex");
}

export function signAccessToken({
  id,
  email,
  role,
  accountType = "merchant",
}) {
  return jwt.sign(
    {
      id: String(id),
      email,
      role,
      isAdmin: accountType === "admin",
      accountType,
      tokenType: "access",
    },
    getAccessSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

export function signRefreshToken(
  { id, email, role, accountType = "merchant" },
  { rememberMe = false } = {}
) {
  const days = rememberMe ? REFRESH_TOKEN_LONG_DAYS : REFRESH_TOKEN_SHORT_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const token = jwt.sign(
    {
      id: String(id),
      email,
      role,
      accountType,
      rememberMe: Boolean(rememberMe),
      tokenType: "refresh",
      jti: crypto.randomUUID(),
    },
    getRefreshSecret(),
    { expiresIn: `${days}d` }
  );

  return { token, expiresAt, maxAgeSeconds: days * 24 * 60 * 60 };
}

export function verifyAccessToken(rawToken) {
  const decoded = jwt.verify(rawToken, getAccessSecret());
  if (decoded?.tokenType === "refresh") {
    throw new Error("Refresh token cannot be used as an access token.");
  }
  return decoded;
}

export function verifyRefreshTokenJwt(rawToken) {
  const decoded = jwt.verify(rawToken, getRefreshSecret());
  if (decoded?.tokenType !== "refresh") {
    throw new Error("Invalid token type: expected refresh token.");
  }
  return decoded;
}

export function getRefreshCookieConfig(maxAgeSeconds = 7 * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
