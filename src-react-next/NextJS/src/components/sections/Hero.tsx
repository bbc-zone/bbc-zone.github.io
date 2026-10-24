"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { businessConfig } from "@/config/business";
import { publicAssetPath } from "@/config/paths";
import { whatsappMessages } from "@/lib/whatsapp";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
            {businessConfig.secondaryTagline}
          </p>
          <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {businessConfig.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Mulai dari layar pecah, baterai bermasalah, hingga HP mati total. Konsultasikan
            masalah smartphone Anda bersama DicoFix.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton message={whatsappMessages.hero} size="lg">
              Konsultasi Gratis via WhatsApp
            </WhatsAppButton>
            <Button asChild variant="outline" size="lg">
              <a href="#layanan">
                Lihat Layanan Kami
                <ArrowRight />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-accent/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl">
            <Image
              src={publicAssetPath("/images/hero-repair.webp")}
              alt="Teknisi memperbaiki smartphone di meja kerja dengan mikroskop dan peralatan presisi"
              width={1200}
              height={800}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-[#0B1120]/20" />
            <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white/90">
              Penanganan perangkat dimulai dari konsultasi yang jelas melalui WhatsApp.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
