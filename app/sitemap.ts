import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const base = appUrl.replace(/\/$/, "");
  const isProd = appUrl.includes("auditit.in");

  if (!isProd) {
    // Return a minimal sitemap to avoid leaking staging URLs
    return [
      {
        url: `${base}/`,
        changeFrequency: "never",
        priority: 0.1,
      },
    ];
  }

  // Core static pages; dynamic content (accountant profiles) can be added later via services if needed
  const routes = ["/", "/accountants", "/dashboard", "/auth", "/profile"];

  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.6,
  }));
}
