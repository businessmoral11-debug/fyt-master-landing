import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { PROMO_BENEFITS, PROMO_CODE, PROMO_DEADLINE, PROMO_DEAL_LINE, formatHoursLeft } from "@/app/data/promoBanner";
import { countryFlagUrl, fetchFeaturedPayouts, formatPayoutAmount, type PublicPayout } from "@/app/api/rewardsApi";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import { EASE } from "./ui";

/** "40% off" pulled from the deal line (e.g. "Limited Time: 40% off + Buy 1 Get 3 Instantly"), so it follows the promo data automatically. */
/** "40% off + Buy 1 Get 3" (drops "Limited Time:" and "Instantly") for the floating button. */
const DEAL_COMPACT = PROMO_DEAL_LINE.replace(/^limited time:\s*/i, "").replace(/\s*instantly\s*$/i, "");

function useNow(active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

/** One countdown unit, e.g. "06" + "d". Plain text, no boxes, so the card stays calm. */
function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <span className="inline-flex items-baseline">
      <span className="tabular text-[22px] font-semibold tracking-[-0.02em] text-white sm:text-[26px]">{value}</span>
      <span className="ml-[2px] text-[13px] font-medium text-[#7f8aa6]">{unit}</span>
    </span>
  );
}

/** "40% off + Buy 1 Get 3 Instantly" (the "Limited time" part is the small label above it). */
const DEAL_HEADLINE = PROMO_DEAL_LINE.replace(/^limited time:\s*/i, "");

/** Offer + countdown, shown right above the challenge picker. Kept deliberately quiet. */
export function PricingOffer() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "100px" });
  const left = formatHoursLeft(PROMO_DEADLINE, useNow(onScreen));
  const days = Math.floor(Number(left.hh) / 24);
  const hours = String(Number(left.hh) % 24).padStart(2, "0");
  return (
    <motion.div
      ref={ref}
      className={`fyt-rd relative w-full overflow-hidden rounded-[20px] p-[20px] sm:p-[24px] lg:px-[32px] lg:py-[28px] ${onScreen ? "fyt-live" : ""}`}
      style={{
        background: "linear-gradient(180deg, rgba(37,99,235,0.16) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(148,178,255,0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 30px 60px -40px rgba(37,99,235,0.6)",
      }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="relative flex flex-col gap-[18px] lg:flex-row lg:items-center lg:justify-between lg:gap-[32px]">
        <div className="flex flex-col gap-[10px]">
          <span className="flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fca5a5]">
            <span className="relative flex size-[6px]">
              <span className="fyt-rd-ping-gated absolute inset-0 rounded-full bg-[#f87171]" />
              <span className="relative size-[6px] rounded-full bg-[#f87171]" />
            </span>
            Limited time
          </span>
          <p className="text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:text-[28px]">{DEAL_HEADLINE}</p>
          <p className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[13px] text-[#9aa6c2]">
            Code
            <span className="rounded-full bg-[#0b1220] px-[10px] py-[3px] text-[12px] font-semibold tracking-[0.06em] text-white" style={{ border: "1px solid rgba(148,178,255,0.25)" }}>
              {PROMO_CODE}
            </span>
            applied at checkout
          </p>
        </div>
        {!left.expired && (
          <div className="flex flex-col gap-[6px] border-t pt-[16px] lg:items-end lg:border-t-0 lg:border-l lg:pl-[32px] lg:pt-0" style={{ borderColor: "rgba(148,178,255,0.14)" }}>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#7f8aa6]">Ends in</span>
            <div className="flex items-baseline gap-[12px]" role="timer" aria-label={`${days} days ${Number(hours)} hours ${Number(left.mm)} minutes left`}>
              {days > 0 && <TimeUnit value={String(days).padStart(2, "0")} unit="d" />}
              <TimeUnit value={hours} unit="h" />
              <TimeUnit value={left.mm} unit="m" />
              <TimeUnit value={left.ss} unit="s" />
            </div>
          </div>
        )}
      </div>
      <ul className="relative mt-[20px] hidden flex-wrap gap-x-[22px] gap-y-[8px] border-t pt-[16px] lg:flex" style={{ borderColor: "rgba(148,178,255,0.12)" }}>
        {PROMO_BENEFITS.map((b) => (
          <li key={b} className="flex items-center gap-[8px] text-[13px] font-medium text-[#c7d4f0]">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.6662 3.5L5.25017 9.9162L2.3338 6.99975" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Rating + community line under the checkout button. */
export function PricingTrustLine() {
  return (
    <div className="flex flex-col items-center gap-[6px] border-t pt-[14px]" style={{ borderColor: "#E8EDF5" }}>
      <span className="flex items-center gap-[6px]">
        <span className="flex gap-[2px]" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 16 16" fill="#00b67a">
              <path d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" />
            </svg>
          ))}
          <svg width="13" height="13" viewBox="0 0 16 16">
            <defs>
              <linearGradient id="rd-pricing-halfstar">
                <stop offset="50%" stopColor="#00b67a" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path fill="url(#rd-pricing-halfstar)" d="M8 1.8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.1l4-.6L8 1.8Z" />
          </svg>
        </span>
        <span className="font-['DM_Sans',sans-serif] text-[12px] font-semibold text-[#111827]">4.5/5 Trust Index Rating</span>
      </span>
      <span className="font-['DM_Sans',sans-serif] text-[12px] text-[#6B7280]">Trusted by 21,500+ traders worldwide</span>
    </div>
  );
}

function relativeTime(iso: string | null, now: number): string {
  if (!iso) return "";
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Live marquee of the latest verified rewards (same public feed as the rewards table). */
export function PayoutTicker() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "150px" });
  const [items, setItems] = useState<PublicPayout[]>([]);
  const now = useNow(false);
  useEffect(() => {
    let cancelled = false;
    fetchFeaturedPayouts(1, 12)
      .then((res) => {
        if (!cancelled) setItems(res.data.filter((p) => p.amount));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (items.length === 0) return null;
  const track = reduce ? items : [...items, ...items];
  return (
    <div ref={ref} className={`fyt-rd relative w-full overflow-hidden ${onScreen ? "fyt-live" : ""}`} style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(148,178,255,0.12)" }} aria-label="Recent verified rewards">
      <div className="mx-auto flex w-full max-w-[1440px] items-center">
        <div className="z-[1] flex shrink-0 items-center gap-[8px] py-[12px] pl-[20px] pr-[14px] lg:pl-[80px]" style={{ background: "linear-gradient(90deg, #06101f 70%, transparent)" }}>
          <span className="relative flex size-[8px]">
            <span className="fyt-rd-ping-gated absolute inset-0 rounded-full bg-[#22c55e]" />
            <span className="relative size-[8px] rounded-full bg-[#22c55e]" />
          </span>
          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86efac]">Live Rewards</span>
        </div>
        <div className="fyt-marquee-mask min-w-0 flex-1 overflow-hidden">
          <ul className={`flex items-center ${reduce ? "flex-wrap gap-[24px]" : "fyt-rd-marquee w-max"}`} style={reduce ? undefined : { animationDuration: "60s", animationPlayState: onScreen ? "running" : "paused" }}>
            {track.map((p, i) => {
              const flag = countryFlagUrl(p.countryCode);
              return (
                <li key={`${p.id ?? i}-${i}`} aria-hidden={i >= items.length || undefined} className="mr-[36px] flex shrink-0 items-center gap-[10px] py-[12px] text-[13px]">
                  {flag && <img src={flag} alt="" width={18} height={13} loading="lazy" decoding="async" className="h-[13px] w-[18px] rounded-[2px] object-cover" />}
                  <span className="font-medium text-[#dbe6ff]">{p.traderName ?? "Trader"}</span>
                  <span className="font-semibold text-[#4ade80] tabular">{formatPayoutAmount(p.amount)}</span>
                  <span className="text-[#6c7690]">{relativeTime(p.createdAt, now)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Floating "Start Challenge" pill: appears after the hero, hides at the pricing section and footer. */
export function FloatingCta() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  const left = formatHoursLeft(PROMO_DEADLINE, useNow(show));
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight;
      const past = window.scrollY > vh * 1.1;
      const pricing = document.getElementById("challenge");
      let inPricing = false;
      if (pricing) {
        const r = pricing.getBoundingClientRect();
        inPricing = r.top < vh * 0.85 && r.bottom > vh * 0.15;
      }
      const nearEnd = window.scrollY + vh > document.documentElement.scrollHeight - 1100;
      setShow(past && !inPricing && !nearEnd);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#challenge"
          onClick={() => pauseHeavyScenesForNav()}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, x: "-50%" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fyt-rd cta-shine group fixed left-1/2 z-[2147482980] flex max-w-[calc(100vw-140px)] items-center gap-[12px] rounded-full py-[6px] pl-[18px] pr-[6px] no-underline sm:max-w-none sm:gap-[14px] sm:py-[8px] sm:pl-[8px] sm:pr-[22px]"
          style={{
            // Inline so the shared .cta-shine rule (position: relative) can't override it.
            position: "fixed",
            bottom: "max(20px, env(safe-area-inset-bottom, 0px))",
            background: "linear-gradient(180deg, #4f8cff 0%, #2563eb 100%)",
            boxShadow: "0 18px 40px -12px rgba(37,99,235,0.8), 0 0 0 1px rgba(191,219,254,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
          aria-label={`Claim offer: ${PROMO_DEAL_LINE}`}
        >
          {/* Phones: two compact lines. Desktop: offer chip + action + timer on one line. */}
          <span className="flex min-w-0 flex-col leading-none sm:hidden">
            <span className="whitespace-nowrap text-[14px] font-semibold text-white">Claim Offer</span>
            <span className="mt-[3px] whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[#dbeafe]">{DEAL_COMPACT}</span>
          </span>
          <span className="hidden shrink-0 whitespace-nowrap rounded-full bg-white px-[11px] py-[6px] text-[12px] font-bold uppercase tracking-[0.04em] text-[#1d4ed8] sm:inline">{DEAL_COMPACT}</span>
          <span className="hidden whitespace-nowrap text-[15px] font-semibold text-white sm:inline">Claim Offer</span>
          {!left.expired && (
            <span className="tabular hidden whitespace-nowrap rounded-full px-[10px] py-[5px] text-[12px] font-semibold text-white sm:inline-flex" style={{ background: "rgba(3,6,13,0.28)" }}>
              Ends in {Number(left.hh) >= 24 ? `${Math.floor(Number(left.hh) / 24)}d ${String(Number(left.hh) % 24).padStart(2, "0")}` : left.hh}:{left.mm}:{left.ss}
            </span>
          )}
          <span aria-hidden="true" className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white sm:size-auto sm:bg-transparent">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-[4px]">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" className="stroke-[#1d4ed8] sm:stroke-white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
