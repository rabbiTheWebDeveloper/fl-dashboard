import { Suspense } from "react";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import ForgotPassword from "./_component/ForgotPassword";

export const metadata = buildMetadata({
  title: "পাসওয়ার্ড রিসেট",
  description: "আপনার AMARDokan অ্যাকাউন্টের পাসওয়ার্ড পুনরুদ্ধার করুন।",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Forgot Password", path: "/forgot-password" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbs)),
        }}
      />
      <Suspense fallback={null}>
        <ForgotPassword />
      </Suspense>
    </>
  );
}
