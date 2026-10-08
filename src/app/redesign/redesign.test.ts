import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, p), "utf8");
const top = read("./SectionsTop.tsx");
const bottom = read("./SectionsBottom.tsx");
const conversion = read("./Conversion.tsx");
const all = top + bottom + conversion;

describe("redesigned below-the-fold", () => {
  it("is the below-the-fold App actually renders", () => {
    expect(read("../App.tsx")).toContain('import("@/app/redesign/RedesignBelowFold")');
  });

  it("renders every section in the original order", () => {
    const composition = read("./RedesignBelowFold.tsx");
    const order = ["<FeaturedIn />", "<ProveYourSkill />", "<ProofInNumbers />", "<LivePayouts />", "<PricingSection />", "<Testimonials />", "<HowItWorks />", "<Comparison />", "<ProductShowcase />", "<ClosingCta />", "<Faq />", "<Footer />"];
    let last = -1;
    for (const tag of order) {
      const at = composition.indexOf(tag);
      expect(at, tag).toBeGreaterThan(last);
      last = at;
    }
  });

  it("keeps the existing copy", () => {
    for (const text of [
      "Prove Your Market Expertise.",
      "Not your ability to survive",
      "unfair rules.",
      "Thousands traded.",
      "Millions rewarded.",
      "A global community built on transparent conditions, real progress, and rewards delivered to traders.",
      "View Live Rewards",
      "Check More Rewards",
      "Real experiences, verified rewards and transparent feedback from our traders.",
      "Join 21,500+ Traders",
      "How It Works",
      "From choosing your account to receiving your reward, every step is clear.",
      "Explore the FYT process",
      "Built for Traders. Backed by Transparency.",
      "See how we provide more value, more freedom, and more opportunities to grow.",
      "Trusted by thousands of traders worldwide",
      "4.5/5 Trust Index Rating",
      "A clear dashboard gives you everything needed to monitor accounts, request rewards, and manage your journey.",
      "Trusted Platform",
      "Access your account with the platforms you already know.",
      "Secure. Fast. Seamless.",
      "Trusted Support Team",
      "Fast, friendly support whenever traders need help.",
      "Chat with us",
      "Join a Growing Global Community",
      "with FYT.",
      "Become our Next Success Story!",
      "Go to FAQs",
      "A simulated-capital prop firm rewarding disciplined traders across 105+ countries.",
      "© 2026 Funding Your Trades. All rights reserved.",
    ]) {
      expect(all, text).toContain(text);
    }
  });

  it("reuses the shared data and functional components instead of copies", () => {
    for (const name of ["PROVE_SKILL_CARDS", "PROOF_STATS", "HOW_IT_WORKS_STEPS", "COMPARISON_ROWS", "FAQ_ITEMS", "FOOTER_COLUMNS", "<Pricing />", "<FooterLegalText />", "<TradingGlobeSlot />", "<TrustindexWidget />", 'data-fyt-embed="certificates"', 'data-fyt-embed="payouts"', "rewards.fundingyourtrades.com/fyt-embed.js"]) {
      expect(all, name).toContain(name);
    }
  });

  it("drives conversion from the challenge section", () => {
    expect(top).toContain("offerSlot: <PricingOffer />");
    expect(top).toContain("afterCheckoutSlot: <PricingTrustLine />");
    expect(top).toContain("<PricingSlotsContext.Provider value={PRICING_SLOTS}>");
    expect(top).not.toContain("<PayoutTicker />");
    expect(read("./RedesignBelowFold.tsx")).toContain("<FloatingCta />");
    // Offer copy and countdown come from the shared promo data, never hard-coded.
    for (const name of ["PROMO_DEAL_LINE", "PROMO_BENEFITS", "PROMO_CODE", "PROMO_SPOTS_LEFT"]) {
      expect(conversion, name).toContain(name);
    }
    expect(conversion).toContain('href="#challenge"');
  });

  it("keeps the anchors other parts of the page jump to", () => {
    expect(top).toContain('id="live-payouts"');
    expect(bottom).toContain('id="how-it-works"');
    expect(read("../BelowFold.tsx")).toContain('id="challenge"');
  });

  it("uses no em dashes in visible copy", () => {
    const visible = all.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(visible).not.toContain("—");
  });
});
