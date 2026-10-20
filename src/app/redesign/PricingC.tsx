/**
 * Challenge pricing (model stack): pick 1-Step / 2-Step / Instant at the top,
 * then size, type and platform in one card. Launch (NEWDASH) or new-trader
 * (WELCOME45) offer, applied automatically through the checkout link.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import imgMatchTraderLogo from "@/assets/live-site/platform-logos/match-trader.png";
import imgPlatform5Logo from "@/assets/live-site/platform-logos/platform-5.png";
import { STEP_PLANS, STEP_SIZES, checkoutUrl, fmtSize, getEntry, type PlanId, type PlatformId, type StepId } from "@/app/data/pricing";
import { ALT_PROMO_CODE, PROMO_CODE, PROMO_DEADLINE } from "@/app/data/promoBanner";
import { SELECT_PLAN_EVENT, writeSavedPlan, type SavedPlan } from "@/app/data/savedPlan";
import { PricingHeading } from "./Growth";

const STEPS: StepId[] = ["1-Step", "2-Step", "Instant"];
const PLATFORMS: { id: PlatformId; label: string; logo: string }[] = [
  { id: "match-trader", label: "MatchTrader", logo: imgMatchTraderLogo },
  { id: "platform-5", label: "Platform 5", logo: imgPlatform5Logo },
];
const BLUE = "linear-gradient(180deg,#4f8cff,#2563eb)";
const LINE = "rgba(148,178,255,0.14)";
const MUTED = "#8e98b0";
const SOFT = "#c7d2e6";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------ offers ----------------------------------- */

type OfferId = "launch" | "welcome";
const OFFERS: Record<OfferId, { off: number; code: string; title: string; extras: string[]; who: string }> = {
  launch: { off: 0.4, code: PROMO_CODE, title: "40% OFF", extras: ["+1 bonus account", "+5% cashback"], who: "Launch offer" },
  welcome: { off: 0.45, code: ALT_PROMO_CODE, title: "45% OFF", extras: ["+ instant BOGO"], who: "New traders" },
};

function offerPrice(old: number, o: OfferId): number {
  return Math.round(old * (1 - OFFERS[o].off) * 100) / 100;
}

/** Checkout with the chosen code applied. Instant Prime SKUs cannot carry a coupon in the link. */
function offerCheckout(productId: number, o: OfferId): { href: string; auto: boolean } {
  const base = checkoutUrl(productId);
  if (base.includes("add-to-cart")) return { href: base, auto: false };
  if (o === "launch") return { href: base, auto: true };
  return { href: `https://fundingyourtrades.com/checkout-link/?products=${productId}:1&coupon=${ALT_PROMO_CODE}`, auto: true };
}

/* ------------------------------ shared state ----------------------------- */

function usePick() {
  const [step, setStepRaw] = useState<StepId>("2-Step");
  const [planRaw, setPlan] = useState<PlanId>("prime");
  const [platform, setPlatform] = useState<PlatformId>("match-trader");
  const [i, setI] = useState(3);
  const [offer, setOffer] = useState<OfferId>("launch");
  const plans = STEP_PLANS[step];
  const plan: PlanId = plans.some((p) => p.id === planRaw) ? planRaw : "prime";
  const sizes = STEP_SIZES[step];
  const size = sizes[Math.min(i, sizes.length - 1)];
  const entry = getEntry(step, plan, platform, size)!;
  const price = offerPrice(entry.priceOld, offer);
  const co = offerCheckout(entry.productId, offer);
  return {
    step, plan, platform, i, plans, sizes, size, entry, offer, price, co,
    save: Math.round((entry.priceOld - price) * 100) / 100,
    setStep: (s: StepId) => { setStepRaw(s); setPlan("prime"); },
    setPlan, setPlatform, setI, setOffer,
  };
}
type Pick = ReturnType<typeof usePick>;

function money(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function useClock(): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const left = Math.max(0, new Date(PROMO_DEADLINE).getTime() - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${Math.floor(left / 864e5)}d ${pad(Math.floor(left / 36e5) % 24)}h ${pad(Math.floor(left / 6e4) % 60)}m ${pad(Math.floor(left / 1e3) % 60)}s`;
}

/* ------------------------------ content ---------------------------------- */

const TYPE_INFO: Record<string, { badge: string; line: string }> = {
  prime: { badge: "No consistency", line: "One big day never holds a reward back" },
  classic: { badge: "News always", line: "News and hedging allowed when funded" },
  plus: { badge: "Fewest rules", line: "Just one 4% max loss" },
};
const INSTANT_PRIME = { badge: "More room", line: "6% max loss, 5 min days" };

function rules(p: Pick): [string, string][] {
  const e = p.entry;
  if (p.step === "Instant") return [[e.profit ?? "N/A", "Target"], [e.maxDaily, "Daily"], [e.maxOverall, "Max loss"], [e.split.replace("Up to ", ""), "Split"]];
  return [[p.step === "2-Step" ? `${e.p1}/${e.p2}` : e.p1 ?? "", p.step === "2-Step" ? "Targets" : "Target"], [e.maxDaily, "Daily"], [e.maxOverall, "Max loss"], [e.split.replace("Up to ", ""), "Split"]];
}

const IC = {
  split: "M3 17l6-6 4 4 8-8M14 7h7v7",
  news: "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5",
  hedge: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  ea: "M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
  sl: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8",
  wk: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  check: "M5 12.5l4.5 4.5L19 7.5",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 7.5h.01",
} as const;
type Perk = { d: string; label: string; challengeOnly: boolean };

/** Same lists as the live "Why traders choose this" panel. */
function perks(p: Pick): Perk[] {
  if (p.step === "Instant")
    return [
      { d: IC.split, label: "Up to 90% split", challengeOnly: false },
      { d: IC.wk, label: "Weekend holding", challengeOnly: false },
      { d: IC.cal, label: "Bi-weekly rewards", challengeOnly: false },
    ];
  const prime = p.plan === "prime";
  return [
    { d: IC.split, label: "Up to 100% split", challengeOnly: false },
    { d: IC.news, label: "News trading", challengeOnly: prime },
    { d: IC.hedge, label: "Hedging", challengeOnly: prime },
    { d: IC.ea, label: "EA and copy", challengeOnly: true },
    { d: IC.sl, label: "No SL rule", challengeOnly: false },
    { d: IC.wk, label: "Weekend holding", challengeOnly: false },
  ];
}

/* ------------------------------ atoms ------------------------------------ */

function Svg({ d, size = 18, color = "#93c5fd", w = 1.8 }: { d: string; size?: number; color?: string; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

/** Number that rolls when it changes. */
function Roll({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={reduce ? false : { y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: "-70%", opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="tabular inline-block">
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Seg<T extends string>({ items, value, onPick, render, size = 44 }: { items: readonly T[]; value: T; onPick: (v: T) => void; render?: (v: T, on: boolean) => ReactNode; size?: number }) {
  const idx = Math.max(0, items.indexOf(value));
  return (
    <div className="relative grid rounded-full p-[4px]" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`, background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
      <span aria-hidden="true" className="absolute bottom-[4px] top-[4px] rounded-full transition-[left] duration-300" style={{ left: `calc(4px + ${idx} * (100% - 8px) / ${items.length})`, width: `calc((100% - 8px) / ${items.length})`, background: BLUE, boxShadow: "0 8px 20px -10px rgba(37,99,235,0.9)" }} />
      {items.map((it) => {
        const on = it === value;
        return (
          <button key={it} type="button" aria-pressed={on} onClick={() => onPick(it)} className="relative z-[1] flex cursor-pointer items-center justify-center gap-[6px] rounded-full border-0 bg-transparent text-[14px] font-semibold transition-colors" style={{ height: size, color: on ? "#fff" : MUTED }}>
            {render ? render(it, on) : it}
          </button>
        );
      })}
    </div>
  );
}

function Label({ n, children, right }: { n?: number; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
        {n !== undefined && <span className="flex size-[18px] items-center justify-center rounded-full text-[10px] text-white" style={{ background: "rgba(59,130,246,0.35)" }}>{n}</span>}
        {children}
      </span>
      {right}
    </div>
  );
}

function TypeCards({ p }: { p: Pick }) {
  return (
    <div className="grid grid-cols-2 gap-[8px]">
      {p.plans.map((x) => {
        const on = x.id === p.plan;
        const note = x.id === "prime" && p.step !== "Instant" ? "No consistency" : "";
        return (
          <button key={x.id} type="button" aria-pressed={on} onClick={() => p.setPlan(x.id)} className="flex h-[58px] cursor-pointer items-center justify-between gap-[8px] rounded-[16px] px-[14px] text-left text-white transition-colors" style={{ border: `1.5px solid ${on ? "#60a5fa" : LINE}`, background: on ? "linear-gradient(180deg, rgba(59,130,246,0.26), rgba(37,99,235,0.06))" : "rgba(255,255,255,0.03)" }}>
            <span className="flex flex-col">
              <span className="text-[16px] font-bold leading-tight">{x.label}</span>
              {note && <span className="text-[11px] font-semibold text-[#86efac]">{note}</span>}
            </span>
            <span className="size-[16px] shrink-0 rounded-full" style={{ border: `2px solid ${on ? "#60a5fa" : "#5b6478"}`, background: on ? "#60a5fa" : "transparent", boxShadow: on ? "inset 0 0 0 2px #0b1430" : "none" }} />
          </button>
        );
      })}
    </div>
  );
}

/** Differences only, opened from the "Compare" link next to Type. */
function CompareTable({ p }: { p: Pick }) {
  const instant = p.step === "Instant";
  const ids = p.plans.map((x) => x.id);
  const names = p.plans.map((x) => x.label);
  const e = ids.map((id) => getEntry(p.step, id, p.platform, p.size)!);
  const rows: [string, string, string][] = instant
    ? [["Profit target", e[0].profit ?? "-", e[1].profit ?? "-"], ["Daily loss", e[0].maxDaily, e[1].maxDaily], ["Max loss", e[0].maxOverall, e[1].maxOverall], ["Min trading days", e[0].minDays, e[1].minDays]]
    : [["Consistency rule", "Applies", "None"], ["News trading", "Always", "Challenge"], ["Hedging", "Always", "Challenge"], ["Fee refund", "2nd reward", "1st reward"]];
  const href = instant ? "https://intercom.help/funding-your-trades/en/articles/14890800-instant-funding-models-compared" : "https://intercom.help/funding-your-trades/en/articles/13374417-fyt-classic-vs-fyt-prime";
  return (
    <div className="overflow-hidden rounded-[16px]" style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${LINE}` }}>
      <div className="grid grid-cols-[1.3fr_1fr_1fr] px-[12px] py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#93c5fd]">
        <span />
        <span className="text-center">{names[0]}</span>
        <span className="text-center">{names[1]}</span>
      </div>
      {rows.map(([k, a, b]) => (
        <div key={k} className="grid grid-cols-[1.3fr_1fr_1fr] items-center px-[12px] py-[9px] text-[12.5px]" style={{ borderTop: "1px solid rgba(148,178,255,0.08)" }}>
          <span style={{ color: SOFT }}>{k}</span>
          <span className="text-center font-semibold" style={{ color: ids[0] === p.plan ? "#fff" : MUTED }}>{a}</span>
          <span className="text-center font-semibold" style={{ color: ids[1] === p.plan ? "#fff" : MUTED }}>{b}</span>
        </div>
      ))}
      <a href={href} target="_blank" rel="noopener noreferrer" className="block px-[12px] py-[9px] text-center text-[12px] font-semibold text-[#93c5fd] no-underline hover:underline" style={{ borderTop: "1px solid rgba(148,178,255,0.08)" }}>
        Full comparison ↗
      </a>
    </div>
  );
}

function PlatformSeg({ p }: { p: Pick }) {
  return (
    <Seg
      items={PLATFORMS.map((x) => x.id)}
      value={p.platform}
      onPick={p.setPlatform}
      size={46}
      render={(id, on) => {
        const pl = PLATFORMS.find((x) => x.id === id)!;
        return (
          <>
            <img src={pl.logo} alt="" className="h-[16px] w-auto" style={{ filter: on ? "brightness(0) invert(1)" : "grayscale(1) brightness(1.6)", opacity: on ? 1 : 0.8 }} />
            <span>{pl.label}</span>
          </>
        );
      }}
    />
  );
}

function CodeLine({ p }: { p: Pick }) {
  const code = OFFERS[p.offer].code;
  const [copied, setCopied] = useState(false);
  if (p.co.auto)
    return (
      <span className="flex items-center justify-center gap-[8px] text-[12.5px]" style={{ color: SOFT }}>
        <span className="flex size-[18px] items-center justify-center rounded-full bg-[#22c55e]"><Svg d={IC.check} size={11} color="#04210f" w={3} /></span>
        Code <b className="text-white" style={{ fontFamily: MONO }}>{code}</b> applied automatically
      </span>
    );
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(code).then(() => setCopied(true)).catch(() => {});
      }}
      className="mx-auto flex cursor-pointer items-center gap-[8px] rounded-full border-0 bg-transparent text-[12.5px]"
      style={{ color: SOFT }}
    >
      Enter <b className="text-white" style={{ fontFamily: MONO }}>{code}</b> at checkout · <span className="text-[#93c5fd]">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function PerkGrid({ p, cols = 3 }: { p: Pick; cols?: 2 | 3 }) {
  const list = perks(p);
  return (
    <div className={`grid gap-[8px] ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {list.map((k) =>
        cols === 3 ? (
          <div key={k.label} className="flex flex-col items-center gap-[6px] rounded-[16px] px-[6px] pb-[10px] pt-[12px] text-center" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(148,178,255,0.1)" }}>
            <span className="relative flex size-[34px] items-center justify-center rounded-[11px]" style={{ background: "rgba(59,130,246,0.14)" }}>
              <Svg d={k.d} />
              <span className="absolute -right-[4px] -top-[4px] flex size-[14px] items-center justify-center rounded-full bg-[#22c55e]"><Svg d={IC.check} size={9} color="#04210f" w={3.2} /></span>
            </span>
            <span className="text-[11.5px] font-semibold leading-[1.2]">{k.label}</span>
            <span className="text-[9px] font-semibold tracking-[0.08em]" style={{ color: k.challengeOnly ? MUTED : "#86efac" }}>{k.challengeOnly ? "IN CHALLENGE" : "ALWAYS"}</span>
          </div>
        ) : (
          <span key={k.label} className="flex items-center gap-[8px] text-[12.5px] font-medium">
            <Svg d={k.d} size={16} color="#4ade80" w={2} />
            <span>
              {k.label}
              {k.challengeOnly && <span style={{ color: MUTED }}> · challenge</span>}
            </span>
          </span>
        ),
      )}
    </div>
  );
}


/** One-row offer switch with a single detail line under it. */
function OfferSwitch({ p }: { p: Pick }) {
  const clock = useClock();
  const o = OFFERS[p.offer];
  return (
    <div className="flex flex-col gap-[10px]">
      <div
        className="relative grid grid-cols-2 rounded-[20px] p-[5px]"
        role="radiogroup"
        aria-label="Choose your offer"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
      >
        <span
          aria-hidden="true"
          className="absolute bottom-[5px] top-[5px] rounded-[15px] transition-[left] duration-300"
          style={{ left: p.offer === "launch" ? 5 : "50%", width: "calc(50% - 5px)", background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(147,197,253,0.08))", border: "1px solid rgba(255,255,255,0.32)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 14px 30px -14px rgba(59,130,246,0.75)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        />
        {(["launch", "welcome"] as OfferId[]).map((id) => {
          const on = p.offer === id;
          return (
            <button key={id} type="button" role="radio" aria-checked={on} onClick={() => p.setOffer(id)} className="relative z-[1] flex h-[54px] cursor-pointer flex-col items-center justify-center rounded-[15px] border-0 bg-transparent transition-colors" style={{ color: on ? "#fff" : MUTED }}>
              <span className="text-[18px] font-semibold leading-none tracking-[-0.02em]">{OFFERS[id].title}</span>
              <span className="mt-[4px] text-[11px] font-medium" style={{ color: on ? "#bfdbfe" : MUTED }}>{OFFERS[id].who}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[6px] text-[12px] font-medium">
        {o.extras.map((x) => (
          <span key={x} className="rounded-full px-[10px] py-[5px] text-[#dbeafe]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>{x.replace(/^\+\s?/, "+ ")}</span>
        ))}
        <span className="flex items-center gap-[5px] rounded-full px-[10px] py-[5px] text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.22)" }}>
          <Svg d={IC.tag} size={12} color="#93c5fd" w={2} />
          {o.code}
        </span>
        {p.offer === "launch" ? (
          <span className="tabular rounded-full px-[10px] py-[5px] text-[#fecaca]" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>Ends in {clock}</span>
        ) : (
          <span className="rounded-full px-[10px] py-[5px] text-[#a7f3d0]" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>No expiry</span>
        )}
      </div>
    </div>
  );
}

/* ============================ The pricing section ============================ */

const MODEL_COPY: Record<StepId, { mark: string; line: string; short: string }> = {
  "1-Step": { mark: "1", line: "One target. No time limit.", short: "One target" },
  "2-Step": { mark: "2", line: "Two phases. More room to trade.", short: "More room" },
  Instant: { mark: "0", line: "Skip the evaluation.", short: "No evaluation" },
};

/** The three models, always at the top so nobody has to scroll to compare. */
function ModelTabs({ p }: { p: Pick }) {
  return (
    <div className="grid grid-cols-3 gap-[8px] lg:grid-cols-1 lg:gap-[10px]" role="tablist" aria-label="Challenge model">
      {STEPS.map((m) => {
        const on = m === p.step;
        const fromOld = getEntry(m, "prime", "match-trader", STEP_SIZES[m][0])?.priceOld ?? 0;
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => p.setStep(m)}
            className="relative flex cursor-pointer flex-col items-center gap-[4px] overflow-hidden rounded-[18px] px-[6px] py-[12px] text-white transition-[background,border-color,box-shadow] duration-300 lg:flex-row lg:items-center lg:gap-[14px] lg:px-[16px] lg:py-[14px] lg:text-left"
            style={{
              border: `1.5px solid ${on ? "rgba(96,165,250,0.85)" : LINE}`,
              background: on ? "linear-gradient(180deg, rgba(59,130,246,0.32), rgba(37,99,235,0.08))" : "rgba(255,255,255,0.03)",
              boxShadow: on ? "0 24px 50px -28px rgba(37,99,235,0.95)" : "none",
            }}
          >
            <span className="hidden size-[44px] shrink-0 items-center justify-center rounded-[14px] text-[17px] font-bold lg:flex" style={{ background: on ? BLUE : "rgba(255,255,255,0.07)" }}>{MODEL_COPY[m].mark}</span>
            <span className="flex flex-col items-center lg:flex-1 lg:items-start">
              <span className="text-[15px] font-bold lg:text-[17px]">{m}</span>
            </span>
            <span className="flex items-baseline gap-[3px] lg:flex-col lg:items-end lg:gap-0">
              <span className="text-[10px]" style={{ color: MUTED }}>from</span>
              <span className="text-[14px] font-bold text-[#93c5fd] lg:text-[17px]">{money(offerPrice(fromOld, p.offer))}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TrustRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-[14px] gap-y-[6px] text-[11.5px]" style={{ color: MUTED }}>
      <span className="flex items-center gap-[5px]">
        <span className="text-[#00b67a]" aria-hidden="true">★★★★★</span>
        <span className="font-semibold text-[#c7d2e6]">4.5/5 · 4K+ reviews</span>
      </span>
      <span>Card or crypto</span>
      <span>Rewards in 24-48h</span>
      <span>Fee back with reward</span>
    </div>
  );
}

export function ChallengePricing() {
  const p = usePick();
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [compare, setCompare] = useState(false);

  // Remember the visitor's plan (welcome-back card) - skip the default on load.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    writeSavedPlan({ step: p.step, plan: p.plan, platform: p.platform, size: p.size });
  }, [p.step, p.plan, p.platform, p.size]);

  // Plan finder / welcome-back can pick a plan for us.
  const { setStep, setPlan, setPlatform, setI } = p;
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<Partial<SavedPlan>>).detail ?? {};
      const step = d.step ?? "2-Step";
      if (d.step) setStep(d.step);
      if (d.plan) setPlan(d.plan);
      if (d.platform) setPlatform(d.platform);
      if (d.size) {
        const k = STEP_SIZES[step].indexOf(d.size);
        if (k >= 0) setI(k);
      }
    };
    window.addEventListener(SELECT_PLAN_EVENT, on);
    return () => window.removeEventListener(SELECT_PLAN_EVENT, on);
  }, [setStep, setPlan, setPlatform, setI]);

  return (
    <section id="challenge" className="fyt-rd relative w-full shrink-0 scroll-mt-[120px] overflow-hidden" style={{ background: `radial-gradient(90% 45% at 50% 0%, #0b1a3a 0%, #03060d 70%)`, color: "#eef0f6" }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.3), transparent)" }} />
      <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-[18px] px-[16px] pb-[64px] pt-[56px] lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-[48px] lg:px-[40px] lg:pb-[110px] lg:pt-[110px]">
        <div className="flex flex-col gap-[18px] lg:sticky lg:top-[140px] lg:self-start">
          <PricingHeading />
          <OfferSwitch p={p} />
          <ModelTabs p={p} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.step}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative overflow-hidden rounded-[26px]"
            style={{ border: "1px solid rgba(96,165,250,0.6)", background: "linear-gradient(180deg, rgba(37,99,235,0.2) 0%, rgba(10,18,40,0.92) 45%)", boxShadow: "0 50px 100px -50px rgba(37,99,235,0.95)" }}
          >
            <span aria-hidden="true" className="pointer-events-none absolute -right-[70px] -top-[80px] size-[240px] rounded-full" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.35), transparent 65%)" }} />
            <div className="relative flex flex-col gap-[16px] p-[16px] sm:p-[22px] lg:gap-[18px] lg:p-[28px]">

              <div className="flex flex-col gap-[8px]">
                <Label>Account size</Label>
                <div className="grid grid-cols-5 gap-[6px]">
                  {p.sizes.map((z, j) => {
                    const on = j === p.i;
                    return (
                      <button key={z} type="button" aria-pressed={on} onClick={() => p.setI(j)} className="h-[46px] cursor-pointer rounded-[13px] text-[13px] font-bold transition-colors sm:text-[14px]" style={{ border: `1px solid ${on ? "#60a5fa" : "rgba(148,178,255,0.16)"}`, background: on ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.02)", color: on ? "#fff" : SOFT }}>
                        {fmtSize(z)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <Label
                    right={
                      <button type="button" aria-expanded={compare} onClick={() => setCompare((v) => !v)} className="flex cursor-pointer items-center gap-[6px] rounded-full border-0 px-[10px] py-[5px] text-[12px] font-semibold text-[#bfdbfe]" style={{ background: compare ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.06)" }}>
                        <Svg d="M7 7h11l-3-3M17 17H6l3 3" size={12} color="#bfdbfe" w={2.2} />
                        {compare ? "Hide" : "Compare"}
                      </button>
                    }
                  >
                    Type
                  </Label>
                  <TypeCards p={p} />
                  <AnimatePresence initial={false}>
                    {compare && (
                      <motion.div key="cmp" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                        <CompareTable p={p} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <Label>Platform</Label>
                  <PlatformSeg p={p} />
                  <div className="mt-[4px] grid grid-cols-4 gap-[6px] rounded-[16px] p-[10px]" style={{ background: "rgba(0,0,0,0.25)" }}>
                    {rules(p).map(([v, l]) => (
                      <span key={l} className="flex flex-col items-center gap-[2px]">
                        <span className="text-[15px] font-bold">{v}</span>
                        <span className="text-[9.5px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>{l}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] rounded-[16px] p-[12px] lg:p-[16px]" style={{ background: "rgba(0,0,0,0.22)" }}>
                <Label>Why traders choose this</Label>
                <PerkGrid p={p} cols={2} />
              </div>

              <a href={p.co.href} className="flex h-[62px] items-center justify-between rounded-[18px] pl-[20px] pr-[8px] text-white no-underline transition-transform hover:-translate-y-[1px]" style={{ background: BLUE, boxShadow: "0 22px 44px -18px rgba(37,99,235,0.95)" }}>
                <span className="flex flex-col">
                  <span className="flex items-baseline gap-[8px]">
                    <Roll value={money(p.price)} className="text-[24px] font-bold leading-none" />
                    <s className="text-[13px] text-[#bfdbfe]">{money(p.entry.priceOld)}</s>
                  </span>
                  <span className="mt-[3px] text-[11px] font-semibold text-[#bbf7d0]">You save {money(p.save)}</span>
                </span>
                <span className="flex items-center gap-[6px] rounded-[13px] bg-white px-[16px] py-[12px] text-[14.5px] font-bold text-[#2563eb]">
                  Start {fmtSize(p.size)}
                  <Svg d="M5 12h14M13 6l6 6-6 6" size={15} color="#2563eb" w={2.6} />
                </span>
              </a>
              <CodeLine p={p} />
              <TrustRow />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
