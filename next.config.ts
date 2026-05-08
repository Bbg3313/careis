import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];

if (supabaseUrl) {
  try {
    const host = new URL(supabaseUrl).hostname;
    remotePatterns = [
      {
        protocol: "https",
        hostname: host,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    /* ignore invalid env */
  }
}

const nextConfig: NextConfig = {
  images: remotePatterns.length ? { remotePatterns } : {},
};

export default nextConfig;
