import { siteConfig } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block private/auth/API routes from crawlers
        disallow: [
          "/dashboard/",
          "/api/",
          "/account-verify",
          "/logout",
          "/_next/",
        ],
      },
      {
        // Prevent AI scrapers from training on site content
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
