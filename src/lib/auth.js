import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Cookie Keys
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token_client";
const USER_KEY = "user";
const ROLE_KEY = "role";

// Refresh 5 minutes before access token expiration
const EXPIRY_BUFFER_MS = 5 * 60 * 1000;

let inflightRefreshPromise = null;

const getCookieOptions = ({ rememberMe = false, expires } = {}) => ({
  path: "/",
  secure:
    typeof window !== "undefined"
      ? window.location.protocol === "https:"
      : process.env.NODE_ENV === "production",
  sameSite: "lax",
  expires: expires ?? (rememberMe ? 30 : 7),
});

// Access Token management
export const getToken = () => Cookies.get(TOKEN_KEY);

export const setToken = (token, options = {}) => {
  if (!token) return false;
  try {
    Cookies.set(TOKEN_KEY, token, getCookieOptions(options));
    return Boolean(Cookies.get(TOKEN_KEY));
  } catch (error) {
    console.error("Error setting token:", error);
    return false;
  }
};

// Refresh Token client backup (primary refresh token is stored as HttpOnly `refreshToken` cookie)
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY) || "";

export const setRefreshToken = (refreshToken, options = {}) => {
  if (!refreshToken) return false;
  try {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, getCookieOptions(options));
    return true;
  } catch (error) {
    console.error("Error setting refresh token:", error);
    return false;
  }
};

// User management
export const getUser = async () => {
  try {
    const userStr = Cookies.get(USER_KEY);
    if (!userStr) return null;
    if (typeof userStr === "object") return userStr;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const setUser = (user, options = {}) => {
  if (!user) return false;
  try {
    const userStr = typeof user === "string" ? user : JSON.stringify(user);
    Cookies.set(USER_KEY, userStr, getCookieOptions(options));
    return Boolean(Cookies.get(USER_KEY));
  } catch (error) {
    console.error("Error setting user:", error);
    return false;
  }
};

// Role management
export const getRole = () => Cookies.get(ROLE_KEY);
export const getUserId = () => Cookies?.get(USER_KEY);

export const setRole = (role, options = {}) => {
  if (!role) return false;
  try {
    Cookies.set(ROLE_KEY, role, getCookieOptions(options));
    return Boolean(Cookies.get(ROLE_KEY));
  } catch (error) {
    console.error("Error setting role:", error);
    return false;
  }
};

export const isTokenExpired = (token, bufferMs = EXPIRY_BUFFER_MS) => {
  if (!token) return true;
  try {
    const tokenData = jwtDecode(token);
    if (!tokenData?.exp) return true;
    const expirationTime = tokenData.exp * 1000;
    return Date.now() > expirationTime - bufferMs;
  } catch {
    return true;
  }
};

// Synchronous check (returns true if access token is valid OR if a user/refresh session is present to attempt silent refresh)
export const isAuthenticated = () => {
  try {
    const token = getToken();
    if (token && !isTokenExpired(token, 0)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const clearAuthCookiesOnly = () => {
  try {
    for (const key of [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, ROLE_KEY]) {
      Cookies.remove(key, { path: "/" });
      Cookies.remove(key);
    }
    return true;
  } catch (error) {
    console.error("Error clearing auth cookies:", error);
    return false;
  }
};

/**
 * Deduplicated silent token rotation against `POST /api/auth/refresh`.
 * Automatically sends the `HttpOnly` `refreshToken` cookie (and client backup if present).
 */
export const refreshAccessToken = async () => {
  if (typeof window === "undefined") return { ok: false };

  if (inflightRefreshPromise) {
    return inflightRefreshPromise;
  }

  inflightRefreshPromise = (async () => {
    try {
      const backupRefresh = getRefreshToken();
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          backupRefresh ? { refreshToken: backupRefresh } : {}
        ),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success || !json?.token) {
        clearAuthCookiesOnly();
        return { ok: false, message: json?.message || "Session expired." };
      }

      setToken(json.token);
      if (json.refreshToken) setRefreshToken(json.refreshToken);
      if (json.user) setUser(json.user);
      if (json.user?.role) setRole(json.user.role);

      return {
        ok: true,
        token: json.token,
        refreshToken: json.refreshToken,
        user: json.user,
      };
    } catch (error) {
      console.error("Silent token refresh error:", error);
      return { ok: false, message: error?.message || "Network error" };
    } finally {
      inflightRefreshPromise = null;
    }
  })();

  return inflightRefreshPromise;
};

/**
 * Ensures an active session: returns immediately if the access token is fresh,
 * otherwise attempts silent rotation via `refreshAccessToken()` before failing.
 */
export const ensureValidSession = async () => {
  const currentToken = getToken();
  if (currentToken && !isTokenExpired(currentToken)) {
    return {
      ok: true,
      refreshed: false,
      token: currentToken,
      role: getRole() || "",
    };
  }

  // Only attempt network refresh if user previously signed in or has a refresh token
  const hasPriorSession = Boolean(
    currentToken || getRefreshToken() || Cookies.get(USER_KEY) || getRole()
  );
  if (!hasPriorSession) {
    return { ok: false, refreshed: false };
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed.ok) {
    return { ok: false, refreshed: false };
  }

  return {
    ok: true,
    refreshed: true,
    token: refreshed.token,
    role: refreshed.user?.role || getRole() || "",
    user: refreshed.user,
  };
};

/**
 * Wrapper around `fetch` that proactively refreshes expiring access tokens
 * and retries once on `401 Unauthorized`.
 */
export const authFetch = async (url, options = {}) => {
  const session = await ensureValidSession();
  const activeToken = session.token || getToken() || "";

  const buildHeaders = (tk) => ({
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
  });

  let response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: buildHeaders(activeToken),
  });

  if (response.status === 401) {
    const rotated = await refreshAccessToken();
    if (rotated.ok && rotated.token) {
      response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: buildHeaders(rotated.token),
      });
    }
  }

  return response;
};

// Authentication headers
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return { "Content-Type": "application/json" };
  }

  // Trigger background proactive refresh if token is within 5-min buffer
  if (typeof window !== "undefined" && isTokenExpired(token)) {
    refreshAccessToken().catch(() => {});
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const logoutAsync = async () => {
  const backupRefresh = getRefreshToken();
  clearAuthCookiesOnly();
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          backupRefresh ? { refreshToken: backupRefresh } : {}
        ),
      });
    } catch {
      // ignore network failure during logout
    }
  }
  return true;
};

export const logout = () => {
  const backupRefresh = getRefreshToken();
  const cleared = clearAuthCookiesOnly();
  if (typeof window !== "undefined") {
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backupRefresh ? { refreshToken: backupRefresh } : {}),
    }).catch(() => {});
  }
  return cleared;
};

export const generateShortName = (fullName) => {
  if (!fullName) return "";
  try {
    const words = fullName.split(" ");
    const initials = words.map((word) => word[0]?.toUpperCase() || "");
    return initials.join("");
  } catch (error) {
    console.error("Error generating short name:", error);
    return "";
  }
};

export const isPublicPath = (path) => {
  const publicPaths = [
    "/",
    "/login",
    "/registration",
    "/account-verify",
    "/forgot-password",
  ];
  return publicPaths.includes(path);
};

export const handleAuthError = (error, router) => {
  if (error?.response?.data?.remark === "authentication_error") {
    logout();
    if (router) {
      router.push("/login");
    } else {
      window.location.href = "/login";
    }
    return true;
  }
  return false;
};

export const getHeaders = () => {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export const getAuthToken = () => {
  const token = getToken();
  return token ? `Bearer ${token}` : "";
};

export const headers = getHeaders();
