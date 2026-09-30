import { FeaturedIn, LivePayouts, PricingSection, ProofInNumbers, ProveYourSkill, Testimonials } from "./SectionsTop";
import { ClosingCta, Comparison, Faq, Footer, HowItWorks, ProductShowcase } from "./SectionsBottom";
import { ScrollProgressBar } from "./ui";
import { FloatingCta } from "./Conversion";

/**
 * Redesigned landing page below the hero. Same content, data, links and
 * checkout flow as the original BelowFold — new visual system, lighter
 * scroll-driven motion (no pinned scroll-jacking sections).
 */
export function BelowFold() {
  return (
    <>
      <ScrollProgressBar />
      <FeaturedIn />
      <ProveYourSkill />
      <ProofInNumbers />
      <LivePayouts />
      <PricingSection />
      <Testimonials />
      <HowItWorks />
      <Comparison />
      <ProductShowcase />
      <ClosingCta />
      <Faq />
      <Footer />
      <FloatingCta />
    </>
  );
}
