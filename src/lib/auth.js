import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Constants
const TOKEN_KEY = "token";
const USER_KEY = "user";
const ROLE_KEY = "role";

const getCookieOptions = ({ rememberMe = false, expires } = {}) => ({
  path: "/",
  secure:
    typeof window !== "undefined"
      ? window.location.protocol === "https:"
      : process.env.NODE_ENV === "production",
  sameSite: "lax",
  expires: expires ?? (rememberMe ? 7 : 1),
});

// Token management
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

// User management
export const getUser = async () => {
  try {
    const userStr = Cookies.get(USER_KEY);
    if (!userStr) return null;

    // Handle case where data is already an object
    if (typeof userStr === "object") return userStr;

    // Parse string data
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const setUser = (user, options = {}) => {
  if (!user) return false;
  try {
    // Ensure we're storing a string
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

// Authentication status
export const isAuthenticated = () => {
  try {
    const token = getToken();
    if (!token) return false;

    if (isTokenExpired(token)) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const tokenData = jwtDecode(token);
    if (!tokenData?.exp) return true;
    const expirationTime = tokenData.exp * 1000;
    return Date.now() > expirationTime - 300000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Authentication headers
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    logout();
    window.location.href = "/login";
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const logout = () => {
  try {
    // Remove cookies from root path and current path
    Cookies.remove(TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_KEY, { path: "/" });
    Cookies.remove(ROLE_KEY, { path: "/" });
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
    Cookies.remove(ROLE_KEY);
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
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
