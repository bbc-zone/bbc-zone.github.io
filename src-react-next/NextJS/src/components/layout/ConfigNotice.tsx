"use client";

import { useRuntimeConfig } from "@/components/providers/RuntimeConfigProvider";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

export function ConfigNotice() {
  const { whatsappNumber, loaded } = useRuntimeConfig();
  if (!loaded || isWhatsAppConfigured(whatsappNumber)) return null;

  return (
    <div className="border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-center text-xs text-amber-100 md:text-sm">
      Nomor WhatsApp belum dikonfigurasi. Atur di{" "}
      <code className="rounded bg-black/30 px-1">site-config.json</code> sebelum
      memublikasikan situs.
    </div>
  );
}
