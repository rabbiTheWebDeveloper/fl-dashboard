import { siteConfig } from "@/lib/seo";

const BASE = siteConfig.url;
const NOW = new Date();

export default function sitemap() {
  return [
    // ── Public marketing pages ──────────────────────────────────────────
    {
      url: BASE,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/registration`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/login`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // ── Informational (future) pages ────────────────────────────────────
    // Uncomment and extend as new public pages are added:
    // { url: `${BASE}/pricing`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    // { url: `${BASE}/features`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
    // { url: `${BASE}/about`, lastModified: NOW, changeFrequency: "yearly", priority: 0.5 },
    // { url: `${BASE}/contact`, lastModified: NOW, changeFrequency: "yearly", priority: 0.5 },
    // { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: "daily", priority: 0.8 },
  ];
}
