import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { faqs } from "@/data/faq";
import { whatsappMessages } from "@/lib/whatsapp";

export function Faq() {
  return (
    <section id="faq" className="bg-surface/50 py-20 md:py-24" aria-labelledby="faq-heading">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">FAQ</p>
          <h2 id="faq-heading" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-muted">
            Jawaban di bawah ini bersifat umum. Untuk detail yang belum dikonfirmasi pemilik
            bisnis, silakan tanyakan langsung melalui WhatsApp.
          </p>
          <div className="mt-6">
            <WhatsAppButton message={whatsappMessages.contact}>Tanya via WhatsApp</WhatsAppButton>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="grid gap-3" defaultValue={faqs[0]?.id}>
            {faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
