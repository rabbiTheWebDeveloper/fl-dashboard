"use client";

import { useEffect } from "react";
import { logoutAsync } from "@/lib/auth";

export default function Logout() {
  useEffect(() => {
    let cancelled = false;
    logoutAsync().finally(() => {
      if (!cancelled) {
        window.location.href = "/login";
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
