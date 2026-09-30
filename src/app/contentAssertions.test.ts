import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, p), "utf8");

const sliceToNextFunction = (source: string, startMarker: string) => {
  const start = source.indexOf(startMarker);
  expect(start).toBeGreaterThan(-1);
  let nextFunctionStart = source.indexOf("\nfunction ", start + startMarker.length);
  if (nextFunctionStart === -1) {
    nextFunctionStart = source.indexOf("\nexport default function", start + startMarker.length);
  }
  if (nextFunctionStart === -1) {
    nextFunctionStart = source.indexOf("\nexport function ", start + startMarker.length);
  }
  expect(nextFunctionStart).toBeGreaterThan(start);
  return source.slice(start, nextFunctionStart);
};

describe("Comparison Table Trustpilot rating", () => {
  it("renders the literal Trust Index rating text", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("4.5/5 Trust Index Rating");
  });

  it("no longer references the unwired trustindex-widget container", () => {
    const app = read("./App.tsx");
    expect(app.includes("trustindex-widget")).toBe(false);
  });
});

describe("Comparison Table difference-is-clear components", () => {
  it("extracts the heading, advantage block, and comparison grid into named components", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function DifferenceHeadingText(");
    expect(app).toContain("function DifferenceAdvantageBlock(");
    expect(app).toContain("function DifferenceComparisonGrid(");
  });

  it("no longer renders the comparison grid wrapped in its own independent whileInView motion.div", () => {
    const app = read("./App.tsx");
    expect(app).not.toContain("DIFFERENCE_GRID_VARIANTS");
  });

  it("ComparisonTable renders all three extracted pieces", () => {
    const app = read("./BelowFold.tsx");
    const comparisonTableBody = sliceToNextFunction(app, "function ComparisonTable()");
    expect(comparisonTableBody).toContain("<DifferenceHeadingText");
    expect(comparisonTableBody).toContain("<DifferenceAdvantageBlock");
    expect(comparisonTableBody).toContain("<DifferenceComparisonGrid");
  });

  it("wires the desktop pinned crossfade using a tall scroll wrapper and the heading-exit/content-enter reveals", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("DIFFERENCE_PIN_SCROLL_HEIGHT_VH");
    expect(app).toContain("DIFFERENCE_HEADING_EXIT_REVEAL");
    expect(app).toContain("DIFFERENCE_CONTENT_ENTER_REVEAL");
    expect(app).toContain("function DifferenceScrollLayer(");
  });

  it("restricts each breakpoint's difference-is-clear layout to its own scope (desktop hidden-then-lg:block, mobile lg:hidden)", () => {
    const app = read("./BelowFold.tsx");
    const desktopPinnedBody = sliceToNextFunction(app, "function DifferencePinnedCrossfade(");
    const mobilePinnedBody = sliceToNextFunction(app, "function DifferenceMobilePinnedCrossfade(");
    expect(desktopPinnedBody).toContain("hidden lg:block");
    expect(mobilePinnedBody).toContain("lg:hidden flex flex-col gap-[20px] items-center w-full");
  });

  it("extracts the trust bar into its own component and animates it in with both the desktop and mobile pinned content blocks, while still rendering it statically for reduced-motion users", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function DifferenceTrustBar(");
    expect((app.match(/<DifferenceTrustBar/g) || []).length).toBe(3);
  });

  it("never mounts either pinned crossfade (or their useScroll target refs) for reduced-motion users", () => {
    const app = read("./BelowFold.tsx");
    const comparisonTableBody = sliceToNextFunction(app, "function ComparisonTable()");
    expect(comparisonTableBody).toContain("{!reduceMotion && <DifferencePinnedCrossfade");
    expect(comparisonTableBody).toContain("{!reduceMotion && <DifferenceMobilePinnedCrossfade");
    expect(comparisonTableBody).not.toMatch(/\{\s*<DifferencePinnedCrossfade/);
    expect(comparisonTableBody).not.toMatch(/\{\s*<DifferenceMobilePinnedCrossfade/);
    expect(comparisonTableBody).toMatch(/\{reduceMotion && \(/);
  });

  it("renders DifferenceMobilePinnedCrossfade as plain in-flow content, not a scroll-jacked pin (avoids the stuck/laggy scroll feel a sticky pin+crossfade caused on mobile)", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function DifferenceMobilePinnedCrossfade(");
    const mobilePinnedBody = sliceToNextFunction(app, "function DifferenceMobilePinnedCrossfade(");
    expect(mobilePinnedBody).not.toContain("useScroll(");
    expect(mobilePinnedBody).not.toContain("DIFFERENCE_MOBILE_PIN_SCROLL_HEIGHT_VH");
    expect(mobilePinnedBody).not.toContain("DIFFERENCE_MOBILE_HEADING_EXIT_REVEAL");
    expect(mobilePinnedBody).not.toContain("DIFFERENCE_MOBILE_CONTENT_ENTER_REVEAL");
    expect(mobilePinnedBody).not.toContain("100dvh");
    expect(mobilePinnedBody).not.toContain("sticky");
    expect(mobilePinnedBody).toContain("<DifferenceHeadingText");
  });

  it("DifferenceMobilePinnedCrossfade's content-enter layer uses the mobile 3-column table, not the desktop 2-card grid", () => {
    const app = read("./BelowFold.tsx");
    const mobilePinnedBody = sliceToNextFunction(app, "function DifferenceMobilePinnedCrossfade(");
    expect(mobilePinnedBody).toContain("<DifferenceComparisonTableMobile");
    expect(mobilePinnedBody).not.toContain("<DifferenceComparisonGrid");
  });

  it("ComparisonTable mounts the mobile pinned crossfade only when motion is not reduced", () => {
    const app = read("./BelowFold.tsx");
    const comparisonTableBody = sliceToNextFunction(app, "function ComparisonTable()");
    expect(comparisonTableBody).toContain("{!reduceMotion && <DifferenceMobilePinnedCrossfade reduceMotion={reduceMotion} />}");
  });

  it("centers the heading (rather than top-aligning it) in the desktop pinned crossfade", () => {
    const app = read("./BelowFold.tsx");
    const desktopPinnedBody = sliceToNextFunction(app, "function DifferencePinnedCrossfade(");
    expect(desktopPinnedBody).toContain('className="absolute inset-0 flex items-center justify-center"');
    expect(desktopPinnedBody).not.toContain("items-start");
    expect(desktopPinnedBody).not.toContain("lg:pt-[16px]");
  });
});

describe("Comparison Table: mobile 3-column table data", () => {
  it("COMPARISON_ROWS carries a distinct, minimal criteria label per row (separate from the fyt/others values) for the mobile table's first column", () => {
    const app = read("./BelowFold.tsx");
    const expectedRows = [
      '{ criteria: "Rewards", fyt: "Weekly Rewards", others: "Bi-Weekly Rewards" },',
      '{ criteria: "Drawdown Type", fyt: "Static drawdown", others: "Relative drawdown" },',
      '{ criteria: "Daily Drawdown", fyt: "Balance based daily drawdown", others: "Equity based daily drawdown" },',
      '{ criteria: "Conditions", fyt: "Transparent conditions", others: "Hidden conditions" },',
      '{ criteria: "Time Limit", fyt: "No Time Limits", others: "Time Limits" },',
      '{ criteria: "Reward Split", fyt: "100% Split", others: "80% Split" },',
      '{ criteria: "Refund", fyt: "200% Refund", others: "100% Refund" },',
      '{ criteria: "Bonus", fyt: "18% Bonus", others: "10% Bonus" },',
      '{ criteria: "Consistency Rule", fyt: "No consistency rule", others: "consistency rule" },',
      '{ criteria: "Weekend Holding", fyt: "Weekend/Overnight holdings", others: "No Weekend holdings" },',
      '{ criteria: "News Trading", fyt: "News Trading", others: "News trading restrictions" },',
    ];
    for (const line of expectedRows) {
      expect(app).toContain(line);
    }
  });

  it("defines DifferenceComparisonTableMobile as a semantic 3-column table, self-scoped to below the lg breakpoint", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function DifferenceComparisonTableMobile()");
    const tableBody = sliceToNextFunction(app, "function DifferenceComparisonTableMobile()");
    expect(tableBody).toContain("lg:hidden");
    expect(tableBody).toContain("<table");
    expect(tableBody).toContain("<colgroup>");
    expect(tableBody).toContain('<th scope="col"');
    expect(tableBody).toContain(">Criteria<");
    expect(tableBody).toContain(">FYT<");
    expect(tableBody).toContain(">Others<");
    expect(tableBody).toContain("table-fixed");
    expect(tableBody).toContain('aria-label="FYT compared with other prop firms"');
  });

  it("DifferenceComparisonTableMobile renders one row per COMPARISON_ROWS entry, with the FYT cell visually distinct from Criteria/Others", () => {
    const app = read("./BelowFold.tsx");
    const tableBody = sliceToNextFunction(app, "function DifferenceComparisonTableMobile()");
    expect(tableBody).toContain("COMPARISON_ROWS.map(");
    expect(tableBody).toContain("<tr key={row.criteria}>");
    expect(tableBody).toContain("{row.criteria}");
    expect(tableBody).toContain("{row.fyt}");
    expect(tableBody).toContain("{row.others}");
    expect(tableBody).toContain("rgba(59,130,246,0.05)");
    expect(tableBody).toContain('scope="row"');
  });

  it("the reduced-motion static fallback shows the desktop grid at lg+ and the mobile table below lg", () => {
    const app = read("./BelowFold.tsx");
    const comparisonTableBody = sliceToNextFunction(app, "function ComparisonTable()");
    expect(comparisonTableBody).toContain('<div className="hidden lg:block w-full">');
    expect(comparisonTableBody).toContain('<DifferenceComparisonGrid />');
    expect(comparisonTableBody).toContain("<DifferenceComparisonTableMobile />");
    expect((app.match(/<DifferenceComparisonTableMobile/g) || []).length).toBe(2);
  });
});

describe("Hero headline responsive sizing", () => {
  it("uses an 80px headline at lg (1024px+), not the v3-inherited 104px", () => {
    const app = read("./App.tsx");
    expect(app).toContain("text-[44px] lg:text-[80px] w-full lg:max-w-[1264px]");
  });
  it("scales the subheadline down proportionally (20px was also v3-inherited; 16px matches the corrected headline ratio)", () => {
    const app = read("./App.tsx");
    expect(app).toContain("text-[16px] leading-[1.6] w-full lg:w-[760px]");
  });
});

describe("Hero radar labels (v4 design)", () => {
  it("no longer references currency/instrument pairs anywhere in the app", () => {
    const orbit = read("./motion/heroOrbit.ts");
    const app = read("./App.tsx");
    for (const stale of ["EUR/USD", "GBP/USD", "BTC/USD", "XAU/USD", "NAS100", "US30"]) {
      expect(orbit.includes(stale)).toBe(false);
      expect(app.includes(stale)).toBe(false);
    }
  });
  it("no longer duplicates the 5 feature callouts in a separate row below the CTAs", () => {
    const app = read("./App.tsx");
    expect(app.includes("HERO_STATS_ROW")).toBe(false);
  });
});

describe("Mobile hero radar — two-row 5-label layout", () => {
  it("sources mobile labels from MOBILE_ORBIT_LABELS, not the old 3-of-5 filter", () => {
    const app = read("./App.tsx");
    expect(app).toContain("MOBILE_ORBIT_LABELS");
    expect(app).toContain("MOBILE_LABEL_LAYOUT");
    expect(app).not.toContain("MOBILE_VISIBLE_LABEL_INDICES");
    expect(app).not.toContain("mobileLabelPosition");
  });
  it("gives the mobile sweep beam its own class suffix so it never collides with desktop's", () => {
    const app = read("./App.tsx");
    expect(app).toContain('beamSuffix="-mobile"');
  });
  it("draws spoke lines from the node center to each mobile label, gated to mobileLabels", () => {
    const app = read("./App.tsx");
    expect(app).toContain("mobileLabels &&");
    expect(app).toContain("<line");
  });
  it("grows the mobile radar's reserved clearance band for the new top row (620, up from 454)", () => {
    const app = read("./App.tsx");
    expect(app).toContain("calc(100vw * 620 / ${HERO_STAGE_WIDTH}");
  });
  it("extends the mobile beam's reach so it visually washes over the new, farther-out label positions", () => {
    const app = read("./App.tsx");
    expect(app).toContain("beamReachScale={1.8}");
    expect(app).toContain('transformOrigin: "860px 860px"');
  });
});

describe("Featured-In section background and logo sizing", () => {
  it("matches the hero's pure black background instead of the spec's #0b0c11", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('className="bg-black relative shrink-0 w-full"');
  });
  it("sizes the press logos per the v3 spec, not the old undersized values", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('{ kind: "image", src: imgPressDigitalJournal, alt: "Digital Journal", w: 80 }');
    expect(app).toContain('{ kind: "image", src: imgPressYahoo, alt: "Yahoo Finance", w: 120 }');
    expect(app).toContain('{ kind: "image", src: imgPressBarchart, alt: "Barchart", w: 110 }');
    expect(app).toContain('{ kind: "image", src: imgPressBenzinga, alt: "Benzinga", w: 120 }');
    expect(app).toContain('{ kind: "image", src: imgPressTrustedProp, alt: "The Trusted Prop", w: 150 }');
  });
});

describe("Featured-In section: FirmFinder removed; Trusted Prop uses the new logo asset", () => {
  it("no longer renders the FirmFinder badge", () => {
    const app = read("./BelowFold.tsx");
    expect(app.includes("FirmFinder")).toBe(false);
    expect(app.includes('badgeText: "F"')).toBe(false);
  });
  it("renders The Trusted Prop from the provided logo image", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('import imgPressTrustedProp from "@/assets/live-site/press-logos/the-trusted-prop.png"');
    expect(app).toContain('{ kind: "image", src: imgPressTrustedProp, alt: "The Trusted Prop", w: 150 }');
    expect(app).not.toContain('badgeText: "TPF"');
  });
});

describe("Prove Your Skill section: scroll-pinned card reveal", () => {
  it("imports motion's scroll-progress hooks and the reveal timing data", () => {
    const app = read("./App.tsx");
    expect(app).toContain('import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion, useInView, type MotionValue } from "motion/react";');
    expect(app).toContain('import { PROVE_SKILL_CARD_REVEALS, PROVE_SKILL_SCROLL_HEIGHT_VH, PROVE_SKILL_MOBILE_CARD_REVEALS, PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH, type CardReveal } from "@/app/motion/proveSkillReveal";');
    expect(app).toContain('import { useMonotonicProgress } from "@/app/motion/scrollProgress";');
  });

  it("BelowFold.tsx's actual import now drops the mobile-only reveal constants (mobile is fully static, no longer scroll-linked)", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('import { PROVE_SKILL_CARD_REVEALS, PROVE_SKILL_SCROLL_HEIGHT_VH, type CardReveal } from "@/app/motion/proveSkillReveal";');
    expect(app).not.toContain("PROVE_SKILL_MOBILE_CARD_REVEALS");
    expect(app).not.toContain("PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH");
  });

  it("imports useRef alongside the existing React hooks", () => {
    const app = read("./App.tsx");
    expect(app).toContain('import { useState, useEffect, useRef, useCallback, useMemo, memo, Fragment, lazy, Suspense, Component, type ReactNode } from "react";');
  });

  it("wraps the desktop layout in a tall scroll-tracking wrapper with a sticky pinned inner", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('style={{ height: `${PROVE_SKILL_SCROLL_HEIGHT_VH}vh` }}');
    expect(app).toContain('className="sticky top-0 h-screen flex flex-col items-center justify-start pt-[140px] gap-0"');
  });

  it("renders mobile as fully static -- no pinned/sticky wrapper, no scroll-tracking ref, no per-card reveal motion", () => {
    const app = read("./BelowFold.tsx");
    const proveYourSkillBody = sliceToNextFunction(app, "function ProveYourSkill()");
    expect(proveYourSkillBody).toContain('className="lg:hidden relative w-full flex flex-col items-center gap-[32px]"');
    expect(proveYourSkillBody).not.toContain("mobileScrollRef");
    expect(proveYourSkillBody).not.toContain("mobileRevealProgress");
    expect(proveYourSkillBody).not.toContain("mobileScrollYProgress");
    expect(proveYourSkillBody).not.toContain("sticky top-0 h-[100svh]");
    expect(proveYourSkillBody).not.toContain("PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH");
    expect(proveYourSkillBody.match(/PROVE_SKILL_CARDS\.map/g)?.length).toBe(1);
  });

  it("mobile cards render via plain divs with animated={false}, not ProveSkillRevealCard", () => {
    const app = read("./BelowFold.tsx");
    const proveYourSkillBody = sliceToNextFunction(app, "function ProveYourSkill()");
    const mobileStart = proveYourSkillBody.indexOf('className="lg:hidden relative w-full flex flex-col items-center gap-[32px]"');
    expect(mobileStart).toBeGreaterThan(-1);
    const mobileSection = proveYourSkillBody.slice(mobileStart);
    expect(mobileSection).not.toContain("<ProveSkillRevealCard");
    expect(mobileSection).toContain("<ProveSkillCard text={c.text} animated={false} />");
    expect(mobileSection).toContain('<div className="flex flex-col gap-[12px] w-full items-center">');
  });

  it("no longer uses a carousel for mobile — cards cascade in a plain vertical stack", () => {
    const app = read("./BelowFold.tsx");
    const proveYourSkillBody = sliceToNextFunction(app, "function ProveYourSkill()");
    expect(proveYourSkillBody.includes("useEmblaCarousel")).toBe(false);
    expect(proveYourSkillBody.includes("emblaApi")).toBe(false);
    expect(proveYourSkillBody.includes("mobileCardIndex")).toBe(false);
    expect(proveYourSkillBody.includes('aria-roledescription="carousel"')).toBe(false);
    expect(proveYourSkillBody.includes("Common unfair trading rules")).toBe(false);
  });

  it("no longer threads role/ariaRoledescription through ProveSkillRevealCard (those were carousel-slide-only props, now unused)", () => {
    const app = read("./BelowFold.tsx");
    const revealCardBody = sliceToNextFunction(app, "function ProveSkillRevealCard(");
    expect(revealCardBody.includes("ariaRoledescription")).toBe(false);
    expect(revealCardBody.includes("role={role}")).toBe(false);
    expect(revealCardBody.includes("role?:")).toBe(false);
  });

  it("skips the scroll-driven style entirely for reduced-motion users", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("style={reduceMotion ? undefined : { opacity, x, y }}");
    expect(app).toContain("const reduceMotion = useReducedMotion();");
  });

  it("binds each card to its correct reveal-timing index by position", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('className="absolute left-[2%] top-[8%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[0]}');
    expect(app).toContain('className="absolute right-[2%] top-[8%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[1]}');
    expect(app).toContain('className="absolute left-[10%] top-[56%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[2]}');
    expect(app).toContain('className="absolute right-[10%] top-[56%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[3]}');
    expect(app).toContain('className="absolute left-1/2 -translate-x-1/2 top-[78%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[4]}');
  });

  it("wires revealProgress through useMonotonicProgress before passing it to the cards", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("const revealProgress = useMonotonicProgress(scrollYProgress);");
  });

  it("no longer creates a second (mobile) useMonotonicProgress ratchet -- mobile has no scroll-linked progress at all", () => {
    const app = read("./BelowFold.tsx");
    const proveYourSkillBody = sliceToNextFunction(app, "function ProveYourSkill()");
    expect(proveYourSkillBody.match(/useMonotonicProgress/g)?.length).toBe(1);
    expect(proveYourSkillBody).not.toContain("mobileRevealProgress");
  });

  it("sizes mobile's cards bigger than before while leaving desktop's size pixel-for-pixel unchanged", () => {
    const app = read("./BelowFold.tsx");
    const cardBody = sliceToNextFunction(app, "function ProveSkillCard(");
    expect(cardBody).toContain("w-[260px] lg:w-[240px]");
    expect(cardBody).toContain("gap-[14px] lg:gap-[12px]");
    expect(cardBody).toContain("px-[18px] lg:px-[16px]");
    expect(cardBody).toContain("py-[16px] lg:py-[14px]");
    expect(cardBody).toContain("text-[16px]");
    expect(cardBody).not.toContain("text-[13px]");
  });
});

describe("Live Rewards embeds", () => {
  it("no longer contains the old hardcoded RECENT_REWARDS table data", () => {
    const app = read("./App.tsx");
    expect(app.includes("RECENT_REWARDS")).toBe(false);
    expect(app.includes("On-chain")).toBe(false);
  });

  it("the certificate carousel and live-feed table were replaced by native pixel-clone components (not an iframe)", () => {
    const app = read("./BelowFold.tsx");
    expect(app).not.toContain("useLiveRewardsFeed(");
    expect(app).not.toContain('function TableColIcon({ kind }: { kind: "person" | "dollar" | "shield" | "clock" })');
    expect(app).not.toContain("function PayoutCertificateCard(");
    expect(app).not.toContain("function RewardRow(");
    expect(app).not.toContain("function EmbedFrame(");
    expect(app).not.toContain("rewards.fundingyourtrades.com/embed/");
    expect(app).toContain('const loadRecentVerifiedRewards = () => import("@/app/recentVerifiedRewards");');
    expect(app).toContain('const loadFeaturedCertificates = () => import("@/app/featuredCertificates");');
    expect(app).toContain("<RecentVerifiedRewards />");
    expect(app).toContain("<FeaturedCertificates />");
    expect(app).toContain("https://rewards.fundingyourtrades.com/");
  });
});

describe("recentVerifiedRewards.tsx / featuredCertificates.tsx: live API wiring", () => {
  it("fetches from the real public rewards API (via the configurable API_BASE_URL), not mock data or a proxy", () => {
    const api = read("./api/rewardsApi.ts");
    expect(api).toContain('import { API_BASE_URL } from "@/app/api/apiBaseUrl"');
    expect(api).toContain("const REWARDS_API_BASE = `${API_BASE_URL}/public`;");
    expect(api).toContain("/featured-payouts");
    expect(api).toContain("/featured-certificates");
    const base = read("./api/apiBaseUrl.ts");
    expect(base).toContain("https://rewards.fundingyourtrades.com/api/v1");
  });

  it("payouts table polls only page 1, every 30 seconds, and pauses while backgrounded", () => {
    const table = read("./recentVerifiedRewards.tsx");
    expect(table).toContain("const POLL_INTERVAL_MS = 30000;");
    expect(table).toContain("if (page !== 1 || !active) return;");
    expect(table).toContain("if (document.hidden) return;");
  });

  it("certificates carousel does not poll — pagination only, deduped by certificateId", () => {
    const carousel = read("./featuredCertificates.tsx");
    expect(carousel).not.toContain("setInterval(load");
    expect(carousel).toContain("seenIdsRef.current.has(c.certificateId)");
  });
});

describe("Testimonials real-data carousel", () => {
  it("no longer contains the old fully-fabricated review names/ratings", () => {
    const app = read("./App.tsx");
    expect(app.includes("Daniel K.")).toBe(false);
    expect(app.includes('rating="4.9/5"')).toBe(false);
  });

  it("no longer renders the old decorative (aria-hidden, unfocusable) carousel buttons", () => {
    const app = read("./App.tsx");
    expect(
      app.includes(
        'aria-hidden="true" tabIndex={-1} className="hidden lg:flex items-center justify-center rounded-full size-[40px] shrink-0 bg-white"',
      ),
    ).toBe(false);
  });

  it("is wired to the real video-only TESTIMONIAL_VIDEOS data with a working, accessible prev button", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("VIDEO_ONLY_ITEMS.map");
    expect(app).toContain('aria-label="Previous testimonials"');
  });
});

describe("Video lightbox: testimonial video cards", () => {
  it("imports createPortal and the video-lightbox source helpers", () => {
    const app = read("./App.tsx");
    expect(app).toContain('import { createPortal } from "react-dom";');
    expect(app).toContain(
      'import { type VideoSource, buildYouTubeEmbedUrl, testimonialVideoSource, pricingExplainerVideoSource } from "@/app/motion/videoLightbox";',
    );
  });

  it("defines a VideoLightbox component that portals an 80vw x 80vh panel to document.body", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function VideoLightbox({ source, onClose }: { source: VideoSource | null; onClose: () => void })");
    expect(app).toContain('className="relative w-[80vw] h-[80vh] rounded-[16px] overflow-hidden bg-black"');
    expect(app).toContain("return createPortal(");
    expect(app).toContain("document.body,");
  });

  it("closes on Escape and stops playback by unmounting on close (returns null when source is falsy)", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('if (e.key === "Escape") onClose();');
    expect(app).toContain("if (!source) return null;");
  });

  it("closes on backdrop click but not on a drag that starts inside the panel and releases on the backdrop", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain(
      'onMouseDown={(e) => {\n        mouseDownOnBackdropRef.current = e.target === e.currentTarget;\n      }}\n      onClick={(e) => {\n        if (mouseDownOnBackdropRef.current && e.target === e.currentTarget) onClose();\n      }}\n      className="fixed inset-0 z-[200] flex items-center justify-center"',
    );
    expect(app).toContain("const mouseDownOnBackdropRef = useRef(false);");
    expect(app).toContain("onClick={(e) => e.stopPropagation()}");
  });

  it("plays the mp4 branch with native controls (surfacing playback errors) and the youtube branch as an embedded iframe", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain(
      '<video\n              key={source.src}\n              src={source.src}\n              poster={source.poster}\n              controls\n              autoPlay\n              onError={() => setVideoError(true)}\n              className="size-full object-contain"\n            />',
    );
    expect(app).toContain("Video unavailable");
    expect(app).toContain("src={buildYouTubeEmbedUrl(source.videoId)}");
    expect(app).toContain("allowFullScreen");
  });

  it("resets the video-error flag whenever the source changes and shows a fallback message on playback error", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("const [videoError, setVideoError] = useState(false);");
    expect(app).toContain('useEffect(() => {\n    setVideoError(false);\n  }, [source]);');
    expect(app).toContain("{videoError && (");
  });

  it("memoizes each VideoLightbox onClose handler so the focus-management effect doesn't re-run on unrelated re-renders", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    const testimonialsBody = sliceToNextFunction(app, "function Testimonials()");
    expect(pricingBody).toContain("const closeExplainerVideo = useCallback(() => setShowExplainerVideo(false), []);");
    expect(testimonialsBody).toContain("const closeVideoLightbox = useCallback(() => setActiveVideo(null), []);");
  });

  it("makes VideoCard an accessible clickable trigger instead of a decorative div", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('function VideoCard({ src, name, onPlay }: { src: string; name: string; onPlay: () => void })');
    expect(app).toContain("aria-label={`Play video testimonial from ${name}`}");
  });

  it("threads onPlayVideo from Testimonials through both carousels and TestimonialSlide to VideoCard", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain(
      'function TestimonialSlide({ item, onPlayVideo }: { item: TestimonialSlideItem; onPlayVideo: (video: TestimonialVideo) => void })',
    );
    expect(app).toContain("<VideoCard src={item.video.posterUrl} name={item.video.name} onPlay={() => onPlayVideo(item.video)} />");
    expect(app).toContain(
      "function TestimonialsDesktopCarousel({ onPlayVideo }: { onPlayVideo: (video: TestimonialVideo) => void })",
    );
    expect(app).toContain(
      "function TestimonialsMobileCarousel({ onPlayVideo }: { onPlayVideo: (video: TestimonialVideo) => void })",
    );
    expect((app.match(/<TestimonialSlide item=\{item\} onPlayVideo=\{onPlayVideo\} \/>/g) || []).length).toBe(2);
  });

  it("Testimonials holds the active-video state and renders one VideoLightbox fed by testimonialVideoSource", () => {
    const app = read("./BelowFold.tsx");
    const testimonialsBody = sliceToNextFunction(app, "function Testimonials()");
    expect(testimonialsBody).toContain("const [activeVideo, setActiveVideo] = useState<TestimonialVideo | null>(null);");
    expect(testimonialsBody).toContain("<TestimonialsDesktopCarousel onPlayVideo={setActiveVideo} />");
    expect(testimonialsBody).toContain("<TestimonialsMobileCarousel onPlayVideo={setActiveVideo} />");
    expect(testimonialsBody).toContain(
      "<VideoLightbox source={activeVideo ? testimonialVideoSource(activeVideo) : null} onClose={closeVideoLightbox} />",
    );
  });
});

describe("Video lightbox: Pricing 'See how it works' explainer", () => {
  it("Pricing holds a showExplainerVideo flag alongside its existing state", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('const [showExplainerVideo, setShowExplainerVideo] = useState(false);');
  });

  it("the 'See how it works' trigger is a real button (not an anchor pretending to be one) that opens the lightbox", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('onClick={(e) => { e.preventDefault(); setShowExplainerVideo(true); }}');
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('<button\n              type="button"\n              onClick={(e) => { e.preventDefault(); setShowExplainerVideo(true); }}');
    expect(pricingBody).not.toContain('href="#"');
  });

  it("Pricing renders a VideoLightbox fed by pricingExplainerVideoSource, closing back to false", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain(
      "<VideoLightbox source={showExplainerVideo ? pricingExplainerVideoSource() : null} onClose={closeExplainerVideo} />",
    );
  });
});

describe("Closing CTA world map widget", () => {
  it("renders the three-globe 3D TradingGlobe instead of the old flat react-simple-maps widget", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('const loadGlobe = () => import("@/app/globe");');
    expect(app).toContain("<TradingGlobe onReady={() => setGlobeReady(true)} active={isActive} />");
  });

  it("no longer imports the old baked-map PNG or defines the old inline map code", () => {
    const app = read("./App.tsx");
    expect(app.includes("imgWorldMapBackground")).toBe(false);
    expect(app.includes("function WorldMapArcs(")).toBe(false);
    expect(app.includes("const CITIES = [")).toBe(false);
    expect(app.includes("const ARCS = [")).toBe(false);
  });
});

describe("Desktop nav: live-site link structure", () => {
  it("imports NAV_LINKS", () => {
    const app = read("./App.tsx");
    expect(app).toContain('import { HERO_CONTENT, KEY_METRICS, NAV_LINKS, FOOTER_COLUMNS, FOOTER_LINKS, FAQ_ITEMS } from "@/app/data/liveSiteContent";');
  });

  it("Links() renders NAV_LINKS.items instead of the old hardcoded placeholder labels", () => {
    const app = read("./App.tsx");
    const linksBody = sliceToNextFunction(app, "function Links()");
    expect(linksBody).toContain("NAV_LINKS.items.map(");
    expect(linksBody).not.toContain("Programs");
    expect(linksBody).not.toContain("Pricing");
    expect(linksBody).not.toContain("Trading Rules");
    expect(linksBody).not.toContain(">Platforms<");
    expect(linksBody).not.toContain("overflow-clip");
    expect(linksBody).toContain("tabIndex={0}");
    expect(linksBody).toContain("cursor-pointer");
    expect(linksBody).not.toContain("invisible");
    expect(linksBody).toContain("pointer-events-none");
    expect(linksBody).toContain("group-hover/affiliate:pointer-events-auto");
    expect(linksBody).toContain("group-focus-within/affiliate:pointer-events-auto");
  });

  it("NavRight() and ButtonPrimaryLg() use NAV_LINKS.login and NAV_LINKS.buyHere as real hrefs", () => {
    const app = read("./App.tsx");
    const navRightBody = sliceToNextFunction(app, "function NavRight()");
    expect(navRightBody).toContain("href={NAV_LINKS.login.href}");
    expect(navRightBody).toContain("{NAV_LINKS.login.label}");
    const buttonBody = sliceToNextFunction(app, "function ButtonPrimaryLg()");
    expect(buttonBody).toContain("href={NAV_LINKS.buyHere.href}");
    expect(buttonBody).toContain("{NAV_LINKS.buyHere.label}");
  });
});

describe("Mobile menu: live-site link structure", () => {
  it("MobileMenu renders NAV_LINKS.items with Affiliate as a collapsible submenu (not flattened into the main list)", () => {
    const app = read("./App.tsx");
    const mobileMenuBody = sliceToNextFunction(app, "function MobileMenu(");
    expect(mobileMenuBody).toContain("NAV_LINKS.items.map(");
    expect(mobileMenuBody).toContain("affiliateOpen");
    expect(mobileMenuBody).toContain('aria-controls="mobile-affiliate-submenu"');
    expect(mobileMenuBody).toContain("setAffiliateOpen");
    expect(mobileMenuBody).not.toContain('const links = ["Programs", "Pricing", "Trading Rules", "Platforms", "FAQ"];');
  });

  it("MobileMenu's bottom actions use NAV_LINKS.login and NAV_LINKS.buyHere as real hrefs", () => {
    const app = read("./App.tsx");
    const mobileMenuBody = sliceToNextFunction(app, "function MobileMenu(");
    expect(mobileMenuBody).toContain("href={NAV_LINKS.login.href}");
    expect(mobileMenuBody).toContain("{NAV_LINKS.login.label}");
    expect(mobileMenuBody).toContain("href={NAV_LINKS.buyHere.href}");
    expect(mobileMenuBody).toContain("{NAV_LINKS.buyHere.label}");
  });

  it("MobileMenu's Buy Here anchor closes the overlay on tap (in-page anchor, otherwise the overlay stays over the scrolled page)", () => {
    const app = read("./App.tsx");
    const mobileMenuBody = sliceToNextFunction(app, "function MobileMenu(");
    expect(mobileMenuBody).toContain('<a href={NAV_LINKS.buyHere.href} onClick={onClose}');
  });
});

describe("How It Works CTA: real link instead of no-op placeholder", () => {
  it("HowItWorksCta links to the pricing section, not a dead '#' with preventDefault", () => {
    const app = read("./BelowFold.tsx");
    const ctaBody = sliceToNextFunction(app, "function HowItWorksCta()");
    expect(ctaBody).toContain('href="#challenge"');
    expect(ctaBody).not.toContain('href="#"');
    expect(ctaBody).not.toContain("onClick={(e) => e.preventDefault()}");
  });
});

describe("Testimonials CTA: real link instead of a dead div", () => {
  it("'Join 21,500+ Traders' is a real anchor to the pricing section, not a non-interactive div", () => {
    const app = read("./BelowFold.tsx");
    const testimonialsBody = sliceToNextFunction(app, "function Testimonials()");
    expect(testimonialsBody).toContain('<a href="#challenge" className="bg-[#3b82f6] flex items-center justify-center px-[32px] py-[14px] rounded-[8px] shrink-0 no-underline">');
    expect(testimonialsBody).not.toContain("cursor-pointer");
  });
});

describe("Footer: real nav columns and social links", () => {
  it("imports FOOTER_COLUMNS and FOOTER_LINKS", () => {
    const app = read("./App.tsx");
    expect(app).toContain(
      'import { HERO_CONTENT, KEY_METRICS, NAV_LINKS, FOOTER_COLUMNS, FOOTER_LINKS, FAQ_ITEMS } from "@/app/data/liveSiteContent";',
    );
  });

  it("Footer renders FOOTER_COLUMNS instead of the old hardcoded 3-column array", () => {
    const app = read("./BelowFold.tsx");
    const footerBody = sliceToNextFunction(app, "function Footer()");
    expect(footerBody).toContain("FOOTER_COLUMNS.map(");
    expect(footerBody).not.toContain("Evaluations");
    expect(footerBody).not.toContain(">Platforms<");
    expect(footerBody).not.toContain(">About<");
  });

  it("Footer wraps each social icon in a real link via a SocialIcon component", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain(
      'function SocialIcon({ label, href, children }: { label: string; href: string; children: ReactNode })',
    );
    const footerBody = sliceToNextFunction(app, "function Footer()");
    expect(footerBody).toContain('<SocialIcon label="X" href={socialHref("X")}>');
    expect(footerBody).toContain('<SocialIcon label="Discord" href={socialHref("Discord")}>');
    expect(footerBody).toContain('<SocialIcon label="Instagram" href={socialHref("Instagram")}>');
    expect(footerBody).toContain('<SocialIcon label="YouTube" href={socialHref("YouTube")}>');
    expect(footerBody).toContain('<SocialIcon label="Telegram" href={socialHref("Telegram")}>');
  });

  it("FOOTER_COLUMNS footer PRODUCT column uses 'Reward ledger' label, not 'Payout ledger'", () => {
    const liveSiteContent = read("./data/liveSiteContent.ts");
    expect(liveSiteContent).toContain('{ label: "Reward ledger", href: "#live-payouts" }');
    expect(liveSiteContent).not.toContain('{ label: "Payout ledger"');
  });
});

describe("Pricing panels: shared row/bullet renderers", () => {
  it("extracts Key Rules rows and Why-traders bullets into standalone components reused by Pricing()", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function KeyRulesRows(");
    expect(app).toContain("function WhyChoiceBullets(");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain("<KeyRulesRows stats={stats} />");
    expect(pricingBody).toContain("<WhyChoiceBullets bullets={traderChoiceBullets} />");
  });
});

describe("Pricing panels: mobile chip switcher for Key Rules / Why traders choose this", () => {
  it("adds a mobilePanelTab state defaulting to Key Rules, changed only by the chip's own onClick", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('type MobilePanelTab = "rules" | "why";');
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('const [mobilePanelTab, setMobilePanelTab] = useState<MobilePanelTab>("rules");');
    expect((pricingBody.match(/setMobilePanelTab/g) || []).length).toBe(2);
    expect(pricingBody).toContain("onClick={() => setMobilePanelTab(opt.id)}");
  });

  it("keeps Your Selection always visible and restricts Key Rules / Why traders choose this to >=640px (sm)", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('<PanelCard className="flex">');
    expect((pricingBody.match(/<PanelCard className="hidden sm:flex">/g) || []).length).toBe(2);
    expect(pricingBody).toContain('<PanelCard className="flex sm:hidden">');
  });

  it("reuses KeyRulesRows and WhyChoiceBullets in both the tablet/desktop cards and the mobile merged card", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect((pricingBody.match(/<KeyRulesRows stats=\{stats\} \/>/g) || []).length).toBe(2);
    expect((pricingBody.match(/<WhyChoiceBullets bullets=\{traderChoiceBullets\} \/>/g) || []).length).toBe(2);
  });

  it("shows the Key Rules / Why traders choose this heading text exactly once each — only in the tablet/desktop cards, never duplicated in the mobile card", () => {
    const app = read("./BelowFold.tsx");
    expect((app.match(/>Key Rules</g) || []).length).toBe(1);
    expect((app.match(/>Why traders choose this</g) || []).length).toBe(1);
  });

  it("drops the decorative info icon from the mobile merged card (stays exactly once, in the tablet/desktop Key Rules card)", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect((pricingBody.match(/kind="info"/g) || []).length).toBe(1);
  });

  it("keeps the 'Designed for consistency' footer caption under Key Rules content in both the tablet/desktop card and the mobile Key Rules tab", () => {
    const app = read("./BelowFold.tsx");
    expect((app.match(/Designed for consistency\. Built for growth\./g) || []).length).toBe(2);
  });

  it("defines the mobile chip labels as the literal heading text", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('{ id: "rules", label: "Key Rules" },');
    expect(app).toContain('{ id: "why", label: "Why traders choose this" },');
  });

  it("styles the chip group as a role=group segmented control matching the existing Pick your model / Choose your type controls, not ARIA tabs", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('aria-label="Show Key Rules or Why traders choose this"');
    expect(pricingBody).not.toContain('role="tablist"');
    expect(pricingBody).not.toContain('role="tab"');
    expect(pricingBody).not.toContain("aria-selected");
  });
});

describe("ProductShowcase Trusted Support Team card (spec v4 blue container)", () => {
  it("recolors the support card container with a darker card-scale blue gradient, and the platform boxes also use the same gradient", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect((gridBody.match(/style=\{SUPPORT_CARD_GRADIENT_STYLE\}/g) || []).length).toBe(2);
    expect(gridBody).not.toContain("PILL_CTA_GRADIENT_STYLE");
    expect((gridBody.match(/border: "1px solid rgba\(0,0,0,0\.08\)"/g) || []).length).toBe(1);
  });

  it("sets the support card heading and subtext to white/light text for the blue background", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).toContain('text-white text-[22px] mb-[8px] text-center xl:text-left">Trusted Support Team');
    expect(gridBody).toContain('text-[rgba(255,255,255,0.8)] text-[14px] mb-[20px] text-center xl:text-left">Fast, friendly support whenever traders need help.');
  });

  it("lightens the support feature icon badges to translucent white and their labels to white", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).toContain('style={{ background: "rgba(255,255,255,0.16)" }}');
    expect(gridBody).toContain('font-medium text-white text-[11px]');
  });

  it("draws the support feature icons in white instead of brand blue, since they now sit on a blue card", () => {
    const app = read("./BelowFold.tsx");
    const iconBody = sliceToNextFunction(app, "function SupportFeatureIcon(");
    expect(iconBody).toContain('stroke: "#ffffff"');
    expect(iconBody).not.toContain('stroke: "#3b82f6"');
  });

  it("flips the Chat with us button to a white pill with blue text/arrow, sharing the card's accent-blue constant", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).toContain('bg-white rounded-full px-[20px] py-[12px]');
    expect(gridBody).toContain('style={{ color: SUPPORT_CARD_ACCENT_BLUE }}>Chat with us');
    expect(gridBody).toContain('stroke={SUPPORT_CARD_ACCENT_BLUE} strokeWidth="1.6"');
    expect(gridBody).toContain("onClick={openIntercomMessenger}");
  });

  it("boots the real Intercom messenger from a bottom-right custom launcher", () => {
    const app = read("./App.tsx");
    expect(app).toContain('id="intercom-chat-button"');
    expect(app).toContain("fyt-intercom-launcher");
    expect(app).not.toContain("intercom-lightweight-app-launcher");
    expect(app).toContain("<IntercomLauncher />");
    expect(app).toContain("bootIntercom");
    expect(app).toContain("toggleIntercomMessenger");
    const intercom = read("./intercom.ts");
    expect(intercom).toContain("widget.intercom.io/widget/");
    expect(intercom).toContain("hide_default_launcher: true");
    expect(intercom).not.toContain("custom_launcher_selector");
  });

  it("renders a floating Discord invite button at the bottom-left", () => {
    const app = read("./App.tsx");
    expect(app).toContain("<DiscordLauncher />");
    expect(app).toContain('const DISCORD_INVITE_URL = "https://discord.com/invite/6NYNSAwxeZ"');
    expect(app).toContain('aria-label="Join FYT on Discord"');
    expect(app).toContain('left: "max(20px, env(safe-area-inset-left, 0px))"');
  });

  it("shrinks the Trusted Platform card's internal spacing (connector gap, logo padding, trailer margin) so it no longer towers over the recolored Support card", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).toContain('top-[-76px] h-[76px]');
    expect(gridBody).toContain('viewBox="0 0 100 76"');
    expect(gridBody).not.toContain('top-[-64px] h-[64px]');
    expect(gridBody).not.toContain('viewBox="0 0 100 64"');
    expect(gridBody).toContain('mb-[76px] text-center lg:text-left">Access your account with the platforms you already know.');
    expect(gridBody).toContain('rounded-[12px] px-[4px] lg:px-0 py-0 lg:py-[14px]"');
    expect(gridBody).toContain('text-[13px] mt-[8px] flex items-center justify-center lg:justify-start gap-[6px]');
  });

  it("lets the support card stretch to match its now-shrunk Trusted Platform sibling again, after trimming its own stacked-layout gap so Platform stays the taller anchor at every desktop width", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).not.toContain('self-start" style={SUPPORT_CARD_GRADIENT_STYLE}');
    expect(gridBody).toContain('rounded-[16px] p-[28px] lg:p-[36px]" style={SUPPORT_CARD_GRADIENT_STYLE}');
    expect(gridBody).toContain('flex flex-col xl:flex-row xl:items-center justify-between h-full gap-[12px] xl:gap-[24px]');
  });
});

describe("Prime plan 'No Consistency' badge", () => {
  it("renders the badge inside the plan-selector button, driven by planFlag", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain("const flag = planFlag(opt.id);");
    expect(pricingBody).toContain("{flag && (");
    expect(pricingBody).toContain("{flag}");
  });

  it("imports planFlag from the pricing module", () => {
    const app = read("./App.tsx");
    expect(app).toMatch(/import\s*\{[^}]*\bplanFlag\b[^}]*\}\s*from\s*"@\/app\/data\/pricing"/);
  });

  it("keeps the flag inside the button element, not as a sibling positioned outside it", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    const buttonStart = pricingBody.indexOf("{STEP_PLANS[step].map((opt) => {");
    expect(buttonStart).toBeGreaterThan(-1);
    const buttonBlockEnd = pricingBody.indexOf("})}", buttonStart);
    const buttonBlock = pricingBody.slice(buttonStart, buttonBlockEnd);
    const openButton = buttonBlock.indexOf("<button");
    const closeButton = buttonBlock.indexOf("</button>");
    const flagSpan = buttonBlock.indexOf("{flag && (");
    expect(openButton).toBeGreaterThan(-1);
    expect(flagSpan).toBeGreaterThan(openButton);
    expect(flagSpan).toBeLessThan(closeButton);
  });
});

describe("ProductShowcase Trusted Platform boxes (blue recolor)", () => {
  it("gives the MatchTrader and Platform 5 boxes the same blue gradient style as the Trusted Support Team card", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect((gridBody.match(/style=\{SUPPORT_CARD_GRADIENT_STYLE\}/g) || []).length).toBe(2);
  });

  it("removes the now-dead per-item dark flag and its black/white ternary styling", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).not.toContain("dark: true");
    expect(gridBody).not.toContain("dark: false");
    expect(gridBody).not.toContain('background: dark ?');
    expect(gridBody).not.toContain('color: dark ?');
  });

  it("sets both platform box labels to plain white text", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).toContain('font-medium text-white text-[11px] lg:text-[16px]');
  });

  it("makes the Platform 5 logo larger than MatchTrader's, since its artwork reads too small on the new blue background (desktop sizes — mobile intentionally uses one shared icon size for both, see the responsive-Platform-cards fix)", () => {
    const app = read("./BelowFold.tsx");
    const gridBody = sliceToNextFunction(app, "{/* Trusted Platform + Trusted Support */}");
    expect(gridBody).toContain('logoClassName: "h-[15px] lg:h-[24px] w-auto object-contain shrink-0"');
    expect(gridBody).toContain('logoClassName: "h-[15px] lg:h-[36px] w-auto object-contain shrink-0"');
  });
});

describe("Pricing panel: Platform selector (step 3, MatchTrader / Platform 5)", () => {
  it("adds a role=group Platform selector using PLATFORM_OPTIONS, wired to setPlatform", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('aria-labelledby="platform-group-label"');
    expect(pricingBody).toContain('id="platform-group-label"');
    expect(pricingBody).toContain("PLATFORM_OPTIONS.map(");
    expect(pricingBody).toContain("onClick={() => setPlatform(opt.id)}");
  });

  it("imports PLATFORM_OPTIONS from the pricing module", () => {
    const app = read("./App.tsx");
    expect(app).toMatch(/import\s*\{[^}]*\bPLATFORM_OPTIONS\b[^}]*\}\s*from\s*"@\/app\/data\/pricing"/);
  });

  it("renders the platform buttons with their real logo marks (PLATFORM_LOGOS), not a generic glyph", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    const start = pricingBody.indexOf("PLATFORM_OPTIONS.map(");
    expect(start).toBeGreaterThan(-1);
    const end = pricingBody.indexOf("})}", start);
    const block = pricingBody.slice(start, end);
    expect(block).toContain("src={PLATFORM_LOGOS[opt.id]}");
    expect(block).toContain("style={{ height: PLATFORM_LOGO_HEIGHT[opt.id] }}");
    expect(block).not.toContain("<SelectorIcon");
  });

  it("maps both platform ids to their real imported logo assets, each with its own height", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('const PLATFORM_LOGOS: Record<PlatformId, string> = { "match-trader": imgMatchTraderLogo, "platform-5": imgPlatform5Logo };');
    expect(app).toContain('const PLATFORM_LOGO_HEIGHT: Record<PlatformId, string> = { "match-trader": "16px", "platform-5": "26px" };');
  });

  it("labels the four selector groups in order: model, type, platform, size", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    const order = ['n={1}>Pick your model<', 'n={2} aside={<PlanCompareShortcut step={step} />}>Choose your type<', 'n={3}>Choose your platform<', 'n={4}>Pick your account size<'].map((l) => pricingBody.indexOf(l));
    order.forEach((i) => expect(i).toBeGreaterThan(-1));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("keeps Model, Type and Platform as an equal 3-column grid on desktop", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('className="grid grid-cols-1 lg:grid-cols-3 gap-[22px] lg:gap-[24px] w-full"');
    expect(pricingBody).not.toContain("lg:pr-[24px]");
    expect(pricingBody).not.toContain("lg:pl-[24px]");
  });
});

describe("Pricing panel: Your Selection recap includes Platform", () => {
  it("derives platformLabel from PLATFORM_OPTIONS and the platform state", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain(
      'const platformLabel = PLATFORM_OPTIONS.find((p) => p.id === platform)?.label ?? "";',
    );
  });

  it("adds a Platform row between Type and Size in the recap array, using a new grid icon", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    const recapStart = pricingBody.indexOf('["lightning-box" as const, "Model"');
    expect(recapStart).toBeGreaterThan(-1);
    const recapEnd = pricingBody.indexOf("].map(([icon, k, v])", recapStart);
    const recapBlock = pricingBody.slice(recapStart, recapEnd);
    const modelIdx = recapBlock.indexOf('"Model"');
    const typeIdx = recapBlock.indexOf('"Type"');
    const platformIdx = recapBlock.indexOf('"Platform"');
    const sizeIdx = recapBlock.indexOf('"Size"');
    expect(modelIdx).toBeGreaterThan(-1);
    expect(typeIdx).toBeGreaterThan(modelIdx);
    expect(platformIdx).toBeGreaterThan(typeIdx);
    expect(sizeIdx).toBeGreaterThan(platformIdx);
    expect(recapBlock).toContain('["grid" as const, "Platform", platformLabel]');
  });

  it("adds a grid case to PanelIcon for the new Platform row", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('type PanelIconKind = "person" | "shield-check" | "star" | "info" | "target" | "clock" | "calendar" | "people" | "trending" | "shield" | "lightning-box" | "bars" | "grid";');
    const iconBody = sliceToNextFunction(app, "function PanelIcon(");
    expect(iconBody).toContain('case "grid":');
  });
});

describe("Pricing panel: checkout link tracks the selected platform", () => {
  it("keeps the Start Challenge href driven by entry.productId, and entry by getEntry(step, plan, platform, size)", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain("const entry = getEntry(step, plan, platform, size)!;");
    expect(pricingBody).toContain("href={checkoutUrl(entry.productId)}");
    expect(pricingBody).toContain("pushViewItem");
    expect(pricingBody).not.toContain("begin_checkout");
  });
});

describe("Prove Your Skill card copy", () => {
  it("spells 'punishes' correctly in the drawdown card", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("Relative drawdown punishes progress.");
    expect(app).not.toContain("punishee");
  });
});

describe("Hero subheading copy", () => {
  it("reads the zero-rule evaluation message", () => {
    const app = read("./App.tsx");
    expect(app).toContain("Zero rules during the evaluation phases, pass however you want.");
    expect(app).not.toContain("Clear conditions, static drawdown, and fast reward processing built for serious traders.");
  });
});

describe("FAQ section", () => {
  it("defines a Faq component using the Radix accordion and the live FAQ_ITEMS data", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("function Faq()");
    expect(app).toMatch(/import\s*\{[^}]*\bFAQ_ITEMS\b[^}]*\}\s*from\s*"@\/app\/data\/liveSiteContent"/);
    expect(app).toContain('import * as Accordion from "@radix-ui/react-accordion";');
    expect(app).toContain('import svgPaths from "@/imports/FytLandingPage/svg-1sqldvgw4z";');
    const faqBody = sliceToNextFunction(app, "function Faq()");
    expect(faqBody).toContain("FAQ_ITEMS.map(({ q, a }, i) =>");
    expect(faqBody).toContain("Frequently Asked Questions");
    expect(faqBody).toContain("<Accordion.Root");
  });

  it("renders ClosingCta (the world map section) after ProductShowcase and before Faq", () => {
    const app = read("./BelowFold.tsx");
    const showcaseIdx = app.indexOf("<ProductShowcase />");
    const faqIdx = app.indexOf("<Faq />");
    const closingIdx = app.indexOf("<ClosingCta />");
    expect(showcaseIdx).toBeGreaterThan(-1);
    expect(closingIdx).toBeGreaterThan(showcaseIdx);
    expect(faqIdx).toBeGreaterThan(closingIdx);
  });
});

describe("Pricing panel: original price shown struck through", () => {
  it("renders entry.priceOld strikethrough directly above entry.priceNew, only when they differ", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain("entry.priceOld > entry.priceNew");
    expect(pricingBody).toContain("${entry.priceOld.toFixed(2)}");
    expect(pricingBody).toContain("line-through");
    const oldIdx = pricingBody.indexOf("entry.priceOld.toFixed(2)");
    const newIdx = pricingBody.indexOf("entry.priceNew.toFixed(2)");
    expect(oldIdx).toBeGreaterThan(-1);
    expect(newIdx).toBeGreaterThan(oldIdx);
  });
});

describe("Pricing panel bullets: pluralized 'reward splits'", () => {
  it("uses plural 'reward splits' wording in all three step/plan bullet branches", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('"Up to 90% reward splits"');
    const hundredCount = (pricingBody.match(/"Up to 100% reward splits"/g) || []).length;
    expect(hundredCount).toBe(2);
  });
});

describe("Live Rewards section heading", () => {
  it("reads 'Live Rewards. Verified Proofs.'", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('Live Rewards. <span className="text-[#3b82f6]">Verified</span> Proofs.');
    expect(app).not.toContain("Live Payouts. <span");
  });
});

describe("Prime plan 'No Consistency' badge stands out from the selection blue", () => {
  it("uses a distinct green accent + pill background instead of the brand blue", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    const flagBlockStart = pricingBody.indexOf("{flag && (");
    expect(flagBlockStart).toBeGreaterThan(-1);
    const flagBlockEnd = pricingBody.indexOf(")}", flagBlockStart);
    const flagBlock = pricingBody.slice(flagBlockStart, flagBlockEnd);
    expect(flagBlock).toContain('color: "#4ade80"');
    expect(flagBlock).toContain('border: "1px solid rgba(74,222,128,0.45)"');
    expect(flagBlock).not.toContain('color: "#3b82f6"');
  });
});

describe("Pricing panel Key Rules: 'Target' instead of 'Profit Target'", () => {
  it("drops the word 'Profit' from the target row label", () => {
    const app = read("./BelowFold.tsx");
    const pricingBody = sliceToNextFunction(app, "function Pricing()");
    expect(pricingBody).toContain('const profitTargetLabel = step === "Instant" && plan === "prime" ? "Withdrawal Threshold" : "Target";');
    expect(pricingBody).not.toContain("Profit Target");
  });
});

describe("Site-wide cleanup: 'profit'/'payout' wording replaced with reward-based terms", () => {
  it("Live Rewards section uses reward-based copy for the nav button", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('<p className="font-[\'Inter:Semi_Bold\',sans-serif] font-semibold text-[14px] text-white whitespace-nowrap">View Live Rewards</p>');
    expect(app).not.toContain("View Live Payouts");
    expect(app).not.toContain("Payout Amount");
    expect(app).not.toContain("payout certificate");
    expect(app).not.toContain("Payout certificates");
  });

  it("Testimonials intro line reads 'verified rewards'", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain("Real experiences, verified rewards and transparent feedback from our traders.");
    expect(app).not.toContain("verified payouts");
  });
});

describe("Promo banner", () => {
  it("imports promoBanner benefits + deal + code + countdown deadline", () => {
    const app = read("./App.tsx");
    expect(app).toMatch(/import\s*\{[^}]*\bPROMO_BENEFITS\b[^}]*\bPROMO_CODE\b[^}]*\bPROMO_DEAL_LINE\b[^}]*\bPROMO_DEADLINE\b[^}]*\bformatHoursLeft\b[^}]*\}\s*from\s*"@\/app\/data\/promoBanner"/);
  });

  it("defines PromoBanner and sticks it with Nav at the top of the page", () => {
    const app = read("./App.tsx");
    expect(app).toContain("function PromoBanner()");
    const bannerIdx = app.indexOf("<PromoBanner />");
    const navIdx = app.indexOf("<Nav />");
    expect(bannerIdx).toBeGreaterThan(-1);
    expect(navIdx).toBeGreaterThan(bannerIdx);
    // Fixed header + spacer (so phones can fold the header without reflowing the page).
    expect(app).toContain('<div ref={ref} className="fixed inset-x-0 top-0 z-40 w-full">');
    const stickyIdx = app.indexOf("<SiteHeader>");
    expect(stickyIdx).toBeGreaterThan(-1);
    expect(stickyIdx).toBeLessThan(bannerIdx);
    const navBody = sliceToNextFunction(app, "function Nav()");
    expect(navBody).not.toContain("sticky top-0");
  });

  it("clicking the banner jumps to #challenge via role=link, not by nesting a button inside a real <a>", () => {
    const app = read("./App.tsx");
    const bannerBody = sliceToNextFunction(app, "function PromoBanner()");
    expect(bannerBody).toContain('role="link"');
    expect(bannerBody).toContain('window.location.hash = "challenge"');
    expect(bannerBody).not.toContain('<a href="#challenge"');
  });

  it("renders a stationary promo layout (no marquee / duplicated track) and still respects reduced motion for the sheen", () => {
    const app = read("./App.tsx");
    const bannerBody = sliceToNextFunction(app, "function PromoBanner()");
    expect(bannerBody).toContain("const reduceMotion = useReducedMotion();");
    expect(bannerBody).not.toContain("[...PROMO_ITEMS, ...PROMO_ITEMS]");
    expect(bannerBody).not.toContain("fyt-marquee");
    expect(bannerBody).toContain("fyt-promo-sheen");
    expect(bannerBody).toContain("PROMO_BANNER_GRADIENT");
    expect(bannerBody).toContain("PROMO_BENEFITS.map");
  });

  it("keeps benefits, Instantly deal line, copyable CODE pill, and the hours-left countdown pill", () => {
    const app = read("./App.tsx");
    const bannerBody = sliceToNextFunction(app, "function PromoBanner()");
    expect(bannerBody).toContain("PROMO_BENEFITS.map");
    expect(bannerBody).toContain("PROMO_DEAL_LINE");
    expect(bannerBody).toContain("<PromoCountdownPill compact");
    expect(bannerBody).toContain("<PromoCountdownPill pulse");
    expect(bannerBody).not.toContain("PROMO_URGENCY");
    expect(bannerBody).toContain("onClick={copyCode}");
    expect(bannerBody).toContain("copyTextToClipboard(PROMO_CODE)");
    const promo = read("./data/promoBanner.ts");
    expect(promo).toContain("First Reward on Demand");
    expect(promo).toContain("Free Drawdown Reset");
    expect(promo).toContain('export const PROMO_DEAL_LINE = "Limited Time: 40% off + Buy 1 Get 3 Instantly"');
    expect(promo).toContain('export const PROMO_CODE = "AWARD40"');
    expect(promo).not.toContain("PROMO_URGENCY");
  });
});

describe("Promo banner sheen animation", () => {
  it("defines the fyt-promo-sheen keyframes used by the stationary promo bar", () => {
    const css = read("../styles/tailwind.css");
    expect(css).toContain("@keyframes fyt-promo-sheen");
  });

  it("keeps fyt-marquee for other marquees (press logos, etc.)", () => {
    const css = read("../styles/tailwind.css");
    expect(css).toContain("@keyframes fyt-marquee");
  });
});

describe("Promo banner countdown", () => {
  it("ticks inside PromoCountdownPill (not PromoBanner) and hides once expired", () => {
    const app = read("./App.tsx");
    const bannerBody = sliceToNextFunction(app, "function PromoBanner()");
    expect(bannerBody).not.toContain("setInterval(() => setNow(Date.now()), 1000)");
    const pillBody = sliceToNextFunction(app, "function PromoCountdownPill(");
    expect(pillBody).toContain("setInterval(() => setNow(Date.now()), 1000)");
    expect(pillBody).toContain("formatHoursLeft(PROMO_DEADLINE, now)");
    expect(pillBody).toContain("if (left.expired) return null;");
    expect(pillBody).toContain("#DC2626");
  });
});

describe("BelowFold error boundary: a chunk-load failure must not blank Nav/Hero", () => {
  it("defines BelowFoldErrorBoundary as a class component with getDerivedStateFromError, rendering null (no error screen) on failure", () => {
    const app = read("./App.tsx");
    expect(app).toContain("class BelowFoldErrorBoundary extends Component");
    expect(app).toContain("static getDerivedStateFromError()");
    expect(app).toContain("return { hasError: true };");
    const boundaryBody = sliceToNextFunction(app, "class BelowFoldErrorBoundary extends Component");
    expect(boundaryBody).toContain("if (this.state.hasError) return null;");
    expect(boundaryBody).toContain("return this.props.children;");
  });

  it("wraps only the BelowFold Suspense boundary, not Nav or Hero", () => {
    const app = read("./App.tsx");
    const appStart = app.indexOf("export default function App()");
    expect(appStart).toBeGreaterThan(-1);
    const appBody = app.slice(appStart);
    const navIdx = appBody.indexOf("<Nav />");
    const heroIdx = appBody.indexOf("<Hero />");
    const boundaryOpenIdx = appBody.indexOf("<BelowFoldErrorBoundary>");
    const suspenseIdx = appBody.indexOf("<Suspense fallback={null}>");
    const belowFoldIdx = appBody.indexOf("<BelowFold />");
    expect(navIdx).toBeGreaterThan(-1);
    expect(heroIdx).toBeGreaterThan(navIdx);
    expect(boundaryOpenIdx).toBeGreaterThan(heroIdx);
    expect(suspenseIdx).toBeGreaterThan(boundaryOpenIdx);
    expect(belowFoldIdx).toBeGreaterThan(suspenseIdx);
  });

  it("does not introduce any retry timer or setTimeout inside the error boundary", () => {
    const app = read("./App.tsx");
    const boundaryBody = sliceToNextFunction(app, "class BelowFoldErrorBoundary extends Component");
    expect(boundaryBody).not.toContain("setTimeout");
    expect(boundaryBody).not.toContain("setInterval");
  });
});
