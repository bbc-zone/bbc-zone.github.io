"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="testimoni" className="py-20 md:py-24" aria-labelledby="testimoni-heading">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Testimoni</p>
          <h2 id="testimoni-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Apa Kata Pelanggan?
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Kutipan di bawah ini adalah data dummy untuk keperluan tampilan website. Bukan ulasan
            pelanggan asli dan bukan rating agregat bisnis.
          </p>
        </Reveal>

        <div className="mt-8 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Testimoni sebelumnya"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Testimoni berikutnya"
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="mt-4 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="min-w-0 shrink-0 grow-0 basis-full pr-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-surface p-6">
                  <p className="font-semibold text-white">{item.name}</p>
                  <div className="mt-3 flex gap-1" aria-label={`Rating contoh ${item.rating} dari 5`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={index < item.rating ? "size-4 fill-accent text-accent" : "size-4 text-muted"}
                      />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">“{item.quote}”</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {testimonials.map((item, index) => (
            <span
              key={item.id}
              className={
                index === selected
                  ? "h-2 w-6 rounded-full bg-accent"
                  : "h-2 w-2 rounded-full bg-white/20"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
