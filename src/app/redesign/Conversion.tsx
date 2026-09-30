import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { PROMO_BENEFITS, PROMO_CODE, PROMO_DEADLINE, PROMO_DEAL_LINE, formatHoursLeft } from "@/app/data/promoBanner";
import { countryFlagUrl, fetchFeaturedPayouts, formatPayoutAmount, type PublicPayout } from "@/app/api/rewardsApi";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import { EASE } from "./ui";

/** "35% off" from "35% off + Buy 1 Get 2 Instantly" — follows the promo data automatically. */
const DEAL_SHORT = PROMO_DEAL_LINE.split("+")[0].trim();

function useNow(active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

function Digit({ value, label }: { value: string; label: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-[4px]">
      <div
        className="relative flex h-[46px] w-[50px] items-center justify-center overflow-hidden rounded-[12px] sm:h-[52px] sm:w-[58px]"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))", border: "1px solid rgba(148,178,255,0.2)" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="tabular absolute text-[22px] font-semibold tracking-[-0.02em] text-white sm:text-[26px]"
            initial={reduce ? false : { y: "70%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduce ? undefined : { y: "-70%", opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#7f8aa6]">{label}</span>
    </div>
  );
}

/** Offer + countdown + benefits, shown right above the challenge picker. */
export function PricingOffer() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "100px" });
  const left = formatHoursLeft(PROMO_DEADLINE, useNow(onScreen));
  return (
    <motion.div
      ref={ref}
      className="fyt-rd fyt-offer-border relative w-full overflow-hidden rounded-[22px] p-[18px] sm:p-[22px] lg:p-[26px]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-[60px] -top-[80px] size-[240px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }} />
      <div className="relative flex flex-col gap-[18px] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-[10px]">
          <span className="inline-flex w-fit items-center gap-[8px] rounded-full px-[10px] py-[5px] text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#fecaca", background: "rgba(220,38,38,0.16)", border: "1px solid rgba(248,113,113,0.35)" }}>
            <span className="relative flex size-[6px]">
              <span className="fyt-rd-ping absolute inset-0 rounded-full bg-[#f87171]" />
              <span className="relative size-[6px] rounded-full bg-[#f87171]" />
            </span>
            {left.expired ? "Offer" : "Offer ends in"}
          </span>
          <p className="text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[26px]">{PROMO_DEAL_LINE}</p>
          <p className="flex flex-wrap items-center gap-[8px] text-[13px] text-[#9aa6c2]">
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#0b1220] px-[10px] py-[4px] text-[12px] font-semibold tracking-[0.06em] text-white" style={{ border: "1px solid rgba(148,178,255,0.25)" }}>
              <span className="text-[#93c5fd]">CODE</span> {PROMO_CODE}
            </span>
            Coupon Auto applied
          </p>
        </div>
        {!left.expired && (
          <div className="flex items-start gap-[8px]" role="timer" aria-label={`${Number(left.hh)} hours ${Number(left.mm)} minutes left`}>
            <Digit value={left.hh} label="Hours" />
            <span className="pt-[10px] text-[22px] font-semibold text-[#5b6b8f]">:</span>
            <Digit value={left.mm} label="Min" />
            <span className="pt-[10px] text-[22px] font-semibold text-[#5b6b8f]">:</span>
            <Digit value={left.ss} label="Sec" />
          </div>
        )}
      </div>
      <ul className="relative mt-[18px] grid grid-cols-2 gap-[8px] border-t pt-[16px] sm:flex sm:flex-wrap sm:gap-x-[22px]" style={{ borderColor: "rgba(148,178,255,0.14)" }}>
        {PROMO_BENEFITS.map((b) => (
          <li key={b} className="flex items-center gap-[8px] text-[12px] font-medium text-[#dbe6ff] sm:text-[13px]">
            <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg, #4f8cff, #2563eb)" }}>
              <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M11.6662 3.5L5.25017 9.9162L2.3338 6.99975" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
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
    <div className="fyt-rd relative w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(148,178,255,0.12)" }} aria-label="Recent verified rewards">
      <div className="mx-auto flex w-full max-w-[1440px] items-center">
        <div className="z-[1] flex shrink-0 items-center gap-[8px] py-[12px] pl-[20px] pr-[14px] lg:pl-[80px]" style={{ background: "linear-gradient(90deg, #06101f 70%, transparent)" }}>
          <span className="relative flex size-[8px]">
            <span className="fyt-rd-ping absolute inset-0 rounded-full bg-[#22c55e]" />
            <span className="relative size-[8px] rounded-full bg-[#22c55e]" />
          </span>
          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86efac]">Live Rewards</span>
        </div>
        <div className="fyt-marquee-mask min-w-0 flex-1 overflow-hidden">
          <ul className={`flex items-center ${reduce ? "flex-wrap gap-[24px]" : "fyt-rd-marquee w-max"}`} style={reduce ? undefined : { animationDuration: "60s" }}>
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
          className="fyt-rd group fixed left-1/2 z-[2147482980] flex max-w-[calc(100vw-150px)] items-center gap-[10px] rounded-full py-[8px] pl-[18px] pr-[18px] min-[380px]:pl-[8px] no-underline sm:max-w-none sm:gap-[14px] sm:pr-[22px]"
          style={{
            // Inline so the shared .cta-shine rule (position: relative) can't override it.
            position: "fixed",
            bottom: "max(20px, env(safe-area-inset-bottom, 0px))",
            background: "linear-gradient(180deg, #4f8cff 0%, #2563eb 100%)",
            boxShadow: "0 18px 40px -12px rgba(37,99,235,0.8), 0 0 0 1px rgba(191,219,254,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
          aria-label={`Start Challenge, ${PROMO_DEAL_LINE}`}
        >
          <span className="hidden shrink-0 whitespace-nowrap rounded-full bg-white px-[10px] py-[6px] min-[380px]:inline text-[11px] font-bold uppercase tracking-[0.04em] text-[#1d4ed8] sm:text-[12px]">{DEAL_SHORT}</span>
          <span className="whitespace-nowrap text-[14px] font-semibold text-white sm:text-[15px]">Start Challenge</span>
          {!left.expired && (
            <span className="tabular hidden whitespace-nowrap rounded-full px-[10px] py-[5px] text-[12px] font-semibold text-white sm:inline-flex" style={{ background: "rgba(3,6,13,0.28)" }}>
              {left.hh}:{left.mm}:{left.ss} left
            </span>
          )}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="hidden shrink-0 transition-transform duration-300 group-hover:translate-x-[4px] min-[400px]:block" aria-hidden="true">
            <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
