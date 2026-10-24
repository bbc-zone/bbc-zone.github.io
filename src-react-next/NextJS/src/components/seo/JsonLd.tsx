"use client";

import { businessConfig } from "@/config/business";
import { useRuntimeConfig } from "@/components/providers/RuntimeConfigProvider";
import { isAddressConfigured, isSiteUrlConfigured } from "@/lib/contact";

export function JsonLd() {
  const { whatsappNumber } = useRuntimeConfig();
  const phone = whatsappNumber;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: businessConfig.name,
    description: businessConfig.description,
    founder: {
      "@type": "Person",
      name: businessConfig.owner,
    },
    areaServed: "ID",
  };

  if (isSiteUrlConfigured()) {
    data.url = businessConfig.siteUrl;
  }

  if (phone) {
    data.telephone = `+${phone}`;
  }

  if (isAddressConfigured()) {
    data.address = businessConfig.address;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
