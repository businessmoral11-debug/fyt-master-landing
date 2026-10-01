import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import imgPressBarchart from "@/assets/live-site/press-logos/barchart.webp";
import imgPressBenzinga from "@/assets/live-site/press-logos/benzinga.webp";
import imgPressDigitalJournal from "@/assets/live-site/press-logos/digitaljournal.webp";
import imgPressYahoo from "@/assets/live-site/press-logos/yahoo.webp";
import imgPressTrustedProp from "@/assets/live-site/press-logos/the-trusted-prop.png";
import imgFytMark from "@/imports/FytLandingPage/c3e1b41ac1a944e4221b3b1465d4e68b855d759f.png";
import { parseCountUpSegments, renderCountUp } from "@/app/motion/countUp";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import { testimonialVideoSource } from "@/app/motion/videoLightbox";
import type { TestimonialVideo } from "@/app/data/testimonials";
import {
  PROVE_SKILL_CARDS,
  PROOF_STATS,
  ProofStatIcon,
  Pricing,
  PricingSlotsContext,
  TestimonialsDesktopCarousel,
  TestimonialsMobileCarousel,
  TestimonialsRevealContext,
  TrustindexWidget,
  VideoLightbox,
} from "@/app/BelowFold";
import { C, Eyebrow, Pill, Reveal, Section, SectionTitle, WordsReveal, spotlightMove, staggerChild, staggerParent, useShimmer } from "./ui";
import { PricingOffer, PricingTrustLine } from "./Conversion";

const FeaturedCertificates = lazy(() => import("@/app/featuredCertificates").then((m) => ({ default: m.FeaturedCertificates })));
const RecentVerifiedRewards = lazy(() => import("@/app/recentVerifiedRewards").then((m) => ({ default: m.RecentVerifiedRewards })));

/* ------------------------------------------------------------------ */
/* As featured in — edge-faded logo marquee                            */
/* ------------------------------------------------------------------ */

const PRESS = [
  { src: imgPressDigitalJournal, alt: "Digital Journal", w: 84 },
  { src: imgPressYahoo, alt: "Yahoo Finance", w: 112 },
  { src: imgPressBarchart, alt: "Barchart", w: 108 },
  { src: imgPressBenzinga, alt: "Benzinga", w: 118 },
  { src: imgPressTrustedProp, alt: "The Trusted Prop", w: 146 },
];

export function FeaturedIn() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const onScreen = useInView(ref, { margin: "150px" });
  const track = reduce ? PRESS : [...PRESS, ...PRESS, ...PRESS, ...PRESS];
  return (
    <section ref={ref} className="fyt-rd relative w-full shrink-0 overflow-hidden" style={{ background: C.ink }} aria-label="As featured in">
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.25), transparent)" }} aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.18), transparent)" }} aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-[18px] px-[20px] py-[34px] lg:flex-row lg:gap-[40px] lg:px-[80px] lg:py-[30px]">
        <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6f7a94] lg:w-[150px]">As featured in</p>
        <div className="fyt-marquee-mask w-full min-w-0 overflow-hidden">
          <div className={`flex items-center ${reduce ? "flex-wrap justify-center gap-x-[40px] gap-y-[16px]" : "fyt-rd-marquee w-max"}`} style={{ animationPlayState: onScreen ? "running" : "paused" }}>
            {track.map((logo, i) => (
              <img
                key={`${logo.alt}-${i}`}
                src={logo.src}
                alt={i < PRESS.length ? logo.alt : ""}
                aria-hidden={i >= PRESS.length || undefined}
                loading="lazy"
                decoding="async"
                className={`shrink-0 object-contain brightness-0 invert opacity-55 transition-opacity duration-300 hover:opacity-100 ${reduce ? "" : "mr-[64px]"}`}
                style={{ width: logo.w }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Prove your market expertise                                         */
/* ------------------------------------------------------------------ */

const PROVE_ICONS: Record<(typeof PROVE_SKILL_CARDS)[number]["id"], ReactNode> = {
  consistency: <path d="M4 14h3l2-6 3 10 2-6h6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  "time-limits": (
    <>
      <circle cx="12" cy="13" r="7" strokeWidth="1.7" />
      <path d="M12 9.5V13l2.5 1.5M9.5 3h5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "hidden-rules": (
    <>
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 20 20 4" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  drawdown: <path d="M3 6l6 6 4-4 8 9M15 17h6v-6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  "delayed-rewards": (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2.5" strokeWidth="1.7" />
      <path d="M3 11h18M8 3.5v3M16 3.5v3" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
};

function OrbVisual({ size = 380 }: { size?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.86, 1, 0.96]);
  return (
    <div ref={ref} className="relative mx-auto" style={{ width: size, height: size, maxWidth: "100%" }} aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ rotate: reduce ? 0 : rotate, scale: reduce ? 1 : scale }}>
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            <linearGradient id="rd-orb-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="188" ry="188" stroke="url(#rd-orb-ring)" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="188" ry="70" stroke="rgba(59,130,246,0.22)" strokeWidth="1" transform="rotate(-24 200 200)" />
          <ellipse cx="200" cy="200" rx="188" ry="70" stroke="rgba(59,130,246,0.16)" strokeWidth="1" transform="rotate(34 200 200)" />
          <circle cx="36" cy="128" r="4" fill="#3b82f6" />
          <circle cx="352" cy="274" r="3" fill="#60a5fa" />
          <circle cx="292" cy="54" r="2.5" fill="#93c5fd" />
        </svg>
      </motion.div>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "46%", height: "46%", background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #eaf1ff 45%, #cfe0ff 100%)", boxShadow: "0 30px 80px -20px rgba(37,99,235,0.55), inset 0 -10px 30px rgba(37,99,235,0.2)" }}
      />
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28%]"
        style={{ width: "25%", height: "25%", background: "linear-gradient(160deg, #0b1330, #050914)", boxShadow: "0 18px 40px -12px rgba(3,6,13,0.65), 0 0 0 6px rgba(255,255,255,0.7)" }}
      >
        <img src={imgFytMark} alt="" className="h-[58%] w-auto" loading="lazy" decoding="async" />
      </div>
    </div>
  );
}

export function ProveYourSkill() {
  const reduce = useReducedMotion();
  const [proveRef, proveShimmer] = useShimmer<HTMLHeadingElement>();
  return (
    <Section tone="light">
      <div className="grid grid-cols-1 items-center gap-[48px] lg:grid-cols-12 lg:gap-[56px]">
        <div className="flex flex-col gap-[22px] lg:col-span-5">
          <Eyebrow tone="light">Why FYT</Eyebrow>
          <h2 ref={proveRef} className={`text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[38px] lg:text-[50px] ${proveShimmer}`} style={{ color: C.textLight }}>
            <WordsReveal text="Prove Your Market Expertise." />
            <br />
            <span className="font-normal" style={{ color: "#3c465c" }}>
              <WordsReveal text="Not your ability to survive" delay={0.15} />
            </span>{" "}
            <WordsReveal text="unfair rules." wordClassName="fyt-gradient-text font-semibold" delay={0.3} />
          </h2>
          <Reveal delay={0.1} className="hidden lg:block">
            <OrbVisual size={360} />
          </Reveal>
        </div>
        <motion.ul
          className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:col-span-7"
          variants={staggerParent(0.09)}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {PROVE_SKILL_CARDS.map((card, i) => (
            <motion.li
              key={card.id}
              variants={staggerChild}
              onPointerMove={spotlightMove}
              className={`fyt-spot fyt-spot-light group flex flex-col gap-[18px] rounded-[22px] bg-white p-[22px] shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] transition-[translate,box-shadow] duration-500 hover:-translate-y-[4px] hover:shadow-[0_28px_60px_-28px_rgba(37,99,235,0.45)] lg:p-[28px] ${i === PROVE_SKILL_CARDS.length - 1 ? "sm:col-span-2" : ""}`}
              style={{ border: `1px solid ${C.borderLight}` }}
            >
              <span className="flex items-center justify-between">
                <span
                  className="relative flex size-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[#eef4ff] transition-colors duration-500 group-hover:bg-[#2563eb]"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="stroke-[#2563eb] transition-colors duration-500 group-hover:stroke-white">
                    {PROVE_ICONS[card.id]}
                  </svg>
                </span>
                <span className="tabular text-[12px] font-semibold tracking-[0.1em]" style={{ color: "#a3b3d4" }} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <p className="text-[17px] font-medium leading-[1.45] tracking-[-0.01em] lg:text-[19px]" style={{ color: C.textLight }}>
                {card.text}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Proof in numbers                                                    */
/* ------------------------------------------------------------------ */

function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const segments = useMemo(() => parseCountUpSegments(value), [value]);
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 55, damping: 18, mass: 1 });
  useEffect(() => {
    if (inView && !reduce) progress.set(1);
  }, [inView, reduce, progress]);
  useMotionValueEvent(spring, "change", (v) => {
    if (!reduce && ref.current) ref.current.textContent = renderCountUp(segments, v);
  });
  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {reduce ? value : renderCountUp(segments, 0)}
    </span>
  );
}

const PROOF_CURVE = "M0 262 C 140 258, 220 236, 330 214 S 520 176, 640 150 S 860 96, 980 70 S 1130 34, 1200 24";

function ProofChartLine() {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.05, 1]);
  return (
    <svg ref={ref} viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 hidden h-[62%] w-full lg:block" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="rd-proof-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rd-proof-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
      <path d={`${PROOF_CURVE} L1200 300 L0 300 Z`} fill="url(#rd-proof-fill)" />
      <motion.path d={PROOF_CURVE} stroke="url(#rd-proof-stroke)" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : pathLength }} />
    </svg>
  );
}

export function ProofInNumbers() {
  const reduce = useReducedMotion();
  const [proofRef, proofShimmer] = useShimmer<HTMLHeadingElement>();
  return (
    <Section tone="dark" stars>
      <ProofChartLine />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] lg:hidden" style={{ background: "radial-gradient(90% 70% at 50% 100%, rgba(37,99,235,0.28), transparent 70%)" }} />
      <div className="relative grid grid-cols-1 items-center gap-[44px] lg:grid-cols-12 lg:gap-[56px]">
        <div className="flex flex-col gap-[22px] lg:col-span-6">
          <Eyebrow>Proof in Numbers</Eyebrow>
          <h2 ref={proofRef} className={`text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[42px] lg:text-[56px] ${proofShimmer}`} style={{ color: C.textDark }}>
            <WordsReveal text="Thousands traded." />
            <br />
            <WordsReveal text="Millions rewarded." wordClassName="fyt-gradient-text" delay={0.2} />
          </h2>
          <Reveal delay={0.15}>
            <p className="max-w-[440px] text-[16px] leading-[1.7] lg:text-[17px]" style={{ color: C.mutedDark }}>
              A global community built on transparent conditions, real progress, and rewards delivered to traders.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <Pill href="#live-payouts" onClick={() => pauseHeavyScenesForNav()}>
              View Live Rewards
            </Pill>
          </Reveal>
        </div>
        <motion.div
          className="grid grid-cols-2 gap-[12px] sm:gap-[16px] lg:col-span-6"
          variants={staggerParent(0.1, 0.1)}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {PROOF_STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerChild}
              onPointerMove={spotlightMove}
              className="fyt-spot group relative flex min-w-0 flex-col gap-[18px] overflow-hidden rounded-[22px] p-[18px] sm:p-[28px]"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))", border: `1px solid ${C.borderDark}` }}
            >
              <span
                aria-hidden="true"
                className="absolute -right-[40px] -top-[40px] size-[140px] rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.28), transparent 70%)" }}
              />
              <span className="relative flex size-[44px] items-center justify-center rounded-[13px]" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(96,165,250,0.25)" }}>
                <ProofStatIcon kind={s.icon} />
              </span>
              <div className="relative flex flex-col gap-[6px]">
                <CountUp value={s.value} className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-white min-[375px]:text-[28px] sm:text-[40px] lg:text-[46px]" />
                <span className="text-[12px] font-medium uppercase tracking-[0.16em] sm:text-[13px]" style={{ color: C.mutedDark }}>
                  {s.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Live rewards / verified proofs                                      */
/* ------------------------------------------------------------------ */

export function LivePayouts() {
  return (
    <Section tone="light" id="live-payouts">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow tone="light" center>
          Live Rewards
        </Eyebrow>
        <SectionTitle tone="light" center lead="Live Rewards." highlight="Verified" trail="Proofs." />
      </div>
      <Reveal delay={0.1} className="mt-[40px] w-full lg:mt-[56px]">
        <Suspense fallback={<div className="h-[320px]" />}>
          <FeaturedCertificates />
        </Suspense>
      </Reveal>
      <Reveal delay={0.1} className="mt-[28px] w-full">
        <div className="rounded-[26px] bg-white p-[10px] sm:p-[18px] lg:p-[26px]" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 40px 80px -48px rgba(30,64,175,0.45)" }}>
          <Suspense fallback={<div className="h-[420px]" />}>
            <RecentVerifiedRewards />
          </Suspense>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-[40px] flex justify-center">
        <Pill href="https://rewards.fundingyourtrades.com/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          Check More Rewards
        </Pill>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing — existing configurator in a new stage                      */
/* ------------------------------------------------------------------ */

const PRICING_SLOTS = { offerSlot: <PricingOffer />, afterCheckoutSlot: <PricingTrustLine /> };

export function PricingSection() {
  return (
    <div className="fyt-rd relative w-full shrink-0 overflow-hidden" style={{ background: `radial-gradient(90% 45% at 50% 0%, #0b1a3a 0%, ${C.ink} 70%)` }}>
      {/* Calm backdrop: one soft glow at the top, nothing else. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.3), transparent)" }} />
      </div>
      <div className="relative mx-auto w-full max-w-[1296px]">
        <PricingSlotsContext.Provider value={PRICING_SLOTS}>
          <Pricing />
        </PricingSlotsContext.Provider>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export function Testimonials() {
  const [activeVideo, setActiveVideo] = useState<TestimonialVideo | null>(null);
  const closeVideo = useCallback(() => setActiveVideo(null), []);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const revealed = !!reduce || inView;
  const [trustRef, trustShimmer] = useShimmer<HTMLHeadingElement>();
  return (
    <section className="fyt-rd relative w-full shrink-0 overflow-hidden" style={{ background: `linear-gradient(180deg, #ffffff 0%, ${C.light} 100%)` }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 fyt-grid-light" />
        <div className="absolute left-1/2 top-[30%] h-[520px] w-[900px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.12), transparent 70%)" }} />
      </div>
      <div ref={ref} className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-[40px] px-[20px] pt-[72px] lg:gap-[56px] lg:px-[80px] lg:pt-[120px]">
        <div className="flex flex-col items-center gap-[18px] text-center">
          <Eyebrow tone="light" center>
            Trust
          </Eyebrow>
          <h2 ref={trustRef} className={`max-w-[760px] text-[32px] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[40px] lg:text-[54px] ${trustShimmer}`} style={{ color: C.textLight }}>
            <WordsReveal text="Trusted by" /> <WordsReveal text="21,500+" wordClassName="fyt-gradient-text" delay={0.1} />{" "}
            <WordsReveal text="satisfied clients worldwide." delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-[560px] text-[16px] leading-[1.7] lg:text-[18px]" style={{ color: C.mutedLight }}>
              Real experiences, verified rewards and transparent feedback from our traders.
            </p>
          </Reveal>
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-[20px] pt-[40px] lg:px-[88px] lg:pt-[56px]">
        <TestimonialsRevealContext.Provider value={revealed}>
          <TestimonialsDesktopCarousel onPlayVideo={setActiveVideo} />
          <TestimonialsMobileCarousel onPlayVideo={setActiveVideo} />
        </TestimonialsRevealContext.Provider>
      </div>
      <div className="fyt-ti-bare relative mt-[8px] w-full lg:mt-[16px]">
        <TrustindexWidget />
      </div>
      <div className="relative flex justify-center px-[20px] pb-[72px] pt-[36px] lg:pb-[120px] lg:pt-[48px]">
        <Reveal>
          <Pill href="#challenge" onClick={() => pauseHeavyScenesForNav()}>
            Join 21,500+ Traders
          </Pill>
        </Reveal>
      </div>
      <VideoLightbox source={activeVideo ? testimonialVideoSource(activeVideo) : null} onClose={closeVideo} />
    </section>
  );
}

