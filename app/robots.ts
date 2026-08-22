import type { MetadataRoute } from "next";

const SITE_URL = "https://passion-protocol.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: ["/discover", "/profile", "/messages", "/workspace", "/onboarding"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
