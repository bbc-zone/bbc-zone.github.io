"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { estimatorBrands, estimatorProblems } from "@/data/estimator";
import { whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function PriceEstimator() {
  const [brandId, setBrandId] = useState(estimatorBrands[0].id);
  const [model, setModel] = useState(estimatorBrands[0].models[0]);
  const [problem, setProblem] = useState<string>(estimatorProblems[0]);

  const selectedBrand = useMemo(
    () => estimatorBrands.find((item) => item.id === brandId) ?? estimatorBrands[0],
    [brandId],
  );

  const message = whatsappMessages.estimate(selectedBrand.name, model, problem);
  const ready = Boolean(brandId && model && problem);

  return (
    <section id="estimasi" className="py-20 md:py-24" aria-labelledby="estimasi-heading">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Estimasi</p>
          <h2 id="estimasi-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Cari Tahu Estimasi Biaya Service HP Anda
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Pilih merek, model, dan jenis kerusakan. Formulir ini tidak menghitung harga otomatis.
            Data pilihan akan disusun menjadi pesan WhatsApp agar teknisi dapat menindaklanjuti.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            className="rounded-3xl border border-white/10 bg-surface p-6 shadow-xl md:p-8"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Merek smartphone
                <select
                  value={brandId}
                  onChange={(event) => {
                    const next = estimatorBrands.find((item) => item.id === event.target.value);
                    setBrandId(event.target.value);
                    setModel(next?.models[0] ?? "");
                  }}
                  className="h-12 rounded-xl border border-white/10 bg-[#0B1120] px-3 text-white"
                >
                  {estimatorBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Model smartphone
                <select
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  className="h-12 rounded-xl border border-white/10 bg-[#0B1120] px-3 text-white"
                >
                  {selectedBrand.models.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="mb-3 text-sm font-medium">Jenis kerusakan</legend>
                <div className="grid grid-cols-2 gap-2">
                  {estimatorProblems.map((item) => (
                    <label
                      key={item}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-center text-sm transition",
                        problem === item
                          ? "border-accent bg-accent/10 text-white"
                          : "border-white/10 text-muted hover:border-white/25",
                      )}
                    >
                      <input
                        type="radio"
                        name="problem"
                        value={item}
                        checked={problem === item}
                        onChange={() => setProblem(item)}
                        className="sr-only"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-8">
              {ready ? (
                <WhatsAppButton message={message} className="w-full" size="lg">
                  Tanyakan Estimasi via WhatsApp
                </WhatsAppButton>
              ) : null}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
