"use client";

import Link from "next/link";
import { useEffect } from "react";
import { siteConfig } from "@/lib/seo";

/**
 * Global error boundary for runtime errors (non-404).
 * Must be a Client Component (Next.js requirement).
 * noIndex is handled via the metadata export below (server-side concern
 * falls back to root layout; the error page itself is not crawled in practice).
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Report to your error tracking service here (e.g. Sentry)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="bn">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#080514",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <main style={{ textAlign: "center", maxWidth: 480 }}>
          {/* Error icon */}
          <div
            aria-hidden="true"
            style={{
              fontSize: 72,
              lineHeight: 1,
              marginBottom: 16,
              filter: "drop-shadow(0 0 24px rgba(124,58,237,0.4))",
            }}
          >
            ⚠️
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "1.75rem",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            কিছু একটা ভুল হয়েছে
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: 32, lineHeight: 1.6 }}>
            একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা
            হোমপেজে ফিরে যান।
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              আবার চেষ্টা করুন
            </button>
            <Link
              href="/"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#cbd5e1",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              হোমপেজে ফিরুন
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}