import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";
import { isSiteUrlConfigured } from "@/lib/contact";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSiteUrlConfigured()) {
    return [];
  }

  return [
    {
      url: `${businessConfig.siteUrl.replace(/\/$/, "")}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
