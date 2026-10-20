import { FeaturedIn, PricingSection, Testimonials } from "./SectionsTop";
import { ClosingCta, Faq, Footer, ProductShowcase } from "./SectionsBottom";
import { ScrollProgressBar } from "./ui";
import { PricingIdeas } from "./PricingIdeas";
import { CountryProof, ExitSavePlan, FreeDemo, PayoutBoard, ProveYourExpertise, WelcomeBack, ZeroRisk } from "./Growth";

/**
 * Redesigned landing page below the hero. Sections alternate dark / white:
 * hero (dark) > country rewards (white) > pricing (dark) > why FYT (white) >
 * proof board (dark) > reviews (white) > zero risk (dark) > free demo (white) >
 * platform (dark) > FAQ (white) > closing CTA + footer (dark).
 */
export function BelowFold() {
  return (
    <>
      <ScrollProgressBar />
      <WelcomeBack />
      <FeaturedIn />
      <CountryProof />
      <PricingSection />
      {/* TEST ONLY: six pricing layouts to compare on the preview. */}
      <PricingIdeas />
      <ProveYourExpertise />
      <PayoutBoard />
      <Testimonials />
      <ZeroRisk />
      <FreeDemo />
      <ProductShowcase />
      <Faq />
      <ClosingCta />
      <Footer />
      <ExitSavePlan />
    </>
  );
}
