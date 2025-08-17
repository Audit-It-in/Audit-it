import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/src/constants/app.constants";

export default function robots(): MetadataRoute.Robots {
  const appUrl = APP_CONFIG.url;
  const isProd = appUrl.includes("auditit.in");

  return {
    rules: isProd ? [{ userAgent: "*", allow: "/" }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: isProd ? [`${appUrl.replace(/\/$/, "")}/sitemap.xml`] : [],
    host: new URL(appUrl).host,
  };
}
