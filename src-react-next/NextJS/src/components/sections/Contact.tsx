import { Clock, MapPin, MessageCircle, User } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { WhatsAppNumberDisplay } from "@/components/whatsapp/WhatsAppNumberDisplay";
import { businessConfig } from "@/config/business";
import { isAddressConfigured, isMapsConfigured, isOpeningHoursConfigured } from "@/lib/contact";
import { whatsappMessages } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="kontak" className="py-20 md:py-24" aria-labelledby="kontak-heading">
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Kontak</p>
          <h2 id="kontak-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Hubungi DicoFix
          </h2>
          <p className="mt-4 text-muted">
            Data yang belum diisi pemilik ditandai sebagai belum dikonfigurasi dan bukan
            informasi bisnis yang sudah terverifikasi.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex gap-3 rounded-2xl border border-white/10 bg-surface p-4">
              <User className="mt-0.5 size-5 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted">Bisnis & pemilik</p>
                <p className="font-semibold">
                  {businessConfig.name} · {businessConfig.owner}
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-2xl border border-white/10 bg-surface p-4">
              <MessageCircle className="mt-0.5 size-5 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted">WhatsApp</p>
                <p className="font-semibold">
                  <WhatsAppNumberDisplay fallback="Nomor WhatsApp belum dikonfigurasi" />
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-2xl border border-white/10 bg-surface p-4">
              <MapPin className="mt-0.5 size-5 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted">Alamat toko</p>
                <p className="font-semibold">
                  {isAddressConfigured()
                    ? businessConfig.address
                    : "Alamat toko belum dikonfigurasi"}
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-2xl border border-white/10 bg-surface p-4">
              <Clock className="mt-0.5 size-5 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted">Jam operasional</p>
                <p className="font-semibold">
                  {isOpeningHoursConfigured()
                    ? businessConfig.openingHours
                    : "Jam operasional belum dikonfigurasi"}
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-6">
            <WhatsAppButton message={whatsappMessages.contact}>Chat via WhatsApp</WhatsAppButton>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          {isMapsConfigured() ? (
            <iframe
              title="Peta lokasi DicoFix"
              src={businessConfig.mapsUrl}
              className="h-full min-h-[22rem] w-full rounded-3xl border border-white/10"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex min-h-[22rem] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-surface px-6 text-center">
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Peta Google Maps belum ditampilkan karena URL lokasi belum dikonfigurasi. Tambahkan
                tautan peta yang valid di <code>src/config/business.ts</code> setelah alamat toko
                dikonfirmasi.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
