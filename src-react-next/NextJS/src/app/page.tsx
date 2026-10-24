import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Brands } from "@/components/sections/Brands";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChoose } from "@/components/sections/WhyChoose";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="utama">
        <Hero />
        <Brands />
        <Services />
        <WhyChoose />
        <PriceEstimator />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <FinalCta />
        <Contact />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
