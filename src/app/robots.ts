// Start: Production Crawl Boundaries (robots.ts — App Router Metadata Route)
import type { MetadataRoute } from "next";

// Start: Dynamic Production Site URL Resolution (eliminates placeholder domain)
// Mirrors the resolver used in layout.tsx so the canonical crawl host always
// binds to the active Vercel deploy or a configured NEXT_PUBLIC_SITE_URL override,
// falling back to the official kampung-siber.vercel.app production target.
function resolveSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  try {
    return new URL(fromEnv ?? "https://kampung-siber.vercel.app").toString();
  } catch {
    return "https://kampung-siber.vercel.app";
  }
}
// End: Dynamic Production Site URL Resolution

export default function robots(): MetadataRoute.Robots {
  const baseUrl = resolveSiteUrl();
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