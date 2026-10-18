import { FeaturedIn, PricingSection, ProofInNumbers, ProveYourSkill, Testimonials } from "./SectionsTop";
import { ClosingCta, Faq, Footer, HowItWorks, ProductShowcase } from "./SectionsBottom";
import { ScrollProgressBar } from "./ui";
import { FloatingCta } from "./Conversion";
import { CountryProof, ExitSavePlan, FreeDemo, PayoutBoard, PlanFinder, ProblemsVsFyt, RewardCalculator, WelcomeBack, ZeroRisk } from "./Growth";

/**
 * Redesigned landing page below the hero. Same content, data, links and
 * checkout flow as the original BelowFold — new visual system, lighter
 * scroll-driven motion (no pinned scroll-jacking sections).
 */
export function BelowFold() {
  return (
    <>
      <ScrollProgressBar />
      <WelcomeBack />
      <FeaturedIn />
      <CountryProof />
      <ProveYourSkill />
      <ProofInNumbers />
      <PlanFinder />
      <PricingSection />
      <PayoutBoard />
      <RewardCalculator />
      <Testimonials />
      <HowItWorks />
      <ProblemsVsFyt />
      <ZeroRisk />
      <FreeDemo />
      <ProductShowcase />
      <ClosingCta />
      <Faq />
      <Footer />
      <FloatingCta />
      <ExitSavePlan />
    </>
  );
}
