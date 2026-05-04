import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/*/profile"],
      disallow: [
        "/api/",
        "/api/*",
        "/dashboard",
        "/dashboard/",
        "/dashboard/*",
        "/*/settings",
        "/*/settings/",
        "/*/settings/*",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
