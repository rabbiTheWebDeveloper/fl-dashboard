export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://amardokan-two.vercel.app/sitemap.xml",
  };
}
