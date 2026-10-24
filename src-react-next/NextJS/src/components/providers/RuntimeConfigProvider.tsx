"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { publicAssetPath } from "@/config/paths";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

type RuntimeConfig = {
  whatsappNumber: string | null;
  loaded: boolean;
};

const RuntimeConfigContext = createContext<RuntimeConfig>({
  whatsappNumber: null,
  loaded: false,
});

export function RuntimeConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RuntimeConfig>({
    whatsappNumber: null,
    loaded: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${publicAssetPath("/site-config.json")}?v=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Runtime config request failed");
        return response.json() as Promise<{ whatsapp?: unknown }>;
      })
      .then((data) => {
        const whatsapp = typeof data.whatsapp === "string" ? data.whatsapp : "";
        setConfig({ whatsappNumber: normalizeWhatsAppNumber(whatsapp), loaded: true });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setConfig({ whatsappNumber: null, loaded: true });
      });

    return () => controller.abort();
  }, []);

  return <RuntimeConfigContext.Provider value={config}>{children}</RuntimeConfigContext.Provider>;
}

export function useRuntimeConfig() {
  return useContext(RuntimeConfigContext);
}
