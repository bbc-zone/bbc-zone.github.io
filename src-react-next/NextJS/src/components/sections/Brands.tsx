import { Reveal } from "@/components/motion/Reveal";
import { phoneBrands } from "@/data/brands";

export function Brands() {
  return (
    <section className="border-y border-white/5 bg-surface/60 py-16 md:py-20" aria-labelledby="merek-heading">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Cakupan merek</p>
          <h2 id="merek-heading" className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Berbagai Merek Smartphone, Satu Solusi
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Daftar berikut adalah contoh merek yang umum ditanyakan pelanggan. Konfirmasikan
            merek dan model Anda melalui WhatsApp sebelum perbaikan. Ini bukan jaminan bahwa
            seluruh merek sudah dilayani.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {phoneBrands.map((brand, index) => (
            <Reveal key={brand.id} delay={index * 0.05}>
              <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0B1120]/70 px-3 py-5 text-center">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-accent"
                >
                  {brand.mark}
                </span>
                <span className="text-sm font-semibold text-white">{brand.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
