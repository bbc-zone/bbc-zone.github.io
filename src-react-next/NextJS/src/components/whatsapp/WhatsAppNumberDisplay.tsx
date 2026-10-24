"use client";

import { useRuntimeConfig } from "@/components/providers/RuntimeConfigProvider";
import { formatWhatsAppDisplay } from "@/lib/contact";

type Props = {
  fallback: string;
  prefix?: string;
  className?: string;
};

export function WhatsAppNumberDisplay({ fallback, prefix = "", className }: Props) {
  const { whatsappNumber } = useRuntimeConfig();
  const text = whatsappNumber ? `${prefix}${formatWhatsAppDisplay(whatsappNumber)}` : fallback;

  return <span className={className}>{text}</span>;
}
