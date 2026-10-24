import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";
import { isSiteUrlConfigured } from "@/lib/contact";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const robotsConfig: MetadataRoute.Robots = {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };

  if (isSiteUrlConfigured()) {
    robotsConfig.sitemap = `${businessConfig.siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  }

  return robotsConfig;
}
