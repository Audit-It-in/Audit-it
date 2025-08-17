// Application Constants
const RAW_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
const FALLBACK_APP_URL = "http://localhost:3000";

function resolveAppUrl(raw: string): string {
  try {
    const candidate = (raw || "").trim();
    if (!candidate || candidate.includes("${")) return FALLBACK_APP_URL;
    const parsed = new URL(candidate);
    // Normalize to origin to avoid accidental paths/query in base
    return parsed.origin;
  } catch {
    return FALLBACK_APP_URL;
  }
}

export const APP_CONFIG = {
  name: "Audit-it",
  description: "Find and connect with the best Chartered Accountants near you",
  url: resolveAppUrl(RAW_APP_URL),
  tagline: "Your Trusted CA Partner",
} as const;
