import type { NextConfig } from "next";

// Dynamically allow Supabase storage host for next/image
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let images: NextConfig["images"] = undefined;

try {
  if (supabaseUrl) {
    const url = new URL(supabaseUrl);
    const protocol = (url.protocol.replace(":", "") || "https") as "http" | "https";
    images = {
      remotePatterns: [
        {
          protocol,
          hostname: url.host,
          pathname: "/storage/v1/object/**",
        },
      ],
    };
  }
} catch {
  // ignore invalid URL; fallback to default images config
}

const nextConfig: NextConfig = {
  images,
};

export default nextConfig;
