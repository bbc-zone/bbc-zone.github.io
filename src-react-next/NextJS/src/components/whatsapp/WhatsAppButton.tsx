"use client";

import { useState } from "react";
import type { VariantProps } from "class-variance-authority";
import { MessageCircle } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { useRuntimeConfig } from "@/components/providers/RuntimeConfigProvider";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  children: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  showIcon?: boolean;
};

export function WhatsAppButton({
  message,
  children,
  className,
  variant = "whatsapp",
  size = "default",
  showIcon = true,
}: Props) {
  const [notice, setNotice] = useState(false);
  const { whatsappNumber } = useRuntimeConfig();
  const url = buildWhatsAppUrl(message, whatsappNumber);

  return (
    <span className="inline-flex flex-col items-stretch gap-2">
      {url ? (
        <Button asChild variant={variant} size={size} className={className}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {showIcon ? <MessageCircle aria-hidden="true" /> : null}
            {children}
          </a>
        </Button>
      ) : (
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className}
          onClick={() => setNotice(true)}
        >
          {showIcon ? <MessageCircle aria-hidden="true" /> : null}
          {children}
        </Button>
      )}
      {notice ? (
        <span
          role="status"
          className={cn(
            "max-w-xs text-xs leading-relaxed text-amber-200",
          )}
        >
          Nomor WhatsApp belum dikonfigurasi. Atur nilai di{" "}
          <code className="rounded bg-white/10 px-1">site-config.json</code>.
        </span>
      ) : null}
    </span>
  );
}
