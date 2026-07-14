// Start: Production Crawl Boundaries (robots.ts — App Router Metadata Route)
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kampung-siber.retro";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/settings/",
          "/dashboard/",
          "/auth/",
          "/signin/",
          "/password_reset/",
          "/forgot_username/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
// End: Production Crawl Boundaries