import { FeaturedIn, LivePayouts, ProofInNumbers, Testimonials } from "./SectionsTop";
import { ProveYourExpertise } from "./ProveExpertise";
import { ChallengePricing } from "./PricingC";
import { PlanFinder } from "./PlanFinder";
import { ClosingCta, Comparison, Faq, Footer, HowItWorks, ProductShowcase } from "./SectionsBottom";
import { ScrollProgressBar } from "./ui";

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
      <LivePayouts />
      <ProveYourExpertise />
      <PlanFinder />
      <ChallengePricing />
      <ProofInNumbers />
      <Testimonials />
      <HowItWorks />
      <Comparison />
      <ProductShowcase />
      <ClosingCta />
      <Faq />
      <Footer />
    </>
  );
}
