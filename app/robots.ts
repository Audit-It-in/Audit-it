import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const isProd = appUrl.includes("auditit.in");

  return {
    rules: isProd ? [{ userAgent: "*", allow: "/" }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: isProd ? [`${appUrl.replace(/\/$/, "")}/sitemap.xml`] : [],
    host: new URL(appUrl).host,
  };
}
