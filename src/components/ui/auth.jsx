/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureValidSession, getRole } from "@/lib/auth";
import Loading from "./loading";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/registration",
  "/account-verify",
  "/forgot-password",
];

const ADMIN_ROLES = [
  "superadmin",
  "user-admin",
  "moderator",
  "support",
  "admin",
];

export function Auth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    ensureValidSession().then((session) => {
      if (!mounted) return;

      if (!session.ok && !isPublicPath) {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      if (session.ok && isPublicPath) {
        const role = String(session.role || getRole() || "").toLowerCase();
        const target = ADMIN_ROLES.includes(role) ? "/admin" : "/dashboard";
        router.replace(target);
        return;
      }

      setAuthorized(true);
    });

    // Proactive background silent refresh check every 4 minutes
    const timer = setInterval(() => {
      ensureValidSession().then((res) => {
        if (!res.ok && !PUBLIC_PATHS.includes(pathname)) {
          router.replace("/login");
        }
      });
    }, 4 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [pathname, router]);

  if (!authorized) return <Loading />;

  return children;
}
