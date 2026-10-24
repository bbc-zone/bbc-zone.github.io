import { businessConfig, PLACEHOLDERS } from "@/config/business";

export function isAddressConfigured(): boolean {
  const address = businessConfig.address.trim();
  return Boolean(address) && address !== PLACEHOLDERS.address;
}

export function isOpeningHoursConfigured(): boolean {
  const hours = businessConfig.openingHours.trim();
  return Boolean(hours) && hours !== PLACEHOLDERS.openingHours;
}

export function isMapsConfigured(): boolean {
  try {
    const url = new URL(businessConfig.mapsUrl);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isSiteUrlConfigured(): boolean {
  try {
    const url = new URL(businessConfig.siteUrl);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function formatWhatsAppDisplay(digits: string): string {
  if (digits.startsWith("62") && digits.length >= 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`;
  }
  return `+${digits}`;
}
