import { MessageCircle, SearchCheck, ShieldCheck, Wallet } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const points = [
  {
    title: "Konsultasi Mudah",
    description:
      "Anda bisa menjelaskan keluhan perangkat kapan saja melalui WhatsApp, tanpa perlu mengisi formulir rumit.",
    icon: MessageCircle,
  },
  {
    title: "Informasi Biaya Transparan",
    description:
      "Estimasi dan opsi penanganan disampaikan secara langsung, sehingga Anda dapat mempertimbangkan langkah berikutnya.",
    icon: Wallet,
  },
  {
    title: "Penanganan Sesuai Kondisi Perangkat",
    description:
      "Setiap smartphone memiliki kondisi berbeda. Teknisi menyesuaikan pemeriksaan dengan gejala dan model yang Anda sampaikan.",
    icon: SearchCheck,
  },
  {
    title: "Komunikasi Langsung via WhatsApp",
    description:
      "Pertanyaan, konfirmasi, dan update proses tetap terpusat di percakapan WhatsApp agar alurnya ringkas.",
    icon: ShieldCheck,
  },
];

export function WhyChoose() {
  return (
    <section id="keunggulan" className="bg-surface/50 py-20 md:py-24" aria-labelledby="keunggulan-heading">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Pendekatan layanan</p>
          <h2 id="keunggulan-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Kenapa Memilih DicoFix?
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Fokus kami adalah memudahkan Anda memahami opsi perbaikan. Klaim hasil, durasi, atau
            garansi tertentu akan dikonfirmasi langsung saat konsultasi, bukan dijanjikan di halaman ini.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.06}>
              <article className="flex h-full gap-4 rounded-3xl border border-white/10 bg-[#0B1120]/70 p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-accent">
                  <point.icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{point.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
