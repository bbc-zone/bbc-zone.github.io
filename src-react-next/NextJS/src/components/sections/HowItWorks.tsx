import { Reveal } from "@/components/motion/Reveal";

const steps = [
  {
    title: "Konsultasi melalui WhatsApp",
    description: "Mulai percakapan dan sampaikan bahwa Anda ingin memeriksa atau memperbaiki smartphone.",
  },
  {
    title: "Jelaskan masalah smartphone",
    description: "Cantumkan merek, model, gejala, dan kapan masalah mulai muncul agar pemeriksaan lebih terarah.",
  },
  {
    title: "Dapatkan informasi pemeriksaan dan estimasi",
    description:
      "Teknisi akan menjelaskan kemungkinan penanganan dan informasi biaya sesuai data yang tersedia.",
  },
  {
    title: "Konfirmasi perbaikan dengan teknisi",
    description: "Anda yang memutuskan apakah perbaikan dilanjutkan setelah informasi tersebut disampaikan.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface/50 py-20 md:py-24" aria-labelledby="alur-heading">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Alur layanan</p>
          <h2 id="alur-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Service HP Jadi Lebih Mudah
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <li className="relative h-full rounded-3xl border border-white/10 bg-[#0B1120]/80 p-6">
                <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
