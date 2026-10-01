import { useRef, type ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import imgFytLogo from "@/imports/FytLandingPage/7dca680e1978188fe7adca05839b49894cdf71f2.png";
import imgFytMark from "@/imports/FytLandingPage/c3e1b41ac1a944e4221b3b1465d4e68b855d759f.png";
import imgDashboardMockup from "@/assets/images/dashboard_floating_3d_v2.webp";
import imgMatchTraderLogo from "@/assets/live-site/platform-logos/match-trader.png";
import imgPlatform5Logo from "@/assets/live-site/platform-logos/platform-5.png";
import { FAQ_ITEMS, FOOTER_COLUMNS, FOOTER_LINKS, HERO_CONTENT } from "@/app/data/liveSiteContent";
import { openIntercomMessenger } from "@/app/intercom";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import {
  COMPARISON_ROWS,
  FooterLegalText,
  HOW_IT_WORKS_STEPS,
  HowItWorksIcon,
  OVERVIEW_BADGES,
  OVERVIEW_HEADING_TEXT,
  OverviewBadgeIcon,
  SUPPORT_EMAIL_HREF,
  SUPPORT_FEATURES,
  SupportFeatureIcon,
  TradingGlobeSlot,
} from "@/app/BelowFold";
import { C, EASE, Eyebrow, Pill, Reveal, Section, SectionTitle, WordsReveal, spotlightMove, staggerChild, staggerParent, useIsDesktop } from "./ui";

/* ------------------------------------------------------------------ */
/* How it works — the connector line draws itself as you scroll        */
/* ------------------------------------------------------------------ */

function StepCard({ step, index, progress, vertical }: { step: (typeof HOW_IT_WORKS_STEPS)[number]; index: number; progress: MotionValue<number>; vertical: boolean }) {
  const reduce = useReducedMotion();
  const total = HOW_IT_WORKS_STEPS.length;
  const at = vertical ? index / total : index / (total - 1);
  const lit = useTransform(progress, [Math.max(0, Math.min(at, 0.98) - 0.12), Math.min(at + 0.02, 1)], [0, 1]);
  const ringOpacity = reduce ? 1 : lit;
  return (
    <motion.div variants={staggerChild} className={`relative flex ${vertical ? "flex-row gap-[18px]" : "flex-col items-center text-center gap-[18px]"}`}>
      <div className="relative z-[1] shrink-0">
        <motion.span
          className="relative flex size-[56px] items-center justify-center rounded-full"
          style={{ background: "#0b1224", border: "1px solid rgba(96,165,250,0.25)" }}
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ opacity: ringOpacity, background: "linear-gradient(180deg, #4f8cff, #2563eb)", boxShadow: "0 0 0 6px rgba(59,130,246,0.14), 0 0 28px rgba(59,130,246,0.55)" }}
          />
          <span className="relative text-[15px] font-semibold text-white tabular">{String(step.n).padStart(2, "0")}</span>
        </motion.span>
      </div>
      <div
        onPointerMove={spotlightMove}
        className={`fyt-spot flex w-full flex-col gap-[12px] rounded-[20px] p-[22px] ${vertical ? "text-left" : "items-center"}`}
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))", border: `1px solid ${C.borderDark}` }}
      >
        <span className="flex size-[42px] items-center justify-center rounded-[12px]" style={{ background: "#eaf2ff" }}>
          <HowItWorksIcon kind={step.icon} />
        </span>
        <p className="text-[20px] font-semibold tracking-[-0.02em] text-white">{step.label}</p>
        <p className="text-[14px] leading-[1.6]" style={{ color: C.mutedDark }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const deskRef = useRef<HTMLDivElement>(null);
  const mobRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: deskP } = useScroll({ target: deskRef, offset: ["start 0.85", "end 0.55"] });
  const { scrollYProgress: mobP } = useScroll({ target: mobRef, offset: ["start 0.75", "end 0.45"] });
  const deskLine = deskP;
  const mobLine = mobP;
  return (
    <Section tone="dark" id="how-it-works" stars>
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow center>Process</Eyebrow>
        <SectionTitle tone="dark" center lead="How It Works" />
        <Reveal delay={0.15}>
          <p className="max-w-[520px] text-[16px] leading-[1.7] lg:text-[17px]" style={{ color: C.mutedDark }}>
            From choosing your account to receiving your reward, every step is clear.
          </p>
        </Reveal>
      </div>

      {/* Desktop: horizontal track */}
      <motion.div
        ref={deskRef}
        className="relative mt-[64px] hidden grid-cols-4 gap-[24px] lg:grid"
        variants={staggerParent(0.12)}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute left-[12.5%] right-[12.5%] top-[28px] h-[2px] rounded-full" style={{ background: "rgba(148,178,255,0.12)" }} aria-hidden="true">
          <motion.div
            className="h-full origin-left rounded-full"
            style={{ scaleX: reduce ? 1 : deskLine, background: "linear-gradient(90deg, #2563eb, #60a5fa)", boxShadow: "0 0 14px rgba(96,165,250,0.8)" }}
          />
        </div>
        {HOW_IT_WORKS_STEPS.map((s, i) => (
          <StepCard key={s.label} step={s} index={i} progress={deskLine} vertical={false} />
        ))}
      </motion.div>

      {/* Mobile: vertical timeline */}
      <motion.div
        ref={mobRef}
        className="relative mt-[48px] flex flex-col gap-[20px] lg:hidden"
        variants={staggerParent(0.1)}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="absolute bottom-[40px] left-[27px] top-[28px] w-[2px] rounded-full" style={{ background: "rgba(148,178,255,0.12)" }} aria-hidden="true">
          <motion.div className="w-full h-full origin-top rounded-full" style={{ scaleY: reduce ? 1 : mobLine, background: "linear-gradient(180deg, #2563eb, #60a5fa)", boxShadow: "0 0 14px rgba(96,165,250,0.8)" }} />
        </div>
        {HOW_IT_WORKS_STEPS.map((s, i) => (
          <StepCard key={s.label} step={s} index={i} progress={mobLine} vertical />
        ))}
      </motion.div>

      <Reveal className="mt-[52px] flex justify-center lg:mt-[64px]">
        <Pill href="#challenge" onClick={() => pauseHeavyScenesForNav()}>
          Explore the FYT process
        </Pill>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison — FYT vs others                                          */
/* ------------------------------------------------------------------ */

function CheckDot({ on }: { on: boolean }) {
  return (
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full" style={{ background: on ? "linear-gradient(180deg, #4f8cff, #2563eb)" : "#e8ebf2" }}>
      {on ? (
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M11.6662 3.5L5.25017 9.9162L2.3338 6.99975" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#8b93a7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

function Stars() {
  return (
    <span className="flex gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 16 16" fill="#2563eb">
          <path d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" />
        </svg>
      ))}
      <svg width="15" height="15" viewBox="0 0 16 16">
        <defs>
          <linearGradient id="rd-halfstar">
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
        <path fill="url(#rd-halfstar)" d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" />
      </svg>
    </span>
  );
}

export function Comparison() {
  const reduce = useReducedMotion();
  return (
    <Section tone="light">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow tone="light" center>
          The FYT Advantage
        </Eyebrow>
        <SectionTitle tone="light" center size="xl" lead="The difference is" highlight="clear." />
        <Reveal delay={0.1} className="flex flex-col items-center gap-[10px]">
          <h3 className="text-[20px] font-semibold tracking-[-0.02em] lg:text-[24px]" style={{ color: C.textLight }}>
            Built for Traders. Backed by Transparency.
          </h3>
          <p className="max-w-[560px] text-[15px] leading-[1.7] lg:text-[16px]" style={{ color: C.mutedLight }}>
            See how we provide more value, more freedom, and more opportunities to grow.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-[44px] lg:mt-[60px]">
        <div className="relative overflow-hidden rounded-[26px] bg-white" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 50px 100px -60px rgba(30,64,175,0.5)" }}>
          <table className="w-full table-fixed border-collapse" aria-label="FYT compared with other prop firms">
            <colgroup>
              <col className="w-[27%] lg:w-[28%]" />
              <col className="w-[38%] lg:w-[38%]" />
              <col className="w-[35%] lg:w-[34%]" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="px-[10px] py-[18px] text-left text-[10px] font-semibold uppercase tracking-[0.14em] sm:px-[20px] lg:px-[32px] lg:py-[24px] lg:text-[12px]" style={{ color: "#8b93a7" }}>
                  Criteria
                </th>
                <th scope="col" className="relative px-[10px] py-[18px] text-left sm:px-[20px] lg:px-[28px] lg:py-[24px]" style={{ background: "linear-gradient(180deg, #2563eb, #1d4ed8)" }}>
                  <span className="flex items-center gap-[10px]">
                    <span className="hidden size-[30px] items-center justify-center rounded-[9px] bg-[#0b1330] sm:flex">
                      <img src={imgFytMark} alt="" className="h-[18px] w-auto" loading="lazy" decoding="async" />
                    </span>
                    <span className="text-[12px] font-semibold text-white sm:text-[15px] lg:text-[17px]">Funding Your Trades</span>
                  </span>
                </th>
                <th scope="col" className="px-[10px] py-[18px] text-left text-[12px] font-semibold sm:px-[20px] sm:text-[15px] lg:px-[28px] lg:py-[24px] lg:text-[17px]" style={{ color: "#6b7280" }}>
                  Others
                </th>
              </tr>
            </thead>
            <motion.tbody variants={staggerParent(0.045)} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
              {COMPARISON_ROWS.map((row, i) => (
                <motion.tr
                  key={row.criteria}
                  variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
                  className="group"
                >
                  <th
                    scope="row"
                    className="break-words hyphens-auto px-[10px] py-[13px] text-left align-middle text-[11px] font-medium leading-[1.35] sm:px-[20px] sm:text-[14px] lg:px-[32px] lg:py-[17px] lg:text-[15px]"
                    style={{ color: C.textLight, borderTop: `1px solid ${C.borderLight}` }}
                  >
                    {row.criteria}
                  </th>
                  <td
                    className="px-[10px] py-[13px] align-middle sm:px-[20px] lg:px-[28px] lg:py-[17px]"
                    style={{ background: i % 2 ? "rgba(37,99,235,0.07)" : "rgba(37,99,235,0.045)", borderTop: "1px solid rgba(37,99,235,0.1)" }}
                  >
                    <span className="flex items-center gap-[8px] sm:gap-[12px]">
                      <span className="hidden sm:flex">
                        <CheckDot on />
                      </span>
                      <span className="break-words text-[11px] font-semibold leading-[1.35] sm:text-[14px] lg:text-[15px]" style={{ color: "#0b1d4d" }}>
                        {row.fyt}
                      </span>
                    </span>
                  </td>
                  <td className="px-[10px] py-[13px] align-middle sm:px-[20px] lg:px-[28px] lg:py-[17px]" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                    <span className="flex items-center gap-[8px] sm:gap-[12px]">
                      <span className="hidden sm:flex">
                        <CheckDot on={false} />
                      </span>
                      <span className="break-words text-[11px] leading-[1.35] sm:text-[14px] lg:text-[15px]" style={{ color: "#6b7280" }}>
                        {row.others}
                      </span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-[32px] flex flex-col items-center justify-center gap-[14px] sm:flex-row sm:gap-[20px]">
        <p className="flex items-center gap-[8px] text-[14px] font-medium" style={{ color: "#4b5563" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="#2563eb" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          Trusted by thousands of traders worldwide
        </p>
        <span className="hidden h-[16px] w-px sm:block" style={{ background: "rgba(0,0,0,0.12)" }} />
        <div className="flex items-center gap-[8px]">
          <Stars />
          <p className="text-[14px] font-medium" style={{ color: "#4b5563" }}>
            4.5/5 Trust Index Rating
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Product showcase — dashboard tilts upright as it scrolls in          */
/* ------------------------------------------------------------------ */

function DashboardStage() {
  const reduce = useReducedMotion();
  // Phones get a flat (2D) rise-and-grow; the 3D tilt is desktop-only.
  const tilt3d = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  const p = scrollYProgress;
  const rotateX = useTransform(p, [0, 1], [tilt3d ? 26 : 0, 0]);
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const y = useTransform(p, [0, 1], [60, 0]);
  const glow = useTransform(p, [0, 1], [0.15, 0.7]);
  return (
    <div ref={ref} className="relative w-full" style={{ perspective: 1400 }}>
      {/* Lit "stage" so the dark screenshot reads on the dark section: a bright
          blue core behind it, a soft wide halo, and a light floor reflection. */}
      <motion.div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[88%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ opacity: reduce ? 0.9 : glow, background: "radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.55) 0%, rgba(37,99,235,0.4) 35%, transparent 70%)" }} />
      <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[-6%] h-[22%] rounded-[50%]" style={{ background: "radial-gradient(ellipse, rgba(147,197,253,0.35), transparent 70%)" }} />
      <motion.div className="relative" style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}>
        <img
          src={imgDashboardMockup}
          alt="FYT trader dashboard overview"
          loading="lazy"
          decoding="async"
          width={1280}
          height={983}
          className="relative h-auto w-full object-contain"
          style={{ filter: "brightness(1.18) contrast(1.06) saturate(1.1) drop-shadow(0 0 1px rgba(191,219,254,0.85)) drop-shadow(0 0 18px rgba(96,165,250,0.35)) drop-shadow(0 40px 60px rgba(2,6,23,0.6))" }}
        />
      </motion.div>
    </div>
  );
}

export function ProductShowcase() {
  const reduce = useReducedMotion();
  return (
    <Section tone="dark" stars>
      <div className="grid grid-cols-1 items-center gap-[40px] lg:grid-cols-12 lg:gap-[48px]">
        <div className="flex flex-col gap-[20px] lg:col-span-5">
          <Eyebrow>Overview of FYT</Eyebrow>
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[36px] lg:text-[46px]" style={{ color: C.textDark }}>
            <WordsReveal text={OVERVIEW_HEADING_TEXT} />
          </h2>
          <Reveal delay={0.15}>
            <p className="text-[16px] leading-[1.7]" style={{ color: C.mutedDark }}>
              A clear dashboard gives you everything needed to monitor accounts, request rewards, and manage your journey.
            </p>
          </Reveal>
          <motion.ul className="flex flex-wrap gap-[10px]" variants={staggerParent(0.08, 0.2)} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true }}>
            {OVERVIEW_BADGES.map(({ label, icon }) => (
              <motion.li
                key={label}
                variants={staggerChild}
                className="flex items-center gap-[8px] rounded-full px-[14px] py-[8px] text-[13px] font-medium"
                style={{ color: "#dbe6ff", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(96,165,250,0.2)" }}
              >
                <OverviewBadgeIcon kind={icon} />
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div className="lg:col-span-7">
          <DashboardStage />
        </div>
      </div>

      <motion.div
        className="mt-[48px] grid grid-cols-1 gap-[16px] lg:mt-[72px] lg:grid-cols-2 lg:gap-[24px]"
        variants={staggerParent(0.12)}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          variants={staggerChild}
          onPointerMove={spotlightMove}
          className="fyt-spot flex flex-col gap-[20px] rounded-[24px] p-[26px] lg:p-[36px]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))", border: `1px solid ${C.borderDark}` }}
        >
          <div>
            <p className="text-[22px] font-semibold tracking-[-0.02em] text-white lg:text-[26px]">Trusted Platform</p>
            <p className="mt-[8px] text-[15px] leading-[1.6]" style={{ color: C.mutedDark }}>
              Access your account with the platforms you already know.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-[10px] lg:gap-[14px]">
            {[
              { name: "MatchTrader", logo: imgMatchTraderLogo, h: "h-[18px] lg:h-[22px]" },
              { name: "Platform 5", logo: imgPlatform5Logo, h: "h-[22px] lg:h-[30px]" },
            ].map(({ name, logo, h }) => (
              <div
                key={name}
                className="flex min-w-0 items-center justify-center gap-[8px] rounded-[16px] px-[8px] py-[16px] transition-[translate] duration-300 hover:-translate-y-[3px] lg:gap-[10px] lg:py-[20px]"
                style={{ background: "linear-gradient(180deg, #3b82f6, #1d4ed8)", boxShadow: "0 16px 36px -18px rgba(37,99,235,0.9), inset 0 1px 0 rgba(255,255,255,0.3)" }}
              >
                <img src={logo} alt="" loading="lazy" decoding="async" className={`${h} w-auto object-contain`} />
                <span className="min-w-0 truncate text-[12px] font-semibold text-white min-[375px]:text-[13px] lg:text-[16px]">{name}</span>
              </div>
            ))}
          </div>
          <p className="flex items-center gap-[8px] text-[13px] font-medium text-[#93c5fd]">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5l5.5 2v4c0 3.5-2.3 6.2-5.5 7-3.2-.8-5.5-3.5-5.5-7v-4l5.5-2Z" stroke="#93c5fd" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Secure. Fast. Seamless.
          </p>
        </motion.div>

        <motion.div
          variants={staggerChild}
          className="relative flex flex-col gap-[22px] overflow-hidden rounded-[24px] p-[26px] lg:p-[36px]"
          style={{ background: "linear-gradient(145deg, #2f6bff 0%, #1d4ed8 55%, #1e3a8a 100%)", boxShadow: "0 40px 80px -40px rgba(37,99,235,0.8), inset 0 1px 0 rgba(255,255,255,0.3)" }}
        >
          <div aria-hidden="true" className="absolute -right-[80px] -top-[80px] size-[260px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)" }} />
          <div className="relative">
            <p className="text-[22px] font-semibold tracking-[-0.02em] text-white lg:text-[26px]">Trusted Support Team</p>
            <p className="mt-[8px] text-[15px] leading-[1.6] text-white/80">Fast, friendly support whenever traders need help.</p>
          </div>
          {/* 2x2 grid of equal tiles: icon + label, left aligned, live dot where it applies. */}
          <div className="relative grid grid-cols-2 gap-[10px]">
            {SUPPORT_FEATURES.map(({ label, icon, action }) => {
              const live = icon === "chat" || icon === "clock";
              const content: ReactNode = (
                <>
                  <span className="relative flex size-[38px] shrink-0 items-center justify-center rounded-[12px]" style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.24)" }}>
                    <SupportFeatureIcon kind={icon} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-[3px] text-left">
                    <span className="truncate text-[13px] font-semibold leading-tight text-white sm:text-[14px]">{label}</span>
                    {live && (
                      <span className="flex items-center gap-[5px] text-[11px] font-medium leading-none text-[#bbf7d0]">
                        <span className="size-[6px] rounded-full bg-[#4ade80] shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                        Online
                      </span>
                    )}
                  </span>
                </>
              );
              const cls = "flex min-h-[64px] items-center gap-[12px] rounded-[16px] px-[12px] py-[12px] text-left transition-[background-color,translate] duration-200 hover:-translate-y-[2px] sm:px-[14px]";
              const tileStyle = { background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.16)" } as const;
              if (action === "intercom")
                return (
                  <button key={label} type="button" onClick={() => void openIntercomMessenger()} aria-label="Open live chat" className={`${cls} cursor-pointer`} style={tileStyle}>
                    {content}
                  </button>
                );
              if (action === "email")
                return (
                  <a key={label} href={SUPPORT_EMAIL_HREF} aria-label="Email support" className={`${cls} no-underline`} style={tileStyle}>
                    {content}
                  </a>
                );
              return (
                <div key={label} className={cls} style={tileStyle}>
                  {content}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => void openIntercomMessenger()}
            className="group relative mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-full border-0 bg-white px-[22px] py-[13px] text-[14px] font-semibold text-[#1d4ed8] transition-[translate] duration-300 hover:-translate-y-[2px] sm:w-fit sm:self-start"
          >
            Chat with us
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-[4px]" aria-hidden="true">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#1d4ed8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA with the live trader globe                               */
/* ------------------------------------------------------------------ */

export function ClosingCta() {
  return (
    <Section tone="dark" stars grid={false} innerClassName="!pt-[24px] lg:!pt-[40px]">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow center>Global Community</Eyebrow>
        <h2 className="text-[32px] leading-[1.08] tracking-[-0.035em] sm:text-[40px] lg:text-[54px]" style={{ color: C.textDark }}>
          <span className="font-semibold">
            <WordsReveal text="Join a Growing Global Community" />
          </span>{" "}
          <span className="font-normal text-[0.8em]" style={{ color: "#a9b4cc" }}>
            <WordsReveal text="with FYT." delay={0.25} />
          </span>
        </h2>
      </div>
      <Reveal delay={0.1} className="mt-[36px] lg:mt-[48px]">
        <div className="relative overflow-hidden rounded-[28px]" style={{ border: `1px solid ${C.borderDark}`, boxShadow: "0 60px 120px -60px rgba(37,99,235,0.6)" }}>
          <TradingGlobeSlot />
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-[36px] flex justify-center lg:mt-[44px]">
        <Pill href={HERO_CONTENT.ctaPrimary.href} onClick={() => pauseHeavyScenesForNav()}>
          Become our Next Success Story!
        </Pill>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */

export function Faq() {
  const reduce = useReducedMotion();
  return (
    <Section tone="light">
      <div className="grid grid-cols-1 gap-[36px] lg:grid-cols-12 lg:gap-[64px]">
        <div className="flex flex-col gap-[20px] lg:col-span-5 lg:sticky lg:top-[180px] lg:self-start">
          <Eyebrow tone="light">FAQ</Eyebrow>
          <SectionTitle tone="light" lead="Frequently Asked" highlight="Questions" />
          <Reveal delay={0.2} className="hidden lg:block">
            <Pill href="https://intercom.help/funding-your-trades/en/" target="_blank" rel="noopener noreferrer">
              Go to FAQs
            </Pill>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Accordion.Root type="single" collapsible asChild>
            <motion.div className="flex flex-col gap-[12px]" variants={staggerParent(0.08)} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <motion.div key={q} variants={staggerChild}>
                  <Accordion.Item
                    value={`item-${i}`}
                    className="group/faq overflow-hidden rounded-[20px] bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(37,99,235,0.45)] data-[state=open]:shadow-[0_24px_50px_-30px_rgba(37,99,235,0.45)]"
                    style={{ border: `1px solid ${C.borderLight}` }}
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-[16px] border-0 bg-transparent px-[20px] py-[20px] text-left lg:px-[28px] lg:py-[24px]">
                        <span className="text-[16px] font-semibold leading-[1.35] tracking-[-0.01em] lg:text-[18px]" style={{ color: C.textLight }}>
                          {q}
                        </span>
                        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#eef4ff] transition-[rotate,background-color] duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-[#2563eb]">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="stroke-[#2563eb] group-data-[state=open]:stroke-white">
                            <path d="M7 1.5v11M1.5 7h11" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_220ms_ease-out] data-[state=open]:animate-[accordion-down_220ms_ease-out]">
                      <p className="px-[20px] pb-[22px] text-[15px] leading-[1.7] lg:px-[28px] lg:pb-[26px]" style={{ color: C.mutedLight }}>
                        {a}
                      </p>
                    </Accordion.Content>
                  </Accordion.Item>
                </motion.div>
              ))}
            </motion.div>
          </Accordion.Root>
          <Reveal className="mt-[28px] flex justify-center lg:hidden">
            <Pill href="https://intercom.help/funding-your-trades/en/" target="_blank" rel="noopener noreferrer">
              Go to FAQs
            </Pill>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

const SOCIAL_ICONS: Record<string, ReactNode> = {
  X: <path d="M2 2l6.7 8.6L2.4 18h2.3l5-5.7 4.4 5.7H18l-7-9.1L17.4 2h-2.3l-4.6 5.3L6.4 2H2z" fill="currentColor" />,
  Discord: (
    <path
      d="M15.5 4.5A13 13 0 0 0 12.6 3.6l-.3.7a10.7 10.7 0 0 0-4.6 0l-.3-.7c-1 .2-2 .5-2.9.9C2.7 7.2 2.2 9.9 2.4 12.5A13 13 0 0 0 6 14.4l.7-1.1c-.6-.2-1.1-.5-1.6-.8l.4-.3c2.9 1.4 6.1 1.4 9 0l.4.3c-.5.3-1 .6-1.6.8l.7 1.1a13 13 0 0 0 3.6-1.9c.3-3-.5-5.6-2.1-8zM7.6 11.2c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3zm4.8 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3z"
      fill="currentColor"
    />
  ),
  Instagram: (
    <>
      <rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="14.6" cy="5.4" r="1.1" fill="currentColor" />
    </>
  ),
  YouTube: (
    <>
      <rect x="1.5" y="4.5" width="17" height="11" rx="3" fill="currentColor" />
      <path d="M8.3 7.5v5l4.4-2.5-4.4-2.5z" fill="#03060d" />
    </>
  ),
  Telegram: <path d="M17.6 3.1 1.9 9.2c-.7.3-.7 1 0 1.2l3.9 1.2 1.5 4.7c.2.6.9.7 1.3.3l2.1-2 4 2.9c.5.4 1.2.1 1.3-.5l2.3-12.7c.1-.8-.5-1.4-1.3-1.1l.6-.1zM6.6 11.4l8.5-5.2-6.6 6.1-.3 2.7-1.6-3.6z" fill="currentColor" />,
};
const SOCIAL_ORDER = ["X", "Discord", "Instagram", "YouTube", "Telegram"] as const;

export function Footer() {
  const socialHref = (label: string) => FOOTER_LINKS.social.find((s) => s.label === label)?.href ?? "#";
  return (
    <footer className="fyt-rd relative w-full shrink-0 overflow-hidden" style={{ background: C.ink }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.45), transparent)" }} />
        <div className="absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.25), transparent 70%)" }} />
      </div>
      <div className="relative mx-auto w-full max-w-[1280px] px-[20px] pb-[40px] pt-[64px] lg:px-[80px] lg:pt-[88px]">
        <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-12 lg:gap-[48px]">
          <div className="flex flex-col gap-[18px] lg:col-span-5">
            <img src={imgFytLogo} alt="Funding Your Trades" loading="lazy" decoding="async" className="h-auto w-[190px]" />
            <p className="max-w-[320px] text-[15px] leading-[1.7]" style={{ color: C.mutedDark }}>
              A simulated-capital prop firm rewarding disciplined traders across 105+ countries.
            </p>
            <div className="flex items-center gap-[10px]">
              {SOCIAL_ORDER.map((label) => (
                <a
                  key={label}
                  href={socialHref(label)}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-[40px] items-center justify-center rounded-full bg-white/[0.04] text-[#9fb8e8] transition-[color,background-color,translate] duration-300 hover:-translate-y-[2px] hover:bg-[#2563eb] hover:text-white"
                  style={{ border: `1px solid ${C.borderDark}` }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    {SOCIAL_ICONS[label]}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[28px] sm:grid-cols-3 lg:col-span-7">
            {FOOTER_COLUMNS.map(({ heading, items }) => (
              <div key={heading} className="flex flex-col gap-[14px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">{heading}</p>
                <ul className="flex flex-col gap-[10px]">
                  {items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="text-[14px] text-[#d6ddec] no-underline transition-colors duration-200 hover:text-white">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[48px] rounded-[20px] p-[20px] text-[12px] lg:mt-[64px] lg:p-[28px]" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.borderDark}`, color: "#6c7690" }}>
          <div className="flex flex-col gap-[14px] [&_span]:text-[#c9d2e4]">
            <FooterLegalText />
          </div>
        </div>

        <div className="mt-[28px] flex flex-col items-center justify-between gap-[12px] text-[13px] sm:flex-row" style={{ color: "#6c7690" }}>
          <p>© 2026 Funding Your Trades. All rights reserved.</p>
          <a href="#" className="no-underline transition-colors hover:text-white" style={{ color: "#8e98b0" }} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
