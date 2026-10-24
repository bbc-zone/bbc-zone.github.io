export function normalizeWhatsAppNumber(number: string | null | undefined): string | null {
  if (!number) return null;
  const trimmed = number.trim();
  if (!trimmed || /x/i.test(trimmed)) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    // Indonesian domestic numbers (08...) become international 628...
    digits = `62${digits.slice(1)}`;
  }

  if (digits.length < 10 || digits.length > 15) return null;
  if (!/^[1-9]\d{9,14}$/.test(digits)) return null;

  return digits;
}

export function isWhatsAppConfigured(number: string | null | undefined): boolean {
  return normalizeWhatsAppNumber(number) !== null;
}

export function buildWhatsAppUrl(message: string, number?: string | null): string | null {
  const phone = normalizeWhatsAppNumber(number);
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string, number?: string | null): boolean {
  const url = buildWhatsAppUrl(message, number);
  if (!url || typeof window === "undefined") return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

export const whatsappMessages = {
  general:
    "Halo DicoFix, saya ingin konsultasi mengenai perbaikan smartphone. Mohon informasi lebih lanjut.",
  hero: "Halo DicoFix, saya ingin konsultasi gratis mengenai perbaikan smartphone. Mohon informasi lebih lanjut.",
  cta: "Halo DicoFix, saya ingin chat untuk konsultasi perbaikan smartphone. Terima kasih.",
  contact:
    "Halo DicoFix, saya ingin bertanya mengenai layanan perbaikan smartphone. Mohon informasinya.",
  estimate(brand: string, model: string, problem: string) {
    return `Halo DicoFix, saya ingin menanyakan estimasi biaya service.

Merek HP: ${brand}
Model HP: ${model}
Kerusakan: ${problem}

Mohon informasi estimasi biaya perbaikannya. Terima kasih.`;
  },
} as const;
