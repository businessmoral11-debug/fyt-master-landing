import { useState, useEffect, useRef, useCallback, useMemo, Fragment, lazy, Suspense, memo, type ReactNode } from "react";
import { createContext, useContext } from "react";
import { createPortal } from "react-dom";
import * as Accordion from "@radix-ui/react-accordion";
import svgPaths from "@/imports/FytLandingPage/svg-1sqldvgw4z";
import useEmblaCarousel from "embla-carousel-react";
import { buildAutoplayPlugins } from "@/app/motion/emblaAutoplay";
import imgImg10782 from "@/imports/FytLandingPage/c3e1b41ac1a944e4221b3b1465d4e68b855d759f.png";
import imgImg10801 from "@/imports/FytLandingPage/7dca680e1978188fe7adca05839b49894cdf71f2.png";
import imgPressBarchart from "@/assets/live-site/press-logos/barchart.webp";
import imgPressBenzinga from "@/assets/live-site/press-logos/benzinga.webp";
import imgPressDigitalJournal from "@/assets/live-site/press-logos/digitaljournal.webp";
import imgPressYahoo from "@/assets/live-site/press-logos/yahoo.webp";
import imgPressTrustedProp from "@/assets/live-site/press-logos/the-trusted-prop.png";
import imgMatchTraderLogo from "@/assets/live-site/platform-logos/match-trader.png";
import imgPlatform5Logo from "@/assets/live-site/platform-logos/platform-5.png";
import { STEP_PLANS, STEP_SIZES, getEntry, checkoutUrl, fmtSize, planFlag, PLATFORM_OPTIONS, CHECKOUT_COUPON_CODE, type StepId, type PlanId, type PlatformId } from "@/app/data/pricing";
import { ALT_PROMO_CODE, ALT_PROMO_DEAL, ALT_PROMO_LABEL } from "@/app/data/promoBanner";
import { pushViewItem } from "@/app/tracking/gtm";
import { HERO_CONTENT, KEY_METRICS, FOOTER_COLUMNS, FOOTER_LINKS, FAQ_ITEMS, TRUSTINDEX_WIDGET } from "@/app/data/liveSiteContent";
import { openIntercomMessenger } from "@/app/intercom";
import { onHeavySceneNavPause, isHeavySceneNavPauseActive, pauseHeavyScenesForNav } from "@/app/three/scenePause";
import { isScrollSettled } from "@/app/three/scrollActivity";
const loadGlobe = () => import("@/app/globe");
const loadRecentVerifiedRewards = () => import("@/app/recentVerifiedRewards");
const loadFeaturedCertificates = () => import("@/app/featuredCertificates");
const TradingGlobe = lazy(() => loadGlobe().then((m) => ({ default: m.TradingGlobe })));
const RecentVerifiedRewards = lazy(() => loadRecentVerifiedRewards().then((m) => ({ default: m.RecentVerifiedRewards })));
const FeaturedCertificates = lazy(() => loadFeaturedCertificates().then((m) => ({ default: m.FeaturedCertificates })));

function prefetchBelowFoldChunks() {
  void loadFeaturedCertificates();
  void loadRecentVerifiedRewards();
  if (window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768) {
    scheduleIdlePreload(preloadGlobeChunkOnce, 150);
  }
}

let globeChunkPreloadStarted = false;
function preloadGlobeChunkOnce() {
  if (globeChunkPreloadStarted) return;
  globeChunkPreloadStarted = true;
  if (import.meta.env.DEV) performance.mark("globe:chunk-load-start");
  void loadGlobe().then(() => {
    if (import.meta.env.DEV) {
      performance.mark("globe:chunk-load-end");
      try {
        performance.measure("Globe: JS chunk download + evaluate", "globe:chunk-load-start", "globe:chunk-load-end");
      } catch {
      }
    }
  });
}

function scheduleIdlePreload(cb: () => void, timeout = 1000) {
  if (typeof window === "undefined") return;
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (typeof ric === "function") {
    ric(cb, { timeout });
  } else {
    setTimeout(cb, timeout);
  }
}
import { parseCountUpSegments, renderCountUp } from "@/app/motion/countUp";
import imgDashboardMockup from "@/assets/images/dashboard_floating_3d_v2.webp";
import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion, useInView, type MotionValue } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useMotionValue, useSpring, useMotionValueEvent, useAnimation } from "motion/react";
import { useMagnetic } from "@/app/motion/magnetic";
import { useTilt } from "@/app/motion/tilt";
import { useCursorGlow } from "@/app/motion/cursorGlow";
import { AmbientBlob, StaticGlow, NOISE_BG, AccentLine } from "@/app/ambient";
import {
  proofRevealItem,
  proofLeftReveal,
  proofRightReveal,
  proofButtonReveal,
  proofCardReveal,
  PROOF_FLOAT_Y,
  PROOF_FLOAT_TRANSITION,
  PROOF_AMBIENT_GLOW_OPACITY,
  PROOF_AMBIENT_GLOW_TRANSITION,
  PROOF_CARD_HOVER_TRANSITION,
  proofCardHover,
  PROOF_CARD_FLOAT_AMPLITUDE_PX,
  PROOF_CARD_FLOAT_DURATION_S,
  PROOF_CARD_FLOAT_STAGGER_S,
  PROOF_CARD_BREATHE_DURATION_S,
  PROOF_CARD_BREATHE_OPACITY,
  PROOF_CARD_BREATHE_STAGGER_S,
  PROOF_ICON_MOTION,
  PROOF_ICON_NETWORK_RING_TRANSITION,
  proofIconNetworkRing,
  PROOF_BUTTON_SWEEP_TRANSITION,
  proofButtonSweep,
  PROOF_DATA_LINES,
  PROOF_DATA_LINE_LIGHT_CYCLE_S,
  PROOF_DATA_LINE_LIGHT_DURATION_S,
  PROOF_DATA_LINE_LIGHT_STAGGER_S,
  PROOF_CONNECTION_LINE_DELAY_S,
  PROOF_CONNECTION_LINE_DURATION_S,
  PROOF_CONNECTION_LINE_OPACITY,
  PROOF_CONNECTION_LINE_TRAVEL_DELAY_S,
  PROOF_CONNECTION_LINE_TRAVEL_DURATION_S,
  PROOF_SPOTLIGHT_OPACITY,
} from "@/app/motion/proofInNumbersMotion";
import {
  productSectionContainer,
  productSectionItem,
  productHeadingContainer,
  productHeadingWord,
  productBadgeContainer,
  productBadgeIcon,
  productBadgeLabel,
  productDashboardContainer,
  productDashboardBack,
  productDashboardFront,
  productDashboardFloatY,
  PRODUCT_DASHBOARD_FLOAT_TRANSITION,
  PRODUCT_DASHBOARD_TILT_MAX_DEG,
  PRODUCT_REFLECTION_SWEEP_TRANSITION,
  productReflectionSweep,
  PRODUCT_AMBIENT_GLOW_OPACITY as PRODUCT_SHOWCASE_AMBIENT_GLOW_OPACITY,
  PRODUCT_AMBIENT_GLOW_TRANSITION,
  PRODUCT_CONNECTION_LINE_DELAY_S,
  PRODUCT_CONNECTION_LINE_DURATION_S,
  PRODUCT_CONNECTION_LINE_OPACITY,
  PRODUCT_DUST_PARTICLES,
  PRODUCT_CARD_HOVER_TRANSITION,
  productPlatformCardHover,
  productPlatformPillHover,
  productIconHoverRotate,
  productSupportCardHover,
  PRODUCT_ONLINE_DOT_TRANSITION,
  productOnlineDotPulse,
  PRODUCT_CHAT_BUTTON_SHEEN_DURATION_S,
  productChatButtonSheen,
} from "@/app/motion/productShowcaseMotion";
import {
  pricingCardFloatY,
  PRICING_CARD_FLOAT_TRANSITION,
  PRICING_SWEEP_TRANSITION,
  pricingSweepOpacity,
  pricingContentDipOpacity,
  PRICING_SPOTLIGHT_OPACITY,
  PRICING_CTA_GRADIENT_DURATION_S,
  pricingCtaGradientPosition,
  PRICING_PRICE_SPRING,
  PRICING_PROGRESS_SEGMENT_TRANSITION,
  PRICING_COMPLETION_LINE_GLOW_DELAY_S,
  PRICING_COMPLETION_LINE_GLOW_DURATION_S,
  PRICING_COMPLETION_CARD_PULSE_DELAY_S,
  PRICING_COMPLETION_CARD_PULSE_DURATION_S,
  pricingCompletionCardPulse,
  PRICING_COMPLETION_CTA_GLOW_DELAY_S,
  PRICING_COMPLETION_CTA_GLOW_DURATION_S,
  pricingCompletionCtaGlow,
} from "@/app/motion/pricingMotion";
import {
  LIVE_PAYOUTS_CTA_GRADIENT_DURATION_S,
  livePayoutsCtaGradientPosition,
  LIVE_PAYOUTS_CTA_FLOAT_TRANSITION,
  livePayoutsCtaFloatY,
  LIVE_PAYOUTS_BG_GLOW_OPACITY,
  LIVE_PAYOUTS_VIGNETTE_OPACITY,
  LIVE_PAYOUTS_NOISE_OPACITY,
} from "@/app/motion/livePayoutsMotion";
import { HeroSceneGate } from "@/app/three/HeroSceneGate";
import { PROVE_SKILL_CARD_REVEALS, PROVE_SKILL_SCROLL_HEIGHT_VH, type CardReveal } from "@/app/motion/proveSkillReveal";
import { useMonotonicProgress } from "@/app/motion/scrollProgress";
import {
  HOW_IT_WORKS_SCROLL_HEIGHT_VH,
  HOW_IT_WORKS_STEP_REVEALS,
  HOW_IT_WORKS_LINE_REVEAL,
  HOW_IT_WORKS_RING_RGB,
  HOW_IT_WORKS_DOT_RGB,
  HOW_IT_WORKS_NUMBER_RGB,
  HOW_IT_WORKS_RING_BORDER_ALPHA,
  HOW_IT_WORKS_RING_GLOW_ALPHA,
  HOW_IT_WORKS_DOT_BG_ALPHA,
  HOW_IT_WORKS_DOT_GLOW_ALPHA,
  HOW_IT_WORKS_NUMBER_ALPHA,
  HOW_IT_WORKS_ICON_BORDER_ALPHA,
  HOW_IT_WORKS_LABEL_DIM_HEX,
  HOW_IT_WORKS_LABEL_PEAK_HEX,
  HOW_IT_WORKS_DESC_DIM_HEX,
  HOW_IT_WORKS_DESC_PEAK_HEX,
  HOW_IT_WORKS_LINE_GLOW,
  HOW_IT_WORKS_MOBILE_SPOTLIGHT_CARD,
  HOW_IT_WORKS_MOBILE_SPOTLIGHT_ICON,
  HOW_IT_WORKS_MOBILE_SPOTLIGHT_TRANSITION_S,
  type StepReveal,
} from "@/app/motion/howItWorksReveal";
import { TESTIMONIAL_VIDEOS, type TestimonialSlideItem, type TestimonialVideo } from "@/app/data/testimonials";
import { TESTIMONIAL_HEADING_REVEAL, TESTIMONIAL_CTA_REVEAL, TESTIMONIAL_MOBILE_CARD_REVEAL } from "@/app/motion/testimonialsReveal";
import { FAQ_TITLE_WORD, FAQ_TITLE_CONTAINER, FAQ_ROWS_CONTAINER, FAQ_ROW_REVEAL, FAQ_TOPLINE_PERIOD_S } from "@/app/motion/faqReveal";
import { FOOTER_LOGO_REVEAL, FOOTER_COLUMNS_CONTAINER, FOOTER_COLUMN_REVEAL, FOOTER_TOPLINE_PERIOD_S } from "@/app/motion/footerReveal";
import { CursorSpotlight } from "@/app/cursorSpotlight";
import { type VideoSource, buildYouTubeEmbedUrl, testimonialVideoSource, pricingExplainerVideoSource } from "@/app/motion/videoLightbox";
import {
  DIFFERENCE_HEADING_WORDS,
  DIFFERENCE_HEADING_PARENT_VARIANTS,
  DIFFERENCE_HEADING_WORD_VARIANTS,
  DIFFERENCE_PIN_SCROLL_HEIGHT_VH,
  DIFFERENCE_HEADING_EXIT_REVEAL,
  DIFFERENCE_CONTENT_ENTER_REVEAL,
  type DifferenceCrossfadeReveal,
} from "@/app/motion/differenceReveal";

const VIDEO_ONLY_ITEMS: TestimonialSlideItem[] = TESTIMONIAL_VIDEOS.map((video) => ({ kind: "video", video }));
const TOTAL_VIDEOS = VIDEO_ONLY_ITEMS.length;

type CoverflowRole = "left" | "center" | "right";
const COVERFLOW_TRANSITION = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };
const COVERFLOW_VARIANTS = {
  enter: (dir: 1 | -1) => ({
    left: dir > 0 ? "100%" : "-27%",
    top: "50%",
    y: "-50%",
    width: "27%",
    scale: 0.82,
    rotateY: dir > 0 ? -24 : 24,
    opacity: 0,
    filter: "brightness(0.6)",
  }),
  left: { left: "1%", top: "50%", y: "-50%", width: "27%", scale: 0.87, rotateY: 18, opacity: 0.72, filter: "brightness(0.75)" },
  center: { left: "31%", top: "50%", y: "-50%", width: "38%", scale: 1, rotateY: 0, opacity: 1, filter: "brightness(1)" },
  right: { left: "72%", top: "50%", y: "-50%", width: "27%", scale: 0.87, rotateY: -18, opacity: 0.72, filter: "brightness(0.75)" },
  exit: (dir: 1 | -1) => ({
    left: dir > 0 ? "-27%" : "100%",
    top: "50%",
    y: "-50%",
    width: "27%",
    scale: 0.82,
    rotateY: dir > 0 ? 24 : -24,
    opacity: 0,
    filter: "brightness(0.6)",
  }),
};

const PILL_CTA_GRADIENT_STYLE = {
  background: "linear-gradient(180deg, #5A9BFF 0%, #2563EB 100%)",
  boxShadow: "0px 8px 28px -6px rgba(37,99,235,0.25), inset 0px 1px 0px rgba(255,255,255,0.38)",
} as const;

const SUPPORT_CARD_ACCENT_BLUE = "#2563EB";
const SUPPORT_CARD_GRADIENT_STYLE = {
  background: `linear-gradient(180deg, ${SUPPORT_CARD_ACCENT_BLUE} 0%, #1D4ED8 100%)`,
  boxShadow: "0px 8px 28px -6px rgba(37,99,235,0.5), inset 0px 1px 0px rgba(255,255,255,0.38)",
} as const;

function HeroCta({
  href, magneticStrength, children, style, className, target, rel,
}: {
  href: string; magneticStrength: number; children: ReactNode; style?: React.CSSProperties; className: string; target?: string; rel?: string;
}) {
  const magnet = useMagnetic<HTMLAnchorElement>(magneticStrength);
  return (
    <motion.a
      ref={magnet.ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      onClick={() => {
        // See src/app/three/scenePause.ts — a same-page anchor jump triggers
        // the site's fast native scroll-behavior:smooth animation, which can
        // outrun the WebGL scenes' own IntersectionObserver-based pausing.
        if (href.startsWith("#")) pauseHeavyScenesForNav();
      }}
      style={{ ...style, x: magnet.style.x, y: magnet.style.y }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}


type PressLogo =
  | { kind: "image"; src: string; alt: string; w: number }
  | { kind: "badge"; alt: string; badgeText: string; badgeColor: string; label: string | readonly string[] };

const PRESS_LOGOS: PressLogo[] = [
  { kind: "image", src: imgPressDigitalJournal, alt: "Digital Journal", w: 80 },
  { kind: "image", src: imgPressYahoo, alt: "Yahoo Finance", w: 120 },
  { kind: "image", src: imgPressBarchart, alt: "Barchart", w: 110 },
  { kind: "image", src: imgPressBenzinga, alt: "Benzinga", w: 120 },
  { kind: "image", src: imgPressTrustedProp, alt: "The Trusted Prop", w: 150 },
];

function LightSweep() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-y-0 w-1/3 pointer-events-none"
      style={{
        background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.05) 45%, rgba(96,165,250,0.12) 50%, rgba(255,255,255,0.05) 55%, transparent 100%)",
        willChange: "transform",
      }}
      initial={{ x: "-140%" }}
      animate={{ x: "340%" }}
      transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
    />
  );
}

function renderPressLogo(logo: PressLogo) {
  if (logo.kind === "badge") {
    return (
      <motion.div
        key={logo.alt}
        className="flex items-center gap-[10px] shrink-0 transition-transform duration-300 ease-out hover:-translate-y-[3px]"
        whileHover={{ scale: 1.04 }}
      >
        <div
          className="flex items-center justify-center rounded-[8px] shrink-0 px-[6px]"
          style={{ minWidth: 28, height: 28, background: logo.badgeColor }}
        >
          <span aria-hidden="true" className="font-['Inter:Bold',sans-serif] font-bold text-white text-[13px] leading-none whitespace-nowrap">{logo.badgeText}</span>
        </div>
        {Array.isArray(logo.label) ? (
          <div className="flex flex-col justify-center">
            {logo.label.map((line) => (
              <span key={line} className="font-['Inter:Bold',sans-serif] font-bold text-[#bfc4d1] text-[10px] leading-[12px] whitespace-nowrap">{line}</span>
            ))}
          </div>
        ) : (
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[#bfc4d1] text-[18px] leading-[22px] whitespace-nowrap">{logo.label}</span>
        )}
      </motion.div>
    );
  }
  return (
    <motion.img
      key={logo.alt}
      src={logo.src}
      alt={logo.alt}
      className="shrink-0 object-contain brightness-0 invert opacity-75 transition-[filter,opacity] duration-500 ease-out hover:brightness-100 hover:invert-0 hover:opacity-100"
      style={{ width: logo.w }}
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}

function FeaturedInDesktopRow() {
  const items: ReactNode[] = [];
  PRESS_LOGOS.forEach((logo, i) => {
    items.push(renderPressLogo(logo));
    if (i < PRESS_LOGOS.length - 1) {
      items.push(<div key={`${logo.alt}-sep`} className="bg-[rgba(255,255,255,0.08)] h-[32px] w-px shrink-0" />);
    }
  });
  return (
    <div className="hidden lg:flex gap-[28px] items-center justify-between px-[40px] h-[80px]">
      {items}
    </div>
  );
}

function FeaturedInMobileRow() {
  const reduceMotion = useReducedMotion();
  const trackItems = reduceMotion ? PRESS_LOGOS : [...PRESS_LOGOS, ...PRESS_LOGOS];
  return (
    <div
      className="lg:hidden w-full overflow-hidden"
      style={{ contain: "layout" }}
      role="region"
      aria-label="As featured in"
    >
      <div
        className={`flex items-center gap-[36px] py-[6px] ${
          reduceMotion ? "flex-wrap justify-center px-[20px]" : "w-max animate-[fyt-marquee_26s_linear_infinite]"
        }`}
      >
        {trackItems.map((logo, i) => (
          <div key={`${logo.alt}-${i}`} className="shrink-0 flex items-center justify-center" aria-hidden={i >= PRESS_LOGOS.length || undefined}>
            {renderPressLogo(logo)}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedIn() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animsActive, setAnimsActive] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setAnimsActive(!!entries[0]?.isIntersecting), {
      rootMargin: "600px 0px 600px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="bg-black relative shrink-0 w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <AmbientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" color="rgba(59,130,246,0.14)" size={560} duration={22} />
      </div>
      <div className="relative flex flex-col gap-[20px] items-center justify-center px-[20px] py-[40px] lg:px-[80px] lg:pb-[48px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#60a5fa] text-[11px] leading-[13px] tracking-[3px]">AS FEATURED IN</p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[1280px] rounded-[20px] px-[24px] py-[20px] lg:px-0 lg:py-0 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #14171F 0%, #0F1117 100%)",
            boxShadow: "inset 0px 1px 8px rgba(59,130,246,0.05)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div aria-hidden className="absolute border border-[rgba(59,130,246,0.15)] border-solid inset-0 pointer-events-none rounded-[20px]" />
          {!reduceMotion && animsActive && <LightSweep />}
          <FeaturedInDesktopRow />
          <FeaturedInMobileRow />
        </motion.div>
      </div>
    </div>
  );
}


const PROVE_SKILL_CARDS = [
  { id: "consistency", text: "Consistency rules limit natural performance." },
  { id: "time-limits", text: "Time limits create pressure." },
  { id: "hidden-rules", text: "Hidden rules cause breaches." },
  { id: "drawdown", text: "Relative drawdown punishes progress." },
  { id: "delayed-rewards", text: "Delayed rewards damage trust." },
] as const;

function StatusIndicator({ animated = true }: { animated?: boolean }) {
  const reduceMotion = useReducedMotion();
  if (!animated) {
    return (
      <div
        aria-hidden="true"
        className="rounded-full shrink-0"
        style={{ width: 7, height: 7, background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }}
      />
    );
  }
  return (
    <motion.div
      aria-hidden="true"
      className="rounded-full shrink-0"
      style={{ width: 7, height: 7, background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }}
      animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/**
 * `animated` defaults to true so every existing (desktop) call site is
 * byte-for-byte unchanged. Mobile passes `animated={false}` for a fully
 * static render: no float wrapper, no tilt/whileHover motion.div, no
 * pulsing status dot -- same markup/classes/content otherwise.
 */
function ProveSkillCard({ text, floatDelay = 0, animated = true }: { text: string; floatDelay?: number; animated?: boolean }) {
  const tilt = useTilt<HTMLDivElement>(4);
  if (!animated) {
    return (
      <div className="group">
        <div
          className="relative overflow-hidden flex gap-[14px] lg:gap-[12px] items-center rounded-[14px] px-[18px] lg:px-[16px] py-[16px] lg:py-[14px] w-[260px] lg:w-[240px] bg-[rgba(255,255,255,0.9)] lg:bg-[rgba(255,255,255,0.72)] lg:backdrop-blur-[14px] transition-[border-color,box-shadow] duration-300 group-hover:border-[rgba(59,130,246,0.4)]"
          style={{
            border: "1px solid rgba(59,130,246,0.14)",
            boxShadow: "0 14px 34px -16px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.55), transparent)" }} />
          <StatusIndicator animated={false} />
          <p className="relative font-['Inter:Regular',sans-serif] font-normal text-[#1f2430] text-[16px] leading-[1.4]">{text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="prove-skill-float" style={{ animationDelay: `${floatDelay}s` }}>
      <motion.div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        whileHover={{ scale: 1.03, y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
        className="group"
      >
        <div
          className="relative overflow-hidden flex gap-[14px] lg:gap-[12px] items-center rounded-[14px] px-[18px] lg:px-[16px] py-[16px] lg:py-[14px] w-[260px] lg:w-[240px] bg-[rgba(255,255,255,0.9)] lg:bg-[rgba(255,255,255,0.72)] lg:backdrop-blur-[14px] transition-[border-color,box-shadow] duration-300 group-hover:border-[rgba(59,130,246,0.4)]"
          style={{
            border: "1px solid rgba(59,130,246,0.14)",
            boxShadow: "0 14px 34px -16px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {/* Soft blue edge light along the top border. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.55), transparent)" }} />
          <StatusIndicator />
          <p className="relative font-['Inter:Regular',sans-serif] font-normal text-[#1f2430] text-[16px] leading-[1.4]">{text}</p>
        </div>
      </motion.div>
    </div>
  );
}

function ProveSkillRevealCard({
  progress,
  reveal,
  reduceMotion,
  className,
  children,
}: {
  progress: MotionValue<number>;
  reveal: CardReveal;
  reduceMotion: boolean | null;
  className: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [0, 1]);
  const x = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [reveal.fromX, 0]);
  const y = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [reveal.fromY, 0]);
  return (
    <motion.div
      className={`prove-skill-reveal-card ${className}`}
      style={reduceMotion ? undefined : { opacity, x, y }}
    >
      {children}
    </motion.div>
  );
}


function BlurRevealWords({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{text}</>;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  );
}

function ProveSkillHeading({ size, animate = true }: { size: string; animate?: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: "min(640px, 92vw)",
          height: 420,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(closest-side, rgba(59,130,246,0.16), rgba(59,130,246,0.05) 55%, transparent 80%)",
          filter: "blur(30px)",
        }}
      />
      <h2 className={`relative font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] ${size} leading-[1.3] tracking-[-0.01em]`}>
        {animate ? <BlurRevealWords text="Prove Your Market Expertise." /> : "Prove Your Market Expertise."}
      </h2>
      <p className={`relative font-['DM_Sans',sans-serif] font-medium ${size} leading-[1.3] tracking-[-0.01em] mt-[6px]`}>
        <span className="text-[#0b0c11]">{animate ? <BlurRevealWords text="Not your ability to survive" /> : "Not your ability to survive"}</span>{" "}
        <span className="text-[#3b82f6]">{animate ? <BlurRevealWords text="unfair rules." /> : "unfair rules."}</span>
      </p>
    </div>
  );
}

function ProveYourSkill() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const revealProgress = useMonotonicProgress(scrollYProgress);
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [cardAnimsActive, setCardAnimsActive] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setCardAnimsActive(!!entries[0]?.isIntersecting), {
      rootMargin: "600px 0px 600px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`bg-white relative shrink-0 w-full ${cardAnimsActive ? "" : "prove-skill-anims-paused"}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03), inset 0 -1px 0 rgba(0,0,0,0.03)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <StaticGlow className="left-[8%] top-[20%]" color="rgba(59,130,246,0.05)" size={520} />
        <StaticGlow className="right-[6%] bottom-[10%]" color="rgba(96,165,250,0.04)" size={420} />
        <div className="absolute inset-0 opacity-[0.025] mix-blend-multiply" style={{ backgroundImage: NOISE_BG }} />
        <AccentLine className="left-0 top-0 w-full" />
        <AccentLine className="left-0 bottom-0 w-full" />
      </div>
      <div className="relative flex flex-col gap-[40px] lg:gap-[0px] items-center px-[20px] py-[64px] lg:px-[80px] lg:py-[120px] w-full max-w-[1280px] mx-auto">
        <div ref={scrollRef} className="hidden lg:block relative w-full" style={{ height: `${PROVE_SKILL_SCROLL_HEIGHT_VH}vh` }}>
          <div className="sticky top-0 h-screen flex flex-col items-center justify-start pt-[140px] gap-0">
            <div className="relative w-full" style={{ height: "900px" }}>
              <div className="absolute left-1/2 -translate-x-1/2 top-[24%] text-center w-[560px]">
                <ProveSkillHeading size="text-[32px] xl:text-[40px]" />
              </div>
              <ProveSkillRevealCard className="absolute left-[2%] top-[8%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[0]} reduceMotion={reduceMotion}>
                <ProveSkillCard text={PROVE_SKILL_CARDS[0].text} floatDelay={0} />
              </ProveSkillRevealCard>
              <ProveSkillRevealCard className="absolute right-[2%] top-[8%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[1]} reduceMotion={reduceMotion}>
                <ProveSkillCard text={PROVE_SKILL_CARDS[1].text} floatDelay={0.3} />
              </ProveSkillRevealCard>
              <ProveSkillRevealCard className="absolute left-[10%] top-[56%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[2]} reduceMotion={reduceMotion}>
                <ProveSkillCard text={PROVE_SKILL_CARDS[2].text} floatDelay={0.6} />
              </ProveSkillRevealCard>
              <ProveSkillRevealCard className="absolute right-[10%] top-[56%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[3]} reduceMotion={reduceMotion}>
                <ProveSkillCard text={PROVE_SKILL_CARDS[3].text} floatDelay={0.9} />
              </ProveSkillRevealCard>
              <ProveSkillRevealCard className="absolute left-1/2 -translate-x-1/2 top-[78%]" progress={revealProgress} reveal={PROVE_SKILL_CARD_REVEALS[4]} reduceMotion={reduceMotion}>
                <ProveSkillCard text={PROVE_SKILL_CARDS[4].text} floatDelay={1.2} />
              </ProveSkillRevealCard>
            </div>
          </div>
        </div>

        {/* Mobile: fully static -- no pinned/sticky scroll-jacking, no
            scroll-linked reveal, no per-card float/tilt/hover motion. Same
            padding/gaps/content as the pinned version, just rendered
            directly in normal document flow. Desktop above is untouched. */}
        <div className="lg:hidden relative w-full flex flex-col items-center gap-[32px]">
          <div className="text-center px-[8px]">
            <ProveSkillHeading size="text-[28px]" animate={false} />
          </div>
          <div className="flex flex-col gap-[12px] w-full items-center">
            {PROVE_SKILL_CARDS.map((c) => (
              <div key={c.id} className="shrink-0">
                <ProveSkillCard text={c.text} animated={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


const PROOF_STATS = [
  { value: KEY_METRICS[0].value, label: "In Rewards", icon: "dollar" },
  { value: KEY_METRICS[1].value, label: "Traders", icon: "people" },
  { value: KEY_METRICS[2].value, label: "Countries", icon: "globe" },
  { value: "24-48H", label: "Processing", icon: "lightning" },
] as const;

function ProofStatIcon({ kind }: { kind: "dollar" | "people" | "globe" | "lightning" }) {
  const common = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" } as const;
  if (kind === "dollar") {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="8" stroke="#60a5fa" strokeWidth="1.4" />
        <path d="M10 5.5v9M12.5 7.8c0-1-1-1.6-2.5-1.6s-2.5.6-2.5 1.6c0 2.1 5 .9 5 3 0 1-1 1.6-2.5 1.6s-2.5-.6-2.5-1.6" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "people") {
    return (
      <svg {...common}>
        <circle cx="7.5" cy="7.5" r="2.5" stroke="#60a5fa" strokeWidth="1.4" />
        <circle cx="13.5" cy="8.5" r="2" stroke="#60a5fa" strokeWidth="1.3" />
        <path d="M3 16c0-2.5 2-4.2 4.5-4.2S12 13.5 12 16" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12.5 12.2c1.8.2 3.5 1.6 3.5 3.8" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "globe") {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="8" stroke="#60a5fa" strokeWidth="1.4" />
        <path d="M2 10h16M10 2c2.2 2.2 3.2 5.1 3.2 8s-1 5.8-3.2 8c-2.2-2.2-3.2-5.1-3.2-8S7.8 4.2 10 2Z" stroke="#60a5fa" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "lightning") {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="8" stroke="#60a5fa" strokeWidth="1.4" />
        <path d="M10.5 5L7 11h2.5L9 15l4-6.5H10L10.5 5Z" fill="#60a5fa" />
      </svg>
    );
  }
  const _exhaustive: never = kind;
  return _exhaustive;
}

function CountUpStat({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const segments = useMemo(() => parseCountUpSegments(value), [value]);
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 60, damping: 16, mass: 1 });

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = prefersReducedMotion ? value : renderCountUp(segments, 0);
  }, [prefersReducedMotion, segments, value]);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    progress.set(1);
  }, [inView, prefersReducedMotion, progress]);

  useMotionValueEvent(spring, "change", (v) => {
    if (prefersReducedMotion || !ref.current) return;
    ref.current.textContent = renderCountUp(segments, v);
  });

  return (
    <p
      ref={ref}
      data-shimmer={prefersReducedMotion ? undefined : "true"}
      className="count-shimmer font-['DM_Sans',sans-serif] font-medium text-[#eef0f6] text-[24px] lg:text-[28px] tracking-[-0.02em]"
    >
      {prefersReducedMotion ? value : renderCountUp(segments, 0)}
    </p>
  );
}

const PROOF_NOISE_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";

function ProofStatCard({
  value,
  label,
  icon,
  index,
  prefersReducedMotion,
}: {
  value: string;
  label: string;
  icon: "dollar" | "people" | "globe" | "lightning";
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const glow = useCursorGlow<HTMLDivElement>();
  const iconMotion = PROOF_ICON_MOTION[icon];

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [0, -PROOF_CARD_FLOAT_AMPLITUDE_PX, 0] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: PROOF_CARD_FLOAT_DURATION_S, repeat: Infinity, ease: "easeInOut", delay: index * PROOF_CARD_FLOAT_STAGGER_S }
      }
    >
      <motion.div
        ref={glow.ref}
        onMouseMove={glow.onMouseMove}
        onMouseLeave={glow.onMouseLeave}
        variants={proofCardReveal}
        whileHover={prefersReducedMotion ? undefined : proofCardHover}
        transition={PROOF_CARD_HOVER_TRANSITION}
        className="proof-card group relative flex h-full w-full flex-col gap-[10px] items-center justify-center overflow-hidden rounded-[14px] px-[16px] py-[24px] lg:py-[28px] text-center"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(155deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015) 60%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 32px rgba(59,130,246,0.04), 0 18px 40px -22px rgba(0,0,0,0.55)",
        }}
      >
        {/* cursor-following highlight — position only, no tilt/rotation */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(160px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(96,165,250,0.14), transparent 70%)" }}
        />
        {/* top reflection sliver */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }}
        />
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[14px]"
            style={{ border: "1px solid rgba(96,165,250,0.4)" }}
            animate={{ opacity: PROOF_CARD_BREATHE_OPACITY }}
            transition={{ duration: PROOF_CARD_BREATHE_DURATION_S, repeat: Infinity, ease: "easeInOut", delay: index * PROOF_CARD_BREATHE_STAGGER_S }}
          />
        )}
        <div className="relative flex items-center justify-center rounded-full size-[36px]" style={{ border: "1px solid rgba(96,165,250,0.35)" }}>
          {icon === "people" && !prefersReducedMotion && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(96,165,250,0.55)" }}
              animate={proofIconNetworkRing}
              transition={PROOF_ICON_NETWORK_RING_TRANSITION}
            />
          )}
          <motion.div animate={prefersReducedMotion ? undefined : iconMotion.animate} transition={iconMotion.transition}>
            <ProofStatIcon kind={icon} />
          </motion.div>
        </div>
        <CountUpStat value={value} />
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[#8a90a3] text-[12px] tracking-[0.5px] uppercase">{label}</p>
      </motion.div>
    </motion.div>
  );
}

function ProofInNumbers() {
  const prefersReducedMotion = useReducedMotion();
  const spotlight = useCursorGlow<HTMLDivElement>();

  return (
    <div
      className="bg-[#0b0c11] relative shrink-0 w-full"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), " +
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.04) 100%)",
          backgroundSize: "48px 48px, 48px 48px, 100% 100%",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(PROOF_NOISE_SVG)}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
          opacity: 0.035,
          mixBlendMode: "overlay",
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <AmbientBlob className="left-[10%] top-[15%]" color="rgba(59,130,246,0.16)" size={500} duration={21} />
        <AmbientBlob className="right-[8%] bottom-[5%]" color="rgba(96,165,250,0.1)" size={420} duration={17} />
        {/* Slow-breathing ambient glow centered behind the whole panel. */}
        <motion.div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 900,
            height: 500,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse, rgba(59,130,246,0.5), transparent 70%)",
            filter: "blur(80px)",
          }}
          initial={{ opacity: 0.08 }}
          animate={prefersReducedMotion ? undefined : { opacity: PROOF_AMBIENT_GLOW_OPACITY }}
          transition={prefersReducedMotion ? undefined : PROOF_AMBIENT_GLOW_TRANSITION}
        />
      </div>
      <div className="relative flex flex-col items-center px-[20px] py-[56px] lg:px-[80px] lg:py-[96px] w-full max-w-[1280px] mx-auto overflow-x-clip">
        <motion.div
          className="w-full"
          animate={prefersReducedMotion ? undefined : { y: PROOF_FLOAT_Y }}
          transition={prefersReducedMotion ? undefined : PROOF_FLOAT_TRANSITION}
        >
          <div
            ref={spotlight.ref}
            onMouseMove={spotlight.onMouseMove}
            onMouseLeave={spotlight.onMouseLeave}
            className="proof-panel relative w-full rounded-[20px] p-[24px] lg:p-[48px]"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -30px rgba(0,0,0,0.6)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[20px]"
              style={{
                background: `radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(96,165,250,${PROOF_SPOTLIGHT_OPACITY}), transparent 70%)`,
              }}
            />
            <div className="relative flex flex-col lg:flex-row gap-[32px] lg:gap-[56px] items-center lg:items-stretch">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={proofLeftReveal}
                className="flex-1 flex flex-col gap-[16px] items-start justify-center text-left w-full"
              >
                <motion.span
                  variants={proofRevealItem}
                  className="px-[16px] py-[6px] rounded-full text-[#60a5fa] text-[11px] font-['Inter:Semi_Bold',sans-serif] font-semibold tracking-[1.5px] uppercase"
                  style={{ border: "1px solid rgba(59,130,246,0.35)" }}
                >
                  Proof in Numbers
                </motion.span>
                <h2 className="font-['DM_Sans',sans-serif] font-medium text-[28px] lg:text-[44px] leading-[1.1] tracking-[-0.02em]">
                  <span className="block text-[#eef0f6]">Thousands traded.</span>
                  <span className="block text-[#3b82f6]">Millions rewarded.</span>
                </h2>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[#9da2b4] text-[15px] lg:text-[16px] leading-[1.6] max-w-[420px]">
                  A global community built on transparent conditions, real progress, and rewards delivered to traders.
                </p>
                <motion.div variants={proofButtonReveal} className="mt-[8px]">
                  <HeroCta
                    href="#live-payouts"
                    magneticStrength={0.18}
                    className="cta-shine group flex items-center gap-[10px] px-[24px] py-[12px] rounded-[999px] shrink-0 no-underline transition-shadow duration-300 hover:shadow-[0_12px_45px_-8px_rgba(59,130,246,0.65)]"
                    style={PILL_CTA_GRADIENT_STYLE}
                  >
                    {!prefersReducedMotion && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-y-0 w-1/3 pointer-events-none"
                        style={{ background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent)" }}
                        initial={{ x: "-115%" }}
                        animate={proofButtonSweep}
                        transition={PROOF_BUTTON_SWEEP_TRANSITION}
                      />
                    )}
                    <div aria-hidden className="absolute border border-[rgba(156,196,255,0.35)] border-solid inset-0 pointer-events-none rounded-[999px]" />
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white whitespace-nowrap">View Live Rewards</p>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-[6px]"
                    >
                      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </HeroCta>
                </motion.div>
              </motion.div>

              <div className="hidden lg:block absolute left-[48px] right-[48px] top-1/2 h-px pointer-events-none">
                {!prefersReducedMotion && (
                  <motion.div
                    className="proof-connection-line absolute inset-0 origin-left"
                    style={{
                      background: "linear-gradient(90deg, transparent, #60a5fa, transparent)",
                      boxShadow: "0 0 8px rgba(96,165,250,0.6)",
                      opacity: PROOF_CONNECTION_LINE_OPACITY,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: PROOF_CONNECTION_LINE_DURATION_S, delay: PROOF_CONNECTION_LINE_DELAY_S, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute top-1/2 size-[6px] -translate-y-1/2 rounded-full"
                    style={{ background: "#93c5fd", boxShadow: "0 0 12px 2px rgba(147,197,253,0.9)" }}
                    initial={{ left: "0%", opacity: 0 }}
                    whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: PROOF_CONNECTION_LINE_TRAVEL_DURATION_S, delay: PROOF_CONNECTION_LINE_TRAVEL_DELAY_S, ease: "easeInOut" }}
                  />
                )}
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={proofRightReveal}
                className="flex-1 grid grid-cols-2 gap-[12px] lg:gap-[16px] w-full min-w-0 relative"
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {PROOF_DATA_LINES.map((line, i) => (
                    <g key={i}>
                      <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="rgba(96,165,250,0.08)" strokeWidth="0.3" />
                      {!prefersReducedMotion && (
                        <motion.circle
                          r={0.8}
                          fill="rgba(147,197,253,0.9)"
                          initial={{ cx: line.x1, cy: line.y1, opacity: 0 }}
                          animate={{ cx: [line.x1, line.x2], cy: [line.y1, line.y2], opacity: [0, 1, 0] }}
                          transition={{
                            duration: PROOF_DATA_LINE_LIGHT_DURATION_S,
                            repeat: Infinity,
                            repeatDelay: PROOF_DATA_LINE_LIGHT_CYCLE_S - PROOF_DATA_LINE_LIGHT_DURATION_S,
                            delay: i * PROOF_DATA_LINE_LIGHT_STAGGER_S,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </g>
                  ))}
                </svg>
                {PROOF_STATS.map(({ value, label, icon }, i) => (
                  <ProofStatCard key={label} value={value} label={label} icon={icon} index={i} prefersReducedMotion={prefersReducedMotion} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


const LIVE_PAYOUTS_NOISE_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";

function LivePayouts() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      id="live-payouts"
      className="bg-white relative shrink-0 w-full scroll-mt-[132px] lg:scroll-mt-[136px]"
      style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03), inset 0 -1px 0 rgba(0,0,0,0.03)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <StaticGlow className="left-[6%] top-[8%]" color="rgba(59,130,246,0.05)" size={480} />
        <StaticGlow className="right-[10%] bottom-[12%]" color="rgba(34,197,94,0.04)" size={380} />
        <AccentLine className="left-0 top-0 w-full" />
        <AccentLine className="left-0 bottom-0 w-full" />
        {/* Soft radial blue glow behind the table. */}
        <div
          className="absolute left-1/2 top-[62%] rounded-full"
          style={{
            width: 900,
            height: 500,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(ellipse, rgba(59,130,246,${LIVE_PAYOUTS_BG_GLOW_OPACITY}), transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        {/* Soft vignette. */}
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${LIVE_PAYOUTS_VIGNETTE_OPACITY}) 100%)` }}
        />
        {/* Subtle noise texture. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(LIVE_PAYOUTS_NOISE_SVG)}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "120px 120px",
            opacity: LIVE_PAYOUTS_NOISE_OPACITY,
            mixBlendMode: "overlay",
          }}
        />
      </div>
      <div className="relative flex flex-col gap-[36px] lg:gap-[48px] items-center px-[20px] py-[56px] lg:px-[80px] lg:py-[96px] w-full max-w-[1280px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] text-[28px] lg:text-[44px] leading-[1.1] tracking-[-0.02em] text-center"
        >
          Live Rewards. <span className="text-[#3b82f6]">Verified</span> Proofs.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Suspense fallback={null}>
            <FeaturedCertificates />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Suspense fallback={null}>
            <RecentVerifiedRewards />
          </Suspense>
        </motion.div>

        <motion.div
          className="w-full sm:w-auto"
          animate={prefersReducedMotion ? undefined : { y: livePayoutsCtaFloatY }}
          transition={prefersReducedMotion ? undefined : LIVE_PAYOUTS_CTA_FLOAT_TRANSITION}
        >
          <motion.div whileHover={prefersReducedMotion ? undefined : { y: -4 }} transition={{ type: "spring", stiffness: 380, damping: 24 }}>
            <HeroCta
              href="https://rewards.fundingyourtrades.com/"
              target="_blank"
              rel="noopener noreferrer"
              magneticStrength={0.16}
              className="cta-shine group flex items-center justify-center gap-[10px] px-[36px] py-[19px] lg:py-[21px] rounded-[999px] shrink-0 no-underline w-full sm:w-auto transition-shadow duration-300 hover:shadow-[0_20px_60px_-12px_rgba(59,130,246,0.65)]"
              style={PILL_CTA_GRADIENT_STYLE}
            >
              {/* Glass highlight */}
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent)" }} />
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.18), transparent, rgba(96,165,250,0.25), transparent)",
                    backgroundSize: "300% 300%",
                  }}
                  animate={livePayoutsCtaGradientPosition}
                  transition={{ duration: LIVE_PAYOUTS_CTA_GRADIENT_DURATION_S, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] lg:text-[17px] text-white whitespace-nowrap">Check More Rewards</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative transition-transform duration-300 group-hover:translate-x-[6px]">
                <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HeroCta>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}


function ClosingCtaButton() {
  const magnet = useMagnetic<HTMLAnchorElement>(0.16);
  return (
    <motion.a
      ref={magnet.ref}
      href={HERO_CONTENT.ctaPrimary.href}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      style={{ ...PILL_CTA_GRADIENT_STYLE, x: magnet.style.x, y: magnet.style.y }}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className="cta-shine group flex justify-center gap-[10px] items-center px-[32px] py-[16px] rounded-[999px] shrink-0 no-underline transition-shadow duration-300 hover:shadow-[0_0_40px_-4px_rgba(94,168,255,0.55)]"
    >
      {/* Glass highlight */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent)" }} />
      <p className="relative font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[16px] text-white text-center max-[374px]:whitespace-normal whitespace-nowrap">Become our Next Success Story!</p>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative transition-transform duration-300 group-hover:translate-x-[4px]">
        <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  );
}

function TradingGlobePlaceholder() {
  return (
    <div className="relative w-full rounded-[20px] overflow-hidden" style={{ border: "1px solid rgba(77,163,255,0.15)", boxShadow: "0 24px 60px -28px rgba(0,0,0,0.6)" }}>
      <div className="rounded-[20px] overflow-hidden aspect-[2/1] min-h-[280px] sm:min-h-0 relative w-full bg-[#05070d]" />
    </div>
  );
}

// Was 1800/3200 originally, then tightened to 500/800 to stop the heavy
// first-time boot from landing mid-fast-scroll. That fixed the crash, but
// with so little lead time the globe often wasn't finished loading (JS
// chunk parse + new WebGL context + canvas texture generation) by the
// time it actually scrolled into view — showing as "coming in late." The
// scroll-settle gate below (isScrollSettled) is what actually prevents the
// heavy boot from landing mid-scroll, so it's safe to give this more lead
// time again without reintroducing that crash.
const GLOBE_INIT_MARGIN_PX = 1100;
const GLOBE_DESKTOP_INIT_MARGIN_PX = 1600;
const GLOBE_REVEAL_MARGIN_PX = 150;
// Was 400ms — combined with the margins above being small, the globe would
// finish loading right as it scrolled into view and then visibly fade in
// over the following 400ms, reinforcing the "late" feeling. With more lead
// time it should usually already be ready before it's on screen, so this
// is now just a quick flash-guard rather than a deliberate fade.
const GLOBE_REVEAL_TRANSITION = "opacity 120ms ease-out";
// Was 400px: the globe's WebGL canvas stayed on frameloop="always" for a
// full 400px of scroll before/after it was on screen — real GPU/main-thread
// work happening while the user is still actively scrolling past it.
const GLOBE_ACTIVE_MARGIN_PX = 150;
/**
 * Mobile only: once scrolled this far past the globe, fully unmount its
 * WebGL Canvas instead of just pausing its render loop. `active`/
 * `frameloop: "demand"` stops per-frame work, but the GPU-resident texture,
 * geometry, and shader memory a live WebGL context holds stays allocated for
 * as long as the Canvas stays mounted — on memory-constrained phones that
 * accumulates for the rest of the session once triggered. Unmounting
 * releases it (react-three-fiber disposes the context on unmount); the
 * lazy-loaded chunk is already cached, so scrolling back re-mounts fast.
 */
const GLOBE_MOBILE_UNMOUNT_MARGIN_PX = 2500;

function isDesktopGlobeViewport(): boolean {
  return window.matchMedia("(min-width: 1024px)").matches && window.matchMedia("(pointer: fine)").matches;
}

function useIsDesktopGlobeViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState(isDesktopGlobeViewport);
  useEffect(() => {
    const queries = [window.matchMedia("(min-width: 1024px)"), window.matchMedia("(pointer: fine)")];
    const update = () => setIsDesktop(isDesktopGlobeViewport());
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);
  return isDesktop;
}

function TradingGlobeSlot() {
  const isDesktop = useIsDesktopGlobeViewport();
  const [shouldInit, setShouldInit] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [stayMounted, setStayMounted] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const revealed = nearViewport && globeReady;

  useEffect(() => {
    if (shouldInit) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldInit(true);
      return;
    }
    let retryTimer: number | undefined;
    const tryInit = () => {
      // Don't boot the globe's heavy first-time load (new JS chunk + new
      // WebGL context + canvas texture generation, all synchronous) while
      // the page is still actively scrolling — whether that's a same-page
      // CTA jump (scenePause) or an ordinary finger-drag/momentum scroll
      // (scrollActivity). Wait for it to settle so that burst of work lands
      // on an idle main thread instead of one that's mid-scroll.
      if (isHeavySceneNavPauseActive() || !isScrollSettled()) {
        retryTimer = window.setTimeout(tryInit, 150);
        return;
      }
      if (import.meta.env.DEV) performance.mark("globe:init-trigger");
      preloadGlobeChunkOnce();
      setShouldInit(true);
      observer.disconnect();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryInit();
      },
      { rootMargin: `0px 0px ${isDesktop ? GLOBE_DESKTOP_INIT_MARGIN_PX : GLOBE_INIT_MARGIN_PX}px 0px` },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [shouldInit, isDesktop]);

  useEffect(() => {
    if (nearViewport) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${GLOBE_REVEAL_MARGIN_PX}px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nearViewport]);

  useEffect(() => {
    if (!shouldInit) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (isHeavySceneNavPauseActive()) {
          setIsActive(false);
          return;
        }
        setIsActive(!!entries[0]?.isIntersecting);
      },
      { rootMargin: `${GLOBE_ACTIVE_MARGIN_PX}px 0px ${GLOBE_ACTIVE_MARGIN_PX}px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldInit]);

  // Instant pause on a hero CTA click — see scenePause.ts.
  useEffect(() => onHeavySceneNavPause(() => setIsActive(false)), []);

  useEffect(() => {
    if (isDesktop || !shouldInit) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setStayMounted(!!entries[0]?.isIntersecting), {
      rootMargin: `${GLOBE_MOBILE_UNMOUNT_MARGIN_PX}px 0px ${GLOBE_MOBILE_UNMOUNT_MARGIN_PX}px 0px`,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop, shouldInit]);

  if (isDesktop) {
    return (
      <div ref={sentinelRef} className="w-full relative">
        <TradingGlobePlaceholder />
        {shouldInit && (
          <Suspense fallback={null}>
            <div
              className="absolute inset-0"
              style={{
                opacity: revealed ? 1 : 0,
                visibility: revealed ? "visible" : "hidden",
                pointerEvents: revealed ? "auto" : "none",
                transition: GLOBE_REVEAL_TRANSITION,
              }}
            >
              <TradingGlobe onReady={() => setGlobeReady(true)} active={isActive} />
            </div>
          </Suspense>
        )}
      </div>
    );
  }

  return (
    <div ref={sentinelRef} className="w-full">
      {shouldInit && stayMounted ? (
        <Suspense fallback={<TradingGlobePlaceholder />}>
          <div
            style={{
              opacity: revealed ? 1 : 0,
              visibility: revealed ? "visible" : "hidden",
              pointerEvents: revealed ? "auto" : "none",
              transition: GLOBE_REVEAL_TRANSITION,
            }}
          >
            <TradingGlobe onReady={() => setGlobeReady(true)} active={isActive} />
          </div>
        </Suspense>
      ) : (
        <TradingGlobePlaceholder />
      )}
    </div>
  );
}

function ClosingCta() {
  return (
    <div className="bg-[#070810] relative shrink-0 w-full">
      <div className="flex flex-col gap-[32px] lg:gap-[40px] items-center px-[20px] py-[64px] lg:px-[80px] lg:py-[120px] w-full max-w-[1280px] mx-auto">
        <h2 className="font-['DM_Sans',sans-serif] text-[#eef0f6] text-[28px] lg:text-[44px] leading-[1.15] tracking-[-0.02em] text-center">
          <span className="font-semibold">Join a Growing Global Community </span>
          <span className="font-normal text-[0.85em]">with FYT.</span>
        </h2>
        <TradingGlobeSlot />
        <ClosingCtaButton />
      </div>
    </div>
  );
}


const PRICING_NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const STEP_DISPLAY_LABELS: Record<StepId, string> = {
  "1-Step": "1 Step",
  "2-Step": "2 Step",
  "Instant": "Instant",
};

const STEP_BENEFIT_LABELS: Record<StepId, string> = {
  "1-Step": "Faster evaluation",
  "2-Step": "Higher success rate",
  "Instant": "Skip evaluation",
};

function SelectorIcon({ kind }: { kind: "lightning" | "bars" | "shield-star" | "diamond" | "grid" }) {
  const common = { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none" } as const;
  if (kind === "lightning") return <svg {...common}><path d="M9 1.5 3 9.5h4L6.5 14.5 13 6.5H9L9 1.5Z" fill="currentColor" /></svg>;
  if (kind === "bars") return <svg {...common}><path d="M2.5 13.5v-4M7 13.5v-8M11.5 13.5v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  if (kind === "shield-star") return <svg {...common}><path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 5.8l.9 1.8 2 .3-1.4 1.4.3 2L8 10.4l-1.8.9.3-2-1.4-1.4 2-.3L8 5.8Z" fill="currentColor" /></svg>;
  if (kind === "grid") return <svg {...common}><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>;
  return <svg {...common}><path d="M8 1.5 13.5 7 8 14.5 2.5 7 8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
}

type PanelIconKind = "person" | "shield-check" | "star" | "info" | "target" | "clock" | "calendar" | "people" | "trending" | "shield" | "lightning-box" | "bars" | "grid";

function PanelIcon({ kind }: { kind: PanelIconKind }) {
  const common = { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none" } as const;
  const s = "currentColor";
  switch (kind) {
    case "person": return <svg {...common}><circle cx="8" cy="5.5" r="2.7" stroke={s} strokeWidth="1.3" /><path d="M2.8 13.5c0-2.4 2.3-4.2 5.2-4.2s5.2 1.8 5.2 4.2" stroke={s} strokeWidth="1.3" strokeLinecap="round" /></svg>;
    case "bars": return <svg {...common}><path d="M3 13.5v-4M8 13.5v-8M13 13.5v-6" stroke={s} strokeWidth="1.4" strokeLinecap="round" /></svg>;
    case "shield-check": case "shield": return <svg {...common}><path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke={s} strokeWidth="1.3" strokeLinejoin="round" />{kind === "shield-check" && <path d="M5.5 8l1.8 1.8L10.8 6" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />}</svg>;
    case "star": return <svg {...common}><path d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" stroke={s} strokeWidth="1.2" strokeLinejoin="round" /></svg>;
    case "info": return <svg {...common}><circle cx="8" cy="8" r="6.2" stroke={s} strokeWidth="1.2" /><path d="M8 7.2v4M8 5.2v.1" stroke={s} strokeWidth="1.3" strokeLinecap="round" /></svg>;
    case "target": return <svg {...common}><circle cx="8" cy="8" r="6" stroke={s} strokeWidth="1.2" /><circle cx="8" cy="8" r="2.6" stroke={s} strokeWidth="1.2" /></svg>;
    case "clock": return <svg {...common}><circle cx="8" cy="8" r="6.2" stroke={s} strokeWidth="1.2" /><path d="M8 4.5V8l2.8 1.6" stroke={s} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case "calendar": return <svg {...common}><rect x="2" y="3.5" width="12" height="10.5" rx="1.5" stroke={s} strokeWidth="1.2" /><path d="M2 6.5h12M5.5 2v3M10.5 2v3" stroke={s} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case "people": return <svg {...common}><circle cx="6" cy="6" r="2.2" stroke={s} strokeWidth="1.2" /><circle cx="11" cy="7" r="1.7" stroke={s} strokeWidth="1.1" /><path d="M2.3 13.2c0-2 1.6-3.5 3.7-3.5s3.7 1.5 3.7 3.5" stroke={s} strokeWidth="1.2" strokeLinecap="round" /><path d="M10.3 9.9c1.4.2 2.7 1.3 2.7 3" stroke={s} strokeWidth="1.1" strokeLinecap="round" /></svg>;
    case "trending": return <svg {...common}><path d="M2 12.5l4-4.5 3 2.5 5-6" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 4h3v3" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "grid": return <svg {...common}><rect x="2" y="2" width="5" height="5" rx="1" stroke={s} strokeWidth="1.2" /><rect x="9" y="2" width="5" height="5" rx="1" stroke={s} strokeWidth="1.2" /><rect x="2" y="9" width="5" height="5" rx="1" stroke={s} strokeWidth="1.2" /><rect x="9" y="9" width="5" height="5" rx="1" stroke={s} strokeWidth="1.2" /></svg>;
    default: return <svg {...common}><path d="M9 1.5 3 9.5h4L6.5 14.5 13 6.5H9L9 1.5Z" fill={s} /></svg>;
  }
}

const STEP_ICONS: Record<StepId, "lightning" | "bars"> = { "1-Step": "lightning", "2-Step": "bars", "Instant": "lightning" };
const PLAN_ICONS: Record<PlanId, "shield-star" | "diamond"> = { classic: "shield-star", plus: "shield-star", prime: "diamond" };
const PLATFORM_LOGOS: Record<PlatformId, string> = { "match-trader": imgMatchTraderLogo, "platform-5": imgPlatform5Logo };
const PLATFORM_LOGO_HEIGHT: Record<PlatformId, string> = { "match-trader": "16px", "platform-5": "26px" };

type MobilePanelTab = "rules" | "why";
const MOBILE_PANEL_TABS: { id: MobilePanelTab; label: string }[] = [
  { id: "rules", label: "Key Rules" },
  { id: "why", label: "Why traders choose this" },
];

interface PricingFlashContextValue {
  changeTick: number;
  celebrated: boolean;
}
const PricingFlashContext = createContext<PricingFlashContextValue>({ changeTick: 0, celebrated: false });

function useTouchedOnChange<T>(value: T): boolean {
  const [touched, setTouched] = useState(false);
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setTouched(true);
  }, [value]);
  return touched;
}

function PanelCard({ children, className }: { children: ReactNode; className: string }) {
  const prefersReducedMotion = useReducedMotion();
  const { changeTick, celebrated } = useContext(PricingFlashContext);
  const contentControls = useAnimation();
  const isFirstChangeTick = useRef(true);
  useEffect(() => {
    if (isFirstChangeTick.current) {
      isFirstChangeTick.current = false;
      return;
    }
    if (prefersReducedMotion) return;
    void contentControls.start({ opacity: pricingContentDipOpacity, transition: PRICING_SWEEP_TRANSITION });
  }, [changeTick, prefersReducedMotion, contentControls]);

  return (
    <motion.div
      className="h-full"
      animate={prefersReducedMotion ? undefined : { y: pricingCardFloatY, scale: celebrated ? pricingCompletionCardPulse.scale : 1 }}
      transition={
        prefersReducedMotion
          ? undefined
          : {
              y: PRICING_CARD_FLOAT_TRANSITION,
              scale: celebrated
                ? { duration: PRICING_COMPLETION_CARD_PULSE_DURATION_S, delay: PRICING_COMPLETION_CARD_PULSE_DELAY_S, ease: "easeOut" }
                : { duration: 0 },
            }
      }
    >
      <motion.div
        className={`${className} group flex-col rounded-[24px] relative h-full`}
        style={{ background: "#FFFFFF", border: "1px solid #E8EDF5", boxShadow: "0 20px 50px rgba(15,23,42,0.08)" }}
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        whileHover={{ y: -4, borderColor: "#60A5FA", boxShadow: "0 28px 60px rgba(15,23,42,0.12)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute -inset-px opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            style={{ background: "radial-gradient(160px circle at 50% 0%, rgba(59,130,246,0.18), transparent 70%)" }}
          />
          {!prefersReducedMotion && changeTick > 0 && (
            <motion.div
              key={changeTick}
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, transparent 38%, rgba(59,130,246,0.9) 50%, transparent 62%)",
                backgroundSize: "280% 280%",
                filter: "blur(3px)",
              }}
              initial={{ backgroundPosition: "0% 130%", opacity: 0 }}
              animate={{ backgroundPosition: "130% 0%", opacity: pricingSweepOpacity }}
              transition={PRICING_SWEEP_TRANSITION}
            />
          )}
        </div>
        <motion.div className="relative flex flex-col gap-[20px] p-[32px]" initial={{ opacity: 1 }} animate={contentControls}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function KeyRulesRows({ stats }: { stats: [string, string][] }) {
  const icons = ["target", "shield", "shield", "calendar", "clock"] as const;
  return (
    <div className="flex flex-col">
      {stats.map(([k, v], i) => (
        <div key={k} className="flex items-center justify-between py-[10px]" style={{ borderBottom: "1px solid #E8EDF5" }}>
          <span className="flex items-center gap-[8px] text-[#2563EB]">
            <PanelIcon kind={icons[i]} />
            <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#6B7280]">{k}</span>
          </span>
          <span className="relative inline-grid overflow-hidden">
            <motion.span
              key={v}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-['Inter:Medium',sans-serif] font-medium text-[#111827] text-[14px] [grid-area:1/1]"
            >
              {v}
            </motion.span>
          </span>
        </div>
      ))}
    </div>
  );
}

function WhyChoiceBullets({ bullets }: { bullets: [PanelIconKind, string][] }) {
  return (
    <div className="flex flex-col gap-[16px]">
      {bullets.map(([icon, label]) => (
        <div key={label} className="flex items-center gap-[12px]">
          <div className="flex items-center justify-center rounded-[10px] size-[32px] shrink-0" style={{ background: "#EEF5FF", color: "#2563EB" }}>
            <PanelIcon kind={icon} />
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[#374151] text-[14px]">{label}</p>
        </div>
      ))}
    </div>
  );
}

const PLAN_COMPARE_CLASSIC_URL = "https://intercom.help/funding-your-trades/en/articles/13374417-fyt-classic-vs-fyt-prime";
const PLAN_COMPARE_INSTANT_URL = "https://intercom.help/funding-your-trades/en/articles/14890800-instant-funding-models-compared";

function planCompareCopy(step: StepId): { href: string; label: string; ariaLabel: string } {
  if (step === "Instant") {
    return {
      href: PLAN_COMPARE_INSTANT_URL,
      label: "Compare Plus vs Prime",
      ariaLabel: "Compare Plus and Prime",
    };
  }
  return {
    href: PLAN_COMPARE_CLASSIC_URL,
    label: "Compare Classic vs Prime",
    ariaLabel: "Compare Classic and Prime",
  };
}

function PlanCompareShortcut({ step }: { step: StepId }) {
  const { href, label, ariaLabel } = planCompareCopy(step);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [mobileRevealed, setMobileRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = anchorRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let showTimeoutId: number | undefined;
    let hideTimeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showTimeoutId = window.setTimeout(() => {
            setMobileRevealed(true);
            hideTimeoutId = window.setTimeout(() => setMobileRevealed(false), 5000);
          }, 4000);
        } else {
          if (showTimeoutId !== undefined) window.clearTimeout(showTimeoutId);
          if (hideTimeoutId !== undefined) window.clearTimeout(hideTimeoutId);
          setMobileRevealed(false);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (showTimeoutId !== undefined) window.clearTimeout(showTimeoutId);
      if (hideTimeoutId !== undefined) window.clearTimeout(hideTimeoutId);
    };
  }, []);

  return (
    <a
      ref={anchorRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          window.open(href, "_blank", "noopener,noreferrer");
        }
      }}
      className="group/compare relative flex shrink-0 items-center justify-center gap-[6px] lg:gap-[8px] self-stretch px-[12px] lg:px-[16px] rounded-[10px] no-underline transition-transform duration-200 hover:scale-[1.04] active:scale-[0.96]"
      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <path d="M8 1.2l1.87 3.9 4.24.63-3.06 3 .72 4.27L8 10.97l-3.77 2.03.72-4.27-3.06-3 4.24-.63L8 1.2Z" fill="#ffffff" />
      </svg>
      <span aria-hidden="true" className="w-px h-[16px] shrink-0" style={{ background: "rgba(255,255,255,0.15)" }} />
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="shrink-0 drop-shadow-[0_0_4px_rgba(59,130,246,0.55)] transition-[filter] duration-200 group-hover/compare:drop-shadow-[0_0_7px_rgba(59,130,246,0.8)]"
      >
        <path d="M8 1.2l1.87 3.9 4.24.63-3.06 3 .72 4.27L8 10.97l-3.77 2.03.72-4.27-3.06-3 4.24-.63L8 1.2Z" fill="#3b82f6" />
      </svg>
      <span
        aria-hidden="true"
        className="hidden lg:block absolute -top-[38px] left-1/2 -translate-x-1/2 whitespace-nowrap px-[10px] py-[6px] rounded-[6px] text-[12px] font-['Inter:Medium',sans-serif] font-medium text-[#eef0f6] opacity-0 group-hover/compare:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: "#12141c", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 20px -8px rgba(0,0,0,0.5)" }}
      >
        {label}
      </span>
      <AnimatePresence>
        {mobileRevealed && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden absolute -top-[38px] right-0 max-w-[calc(100vw-32px)] whitespace-nowrap px-[10px] py-[6px] rounded-[6px] text-[12px] font-['Inter:Medium',sans-serif] font-medium text-[#eef0f6] pointer-events-none"
            style={{ background: "#12141c", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 20px -8px rgba(0,0,0,0.5)" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}

const PRICING_ANIMATIONS_ACTIVE_MARGIN_PX = 600;

function Pricing() {
  const [step, setStep] = useState<StepId>("2-Step");
  const [plan, setPlan] = useState<PlanId>("prime");
  const [platform, setPlatform] = useState<PlatformId>("match-trader");
  const [size, setSize] = useState<number>(100000);
  const [showExplainerVideo, setShowExplainerVideo] = useState(false);
  const closeExplainerVideo = useCallback(() => setShowExplainerVideo(false), []);
  const [mobilePanelTab, setMobilePanelTab] = useState<MobilePanelTab>("rules");
  const checkoutMagnet = useMagnetic<HTMLDivElement>(0.2);
  const reduceMotion = useReducedMotion();
  const spotlight = useCursorGlow<HTMLDivElement>();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animsActive, setAnimsActive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setAnimsActive(!!entries[0]?.isIntersecting),
      { rootMargin: `${PRICING_ANIMATIONS_ACTIVE_MARGIN_PX}px 0px ${PRICING_ANIMATIONS_ACTIVE_MARGIN_PX}px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stepTouched = useTouchedOnChange(step);
  const planTouched = useTouchedOnChange(plan);
  const platformTouched = useTouchedOnChange(platform);
  const sizeTouched = useTouchedOnChange(size);
  const allTouched = stepTouched && planTouched && platformTouched && sizeTouched;
  const [celebrated, setCelebrated] = useState(false);
  useEffect(() => {
    if (allTouched) setCelebrated(true);
  }, [allTouched]);

  const [changeTick, setChangeTick] = useState(0);
  const isFirstChangeRender = useRef(true);
  useEffect(() => {
    if (isFirstChangeRender.current) {
      isFirstChangeRender.current = false;
      return;
    }
    setChangeTick((t) => t + 1);
  }, [step, plan, platform, size]);

  const entry = getEntry(step, plan, platform, size)!;
  const planLabel = STEP_PLANS[step].find((p) => p.id === plan)?.label ?? "";
  const platformLabel = PLATFORM_OPTIONS.find((p) => p.id === platform)?.label ?? "";
  const sizeLabel = fmtSize(size);

  const priceRef = useRef<HTMLParagraphElement>(null);
  const priceMotionValue = useMotionValue(entry.priceNew);
  const priceSpring = useSpring(priceMotionValue, PRICING_PRICE_SPRING);
  useEffect(() => {
    priceMotionValue.set(entry.priceNew);
  }, [entry.priceNew, priceMotionValue]);
  useMotionValueEvent(priceSpring, "change", (v) => {
    if (priceRef.current) priceRef.current.textContent = `$${v.toFixed(2)}`;
  });

  function handleStepChange(next: StepId) {
    setStep(next);
    if (!STEP_PLANS[next].some((p) => p.id === plan)) setPlan(STEP_PLANS[next][0].id);
    if (!STEP_SIZES[next].includes(size)) setSize(100000);
  }

  const profitTargetLabel = step === "Instant" && plan === "prime" ? "Withdrawal Threshold" : "Target";
  const maxOverallLossLabel =
    step === "Instant"
      ? plan === "prime"
        ? "Max Overall Loss (Trailing Cap)"
        : "Max Overall Loss (Trailing)"
      : "Max Overall Loss (Static)";

  const stats: [string, string][] = [
    [profitTargetLabel, step === "Instant" ? (entry.profit ?? "N/A") : step === "2-Step" ? `${entry.p1} / ${entry.p2}` : entry.p1 ?? ""],
    ["Max Daily Loss", entry.maxDaily],
    [maxOverallLossLabel, entry.maxOverall],
    ["Min Trading Days", entry.minDays],
    ["Time Limit", entry.time],
  ];

  const traderChoiceBullets: [PanelIconKind, string][] =
    step === "Instant"
      ? [
          ["trending", "Up to 90% reward splits"],
          ["calendar", "Weekend/Overnight holdings"],
          ["clock", "Bi-weekly reward"],
        ]
      : plan === "prime"
      ? [
          ["trending", "Up to 100% reward splits"],
          ["star", "News trading (challenge only)"],
          ["shield", "Hedging (challenge only)"],
          ["people", "EA/Copy trading (challenge only)"],
          ["target", "No SL requirement"],
          ["calendar", "Weekend/Overnight holdings"],
        ]
      : [
          ["trending", "Up to 100% reward splits"],
          ["star", "News trading"],
          ["shield", "Hedging"],
          ["people", "EA/Copy trading (challenge only)"],
          ["target", "No SL requirement"],
          ["calendar", "Weekend/Overnight holdings"],
        ];

  return (
    <div ref={sectionRef} id="challenge" className="relative shrink-0 w-full scroll-mt-[132px] lg:scroll-mt-[136px]">
      <div
        ref={spotlight.ref}
        onMouseMove={spotlight.onMouseMove}
        onMouseLeave={spotlight.onMouseLeave}
        className="overflow-clip rounded-[inherit] size-full relative"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <AmbientBlob className="left-[4%] top-[6%]" color="rgba(59,130,246,0.1)" size={580} duration={27} />
          <AmbientBlob className="right-[6%] bottom-[10%]" color="rgba(96,165,250,0.07)" size={460} duration={22} />
          <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: PRICING_NOISE_BG }} />
          {/* Mouse spotlight over the whole configurator — very subtle. */}
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(500px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(96,165,250,${PRICING_SPOTLIGHT_OPACITY}), transparent 70%)` }}
          />
        </div>
        <div className="content-stretch flex flex-col gap-[32px] lg:gap-[48px] items-start px-[20px] py-[48px] lg:px-[88px] lg:py-[120px] relative size-full">
          <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[32px] items-center lg:items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col gap-[12px] items-center lg:items-start"
            >
              <p className="font-['DM_Sans',sans-serif] font-medium leading-[1.1] text-[#eef0f6] text-[32px] lg:text-[44px] tracking-[-0.792px] text-center lg:text-left">
                Find the right challenge
                <br />
                <span className="text-[#eef0f6]">in </span>
                <span className="text-[#3b82f6]" style={{ textShadow: "0 0 30px rgba(59,130,246,0.35)" }}>under a minute.</span>
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.6] text-[#9da2b4] text-[16px] lg:text-[18px] text-center lg:text-left">Pick a model, compare essentials, and start with clarity.</p>
            </motion.div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowExplainerVideo(true); }}
              className="flex items-center justify-center lg:justify-start gap-[14px] px-[16px] py-[14px] rounded-[12px] shrink-0 no-underline w-full lg:w-[300px] relative overflow-hidden transition-[border-color,transform] duration-300 hover:border-[rgba(59,130,246,0.4)] hover:-translate-y-[2px]"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
            >
              <motion.div
                className="flex items-center justify-center rounded-full size-[44px] shrink-0"
                style={{ border: "1.5px solid #3b82f6", background: "rgba(59,130,246,0.08)" }}
                animate={reduceMotion || !animsActive ? undefined : { boxShadow: ["0 0 12px rgba(59,130,246,0.5)", "0 0 20px rgba(59,130,246,0.85)", "0 0 12px rgba(59,130,246,0.5)"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="ml-[2px]"><path d="M1 1L13 8L1 15V1Z" fill="white" /></svg>
              </motion.div>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[14px]">See how it works</p>
              <div className="hidden lg:flex items-end gap-[3px] absolute right-[16px] bottom-[14px] h-[28px]" aria-hidden="true">
                {[6, 12, 18, 24, 14, 20, 10].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{ height: `${h}px`, background: "rgba(59,130,246,0.35)" }}
                    animate={reduceMotion ? undefined : { height: [`${h}px`, `${Math.max(4, h - 10)}px`, `${h}px`] }}
                    transition={{ duration: 1 + (i % 3) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
                  />
                ))}
              </div>
            </button>
          </div>

          <div className="flex gap-[6px] w-full" aria-hidden="true">
            {[stepTouched, planTouched, platformTouched, sizeTouched].map((touched, i) => (
              <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full origin-left"
                  style={{ background: "#3b82f6" }}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: touched ? 1 : 0,
                    boxShadow:
                      celebrated && !reduceMotion
                        ? ["0 0 4px rgba(59,130,246,0.4)", "0 0 16px rgba(59,130,246,0.9)", "0 0 4px rgba(59,130,246,0.4)"]
                        : touched
                        ? "0 0 4px rgba(59,130,246,0.4)"
                        : "none",
                  }}
                  transition={
                    celebrated && !reduceMotion
                      ? { scaleX: PRICING_PROGRESS_SEGMENT_TRANSITION, boxShadow: { duration: PRICING_COMPLETION_LINE_GLOW_DURATION_S, delay: PRICING_COMPLETION_LINE_GLOW_DELAY_S, ease: "easeOut" } }
                      : PRICING_PROGRESS_SEGMENT_TRANSITION
                  }
                />
              </div>
            ))}
          </div>

          {/* Controls — row 1: three segmented controls (model | type | platform); row 2: full-width size */}
          <div className="flex flex-col gap-[24px] w-full">
            <div className="flex flex-col lg:flex-row gap-[24px] w-full">
              <div className="flex-1 flex flex-col gap-[12px]">
                <p className="sr-only lg:not-sr-only lg:static font-['Inter:Regular',sans-serif] font-normal text-[#9da2b4] text-[13px]" id="model-group-label">1. Pick your model</p>
                <div className="flex flex-1 rounded-[10px]" role="group" aria-labelledby="model-group-label" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  {(["1-Step", "2-Step", "Instant"] as StepId[]).map((id, i, arr) => {
                    const active = id === step;
                    const prevActive = i > 0 && arr[i - 1] === step;
                    return (
                      <button
                        key={id}
                        onClick={() => handleStepChange(id)}
                        aria-pressed={active}
                        className="relative flex-1 flex flex-col items-center justify-center gap-[3px] py-[10px] cursor-pointer rounded-[10px] transition-[transform,translate] duration-200 hover:scale-[1.02] active:scale-[0.96]"
                        style={{
                          translate: active ? "0 -3px" : "0 0",
                          ...(i > 0 && !active && !prevActive ? { borderLeft: "1px solid rgba(255,255,255,0.1)" } : {}),
                        }}
                      >
                        {active && (
                          <motion.div
                            layoutId="pricing-model-pill"
                            className="absolute inset-0 rounded-[10px]"
                            style={PILL_CTA_GRADIENT_STYLE}
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            transition={{ layout: { type: "spring", stiffness: 500, damping: 35 } }}
                          />
                        )}
                        <span className="relative z-[1] flex items-center gap-[8px]">
                          <span style={{ color: active ? "#ffffff" : "#9da2b4" }}><SelectorIcon kind={STEP_ICONS[id]} /></span>
                          <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px]" style={{ color: active ? "#eef0f6" : "#9da2b4" }}>{STEP_DISPLAY_LABELS[id]}</span>
                        </span>
                        <span
                          className="relative z-[1] font-['Inter:Regular',sans-serif] font-normal text-[11px] leading-[13px] whitespace-nowrap"
                          style={{ color: active ? "rgba(255,255,255,0.78)" : "rgba(157,162,180,0.75)" }}
                        >
                          {STEP_BENEFIT_LABELS[id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.div
                className="hidden lg:block w-px"
                style={{ background: "linear-gradient(180deg, transparent 0%, rgba(96,165,250,0.35) 50%, transparent 100%)" }}
                animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />

              <div className="flex-1 flex flex-col gap-[12px]">
                <p className="sr-only lg:not-sr-only lg:static font-['Inter:Regular',sans-serif] font-normal text-[#9da2b4] text-[13px]" id="type-group-label">2. Choose your type</p>
                <div className="flex flex-1 items-stretch gap-[8px]">
                  <div className="flex flex-1 rounded-[10px]" role="group" aria-labelledby="type-group-label" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    {STEP_PLANS[step].map((opt, i, arr) => {
                      const active = opt.id === plan;
                      const prevActive = i > 0 && arr[i - 1].id === plan;
                      const flag = planFlag(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setPlan(opt.id)}
                          aria-pressed={active}
                          className="relative flex-1 flex flex-col items-center justify-center gap-[2px] py-[10px] cursor-pointer rounded-[10px] transition-[transform,translate] duration-200 hover:scale-[1.02] active:scale-[0.96]"
                          style={{
                            color: active ? "#ffffff" : "#9da2b4",
                            translate: active ? "0 -3px" : "0 0",
                            ...(i > 0 && !active && !prevActive ? { borderLeft: "1px solid rgba(255,255,255,0.1)" } : {}),
                          }}
                        >
                          {active && (
                            <motion.div
                              layoutId="pricing-type-pill"
                              className="absolute inset-0 rounded-[10px]"
                              style={PILL_CTA_GRADIENT_STYLE}
                              initial={{ scale: 0.85 }}
                              animate={{ scale: 1 }}
                              transition={{ layout: { type: "spring", stiffness: 500, damping: 35 } }}
                            />
                          )}
                          <span className="relative z-[1] flex items-center gap-[8px]">
                            <SelectorIcon kind={PLAN_ICONS[opt.id]} />
                            <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px]">{opt.label}</span>
                          </span>
                          {flag && (
                            <span
                              className="relative z-[1] font-['Inter:Bold',sans-serif] font-bold text-[10px] leading-[12px] tracking-[0.4px] uppercase whitespace-nowrap px-[6px] py-[2px] rounded-full"
                              style={{ color: "#22c55e", background: "rgba(34,197,94,0.12)" }}
                            >
                              {flag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <PlanCompareShortcut step={step} />
                </div>
              </div>

              <motion.div
                className="hidden lg:block w-px"
                style={{ background: "linear-gradient(180deg, transparent 0%, rgba(96,165,250,0.35) 50%, transparent 100%)" }}
                animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />

              <div className="flex-1 flex flex-col gap-[12px]">
                <p className="sr-only lg:not-sr-only lg:static font-['Inter:Regular',sans-serif] font-normal text-[#9da2b4] text-[13px]" id="platform-group-label">3. Choose your platform</p>
                <div className="flex flex-1 rounded-[10px]" role="group" aria-labelledby="platform-group-label" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  {PLATFORM_OPTIONS.map((opt, i, arr) => {
                    const active = opt.id === platform;
                    const prevActive = i > 0 && arr[i - 1].id === platform;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPlatform(opt.id)}
                        aria-pressed={active}
                        className="relative flex-1 flex items-center justify-center gap-[8px] py-[12px] cursor-pointer rounded-[10px] transition-[transform,translate] duration-200 hover:scale-[1.02] active:scale-[0.96]"
                        style={{
                          translate: active ? "0 -3px" : "0 0",
                          ...(i > 0 && !active && !prevActive ? { borderLeft: "1px solid rgba(255,255,255,0.1)" } : {}),
                        }}
                      >
                        {active && (
                          <motion.div
                            layoutId="pricing-platform-pill"
                            className="absolute inset-0 rounded-[10px]"
                            style={PILL_CTA_GRADIENT_STYLE}
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            transition={{ layout: { type: "spring", stiffness: 500, damping: 35 } }}
                          />
                        )}
                        <img
                          src={PLATFORM_LOGOS[opt.id]}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="relative z-[1] w-auto object-contain"
                          style={{ height: PLATFORM_LOGO_HEIGHT[opt.id] }}
                        />
                        <span className="relative z-[1] font-['Inter:Medium',sans-serif] font-medium text-[14px]" style={{ color: active ? "#eef0f6" : "#9da2b4" }}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[12px] w-full">
              <p className="sr-only lg:not-sr-only lg:static font-['Inter:Regular',sans-serif] font-normal text-[#9da2b4] text-[13px]" id="size-group-label">4. Pick your account size</p>
              <div className="flex gap-[10px] w-full" role="group" aria-labelledby="size-group-label">
                {STEP_SIZES[step].map((value) => {
                  const active = value === size;
                  return (
                    <button
                      key={value}
                      onClick={() => setSize(value)}
                      aria-pressed={active}
                      className="relative flex-1 flex items-center justify-center py-[12px] rounded-[10px] cursor-pointer transition-[transform,translate] duration-200 hover:scale-[1.02] active:scale-[0.96]"
                      style={{ translate: active ? "0 -3px" : "0 0" }}
                    >
                      {active ? (
                        <motion.div
                          layoutId="pricing-size-pill"
                          className="absolute inset-0 rounded-[10px]"
                          style={PILL_CTA_GRADIENT_STYLE}
                          initial={{ scale: 0.85 }}
                          animate={{ scale: 1 }}
                          transition={{ layout: { type: "spring", stiffness: 500, damping: 35 } }}
                        />
                      ) : (
                        <div aria-hidden className="absolute inset-0 rounded-[10px] pointer-events-none" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                      )}
                      <p
                        className={`relative z-[1] font-['Inter:${active ? "Medium" : "Regular"}',sans-serif] font-${active ? "medium" : "normal"} text-[14px] whitespace-nowrap`}
                        style={{ color: active ? "#ffffff" : "#9da2b4" }}
                      >
                        {fmtSize(value)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results panel — 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] w-full">
            {/* Your Selection */}
            <PricingFlashContext.Provider value={{ changeTick, celebrated }}>
            <PanelCard className="flex">
              <div className="flex items-center gap-[12px]">
                <div className="flex items-center justify-center rounded-[12px] size-[44px] shrink-0" style={{ background: "#EEF5FF", color: "#2563EB" }}>
                  <PanelIcon kind="person" />
                </div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#111827] text-[14px]">Your Selection</p>
              </div>
              <div className="flex flex-col">
                {[
                  ["lightning-box" as const, "Model", STEP_DISPLAY_LABELS[step]],
                  ["shield" as const, "Type", planLabel],
                  ["grid" as const, "Platform", platformLabel],
                  ["bars" as const, "Size", sizeLabel],
                ].map(([icon, k, v]) => (
                  <div key={k} className="flex items-center justify-between py-[10px]" style={{ borderBottom: "1px solid #E8EDF5" }}>
                    <span className="flex items-center gap-[8px] text-[#2563EB]"><PanelIcon kind={icon} /><span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#6B7280]">{k}</span></span>
                    <span className="relative inline-grid overflow-hidden">
                      <motion.span
                        key={v}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="font-['Inter:Medium',sans-serif] font-medium text-[#111827] text-[14px] [grid-area:1/1]"
                      >
                        {v}
                      </motion.span>
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="flex flex-col gap-[20px]"
                style={{
                  border: "2px solid rgba(59,130,246,0.55)",
                  borderRadius: "18px",
                  background: "transparent",
                  boxShadow: "0 0 28px rgba(59,130,246,0.22)",
                  padding: "24px",
                }}
              >
              <div className="flex flex-col items-center text-center gap-[4px] mt-[4px]">
                {/* Fee cadence label:
                    - Instant → Prime → $10K/$25K/$50K/$100K → "Monthly"
                    - Instant → Prime → $5K, Instant → Plus, 1-Step/2-Step → "One-time fee" */}
                {step === "Instant" && plan === "prime" && size !== 5000 ? (
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6B7280] text-[12px]">Monthly</p>
                ) : (
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6B7280] text-[12px]">One-time fee</p>
                )}
                {entry.priceOld > entry.priceNew && (
                  <motion.p
                    key={entry.priceOld}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="font-['Inter:Regular',sans-serif] font-normal text-[#9CA3AF] text-[14px] line-through"
                  >${entry.priceOld.toFixed(2)}</motion.p>
                )}
                <motion.p
                  ref={priceRef}
                  initial={{ opacity: 0, y: -10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className="font-['DM_Sans',sans-serif] font-bold text-[#2563EB] text-[44px] leading-[1.1] tracking-[-0.8px]"
                >${entry.priceNew.toFixed(2)}</motion.p>
                <p className="m-0 font-['Inter:Medium',sans-serif] text-[11px] font-medium leading-[15px] text-[#7EB6FF]">
                  {CHECKOUT_COUPON_CODE} Coupon Auto applied
                </p>
              </div>

              <div
                className="relative self-center w-full max-w-[280px] overflow-hidden rounded-[16px]"
                style={{
                  border: "1px solid rgba(37,99,235,0.16)",
                  background: "#F8FAFF",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset",
                }}
              >
                {!reduceMotion && animsActive && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-25"
                    style={{
                      background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.45) 45%, rgba(90,155,255,0.15) 50%, rgba(255,255,255,0.45) 55%, transparent 100%)",
                      animation: "fyt-alt-promo-sheen 7s ease-in-out infinite",
                    }}
                  />
                )}

                <div className="relative z-[1] flex flex-col items-center gap-[6px] px-[14px] py-[12px] text-center">
                  <span
                    className="inline-flex items-center rounded-full px-[8px] py-[2px] font-['Inter:Semi_Bold',sans-serif] text-[10px] font-semibold uppercase tracking-[0.06em] text-[#2563EB]"
                    style={{ background: "rgba(37,99,235,0.10)" }}
                  >
                    {ALT_PROMO_LABEL}
                  </span>
                  <p className="m-0 font-['DM_Sans',sans-serif] text-[15px] font-bold leading-[20px] tracking-[-0.2px] text-[#111827]">
                    {ALT_PROMO_DEAL}
                  </p>
                  <p className="m-0 flex items-center gap-[6px] font-['Inter:Medium',sans-serif] text-[12px] font-medium leading-none text-[#6B7280]">
                    Use Code
                    <span className="inline-flex items-center rounded-full bg-[#0B1220] px-[8px] py-[4px] font-['Inter:Bold',sans-serif] text-[11px] font-bold tracking-[0.05em] text-white">
                      {ALT_PROMO_CODE}
                    </span>
                  </p>
                </div>
              </div>
              <motion.div
                ref={checkoutMagnet.ref}
                onMouseMove={checkoutMagnet.onMouseMove}
                onMouseLeave={checkoutMagnet.onMouseLeave}
                style={checkoutMagnet.style}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="group relative w-full rounded-[16px]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[16px] pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(140px circle at 50% 0%, rgba(255,255,255,0.4), transparent 70%)" }}
                />
                <a
                  href={checkoutUrl(entry.productId)}
                  onClick={() =>
                    pushViewItem({
                      itemId: entry.productId,
                      itemName: `${STEP_DISPLAY_LABELS[step]} ${planLabel} · ${platformLabel} · ${sizeLabel}`,
                      price: entry.priceNew,
                    })
                  }
                  className="rounded-[16px] shrink-0 w-full block no-underline relative overflow-hidden h-[58px]"
                  style={{ background: "linear-gradient(180deg, #5A9BFF 0%, #2563EB 100%)", boxShadow: "0 8px 28px -6px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.35)" }}
                >
                  {!reduceMotion && animsActive && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.18), transparent, rgba(96,165,250,0.25), transparent)",
                        backgroundSize: "300% 300%",
                      }}
                      animate={pricingCtaGradientPosition}
                      transition={{ duration: PRICING_CTA_GRADIENT_DURATION_S, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {celebrated && !reduceMotion && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      initial={{ boxShadow: "0 0 0px rgba(59,130,246,0)" }}
                      animate={pricingCompletionCtaGlow}
                      transition={{ duration: PRICING_COMPLETION_CTA_GLOW_DURATION_S, delay: PRICING_COMPLETION_CTA_GLOW_DELAY_S, ease: "easeOut" }}
                    />
                  )}
                  <div className="relative flex items-center justify-center gap-[8px] h-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white">Start Challenge</p>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-[6px]"
                    >
                      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              </motion.div>
              <p className="flex items-center justify-center gap-[6px] font-['Inter:Regular',sans-serif] font-normal text-[#6B7280] text-[12px]">
                <PanelIcon kind="shield" /> Secure checkout · Instant access
              </p>
              </div>
            </PanelCard>
            </PricingFlashContext.Provider>

            {/* Key Rules — tablet/desktop only (>=640px); merged into the mobile chip switcher below */}
            <PricingFlashContext.Provider value={{ changeTick, celebrated }}>
            <PanelCard className="hidden sm:flex">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-[12px]">
                  <span className="flex items-center justify-center rounded-[12px] size-[44px] shrink-0" style={{ background: "#EEF5FF", color: "#2563EB" }}><PanelIcon kind="shield-check" /></span>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#111827] text-[14px]">Key Rules</p>
                </span>
                <span className="text-[#2563EB]"><PanelIcon kind="info" /></span>
              </div>
              <KeyRulesRows stats={stats} />
              <p className="flex items-center gap-[6px] font-['Inter:Regular',sans-serif] font-normal text-[#6B7280] text-[12px] mt-[4px]">
                <PanelIcon kind="shield-check" /> Designed for consistency. Built for growth.
              </p>
            </PanelCard>
            </PricingFlashContext.Provider>

            {/* Why traders choose this — tablet/desktop only (>=640px); merged into the mobile chip switcher below */}
            <PricingFlashContext.Provider value={{ changeTick, celebrated }}>
            <PanelCard className="hidden sm:flex">
              <div className="flex items-center gap-[12px]">
                <span className="flex items-center justify-center rounded-[12px] size-[44px] shrink-0" style={{ background: "#EEF5FF", color: "#2563EB" }}><PanelIcon kind="star" /></span>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#111827] text-[14px]">Why traders choose this</p>
              </div>
              <WhyChoiceBullets bullets={traderChoiceBullets} />
            </PanelCard>
            </PricingFlashContext.Provider>

            {/* Key Rules / Why traders choose this — mobile only (<640px), merged behind a chip switcher */}
            <PricingFlashContext.Provider value={{ changeTick, celebrated }}>
            <PanelCard className="flex sm:hidden">
              <div className="flex rounded-[10px]" role="group" aria-label="Show Key Rules or Why traders choose this" style={{ border: "1px solid #E8EDF5" }}>
                {MOBILE_PANEL_TABS.map((opt, i, arr) => {
                  const active = opt.id === mobilePanelTab;
                  const prevActive = i > 0 && arr[i - 1].id === mobilePanelTab;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setMobilePanelTab(opt.id)}
                      aria-pressed={active}
                      className="relative flex-1 flex items-center justify-center py-[12px] px-[8px] cursor-pointer rounded-[10px] text-center transition-[transform,translate] duration-200 hover:scale-[1.02] active:scale-[0.96]"
                      style={{
                        translate: active ? "0 -3px" : "0 0",
                        ...(i > 0 && !active && !prevActive ? { borderLeft: "1px solid rgba(255,255,255,0.1)" } : {}),
                      }}
                    >
                      {active && (
                        <motion.div
                          layoutId="pricing-mobile-tab-pill"
                          className="absolute inset-0 rounded-[10px]"
                          style={PILL_CTA_GRADIENT_STYLE}
                          initial={{ scale: 0.85 }}
                          animate={{ scale: 1 }}
                          transition={{ layout: { type: "spring", stiffness: 500, damping: 35 } }}
                        />
                      )}
                      <span className="relative z-[1] font-['Inter:Medium',sans-serif] font-medium text-[14px]" style={{ color: active ? "#eef0f6" : "#9da2b4" }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {mobilePanelTab === "rules" ? (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-[16px]"
                  >
                    <KeyRulesRows stats={stats} />
                    <p className="flex items-center gap-[6px] font-['Inter:Regular',sans-serif] font-normal text-[#6B7280] text-[12px] mt-[4px]">
                      <PanelIcon kind="shield-check" /> Designed for consistency. Built for growth.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="why"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WhyChoiceBullets bullets={traderChoiceBullets} />
                  </motion.div>
                )}
              </AnimatePresence>
            </PanelCard>
            </PricingFlashContext.Provider>
          </div>

          <PaymentOptions />
        </div>
      </div>
      <VideoLightbox source={showExplainerVideo ? pricingExplainerVideoSource() : null} onClose={closeExplainerVideo} />
    </div>
  );
}


function PaymentBadgeShell({ children, index, reduceMotion }: { children: ReactNode; index: number; reduceMotion: boolean | null }) {
  return (
    <motion.div
      className="shrink-0"
      animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
      transition={reduceMotion ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
    >
      {children}
    </motion.div>
  );
}

function VisaBadge() {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-[10px] h-[44px] px-[16px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
    >
      <span className="font-['DM_Sans',sans-serif] font-bold italic text-[#1434CB] text-[16px] tracking-[-0.3px]">VISA</span>
    </motion.div>
  );
}

function MastercardBadge() {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-[10px] h-[44px] w-[64px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
    >
      <div className="relative w-[34px] h-[20px]">
        <div className="absolute left-0 top-0 size-[20px] rounded-full bg-[#EB001B]" />
        <div className="absolute right-0 top-0 size-[20px] rounded-full bg-[#F79E1B] mix-blend-multiply" />
      </div>
    </motion.div>
  );
}

function CryptoIcon({ bg, children, label }: { bg: string; children: ReactNode; label: string }) {
  return (
    <motion.div
      aria-label={label}
      whileHover={{ y: -3, scale: 1.08 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="size-[28px] lg:size-[30px] rounded-full flex items-center justify-center shrink-0 ring-2 ring-white"
      style={{ background: bg }}
    >
      {children}
    </motion.div>
  );
}

function CryptoCluster() {
  return (
    <div className="bg-white rounded-full h-[44px] px-[10px] flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
      <div className="flex items-center -space-x-[6px]">
        <CryptoIcon bg="#0A0A0A" label="Bitcoin">
          <span className="font-['DM_Sans',sans-serif] font-bold text-[#F7931A] text-[13px]">₿</span>
        </CryptoIcon>
        <CryptoIcon bg="#26A17B" label="USDT">
          <span className="font-['DM_Sans',sans-serif] font-bold text-white text-[12px]">₮</span>
        </CryptoIcon>
        <CryptoIcon bg="#627EEA" label="Ethereum">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0.5 1.2 6.3 6 8.8l4.8-2.5L6 0.5Z" fill="#fff" fillOpacity="0.85" />
            <path d="M6 9.6 1.2 6.9 6 11.5l4.8-4.6L6 9.6Z" fill="#fff" />
          </svg>
        </CryptoIcon>
        <CryptoIcon bg="#1F72B8" label="American Express">
          <span className="font-['DM_Sans',sans-serif] font-bold text-white text-[7px] tracking-[-0.2px]">AMEX</span>
        </CryptoIcon>
      </div>
    </div>
  );
}

function PaymentMoreButton() {
  return (
    <motion.button
      type="button"
      aria-label="More payment options"
      whileHover={{ y: -3, scale: 1.08 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="size-[36px] rounded-full bg-[#2A2E3A] hover:bg-[#353A48] flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer border-0"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1v12M1 7h12" stroke="#9da2b4" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

function PaymentOptions() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animsActive, setAnimsActive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setAnimsActive(!!entries[0]?.isIntersecting),
      { rootMargin: "600px 0px 600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-fit max-w-full mx-auto rounded-[20px] overflow-hidden flex flex-col lg:flex-row gap-[18px] lg:gap-[32px] items-center justify-center lg:justify-start px-[24px] py-[22px] lg:px-[40px] lg:py-[26px]"
      style={{
        background: "linear-gradient(90deg, #14171F 0%, #0F1117 100%)",
        boxShadow: "inset 0px 1px 8px rgba(59,130,246,0.05)",
      }}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(59,130,246,0.15)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      {!reduceMotion && animsActive && <LightSweep />}
      <p className="relative z-[1] font-['DM_Sans',sans-serif] font-medium text-[#eef0f6] text-[18px] lg:text-[20px] shrink-0">Payment Options:</p>
      <div className="relative z-[1] flex flex-wrap justify-center lg:justify-start items-center gap-[12px]">
        <PaymentBadgeShell index={0} reduceMotion={reduceMotion || !animsActive}>
          <VisaBadge />
        </PaymentBadgeShell>
        <PaymentBadgeShell index={1} reduceMotion={reduceMotion || !animsActive}>
          <MastercardBadge />
        </PaymentBadgeShell>
        <PaymentBadgeShell index={2} reduceMotion={reduceMotion || !animsActive}>
          <CryptoCluster />
        </PaymentBadgeShell>
        <PaymentBadgeShell index={3} reduceMotion={reduceMotion || !animsActive}>
          <PaymentMoreButton />
        </PaymentBadgeShell>
      </div>
    </motion.div>
  );
}


const HOW_IT_WORKS_STEPS = [
  { n: 1, label: "Choose", desc: "Select the evaluation and account size that fits your style.", icon: "person" },
  { n: 2, label: "Trade", desc: "Reach the target while respecting clear, transparent account rules.", icon: "candles" },
  { n: 3, label: "Get Your Account", desc: "Complete verification and receive your master account.", icon: "shield-check" },
  { n: 4, label: "Reward", desc: "Request your reward from the dashboard and track its status.", icon: "gift" },
] as const;

function HowItWorksIcon({ kind }: { kind: (typeof HOW_IT_WORKS_STEPS)[number]["icon"] }) {
  const common = { width: 22, height: 22, viewBox: "0 0 22 22", fill: "none" } as const;
  const s = "#2563EB";
  if (kind === "person") return <svg {...common}><circle cx="11" cy="7.5" r="3.2" stroke={s} strokeWidth="2" /><path d="M4 18c0-3 3-5.2 7-5.2s7 2.2 7 5.2" stroke={s} strokeWidth="2" strokeLinecap="round" /></svg>;
  if (kind === "candles") return <svg {...common}><path d="M7 4v3M7 11v7M15 4v9M15 17v1" stroke={s} strokeWidth="2" strokeLinecap="round" /><rect x="5" y="7" width="4" height="4" rx="0.5" stroke={s} strokeWidth="2" /><rect x="13" y="9" width="4" height="8" rx="0.5" stroke={s} strokeWidth="2" /></svg>;
  if (kind === "shield-check") return <svg {...common}><path d="M11 3l7 2.5v5.5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V5.5L11 3Z" stroke={s} strokeWidth="2" strokeLinejoin="round" /><path d="M7.5 11l2.3 2.3L14.5 8.5" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return <svg {...common}><rect x="4" y="9" width="14" height="9" rx="1" stroke={s} strokeWidth="2" /><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10v4H4.5A1.5 1.5 0 0 1 3 7.5v-1Z" stroke={s} strokeWidth="2" strokeLinejoin="round" /><path d="M19 6.5A1.5 1.5 0 0 0 17.5 5H12v4h5.5A1.5 1.5 0 0 0 19 7.5v-1Z" stroke={s} strokeWidth="2" strokeLinejoin="round" /><path d="M11 5v13" stroke={s} strokeWidth="2" /></svg>;
}

function HowItWorksHeading({ size, subtextSize }: { size: string; subtextSize: string }) {
  return (
    <div className="flex flex-col gap-[12px] items-center text-center">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#60a5fa] text-[12px] tracking-[2.64px]">[ PROCESS ]</p>
      <h2 className={`font-['DM_Sans',sans-serif] font-medium text-[#eef0f6] ${size} leading-[1.1] tracking-[-0.02em]`}>How It Works</h2>
      <p className={`font-['Inter:Regular',sans-serif] font-normal text-[#9da2b4] ${subtextSize} max-w-[520px]`}>From choosing your account to receiving your reward, every step is clear.</p>
    </div>
  );
}

function HowItWorksCta() {
  return (
    <a
      href="#challenge"
      onClick={() => pauseHeavyScenesForNav()}
      className="cta-shine flex items-center gap-[10px] px-[32px] py-[16px] rounded-[999px] shrink-0 no-underline"
      style={PILL_CTA_GRADIENT_STYLE}
    >
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-white whitespace-nowrap">Explore the FYT process</p>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </a>
  );
}

const ringBorderCss = (alpha: number) => `1px solid rgba(${HOW_IT_WORKS_RING_RGB},${alpha})`;
const ringGlowCss = (alpha: number) => `0 0 10px rgba(${HOW_IT_WORKS_RING_RGB},${alpha})`;
const dotBgCss = (alpha: number) => `rgba(${HOW_IT_WORKS_DOT_RGB},${alpha})`;
const dotGlowCss = (alpha: number) => `0 0 6px rgba(255,255,255,${alpha})`;
const numberColorCss = (alpha: number) => `rgba(${HOW_IT_WORKS_NUMBER_RGB},${alpha})`;

function HowItWorksStepReveal({
  step,
  reveal,
  progress,
  reduceMotion,
}: {
  step: (typeof HOW_IT_WORKS_STEPS)[number];
  reveal: StepReveal;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const ringBorderAlpha = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_RING_BORDER_ALPHA.dim, HOW_IT_WORKS_RING_BORDER_ALPHA.peak]);
  const ringGlowAlpha = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_RING_GLOW_ALPHA.dim, HOW_IT_WORKS_RING_GLOW_ALPHA.peak]);
  const dotBgAlpha = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_DOT_BG_ALPHA.dim, HOW_IT_WORKS_DOT_BG_ALPHA.peak]);
  const dotGlowAlpha = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_DOT_GLOW_ALPHA.dim, HOW_IT_WORKS_DOT_GLOW_ALPHA.peak]);
  const numberAlpha = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_NUMBER_ALPHA.dim, HOW_IT_WORKS_NUMBER_ALPHA.peak]);
  const iconBorderAlpha = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_ICON_BORDER_ALPHA.dim, HOW_IT_WORKS_ICON_BORDER_ALPHA.peak]);
  const labelColor = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_LABEL_DIM_HEX, HOW_IT_WORKS_LABEL_PEAK_HEX]);
  const descColor = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [HOW_IT_WORKS_DESC_DIM_HEX, HOW_IT_WORKS_DESC_PEAK_HEX]);

  const ringBorder = useMotionTemplate`1px solid rgba(${HOW_IT_WORKS_RING_RGB},${ringBorderAlpha})`;
  const ringGlow = useMotionTemplate`0 0 10px rgba(${HOW_IT_WORKS_RING_RGB},${ringGlowAlpha})`;
  const dotBackground = useMotionTemplate`rgba(${HOW_IT_WORKS_DOT_RGB},${dotBgAlpha})`;
  const dotGlow = useMotionTemplate`0 0 6px rgba(255,255,255,${dotGlowAlpha})`;
  const numberColor = useMotionTemplate`rgba(${HOW_IT_WORKS_NUMBER_RGB},${numberAlpha})`;
  const iconBorder = useMotionTemplate`1px solid rgba(${HOW_IT_WORKS_RING_RGB},${iconBorderAlpha})`;

  const ringStyle = reduceMotion
    ? { border: ringBorderCss(HOW_IT_WORKS_RING_BORDER_ALPHA.peak), boxShadow: ringGlowCss(HOW_IT_WORKS_RING_GLOW_ALPHA.peak) }
    : { border: ringBorder, boxShadow: ringGlow };
  const dotStyle = reduceMotion
    ? { background: dotBgCss(HOW_IT_WORKS_DOT_BG_ALPHA.peak), boxShadow: dotGlowCss(HOW_IT_WORKS_DOT_GLOW_ALPHA.peak) }
    : { background: dotBackground, boxShadow: dotGlow };
  const numberStyle = reduceMotion ? { color: numberColorCss(HOW_IT_WORKS_NUMBER_ALPHA.peak) } : { color: numberColor };
  const iconCircleStyle = reduceMotion
    ? { border: ringBorderCss(HOW_IT_WORKS_ICON_BORDER_ALPHA.peak), background: "#FFFFFF", boxShadow: "inset 0 2px 4px rgba(15,23,42,0.08)" }
    : { border: iconBorder, background: "#FFFFFF", boxShadow: "inset 0 2px 4px rgba(15,23,42,0.08)" };
  const labelStyle = reduceMotion ? { color: HOW_IT_WORKS_LABEL_PEAK_HEX } : { color: labelColor };
  const descStyle = reduceMotion ? { color: HOW_IT_WORKS_DESC_PEAK_HEX } : { color: descColor };

  return (
    <div className="flex flex-col items-center gap-[10px] text-center">
      <motion.div className="flex items-center justify-center rounded-full size-[36px] shrink-0" style={ringStyle}>
        <motion.div className="rounded-full size-[10px]" style={dotStyle} />
      </motion.div>
      <motion.p className="font-['DM_Sans',sans-serif] font-medium text-[13px]" style={numberStyle}>
        {String(step.n).padStart(2, "0")}
      </motion.p>
      <motion.p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[22px]" style={labelStyle}>
        {step.label}
      </motion.p>
      <motion.div className="flex items-center justify-center rounded-full size-[56px] shrink-0 mt-[6px]" style={iconCircleStyle}>
        <HowItWorksIcon kind={step.icon} />
      </motion.div>
      <motion.p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] leading-[1.5] mt-[6px]" style={descStyle}>
        {step.desc}
      </motion.p>
    </div>
  );
}

function HowItWorks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const reduceMotion = useReducedMotion();
  const lineScale = useTransform(scrollYProgress, [HOW_IT_WORKS_LINE_REVEAL.fadeStart, HOW_IT_WORKS_LINE_REVEAL.fadeEnd], [0, 1]);

  const mobileGridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mobileSpotlightProgress } = useScroll({ target: mobileGridRef, offset: ["start 0.85", "end 0.15"] });
  const [mobileActiveIndex, setMobileActiveIndex] = useState(-1);
  useMotionValueEvent(mobileSpotlightProgress, "change", (v) => {
    if (reduceMotion) return;
    const idx = Math.min(HOW_IT_WORKS_STEPS.length - 1, Math.max(0, Math.floor(v * HOW_IT_WORKS_STEPS.length)));
    setMobileActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  return (
    <div id="how-it-works" className="bg-[#070810] relative shrink-0 w-full scroll-mt-[132px] lg:scroll-mt-[136px]">
      <div className="flex flex-col gap-[40px] lg:gap-[56px] items-center px-[20px] py-[56px] lg:px-[80px] lg:py-[96px] w-full max-w-[1280px] mx-auto">
        <div ref={scrollRef} className="hidden lg:block relative w-full" style={{ height: `${HOW_IT_WORKS_SCROLL_HEIGHT_VH}vh` }}>
          <div className="sticky top-0 h-screen flex flex-col items-center justify-start pt-[140px] gap-[56px]">
            <HowItWorksHeading size="text-[44px]" subtextSize="text-[16px]" />
            <div className="relative w-full">
              <div className="absolute top-[18px] left-[6%] right-[6%] h-px" aria-hidden>
                <motion.div
                  className="h-full w-full origin-left"
                  style={{
                    scaleX: reduceMotion ? 1 : lineScale,
                    background: `rgba(${HOW_IT_WORKS_RING_RGB},1)`,
                    boxShadow: HOW_IT_WORKS_LINE_GLOW,
                  }}
                />
              </div>
              <div className="grid grid-cols-4 gap-[24px] w-full relative">
                {HOW_IT_WORKS_STEPS.map((s, i) => (
                  <HowItWorksStepReveal key={s.label} step={s} reveal={HOW_IT_WORKS_STEP_REVEALS[i]} progress={scrollYProgress} reduceMotion={reduceMotion} />
                ))}
              </div>
            </div>
            <HowItWorksCta />
          </div>
        </div>

        <div className="flex lg:hidden flex-col gap-[40px] items-center w-full">
          <HowItWorksHeading size="text-[28px]" subtextSize="text-[14px]" />
          <div ref={mobileGridRef} className="grid grid-cols-2 gap-[32px] w-full">
            {HOW_IT_WORKS_STEPS.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col items-center gap-[10px] text-center rounded-[16px]"
                variants={HOW_IT_WORKS_MOBILE_SPOTLIGHT_CARD}
                initial="rest"
                animate={mobileActiveIndex === i ? "active" : "rest"}
                transition={{ duration: HOW_IT_WORKS_MOBILE_SPOTLIGHT_TRANSITION_S, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-['DM_Sans',sans-serif] font-medium text-[#60a5fa] text-[13px]">{String(s.n).padStart(2, "0")}</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#eef0f6] text-[20px]">{s.label}</p>
                <motion.div
                  className="flex items-center justify-center rounded-full size-[56px] shrink-0 mt-[6px]"
                  style={{ border: "1px solid rgba(59,130,246,0.4)" }}
                  variants={HOW_IT_WORKS_MOBILE_SPOTLIGHT_ICON}
                  initial="rest"
                  animate={mobileActiveIndex === i ? "active" : "rest"}
                  transition={{ duration: HOW_IT_WORKS_MOBILE_SPOTLIGHT_TRANSITION_S, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HowItWorksIcon kind={s.icon} />
                </motion.div>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[#8a90a3] text-[13px] leading-[1.5] mt-[6px]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <HowItWorksCta />
        </div>
      </div>
    </div>
  );
}


function TrustIndexBadge({ rating }: { rating: number }) {
  return (
    <div className="flex flex-wrap gap-[6px] items-center">
      <span className="flex items-center justify-center shrink-0" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="#1e3a8a" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M5.5 8l1.8 1.8L10.8 6" stroke="#1e3a8a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#1f2430] text-[12px] whitespace-nowrap">Trust Index</span>
      <span className="flex gap-[2px] items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 16 16" fill="none">
            <rect width="16" height="16" rx="3" fill={i < rating ? "#16A34A" : "#D1D5DB"} />
            {i < rating && <path d="M8 3.2l1.4 2.9 3.2.5-2.3 2.2.5 3.2L8 10.5l-2.8 1.5.5-3.2-2.3-2.2 3.2-.5L8 3.2Z" fill="#fff" />}
          </svg>
        ))}
      </span>
      <span className="font-['Inter:Regular',sans-serif] font-normal text-[#5f6478] text-[12px]">{rating}/5</span>
    </div>
  );
}

function ReviewCard({ initials, name, color, rating, title, quote }: { initials: string; name: string; color: string; rating: number; title: string; quote: string }) {
  return (
    <div
      className="group bg-white flex-[1_0_0] h-full min-w-px relative rounded-[16px] transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-[6px] hover:scale-[1.02] hover:shadow-[0_20px_45px_-10px_rgba(59,130,246,0.35)]"
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[16px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(59,130,246,0.45)" }}
      />
      <div className="content-stretch flex flex-col items-start justify-between gap-[16px] pb-[28px] pt-[28px] px-[28px] relative size-full">
        <TrustIndexBadge rating={rating} />
        <div className="flex flex-col gap-[8px]">
          <p className="font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] text-[17px] leading-[1.3]">{title}</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.6] text-[#5f6478] text-[14px]">{quote}</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="bg-[rgba(0,0,0,0.06)] h-px relative shrink-0 w-full" />
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[40px]" style={{ background: color }}>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white">{initials}</p>
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0b0c11] text-[14px]">{name}</p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[#8a90a3] text-[12px]">Funded Trader</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbnailOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" opacity="0.45">
      <path d="M3 3l18 18M8.5 5H18a2 2 0 0 1 2 2v9.5M4 8.5V17a2 2 0 0 0 2 2h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function VideoCard({ src, name, onPlay }: { src: string; name: string; onPlay: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const triedOnceRef = useRef(false);

  function handleError() {
    if (!triedOnceRef.current) {
      triedOnceRef.current = true;
      setAttempt((n) => n + 1);
      return;
    }
    if (import.meta.env.DEV) {
      console.error(`[VideoCard] Thumbnail failed to load after retry for "${name}": ${src}`);
    }
    setFailed(true);
  }

  const imgSrc = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play video testimonial from ${name}`}
      className="group flex flex-col w-full aspect-video items-center justify-center overflow-hidden relative rounded-[20px] border-0 p-0 bg-[#0a0f1c] cursor-pointer text-left shadow-[0_8px_24px_-8px_rgba(2,6,23,0.45)] transition-[transform,box-shadow] duration-[300ms] ease-out motion-reduce:transition-none hover:-translate-y-[4px] hover:scale-[1.02] hover:shadow-[0_22px_48px_-12px_rgba(59,130,246,0.4)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
    >
      {/* Premium border — soft blue at rest, brighter glow ring on hover. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[20px] pointer-events-none z-10"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] motion-reduce:transition-none z-10"
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(59,130,246,0.65)" }}
      />
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center rounded-[20px]" style={{ background: "#0a0f1c" }}>
          <ThumbnailOffIcon />
        </div>
      ) : (
        <img
          alt={`${name}, FYT trader video testimonial`}
          className="absolute inset-0 size-full object-cover object-center pointer-events-none rounded-[20px] transition-[transform,filter] duration-[400ms] ease-out motion-reduce:transition-none group-hover:scale-[1.05] group-hover:brightness-[1.06]"
          src={imgSrc}
          loading="eager"
          fetchpriority="low"
          onError={handleError}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 45%)" }}
      />
      <div className="bg-[rgba(59,130,246,0.9)] flex items-center justify-center relative rounded-full shrink-0 size-[52px] lg:size-[56px] pointer-events-none transition-transform duration-[300ms] ease-out motion-reduce:transition-none group-hover:scale-[1.08]" style={{ boxShadow: "0 8px 24px -6px rgba(59,130,246,0.6)" }}>
        <div aria-hidden className="absolute border-2 border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-full" />
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className="relative ml-[3px]">
          <path d="M1 1.5L17 10L1 18.5V1.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        className="absolute bottom-[12px] left-[12px] flex flex-col gap-[4px] items-start px-[10px] py-[6px] rounded-[8px] pointer-events-none"
        style={{ background: "rgba(10,15,28,0.65)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-white whitespace-nowrap">{name}</p>
      </div>
    </button>
  );
}

function VideoLightbox({ source, onClose }: { source: VideoSource | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mouseDownOnBackdropRef = useRef(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [source]);

  useEffect(() => {
    if (!source) return;
    const previouslyFocusedElement = document.activeElement;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      (previouslyFocusedElement as HTMLElement | null)?.focus?.();
    };
  }, [source, onClose]);

  if (!source) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={source.title}
      onMouseDown={(e) => {
        mouseDownOnBackdropRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (mouseDownOnBackdropRef.current && e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-[80vw] h-[80vh] rounded-[16px] overflow-hidden bg-black">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-[12px] right-[12px] z-10 flex items-center justify-center rounded-full size-[40px] cursor-pointer border-0"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 1l14 14M15 1L1 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {source.kind === "mp4" ? (
          <>
            <video
              key={source.src}
              src={source.src}
              poster={source.poster}
              controls
              autoPlay
              onError={() => setVideoError(true)}
              className="size-full object-contain"
            />
            {videoError && (
              <div
                className="absolute inset-0 flex items-center justify-center text-white text-[14px]"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                Video unavailable
              </div>
            )}
          </>
        ) : (
          <iframe
            key={source.videoId}
            src={buildYouTubeEmbedUrl(source.videoId)}
            title={source.title}
            className="size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>,
    document.body,
  );
}

const TestimonialsRevealContext = createContext(false);

function TestimonialSlide({ item, onPlayVideo }: { item: TestimonialSlideItem; onPlayVideo: (video: TestimonialVideo) => void }) {
  if (item.kind === "review") {
    const r = item.review;
    return <ReviewCard initials={r.initials} name={r.name} color={r.color} rating={r.rating} title={r.title} quote={r.quote} />;
  }
  return <VideoCard src={item.video.posterUrl} name={item.video.name} onPlay={() => onPlayVideo(item.video)} />;
}

function TestimonialsDesktopCarousel({ onPlayVideo }: { onPlayVideo: (video: TestimonialVideo) => void }) {
  const prefersReducedMotion = useReducedMotion();
  const revealed = useContext(TestimonialsRevealContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const advance = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCenterIndex((i) => (i + dir + TOTAL_VIDEOS) % TOTAL_VIDEOS);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    let intervalId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !intervalId) {
          intervalId = window.setInterval(() => advance(1), 4000);
        } else if (!entry.isIntersecting && intervalId) {
          window.clearInterval(intervalId);
          intervalId = 0;
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion, advance]);

  const triplet = [-1, 0, 1].map((offset) => {
    const idx = (centerIndex + offset + TOTAL_VIDEOS) % TOTAL_VIDEOS;
    const role: CoverflowRole = offset === -1 ? "left" : offset === 0 ? "center" : "right";
    return { idx, role, item: VIDEO_ONLY_ITEMS[idx] };
  });

  return (
    <motion.div
      className="hidden lg:flex items-center gap-[12px] w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        aria-label="Previous testimonials"
        onClick={() => advance(-1)}
        className="flex items-center justify-center rounded-full size-[40px] shrink-0 cursor-pointer bg-white"
        style={{ border: "1px solid rgba(0,0,0,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div
        ref={containerRef}
        className="relative flex-1 h-[230px] lg:h-[264px] overflow-hidden"
        style={{ perspective: 1400 }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Trader testimonials"
      >
        <AnimatePresence initial={false} custom={direction}>
          {triplet.map(({ idx, role, item }) => (
            <motion.div
              key={idx}
              role="group"
              aria-roledescription="slide"
              custom={direction}
              variants={COVERFLOW_VARIANTS}
              initial="enter"
              animate={role}
              exit="exit"
              transition={prefersReducedMotion ? { duration: 0 } : COVERFLOW_TRANSITION}
              className="absolute"
              style={{ zIndex: role === "center" ? 3 : 2 }}
            >
              <TestimonialSlide item={item} onPlayVideo={onPlayVideo} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button
        type="button"
        aria-label="Next testimonials"
        onClick={() => advance(1)}
        className="flex items-center justify-center rounded-full size-[40px] shrink-0 cursor-pointer bg-white"
        style={{ border: "1px solid rgba(0,0,0,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </motion.div>
  );
}

function TestimonialsMobileCarousel({ onPlayVideo }: { onPlayVideo: (video: TestimonialVideo) => void }) {
  const prefersReducedMotion = useReducedMotion();
  const revealed = useContext(TestimonialsRevealContext);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    buildAutoplayPlugins(prefersReducedMotion, { delay: 4000, stopOnInteraction: false }),
  );
  return (
    <div className="lg:hidden w-full flex flex-col gap-[16px]">
      <div className="w-full overflow-hidden" ref={emblaRef} role="region" aria-roledescription="carousel" aria-label="Trader testimonials">
        <div className="flex">
          {VIDEO_ONLY_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              role="group"
              aria-roledescription="slide"
              className="flex-shrink-0 basis-full px-[2px] flex items-center"
              variants={TESTIMONIAL_MOBILE_CARD_REVEAL}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={revealed ? "show" : "hidden"}
            >
              <TestimonialSlide item={item} onPlayVideo={onPlayVideo} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-[16px]">
        <button
          type="button"
          aria-label="Previous testimonials"
          onClick={() => emblaApi?.scrollPrev()}
          className="flex items-center justify-center rounded-full size-[40px] shrink-0 cursor-pointer bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.1)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          type="button"
          aria-label="Next testimonials"
          onClick={() => emblaApi?.scrollNext()}
          className="flex items-center justify-center rounded-full size-[40px] shrink-0 cursor-pointer bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.1)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

let trustindexScriptInjected = false;
let trustindexAutoplayConfigured = false;

type TrustindexSliderInstance = {
  isLoop: boolean;
  autoPlayDirection: "next" | "prev";
  autoPlayInterval?: number;
  toggleNavigation: () => void;
  move: (direction: "next" | "prev", reason: string, duration: number) => void;
  resize: (force?: boolean) => void;
};

type TrustindexReviewWidgetInstance = {
  resize: () => void;
};

const TRUSTINDEX_DARK_THEME_CSS = `
.ti-dark-shell .ti-widget-header{background-color:transparent!important;border-color:transparent!important}
.ti-dark-shell .ti-widget-header *{color:#111827!important}
.ti-dark-shell .ti-verified-by-row .ti-inner{color:#ffffff!important}
.ti-dark-shell .ti-widget[data-layout-id="108"][data-set-id="ligth-border"] .ti-review-item>.ti-inner{background-color:#ffffff!important;border-color:rgba(15,17,23,.08)!important;box-shadow:0 4px 16px rgba(0,0,0,.08)!important}
.ti-dark-shell .ti-name{color:#111827!important}
.ti-dark-shell .ti-date{color:#6b7280!important}
.ti-dark-shell .ti-review-text-container,.ti-dark-shell .ti-review-content{color:#374151!important}
.ti-dark-shell .ti-read-more span{color:#2563eb!important;opacity:1!important}
.ti-dark-shell .ti-read-more span:hover{opacity:.8!important}
.ti-dark-shell .ti-prev,.ti-dark-shell .ti-next{background-color:#1a1d27!important;outline-color:rgba(59,130,246,.3)!important}
.ti-dark-shell .ti-controls .ti-prev:before,.ti-dark-shell .ti-controls .ti-next:before{border-color:#9da2b4!important}
.ti-dark-shell .ti-controls-line{background:rgba(0,0,0,.08)!important}
.ti-dark-shell .ti-controls-line .dot{background:#3b82f6!important}
`;

const TrustindexWidget = memo(function TrustindexWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || trustindexScriptInjected) return;

    let raf = 0;
    let cancelled = false;

    function isContainerVisible(el: HTMLElement) {
      if (typeof el.checkVisibility === "function") {
        return el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true });
      }
      return el.getClientRects().length > 0;
    }

    function tryInject() {
      if (cancelled || trustindexScriptInjected) return;
      if (!isContainerVisible(container)) {
        raf = requestAnimationFrame(tryInject);
        return;
      }
      trustindexScriptInjected = true;
      const script = document.createElement("script");
      script.defer = true;
      script.async = true;
      script.src = TRUSTINDEX_WIDGET.loaderSrc;
      container.appendChild(script);
    }

    raf = requestAnimationFrame(tryInject);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const container = containerRef.current;
    if (!container) return;

    let intervalId = 0;
    let slider: TrustindexSliderInstance | null = null;
    let ownsAutoplay = false;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && slider && !intervalId) {
          intervalId = window.setInterval(() => {
            slider!.move(slider!.autoPlayDirection, "auto", 1000);
          }, 4000);
        } else if (!entry.isIntersecting && intervalId) {
          window.clearInterval(intervalId);
          intervalId = 0;
        }
      },
      { threshold: 0.3 }
    );

    type TrustindexWidgetEl = HTMLElement & {
      reviewTargetWidth?: number;
      TrustindexSliderWidget?: TrustindexSliderInstance;
      TrustindexReviewWidget?: TrustindexReviewWidgetInstance;
    };
    let widgetEl: TrustindexWidgetEl | null = null;
    let reviewWidget: TrustindexReviewWidgetInstance | null = null;
    const columnResizeObserver = new ResizeObserver(() => applyColumnOverride());

    function stopNativeAutoplay() {
      if (slider?.autoPlayInterval !== undefined) {
        window.clearInterval(slider.autoPlayInterval);
        delete slider.autoPlayInterval;
      }
    }

    function applyColumnOverride() {
      if (!widgetEl || !reviewWidget) return;
      const containerWidth = widgetEl.offsetWidth;
      if (containerWidth <= 0) return;
      const isDesktop = window.innerWidth >= 1024;
      widgetEl.reviewTargetWidth = isDesktop ? Math.max(1, Math.floor(containerWidth / 4) - 2) : 300;
      reviewWidget.resize();
      slider?.resize(true);
      stopNativeAutoplay();
    }

    function trySetup(): boolean {
      const found = container!.querySelector<TrustindexWidgetEl>(".ti-widget");
      const instance = found?.TrustindexSliderWidget;
      if (!instance || !found) return false;
      mutationObserver.disconnect();
      if (trustindexAutoplayConfigured) return true;
      trustindexAutoplayConfigured = true;
      ownsAutoplay = true;
      widgetEl = found;
      slider = instance;
      slider.isLoop = true;
      reviewWidget = found.TrustindexReviewWidget ?? null;
      applyColumnOverride();
      columnResizeObserver.observe(found);
      slider.toggleNavigation();
      slider.resize(true);
      stopNativeAutoplay();
      intersectionObserver.observe(container!);
      return true;
    }

    const mutationObserver = new MutationObserver(() => {
      trySetup();
    });
    if (!trySetup()) {
      mutationObserver.observe(container, { childList: true, subtree: true });
    }

    let pollAttempts = 0;
    const pollId = window.setInterval(() => {
      pollAttempts++;
      if (trySetup() || pollAttempts > 40) window.clearInterval(pollId);
    }, 200);

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
      columnResizeObserver.disconnect();
      window.clearInterval(pollId);
      if (intervalId) window.clearInterval(intervalId);
      if (ownsAutoplay) trustindexAutoplayConfigured = false;
    };
  }, [reduceMotion]);

  return (
    <div className="ti-dark-shell w-full overflow-x-hidden" style={{ background: "#ffffff" }}>
      <style>{TRUSTINDEX_DARK_THEME_CSS}</style>
      {/* No max-width cap here — matches the video testimonial carousel
          section immediately above, which also just uses this same
          px-[20px] lg:px-[88px] padding with no extra width cap, so the
          two sections' content lines up instead of this one looking
          narrower on wide viewports. */}
      <div ref={containerRef} className="relative z-[1] w-full overflow-x-hidden px-[20px] py-[32px] lg:px-[88px] lg:py-[48px]" />
    </div>
  );
});

function Testimonials() {
  const [activeVideo, setActiveVideo] = useState<TestimonialVideo | null>(null);
  const closeVideoLightbox = useCallback(() => setActiveVideo(null), []);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const revealed = prefersReducedMotion || inView;
  return (
    <div ref={sectionRef} className="bg-white relative shrink-0 w-full" style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <StaticGlow className="left-[10%] top-[10%]" color="rgba(59,130,246,0.05)" size={480} />
        <StaticGlow className="right-[8%] bottom-[8%]" color="rgba(96,165,250,0.04)" size={420} />
        <div className="absolute inset-0 opacity-[0.025] mix-blend-multiply" style={{ backgroundImage: NOISE_BG }} />
        <AccentLine className="left-0 top-0 w-full" />
        <AccentLine className="left-0 bottom-0 w-full" />
      </div>
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[40px] lg:gap-[64px] items-center px-[20px] pt-[48px] lg:px-[88px] lg:pt-[120px] relative w-full">
          <motion.div
            className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full"
            variants={TESTIMONIAL_HEADING_REVEAL}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={revealed ? "show" : "hidden"}
          >
            <h2 className="font-['DM_Sans',sans-serif] font-medium leading-[1.1] text-[#0b0c11] text-[32px] lg:text-[52px] text-center tracking-[-0.936px] w-full lg:w-[700px]">Trusted by 21,500+ satisfied clients worldwide.</h2>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.6] text-[#6b7280] text-[15px] lg:text-[18px] text-center w-full lg:w-[560px]">Real experiences, verified rewards and transparent feedback from our traders.</p>
          </motion.div>
          <TestimonialsRevealContext.Provider value={revealed}>
            <TestimonialsDesktopCarousel onPlayVideo={setActiveVideo} />
            <TestimonialsMobileCarousel onPlayVideo={setActiveVideo} />
          </TestimonialsRevealContext.Provider>
        </div>
        {/* Trustindex widget — an additional, separate social-proof element
            placed directly below the existing review cards/videos above,
            never replacing them. Rendered as a plain sibling of the padded
            column above/below (rather than inside it) specifically so its
            own full-bleed dark background can reach the true edges of the
            section — see TrustindexWidget's own comment for why. The
            mt-[40px] lg:mt-[64px] here replicates the same gap the padded
            column's own `gap` utility gives every other element in it. */}
        <div className="w-full mt-[40px] lg:mt-[64px]">
          <TrustindexWidget />
        </div>
        <div className="content-stretch flex flex-col items-center px-[20px] pb-[48px] pt-[40px] lg:px-[88px] lg:pb-[120px] lg:pt-[64px] relative w-full">
          <motion.div variants={TESTIMONIAL_CTA_REVEAL} initial={prefersReducedMotion ? false : "hidden"} animate={revealed ? "show" : "hidden"}>
            <a href="#challenge" onClick={() => pauseHeavyScenesForNav()} className="bg-[#3b82f6] flex items-center justify-center px-[32px] py-[14px] rounded-[8px] shrink-0 no-underline">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[16px] leading-[19px] text-white whitespace-nowrap">Join 21,500+ Traders</p>
            </a>
          </motion.div>
        </div>
      </div>
      <VideoLightbox source={activeVideo ? testimonialVideoSource(activeVideo) : null} onClose={closeVideoLightbox} />
    </div>
  );
}


const COMPARISON_ROWS = [
  { criteria: "Rewards", fyt: "Weekly Rewards", others: "Bi-Weekly Rewards" },
  { criteria: "Drawdown Type", fyt: "Static drawdown", others: "Relative drawdown" },
  { criteria: "Daily Drawdown", fyt: "Balance based daily drawdown", others: "Equity based daily drawdown" },
  { criteria: "Conditions", fyt: "Transparent conditions", others: "Hidden conditions" },
  { criteria: "Time Limit", fyt: "No Time Limits", others: "Time Limits" },
  { criteria: "Reward Split", fyt: "100% Split", others: "80% Split" },
  { criteria: "Refund", fyt: "200% Refund", others: "100% Refund" },
  { criteria: "Bonus", fyt: "18% Bonus", others: "10% Bonus" },
  { criteria: "Consistency Rule", fyt: "No consistency rule", others: "consistency rule" },
  { criteria: "Weekend Holding", fyt: "Weekend/Overnight holdings", others: "No Weekend holdings" },
  { criteria: "News Trading", fyt: "News Trading", others: "News trading restrictions" },
] as const;

function DifferenceHeadingText({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.p
      className="font-['DM_Sans',sans-serif] font-normal text-[#0b0c11] text-[36px] lg:text-[64px] text-center tracking-[-0.02em] lg:mb-[16px]"
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true }}
      variants={reduceMotion ? undefined : DIFFERENCE_HEADING_PARENT_VARIANTS}
    >
      {DIFFERENCE_HEADING_WORDS.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            style={{ display: "inline-block" }}
            variants={reduceMotion ? undefined : DIFFERENCE_HEADING_WORD_VARIANTS}
          >
            {word}
          </motion.span>
          {i < DIFFERENCE_HEADING_WORDS.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.p>
  );
}

function DifferenceAdvantageBlock() {
  return (
    <div className="flex flex-col gap-[12px] items-center text-center">
      <span className="px-[16px] py-[6px] rounded-full text-[#3b82f6] text-[11px] font-['Inter:Semi_Bold',sans-serif] font-semibold tracking-[1.5px] uppercase" style={{ background: "rgba(59,130,246,0.08)" }}>
        The FYT Advantage
      </span>
      <h2 className="font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] text-[28px] lg:text-[44px] leading-[1.1] tracking-[-0.02em]">
        Built for Traders. Backed by Transparency.
      </h2>
      <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6b7280] text-[14px] lg:text-[16px] max-w-[560px]">
        See how we provide more value, more freedom, and more opportunities to grow.
      </p>
    </div>
  );
}

function DifferenceComparisonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] w-full">
      <div className="rounded-[20px] p-[24px] lg:p-[32px] relative" style={{ border: "2px solid #3b82f6", background: "linear-gradient(180deg, rgba(59,130,246,0.04) 0%, rgba(255,255,255,1) 100%)" }}>
        <div className="absolute top-0 right-[20px] w-[28px] h-[36px] flex items-start justify-center pt-[6px]" style={{ background: "#3b82f6", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" fill="white" /></svg>
        </div>
        <div className="flex items-center gap-[10px] mb-[16px]">
          <div className="flex items-center justify-center rounded-[8px] shrink-0" style={{ width: 32, height: 28, background: "#0b0c11" }}>
            <img src={imgImg10782} alt="" loading="lazy" decoding="async" className="h-[20px] w-auto" />
          </div>
          <p className="font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] text-[20px]">Funding Your Trades</p>
        </div>
        {COMPARISON_ROWS.map((row) => (
          <div key={row.fyt} className="flex items-center gap-[10px] py-[10px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <span className="flex items-center justify-center rounded-full size-[20px] shrink-0" style={{ background: "#3b82f6" }}>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M11.6662 3.5L5.25017 9.9162L2.3338 6.99975" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#1f2430] text-[14px] lg:text-[15px]">{row.fyt}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[20px] p-[24px] lg:p-[32px]" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-[10px] mb-[16px]">
          <span className="flex items-center justify-center rounded-full size-[28px]" style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2" stroke="#6b7280" strokeWidth="1.2" /><circle cx="10.5" cy="7" r="1.6" stroke="#6b7280" strokeWidth="1.1" /><path d="M2.5 12.5c0-1.8 1.5-3 3.5-3s3.5 1.2 3.5 3" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" /><path d="M9.8 9.6c1.2.2 2.2 1.1 2.2 2.4" stroke="#6b7280" strokeWidth="1.1" strokeLinecap="round" /></svg>
          </span>
          <p className="font-['DM_Sans',sans-serif] font-medium text-[#6b7280] text-[20px]">Others</p>
        </div>
        {COMPARISON_ROWS.map((row) => (
          <div key={row.others} className="flex items-center gap-[10px] py-[10px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <span className="flex items-center justify-center rounded-full size-[20px] shrink-0" style={{ background: "rgba(0,0,0,0.25)" }}>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6b7280] text-[14px] lg:text-[15px]">{row.others}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifferenceComparisonTableMobile() {
  return (
    <div className="lg:hidden w-full rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
      <table className="w-full border-collapse table-fixed" aria-label="FYT compared with other prop firms">
        <colgroup>
          <col className="w-[26%]" />
          <col className="w-[37%]" />
          <col className="w-[37%]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="text-left font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#6b7280] text-[10px] tracking-[0.5px] uppercase px-[8px] py-[7px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>Criteria</th>
            <th scope="col" className="text-left font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#3b82f6] text-[11px] px-[8px] py-[7px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(59,130,246,0.05)" }}>FYT</th>
            <th scope="col" className="text-left font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#6b7280] text-[11px] px-[8px] py-[7px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>Others</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.criteria}>
              <th
                scope="row"
                className="text-left align-top break-words font-['Inter:Medium',sans-serif] font-medium text-[#1f2430] text-[11px] leading-[1.4] px-[8px] py-[7px]"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
              >
                {row.criteria}
              </th>
              <td
                className="align-top break-words font-['Inter:Medium',sans-serif] font-medium text-[#0b0c11] text-[11px] leading-[1.4] px-[8px] py-[7px]"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "rgba(59,130,246,0.05)" }}
              >
                {row.fyt}
              </td>
              <td
                className="align-top break-words font-['Inter:Regular',sans-serif] font-normal text-[#6b7280] text-[11px] leading-[1.4] px-[8px] py-[7px]"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
              >
                {row.others}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DifferenceTrustBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-[16px] items-center">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#4b5563] text-[13px] flex items-center gap-[8px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="#3b82f6" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        </svg>
        Trusted by thousands of traders worldwide
      </p>
      <span className="hidden sm:block w-px h-[16px]" style={{ background: "rgba(0,0,0,0.12)" }} />
      <div className="flex items-center gap-[8px]">
        <span className="flex gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="#3b82f6"><path d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" /></svg>
          ))}
          <svg width="14" height="14" viewBox="0 0 16 16"><defs><linearGradient id="comparison-trustpilot-halfstar"><stop offset="50%" stopColor="#3b82f6" /><stop offset="50%" stopColor="#d1d5db" /></linearGradient></defs><path fill="url(#comparison-trustpilot-halfstar)" d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" /></svg>
        </span>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#4b5563] text-[13px]">4.5/5 Trust Index Rating</p>
      </div>
    </div>
  );
}

function DifferenceScrollLayer({
  progress,
  reveal,
  className,
  children,
}: {
  progress: MotionValue<number>;
  reveal: DifferenceCrossfadeReveal;
  className: string;
  children: ReactNode;
}) {
  const x = useTransform(progress, [reveal.fadeStart, reveal.fadeEnd], [reveal.xFrom, reveal.xTo]);
  return (
    <motion.div className={className} style={{ x }}>
      {children}
    </motion.div>
  );
}

function DifferencePinnedCrossfade({ reduceMotion }: { reduceMotion: boolean | null }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });

  return (
    <div ref={scrollRef} className="hidden lg:block relative w-full" style={{ height: `${DIFFERENCE_PIN_SCROLL_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-start pt-[140px]">
        <div className="relative w-full overflow-x-hidden">
          <DifferenceScrollLayer
            className="absolute inset-0 flex items-center justify-center"
            progress={scrollYProgress}
            reveal={DIFFERENCE_HEADING_EXIT_REVEAL}
          >
            <DifferenceHeadingText reduceMotion={reduceMotion} />
          </DifferenceScrollLayer>
          <DifferenceScrollLayer
            className="flex flex-col gap-[36px] lg:gap-[48px] items-center w-full"
            progress={scrollYProgress}
            reveal={DIFFERENCE_CONTENT_ENTER_REVEAL}
          >
            <DifferenceAdvantageBlock />
            <DifferenceComparisonGrid />
            <DifferenceTrustBar />
          </DifferenceScrollLayer>
        </div>
      </div>
    </div>
  );
}

function DifferenceMobilePinnedCrossfade({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="lg:hidden flex flex-col gap-[20px] items-center w-full">
      <DifferenceHeadingText reduceMotion={reduceMotion} />
      <DifferenceAdvantageBlock />
      <DifferenceComparisonTableMobile />
      <DifferenceTrustBar />
    </div>
  );
}

function ComparisonTable() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-white relative shrink-0 w-full" style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <StaticGlow className="left-[6%] top-[15%]" color="rgba(59,130,246,0.05)" size={500} />
        <StaticGlow className="right-[8%] bottom-[10%]" color="rgba(96,165,250,0.04)" size={420} />
        <div className="absolute inset-0 opacity-[0.025] mix-blend-multiply" style={{ backgroundImage: NOISE_BG }} />
        <AccentLine className="left-0 top-0 w-full" />
        <AccentLine className="left-0 bottom-0 w-full" />
      </div>
      <div className="relative flex flex-col gap-[36px] lg:gap-[48px] items-center px-[20px] py-[64px] lg:px-[80px] lg:py-[120px] w-full max-w-[1280px] mx-auto">
        {!reduceMotion && <DifferencePinnedCrossfade reduceMotion={reduceMotion} />}

        {!reduceMotion && <DifferenceMobilePinnedCrossfade reduceMotion={reduceMotion} />}

        {reduceMotion && (
          <div className="flex flex-col gap-[36px] lg:gap-[48px] items-center w-full">
            <DifferenceHeadingText reduceMotion={reduceMotion} />
            <DifferenceAdvantageBlock />
            <div className="hidden lg:block w-full">
              <DifferenceComparisonGrid />
            </div>
            <DifferenceComparisonTableMobile />
            <DifferenceTrustBar />
          </div>
        )}
      </div>
    </div>
  );
}


const OVERVIEW_BADGES = [
  { label: "Secure by design", icon: "shield" as const },
  { label: "Real-time updates", icon: "bolt" as const },
  { label: "Built for traders", icon: "trend" as const },
] as const;

function OverviewBadgeIcon({ kind }: { kind: (typeof OVERVIEW_BADGES)[number]["icon"] }) {
  const common = { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "#3b82f6" } as const;
  if (kind === "shield") return <svg {...common}><path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" strokeWidth="1.3" strokeLinejoin="round" /><path d="M5.5 8l1.8 1.8L10.8 6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (kind === "bolt") return <svg {...common}><path d="M9 1.5 3.5 9h4l-1 5.5L12.5 7h-4L9 1.5Z" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
  return <svg {...common}><path d="M2 12.5l4-4.5 3 2.5 5-6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 4h3v3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
const OVERVIEW_HEADING_TEXT = "Designed around the way you actually operate";

const SUPPORT_CHAT_TOPICS = [
  { title: "Maximum Drawdown/Loss Limit", subtitle: "How maximum drawdown works?" },
  { title: "Daily Loss Limit", subtitle: "How daily drawdown works?" },
  { title: "What withdrawal methods are available?", subtitle: "Withdrawal/Payout options" },
] as const;

const SUPPORT_CHAT_CONTACT_URL = "https://fundingyourtrades.com/contact/";

const SUPPORT_CHAT_NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "messages", label: "Messages" },
  { key: "help", label: "Help" },
] as const;

type SupportChatNavKey = (typeof SUPPORT_CHAT_NAV_ITEMS)[number]["key"];

function SupportChatNavIcon({ kind, active }: { kind: SupportChatNavKey; active: boolean }) {
  const stroke = active ? SUPPORT_CARD_ACCENT_BLUE : "rgba(255,255,255,0.55)";
  const common = { width: 18, height: 18, viewBox: "0 0 16 16", fill: "none", stroke } as const;
  if (kind === "home") return <svg {...common}><path d="M2 7.5 8 2.5l6 5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.5 6.5V13h9V6.5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (kind === "messages") return <svg {...common}><path d="M2 3.5h12v7H6l-3 2.5v-2.5H2v-7Z" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
  return <svg {...common}><circle cx="8" cy="8" r="6" strokeWidth="1.4" /><path d="M6.2 6.2a1.8 1.8 0 1 1 2.6 1.6c-.6.35-.8.7-.8 1.3" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="11.2" r="0.15" fill={stroke} stroke="none" /></svg>;
}

function SupportChatTopicsList() {
  return (
    <div className="flex flex-col gap-[10px]">
      <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[rgba(255,255,255,0.55)] text-[12px] uppercase tracking-[0.08em]">Common topics</span>
      <div className="flex flex-col rounded-[14px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        {SUPPORT_CHAT_TOPICS.map((topic, i) => (
          <a
            key={topic.title}
            href={SUPPORT_CHAT_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-[12px] px-[16px] py-[14px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex flex-col gap-[2px] min-w-0">
              <span className="font-['Inter:Medium',sans-serif] font-medium text-white text-[13.5px] leading-[1.3]">{topic.title}</span>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.55)] text-[12px] leading-[1.3]">{topic.subtitle}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-[4px]">
              <path d="M6 3l5 5-5 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

function SupportChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mouseDownOnBackdropRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<SupportChatNavKey>("home");

  useEffect(() => {
    if (open) setActiveTab("home");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const body = document.body;
    const scrollY = window.scrollY;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousLeft = body.style.left;
    const previousRight = body.style.right;
    const previousWidth = body.style.width;
    const previousHeight = body.style.height;
    const previousOverflow = body.style.overflow;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.height = "auto";
    body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.left = previousLeft;
      body.style.right = previousRight;
      body.style.width = previousWidth;
      body.style.height = previousHeight;
      body.style.overflow = previousOverflow;
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
      });
      previouslyFocusedElement?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Support chat"
      onMouseDown={(e) => {
        mouseDownOnBackdropRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (mouseDownOnBackdropRef.current && e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[200] flex items-stretch justify-end"
      style={{ background: "rgba(6,10,20,0.55)" }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
        animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className="relative flex flex-col w-full sm:w-[500px] h-full sm:h-[min(680px,100dvh)] sm:my-auto sm:mr-[20px] sm:rounded-[20px] overflow-hidden"
        style={{
          background: "#0B1220",
          boxShadow: "0 24px 64px -12px rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <div
          className="flex items-center justify-between px-[20px] py-[18px] shrink-0"
          style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #0B1220 130%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-[10px]">
            <span className="flex items-center justify-center rounded-full size-[34px]" style={{ background: "rgba(255,255,255,0.14)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="#ffffff" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="font-['DM_Sans',sans-serif] font-medium text-white text-[15px] leading-[1.2]">Funding Your Trades</span>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.7)] text-[12px] leading-[1.2]">Support</span>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex items-center justify-center rounded-full size-[32px] cursor-pointer border-0"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-[20px] py-[24px] flex flex-col gap-[24px]">
          {activeTab === "home" && (
            <>
              <div className="flex flex-col gap-[4px]">
                <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[22px] leading-[1.2]">Hi there 👋</p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.7)] text-[15px]">How can we help?</p>
              </div>

              <a
                href={SUPPORT_CHAT_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-[12px] rounded-[14px] px-[18px] py-[16px]"
                style={{ ...PILL_CTA_GRADIENT_STYLE, background: `linear-gradient(180deg, #5A9BFF 0%, ${SUPPORT_CARD_ACCENT_BLUE} 100%)` }}
              >
                <div className="flex flex-col gap-[2px]">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[14px]">Send us a message</span>
                  <span className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.85)] text-[12px]">We typically reply in under 5 minutes</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-[4px]">
                  <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <SupportChatTopicsList />
            </>
          )}

          {activeTab === "messages" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-[14px] text-center py-[32px]">
              <span className="flex items-center justify-center rounded-full size-[48px]" style={{ background: "rgba(255,255,255,0.08)" }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3.5h12v7H6l-3 2.5v-2.5H2v-7Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="flex flex-col gap-[4px]">
                <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[16px] leading-[1.2]">No messages yet</p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.55)] text-[13px] leading-[1.4]">Start a conversation and we'll reply here.</p>
              </div>
              <a
                href={SUPPORT_CHAT_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-[8px] rounded-[14px] px-[18px] py-[12px] w-full"
                style={{ ...PILL_CTA_GRADIENT_STYLE, background: `linear-gradient(180deg, #5A9BFF 0%, ${SUPPORT_CARD_ACCENT_BLUE} 100%)` }}
              >
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[14px]">Send us a message</span>
              </a>
            </div>
          )}

          {activeTab === "help" && (
            <>
              <div className="flex flex-col gap-[4px]">
                <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[18px] leading-[1.2]">Help center</p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.7)] text-[13px]">Browse common topics below.</p>
              </div>
              <SupportChatTopicsList />
            </>
          )}
        </div>

        <div
          className="flex items-center justify-around px-[12px] py-[10px] shrink-0"
          style={{ background: "#0B1220", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {SUPPORT_CHAT_NAV_ITEMS.map(({ key, label }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="flex flex-col items-center gap-[4px] px-[16px] py-[4px] cursor-pointer border-0 bg-transparent"
              >
                <SupportChatNavIcon kind={key} active={active} />
                <span
                  className="font-['Inter:Medium',sans-serif] font-medium text-[11px]"
                  style={{ color: active ? SUPPORT_CARD_ACCENT_BLUE : "rgba(255,255,255,0.55)" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

const SUPPORT_EMAIL_HREF = "mailto:support@fundingyourtrades.com";

const SUPPORT_FEATURES = [
  { label: "Live Chat", icon: "chat" as const, action: "intercom" as const },
  { label: "Email Support", icon: "email" as const, action: "email" as const },
  { label: "Always On", icon: "clock" as const, action: "none" as const },
  { label: "Expert Help", icon: "star" as const, action: "none" as const },
] as const;

function SupportFeatureIcon({ kind }: { kind: (typeof SUPPORT_FEATURES)[number]["icon"] }) {
  const common = { width: 15, height: 15, viewBox: "0 0 16 16", fill: "none", stroke: "#ffffff" } as const;
  if (kind === "chat") return <svg {...common}><path d="M2 3.5h12v7H6l-3 2.5v-2.5H2v-7Z" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
  if (kind === "email") return <svg {...common}><rect x="2" y="3.5" width="12" height="9" rx="1.5" strokeWidth="1.3" /><path d="M2.5 4.5L8 9l5.5-4.5" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
  if (kind === "clock") return <svg {...common}><circle cx="8" cy="8" r="6.2" strokeWidth="1.2" /><path d="M8 4.5V8l2.8 1.6" strokeWidth="1.2" strokeLinecap="round" /></svg>;
  return <svg {...common}><path d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
}

function ProductShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const tilt = useTilt<HTMLDivElement>(PRODUCT_DASHBOARD_TILT_MAX_DEG);
  const headingWords = OVERVIEW_HEADING_TEXT.split(" ");

  return (
    <div className="relative shrink-0 w-full" style={{ background: "#F8FAFF", boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PRODUCT_DUST_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle, rgba(59,130,246,0.55), transparent 70%)",
              filter: "blur(1px)",
              opacity: 0.4,
            }}
          />
        ))}
        <div className="absolute inset-0 opacity-[0.025] mix-blend-multiply" style={{ backgroundImage: NOISE_BG }} />
        <AccentLine className="left-0 top-0 w-full" />
        <AccentLine className="left-0 bottom-0 w-full" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={productSectionContainer}
        className="relative flex flex-col gap-[48px] lg:gap-[64px] px-[20px] py-[56px] lg:px-[80px] lg:py-[96px] w-full max-w-[1280px] mx-auto"
      >
        {/* Dashboard overview — reveal order items 1 (heading) & 2 (dashboard) */}
        <div className="relative flex flex-col lg:flex-row gap-[32px] lg:gap-[56px] items-center">
          <motion.div variants={productSectionItem} className="flex-1 flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[10px]">
              <span className="text-[#3b82f6] text-[12px] font-['Inter:Semi_Bold',sans-serif] font-semibold tracking-[1.5px] uppercase">Overview of FYT</span>
              <span className="w-[32px] h-[2px] rounded-full" style={{ background: "#3b82f6" }} aria-hidden />
            </div>
            <motion.h2
              variants={productHeadingContainer}
              className="font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] text-[26px] lg:text-[36px] leading-[1.2] tracking-[-0.02em]"
            >
              {headingWords.map((word, i) => (
                <motion.span key={i} variants={productHeadingWord} className="inline-block whitespace-pre">
                  {word}
                  {i < headingWords.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </motion.h2>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6b7280] text-[15px] leading-[1.6]">
              A clear dashboard gives you everything needed to monitor accounts, request rewards, and manage your journey.
            </p>
            <motion.div
              variants={productBadgeContainer}
              className="flex flex-wrap items-center gap-[16px] mt-[8px]"
            >
              {OVERVIEW_BADGES.flatMap(({ label, icon }, i) => [
                i > 0 ? (
                  <span key={`div-${label}`} className="hidden sm:block w-px h-[16px]" style={{ background: "rgba(0,0,0,0.12)" }} aria-hidden />
                ) : null,
                <span key={label} className="flex items-center gap-[6px] text-[#374151] text-[13px] font-['Inter:Medium',sans-serif] font-medium">
                  <motion.span variants={productBadgeIcon} className="inline-flex">
                    <OverviewBadgeIcon kind={icon} />
                  </motion.span>
                  <motion.span variants={productBadgeLabel}>{label}</motion.span>
                </span>,
              ])}
            </motion.div>
          </motion.div>

          {/* Heading → dashboard connection line, growing during the reveal. */}
          {!prefersReducedMotion && (
            <div className="hidden lg:block absolute left-[20%] right-[8%] top-1/2 h-px pointer-events-none">
              <motion.div
                className="absolute inset-0 origin-left"
                style={{
                  background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                  boxShadow: "0 0 8px rgba(59,130,246,0.5)",
                  opacity: PRODUCT_CONNECTION_LINE_OPACITY,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: PRODUCT_CONNECTION_LINE_DURATION_S, delay: PRODUCT_CONNECTION_LINE_DELAY_S, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          )}

          <motion.div variants={productSectionItem} className="flex-1 w-full">
            <motion.div
              ref={tilt.ref}
              onMouseMove={tilt.onMouseMove}
              onMouseLeave={tilt.onMouseLeave}
              className="relative"
              style={{ rotateX: tilt.style.rotateX, rotateY: tilt.style.rotateY, transformPerspective: tilt.style.transformPerspective }}
              animate={prefersReducedMotion ? undefined : { y: productDashboardFloatY }}
              transition={prefersReducedMotion ? undefined : PRODUCT_DASHBOARD_FLOAT_TRANSITION}
            >
              {/* Ambient blue glow behind the dashboard */}
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                style={{
                  width: "70%",
                  height: "70%",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(ellipse, rgba(59,130,246,0.55), transparent 70%)",
                  filter: "blur(60px)",
                }}
                initial={{ opacity: 0.06 }}
                animate={prefersReducedMotion ? undefined : { opacity: PRODUCT_SHOWCASE_AMBIENT_GLOW_OPACITY }}
                transition={prefersReducedMotion ? undefined : PRODUCT_AMBIENT_GLOW_TRANSITION}
              />
              <motion.div variants={productDashboardContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="relative">
                {/* Back layer */}
                <motion.img
                  variants={productDashboardBack}
                  src={imgDashboardMockup}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={1280}
                  height={983}
                  className="absolute inset-0 w-full h-auto object-contain pointer-events-none"
                  style={{ filter: "blur(1.5px) saturate(0.85)", opacity: 0.55 }}
                />
                <motion.div variants={productDashboardFront} className="relative overflow-hidden">
                  <img src={imgDashboardMockup} alt="FYT trader dashboard overview" loading="lazy" width={1280} height={983} className="w-full h-auto object-contain" />
                  {!prefersReducedMotion && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-y-0 w-1/4 pointer-events-none"
                      style={{ background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.5), transparent)" }}
                      initial={{ x: "-120%" }}
                      animate={productReflectionSweep}
                      transition={PRODUCT_REFLECTION_SWEEP_TRANSITION}
                    />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        {/* Trusted Platform + Trusted Support */}
        {/* reveal order items 3 & 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <motion.div
            variants={productSectionItem}
            whileHover={prefersReducedMotion ? undefined : productPlatformCardHover}
            transition={PRODUCT_CARD_HOVER_TRANSITION}
            className="group rounded-[16px] p-[28px] lg:p-[36px]"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <p className="font-['DM_Sans',sans-serif] font-medium text-[#0b0c11] text-[22px] mb-[8px] text-center lg:text-left">Trusted Platform</p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6b7280] text-[14px] mb-[76px] text-center lg:text-left">Access your account with the platforms you already know.</p>
            <div className="relative">
              <div className="hidden sm:block absolute left-0 right-0 top-[-76px] h-[76px] pointer-events-none" aria-hidden>
                <svg width="100%" height="100%" viewBox="0 0 100 76" preserveAspectRatio="none" fill="none">
                  <path d="M50 44 V52 H25 V76" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M50 44 V52 H75 V76" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
                <motion.span
                  className="absolute left-1/2 -translate-x-1/2 top-[8px] flex items-center justify-center rounded-full bg-white size-[36px]"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  whileHover={prefersReducedMotion ? undefined : productIconHoverRotate}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0V7Z" stroke="#3b82f6" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M10 16v3" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </motion.span>
              </div>
              <div className="flex justify-center lg:justify-start items-center lg:items-stretch gap-[8px] lg:gap-[16px] w-full pt-0">
                {[
                  { name: "MatchTrader", logo: imgMatchTraderLogo, logoClassName: "h-[15px] lg:h-[24px] w-auto object-contain shrink-0" },
                  { name: "Platform 5", logo: imgPlatform5Logo, logoClassName: "h-[15px] lg:h-[36px] w-auto object-contain shrink-0" },
                ].map(({ name, logo, logoClassName }) => (
                  <motion.div
                    key={name}
                    whileHover={prefersReducedMotion ? undefined : productPlatformPillHover}
                    transition={PRODUCT_CARD_HOVER_TRANSITION}
                    className="w-[128px] shrink-0 lg:w-auto lg:flex-1 min-w-0 h-[44px] lg:h-auto flex items-center justify-center gap-[4px] lg:gap-[10px] rounded-[12px] px-[4px] lg:px-0 py-0 lg:py-[14px]"
                    style={SUPPORT_CARD_GRADIENT_STYLE}
                  >
                    <img src={logo} alt="" loading="lazy" className={logoClassName} />
                    <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[11px] lg:text-[16px] whitespace-nowrap overflow-hidden text-ellipsis min-w-0">{name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#3b82f6] text-[13px] mt-[8px] flex items-center justify-center lg:justify-start gap-[6px]">
              <motion.svg width="14" height="14" viewBox="0 0 16 16" fill="none" whileHover={prefersReducedMotion ? undefined : productIconHoverRotate}>
                <path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="#3b82f6" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
              </motion.svg>
              Secure. Fast. Seamless.
            </p>
          </motion.div>
          <motion.div
            variants={productSectionItem}
            whileHover={prefersReducedMotion ? undefined : productSupportCardHover}
            transition={PRODUCT_CARD_HOVER_TRANSITION}
            className="rounded-[16px] p-[28px] lg:p-[36px]" style={SUPPORT_CARD_GRADIENT_STYLE}
          >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between h-full gap-[12px] xl:gap-[24px]">
              <div className="flex-1 min-w-0">
                <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[22px] mb-[8px] text-center xl:text-left">Trusted Support Team</p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[rgba(255,255,255,0.8)] text-[14px] mb-[20px] text-center xl:text-left">Fast, friendly support whenever traders need help.</p>
                <div className="support-features-track flex flex-wrap justify-center xl:justify-start gap-[20px]">
                  {SUPPORT_FEATURES.map(({ label, icon, action }) => {
                    const content = (
                      <>
                        <span className="relative flex items-center justify-center rounded-full size-[36px]" style={{ background: "rgba(255,255,255,0.16)" }}>
                          {(icon === "chat" || icon === "clock") && !prefersReducedMotion && (
                            <motion.span
                              aria-hidden="true"
                              className="absolute top-0 right-0 rounded-full size-[8px]"
                              style={{ background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }}
                              animate={productOnlineDotPulse}
                              transition={PRODUCT_ONLINE_DOT_TRANSITION}
                            />
                          )}
                          <SupportFeatureIcon kind={icon} />
                        </span>
                        <span className="font-['Inter:Medium',sans-serif] font-medium text-white text-[11px]">{label}</span>
                      </>
                    );
                    const itemClass = "flex flex-col items-center gap-[6px] text-center shrink-0";
                    if (action === "intercom") {
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => { void openIntercomMessenger(); }}
                          aria-label="Open live chat"
                          className={`${itemClass} bg-transparent border-0 p-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95`}
                        >
                          {content}
                        </button>
                      );
                    }
                    if (action === "email") {
                      return (
                        <a
                          key={label}
                          href={SUPPORT_EMAIL_HREF}
                          aria-label="Email support"
                          className={`${itemClass} no-underline transition-transform duration-200 hover:scale-105 active:scale-95`}
                        >
                          {content}
                        </a>
                      );
                    }
                    return (
                      <div key={label} className={itemClass}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="group relative inline-flex items-center gap-[8px] bg-white rounded-full px-[20px] py-[12px] whitespace-nowrap shrink-0 self-center overflow-hidden cursor-pointer border-0"
                onClick={openIntercomMessenger}
              >
                {!prefersReducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 w-1/3 pointer-events-none"
                    style={{ background: "linear-gradient(115deg, transparent, rgba(59,130,246,0.12), transparent)" }}
                    initial={{ x: "-115%" }}
                    animate={productChatButtonSheen}
                    transition={{ duration: PRODUCT_CHAT_BUTTON_SHEEN_DURATION_S, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <span className="relative font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px]" style={{ color: SUPPORT_CARD_ACCENT_BLUE }}>Chat with us</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="relative transition-transform duration-300 group-hover:translate-x-[6px]"
                >
                  <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke={SUPPORT_CARD_ACCENT_BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function Faq() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const revealed = prefersReducedMotion || inView;
  const titleWords = "Frequently Asked Questions".split(" ");

  return (
    <div ref={sectionRef} className="bg-[#070810] relative shrink-0 w-full">
      {!prefersReducedMotion && (
        <div className="absolute top-0 inset-x-0 h-px overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-y-0 w-1/4"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.7), transparent)",
              animation: `blue-light-sweep ${FAQ_TOPLINE_PERIOD_S}s ease-in-out infinite`,
            }}
          />
        </div>
      )}
      {/* Background: soft blue radial glow (3-5% opacity) + a whisper of grain. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[10%] -translate-x-1/2 rounded-full"
          style={{ width: 640, height: 480, background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)", filter: "blur(60px)" }}
        />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />
      </div>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[36px] lg:gap-[58px] items-start px-[20px] py-[48px] lg:px-[88px] lg:py-[120px] max-w-[1280px] mx-auto relative size-full">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start leading-[normal] overflow-clip relative shrink-0">
            <motion.p
              className="font-['DM_Sans',sans-serif] font-medium relative shrink-0 text-[#eef0f6] text-[32px] lg:text-[44px] tracking-[-0.792px]"
              variants={FAQ_TITLE_CONTAINER}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={revealed ? "show" : "hidden"}
            >
              {titleWords.map((word, i) => (
                <motion.span key={i} variants={FAQ_TITLE_WORD} className="inline-block">
                  {word}
                  {i < titleWords.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </motion.p>
          </div>
          <div className="w-full flex flex-col items-center">
          <Accordion.Root asChild type="single" collapsible>
            <motion.div
              className="w-full border-t border-[rgba(255,255,255,0.08)]"
              variants={FAQ_ROWS_CONTAINER}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={revealed ? "show" : "hidden"}
            >
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <motion.div key={i} variants={FAQ_ROW_REVEAL}>
                <Accordion.Item value={`item-${i}`} className="group/row relative w-full border-b border-[rgba(255,255,255,0.08)]">
                  {/* Left accent line — grows on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-[-1px] top-[10px] bottom-[10px] w-[2px] rounded-full bg-[#3b82f6] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 ease-out"
                    style={{ transformOrigin: "center" }}
                  />
                  <Accordion.Header>
                    <Accordion.Trigger className="group w-full flex items-center justify-between gap-[16px] py-[24px] pl-[16px] bg-transparent border-0 cursor-pointer text-left">
                      <p className="[word-break:break-word] font-['DM_Sans',sans-serif] font-medium leading-[1.3] text-[#eef0f6] text-[16px] lg:text-[18px] transition-colors duration-200 group-hover:text-[#60a5fa]">{q}</p>
                      <div className="relative shrink-0 size-[22px] transition-transform duration-200 group-data-[state=open]:rotate-45">
                        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                          <path d={svgPaths.p15c41080} stroke="#3b82f6" strokeLinecap="round" strokeWidth="1.46667" />
                        </svg>
                      </div>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-1/4 pointer-events-none opacity-0 group-data-[state=open]:opacity-100"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.9), transparent)",
                          animation: "blue-light-sweep 600ms ease-out",
                        }}
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="group overflow-hidden pl-[16px] data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.65] text-[#9da2b4] text-[14px] lg:text-[15px] pb-[24px] pr-[40px] group-data-[state=open]:animate-in group-data-[state=open]:fade-in group-data-[state=open]:slide-in-from-top-2 duration-300">
                      {a}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
            </motion.div>
          </Accordion.Root>
          <a
            href="https://intercom.help/funding-your-trades/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine mt-[36px] flex items-center gap-[10px] px-[32px] py-[16px] rounded-[999px] shrink-0 no-underline transition-shadow duration-300 hover:shadow-[0_12px_45px_-8px_rgba(59,130,246,0.65)]"
            style={PILL_CTA_GRADIENT_STYLE}
          >
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-white whitespace-nowrap">Go to FAQs</p>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}


function SocialIcon({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  return (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="inline-flex">
      {children}
    </a>
  );
}

function Footer() {
  const socialHref = (label: string) => FOOTER_LINKS.social.find((s) => s.label === label)!.href;
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const revealed = prefersReducedMotion || inView;

  return (
    <div ref={sectionRef} className="relative shrink-0 w-full">
      {/* Thin top border with a blue light traveling across it every 12-15s. */}
      <div className="absolute top-0 inset-x-0 h-px bg-[rgba(255,255,255,0.08)] overflow-hidden pointer-events-none" aria-hidden="true">
        {!prefersReducedMotion && (
          <div
            className="absolute inset-y-0 w-1/4"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.7), transparent)",
              animation: `blue-light-sweep ${FOOTER_TOPLINE_PERIOD_S}s ease-in-out infinite`,
            }}
          />
        )}
      </div>
      {/* Background: subtle radial gradients, soft blue blobs (3% opacity), grain, vignette. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.05), transparent 70%)" }} />
        <StaticGlow className="left-[8%] top-[10%]" color="rgba(59,130,246,0.03)" size={420} />
        <StaticGlow className="right-[10%] bottom-[10%]" color="rgba(96,165,250,0.03)" size={380} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(0,0,0,0.25) 100%)" }} />
      </div>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[48px] items-start pb-[36px] pt-[64px] px-[20px] lg:px-[88px] lg:max-w-[1280px] lg:mx-auto relative size-full">
          <motion.div
            className="content-stretch flex flex-col lg:flex-row gap-[32px] lg:gap-[40px] items-start relative shrink-0 w-full"
            variants={FOOTER_COLUMNS_CONTAINER}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={revealed ? "show" : "hidden"}
          >
            <motion.div variants={FOOTER_COLUMN_REVEAL} className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px overflow-clip relative">
              <div className="relative h-[100px] w-[218px] shrink-0">
                {/* Soft breathing blue glow behind the logo. */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width: 160,
                    height: 160,
                    background: "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)",
                    filter: "blur(30px)",
                    animation: prefersReducedMotion ? undefined : "footer-logo-glow-breathe 5s ease-in-out infinite",
                  }}
                />
                <img alt="" loading="lazy" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg10801} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[1.6] not-italic relative shrink-0 text-[#9da2b4] text-[14px] w-[280px]">A simulated-capital prop firm rewarding disciplined traders across 105+ countries.</p>
            </motion.div>
            {FOOTER_COLUMNS.map(({ heading, items }) => (
              <motion.div key={heading} variants={FOOTER_COLUMN_REVEAL} className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative">
                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#3b82f6] text-[12px] tracking-[1.44px] whitespace-nowrap">{heading}</p>
                <div className="h-[18px]" />
                {items.map((item) => (
                  <div key={item.label}>
                    <a href={item.href} className="group/link relative inline-flex [word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic shrink-0 text-[#eef0f6] text-[14px] whitespace-nowrap no-underline transition-[color,transform] duration-200 hover:text-[#60a5fa] hover:translate-x-[4px]">
                      {item.label}
                      <span aria-hidden="true" className="absolute left-0 -bottom-[2px] h-px w-0 bg-[#60a5fa] transition-[width] duration-200 group-hover/link:w-full" />
                    </a>
                    <div className="h-[10px]" />
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
          <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
          <div className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[20px] items-start not-italic overflow-clip pt-[26px] relative shrink-0 text-[#5f6478] text-[12px] w-full">
            <p className="leading-[1.7] relative shrink-0 w-full">Funding Your Trades provides a simulated trading environment for the purpose of evaluating trading skill. Clients are assigned demo accounts with simulated funds; all trading activity is carried out in a simulated environment and no real capital is deposited or traded. FYT is not a broker and does not provide investment services. Trading in financial markets involves significant risk and is not suitable for everyone. Performance in a simulated environment does not guarantee future results.</p>
            <div className="content-stretch flex flex-col lg:flex-row gap-[8px] lg:gap-0 items-start lg:justify-between leading-[normal] relative shrink-0 w-full lg:whitespace-nowrap">
              <p className="relative shrink-0">© 2026 Funding Your Trades. All rights reserved.</p>
              <div className="flex gap-[20px] items-center shrink-0">
                <SocialIcon label="X" href={socialHref("X")}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M2 2l6.7 8.6L2.4 18h2.3l5-5.7 4.4 5.7H18l-7-9.1L17.4 2h-2.3l-4.6 5.3L6.4 2H2z" fill="#3b82f6" />
                  </svg>
                </SocialIcon>
                <SocialIcon label="Discord" href={socialHref("Discord")}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M15.5 4.5A13 13 0 0 0 12.6 3.6l-.3.7a10.7 10.7 0 0 0-4.6 0l-.3-.7c-1 .2-2 .5-2.9.9C2.7 7.2 2.2 9.9 2.4 12.5A13 13 0 0 0 6 14.4l.7-1.1c-.6-.2-1.1-.5-1.6-.8l.4-.3c2.9 1.4 6.1 1.4 9 0l.4.3c-.5.3-1 .6-1.6.8l.7 1.1a13 13 0 0 0 3.6-1.9c.3-3-.5-5.6-2.1-8zM7.6 11.2c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3zm4.8 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3z" fill="#3b82f6" />
                  </svg>
                </SocialIcon>
                <SocialIcon label="Instagram" href={socialHref("Instagram")}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke="#3b82f6" strokeWidth="1.7" />
                    <circle cx="10" cy="10" r="3.4" stroke="#3b82f6" strokeWidth="1.7" />
                    <circle cx="14.6" cy="5.4" r="1.1" fill="#3b82f6" />
                  </svg>
                </SocialIcon>
                <SocialIcon label="YouTube" href={socialHref("YouTube")}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="1.5" y="4.5" width="17" height="11" rx="3" fill="#3b82f6" />
                    <path d="M8.3 7.5v5l4.4-2.5-4.4-2.5z" fill="#070810" />
                  </svg>
                </SocialIcon>
                <SocialIcon label="Telegram" href={socialHref("Telegram")}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M17.6 3.1 1.9 9.2c-.7.3-.7 1 0 1.2l3.9 1.2 1.5 4.7c.2.6.9.7 1.3.3l2.1-2 4 2.9c.5.4 1.2.1 1.3-.5l2.3-12.7c.1-.8-.5-1.4-1.3-1.1l.6-.1zM6.6 11.4l8.5-5.2-6.6 6.1-.3 2.7-1.6-3.6z" fill="#3b82f6" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function BelowFold() {
  return (
    <>
      <div className="bg-[rgba(255,255,255,0.06)] h-px relative shrink-0 w-full" />
      <FeaturedIn />
      <ProveYourSkill />
      <ProofInNumbers />
      <LivePayouts />
      <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
      <Pricing />
      <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
      <Testimonials />
      <HowItWorks />
      <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
      <ComparisonTable />
      <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
      <ProductShowcase />
      <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
      <ClosingCta />
      <div className="bg-[rgba(255,255,255,0.08)] h-px relative shrink-0 w-full" />
      <Faq />
      <Footer />
    </>
  );
}
