import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="layanan" className="py-20 md:py-24" aria-labelledby="layanan-heading">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Layanan</p>
          <h2 id="layanan-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Layanan Perbaikan Smartphone
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Pilih topik yang paling dekat dengan kendala perangkat Anda, lalu lanjutkan
            konsultasi melalui WhatsApp agar teknisi dapat menanyakan detail yang diperlukan.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.04}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_50px_-24px_rgba(6,182,212,0.55)]">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    width={800}
                    height={500}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted">{service.description}</p>
                  <WhatsAppButton message={service.whatsappMessage} size="sm">
                    Konsultasi Layanan
                  </WhatsAppButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
