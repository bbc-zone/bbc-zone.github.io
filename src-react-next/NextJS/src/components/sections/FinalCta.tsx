import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { whatsappMessages } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24" aria-labelledby="cta-heading">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.28),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.22),_transparent_38%)]" />
      <div className="container-page relative">
        <Reveal>
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/30 via-[#0B1120] to-accent/20 px-6 py-12 text-center md:px-16">
            <h2 id="cta-heading" className="text-3xl font-bold tracking-tight md:text-5xl">
              Jangan Biarkan HP Rusak Mengganggu Aktivitasmu!
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted md:text-lg">
              Konsultasikan masalah smartphone Anda bersama DicoFix dan temukan pilihan
              penanganan yang sesuai.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton message={whatsappMessages.cta} size="lg">
                Chat DicoFix Sekarang
              </WhatsAppButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
