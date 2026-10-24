"use client";

import { MessageCircle } from "lucide-react";
import { useRuntimeConfig } from "@/components/providers/RuntimeConfigProvider";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import { useState } from "react";

export function FloatingWhatsApp() {
  const [notice, setNotice] = useState(false);
  const { whatsappNumber } = useRuntimeConfig();
  const url = buildWhatsAppUrl(whatsappMessages.general, whatsappNumber);

  return (
    <div className="fixed right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-2 md:right-6">
      {notice ? (
        <p
          role="status"
          className="max-w-[16rem] rounded-xl border border-amber-300/30 bg-[#0B1120]/95 px-3 py-2 text-xs text-amber-100 shadow-xl"
        >
          Nomor WhatsApp belum dikonfigurasi. Isi di site-config.json.
        </p>
      ) : null}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-[#052e16] shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition hover:scale-105"
          aria-label="Chat DicoFix di WhatsApp"
        >
          <MessageCircle className="size-7" />
        </a>
      ) : (
        <button
          type="button"
          className="inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-[#052e16] shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition hover:scale-105"
          aria-label="WhatsApp belum dikonfigurasi"
          onClick={() => setNotice(true)}
        >
          <MessageCircle className="size-7" />
        </button>
      )}
    </div>
  );
}
