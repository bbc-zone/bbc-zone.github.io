import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ConfigNotice } from "@/components/layout/ConfigNotice";
import { RuntimeConfigProvider } from "@/components/providers/RuntimeConfigProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessConfig } from "@/config/business";
import { publicAssetPath } from "@/config/paths";
import { isSiteUrlConfigured } from "@/lib/contact";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const title = "DicoFix — Jasa Service HP | Konsultasi Perbaikan Smartphone";
const description =
  "DicoFix membantu Anda menangani berbagai masalah smartphone, mulai dari LCD rusak, baterai bermasalah, hingga HP mati total. Konsultasi langsung melalui WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: businessConfig.name,
  authors: [{ name: businessConfig.owner }],
  keywords: [
    "DicoFix",
    "jasa service HP",
    "perbaikan smartphone",
    "ganti LCD HP",
    "ganti baterai HP",
    "HP mati total",
  ],
  robots: {
    index: true,
    follow: true,
  },
  ...(isSiteUrlConfigured()
    ? {
        metadataBase: new URL(businessConfig.siteUrl),
        alternates: { canonical: "/" },
      }
    : {}),
  openGraph: {
    title,
    description,
    type: "website",
    locale: "id_ID",
    siteName: businessConfig.name,
    images: [
      {
        url: publicAssetPath("/images/hero-repair.webp"),
        width: 1200,
        height: 800,
        alt: "Teknisi DicoFix sedang memperbaiki smartphone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [publicAssetPath("/images/hero-repair.webp")],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <RuntimeConfigProvider>
          <JsonLd />
          <a
            href="#utama"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-background"
          >
            Lewati ke konten utama
          </a>
          <ConfigNotice />
          {children}
        </RuntimeConfigProvider>
      </body>
    </html>
  );
}
