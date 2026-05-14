import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/order", "/payment/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
