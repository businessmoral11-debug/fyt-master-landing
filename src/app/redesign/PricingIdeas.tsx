/**
 * TEST ONLY: pricing layouts A and C (round 2) shown under the live pricing so
 * the team can compare them on the preview. Remove the loser before main.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import imgMatchTraderLogo from "@/assets/live-site/platform-logos/match-trader.png";
import imgPlatform5Logo from "@/assets/live-site/platform-logos/platform-5.png";
import { STEP_PLANS, STEP_SIZES, checkoutUrl, fmtSize, getEntry, type PlanId, type PlatformId, type StepId } from "@/app/data/pricing";
import { ALT_PROMO_CODE, PROMO_CODE, PROMO_DEADLINE } from "@/app/data/promoBanner";

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
  return `${Math.floor(left / 864e5)}d ${pad(Math.floor(left / 36e5) % 24)}:${pad(Math.floor(left / 6e4) % 60)}:${pad(Math.floor(left / 1e3) % 60)}`;
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

/** Two offers side by side: auto-applied launch code, or the new-trader code. */
function OfferPicker({ p, compact }: { p: Pick; compact?: boolean }) {
  const clock = useClock();
  return (
    <div className="grid grid-cols-2 gap-[8px]" role="radiogroup" aria-label="Choose your offer">
      {(["launch", "welcome"] as OfferId[]).map((id) => {
        const o = OFFERS[id];
        const on = p.offer === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => p.setOffer(id)}
            className="relative flex cursor-pointer flex-col items-start gap-[6px] overflow-hidden rounded-[18px] text-left text-white transition-[transform,box-shadow] duration-300"
            style={{
              padding: compact ? "12px 12px 11px" : "14px 14px 12px",
              border: `1.5px solid ${on ? (id === "launch" ? "rgba(248,113,113,0.75)" : "rgba(52,211,153,0.75)") : LINE}`,
              background: on
                ? id === "launch"
                  ? "linear-gradient(160deg, rgba(239,68,68,0.22), rgba(37,99,235,0.12))"
                  : "linear-gradient(160deg, rgba(16,185,129,0.22), rgba(37,99,235,0.12))"
                : "rgba(255,255,255,0.03)",
              boxShadow: on ? "0 24px 50px -30px rgba(239,68,68,0.6)" : "none",
            }}
          >
            <span className="flex w-full items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: id === "launch" ? "#fca5a5" : "#6ee7b7" }}>{o.who}</span>
              <span className="flex size-[18px] items-center justify-center rounded-full" style={{ border: `2px solid ${on ? "#fff" : "#5b6478"}`, background: on ? "#fff" : "transparent" }}>
                {on && <Svg d={IC.check} size={11} color="#0a1226" w={3} />}
              </span>
            </span>
            <span className={`${compact ? "text-[22px]" : "text-[26px]"} font-bold leading-none tracking-[-0.03em]`}>{o.title}</span>
            <span className="text-[11.5px] leading-[1.3]" style={{ color: SOFT }}>{o.extras.join(" ")}</span>
            <span className="mt-[2px] flex items-center gap-[6px] rounded-full px-[8px] py-[3px] text-[10.5px] font-semibold" style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.25)" }}>
              <span style={{ fontFamily: MONO }}>{o.code}</span>
              {id === "launch" ? <span style={{ color: "#fca5a5", fontFamily: MONO }}>{clock.slice(0, -3)}</span> : <span className="text-[#6ee7b7]">no expiry</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TypeCards({ p }: { p: Pick }) {
  return (
    <div className="grid grid-cols-2 gap-[8px]">
      {p.plans.map((x) => {
        const on = x.id === p.plan;
        const info = p.step === "Instant" && x.id === "prime" ? INSTANT_PRIME : TYPE_INFO[x.id];
        return (
          <button key={x.id} type="button" aria-pressed={on} onClick={() => p.setPlan(x.id)} className="relative flex cursor-pointer flex-col items-start gap-[6px] rounded-[18px] p-[12px] text-left text-white transition-colors" style={{ border: `1.5px solid ${on ? "#60a5fa" : LINE}`, background: on ? "linear-gradient(180deg, rgba(59,130,246,0.26), rgba(37,99,235,0.06))" : "rgba(255,255,255,0.03)" }}>
            <span className="flex w-full items-center justify-between">
              <span className="text-[16px] font-bold">{x.label}</span>
              <span className="size-[16px] rounded-full" style={{ border: `2px solid ${on ? "#60a5fa" : "#5b6478"}`, background: on ? "#60a5fa" : "transparent", boxShadow: on ? "inset 0 0 0 2px #0b1430" : "none" }} />
            </span>
            <span className="rounded-full px-[8px] py-[3px] text-[10px] font-bold uppercase tracking-[0.1em]" style={{ background: on ? "rgba(34,197,94,0.16)" : "rgba(255,255,255,0.06)", color: on ? "#86efac" : SOFT }}>{info.badge}</span>
            <span className="text-[11.5px] leading-[1.35]" style={{ color: MUTED }}>{info.line}</span>
          </button>
        );
      })}
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

/* ================================ A v3 =================================== */

/** One-row offer switch with a single detail line under it. */
function OfferSwitch({ p }: { p: Pick }) {
  const clock = useClock();
  const o = OFFERS[p.offer];
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="relative grid grid-cols-2 rounded-[18px] p-[4px]" role="radiogroup" aria-label="Choose your offer" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
        <span aria-hidden="true" className="absolute bottom-[4px] top-[4px] rounded-[14px] transition-[left,background] duration-300" style={{ left: p.offer === "launch" ? 4 : "calc(50%)", width: "calc(50% - 4px)", background: p.offer === "launch" ? "linear-gradient(160deg,#ef4444,#b91c1c)" : "linear-gradient(160deg,#10b981,#047857)", boxShadow: "0 12px 26px -14px rgba(0,0,0,0.9)" }} />
        {(["launch", "welcome"] as OfferId[]).map((id) => {
          const on = p.offer === id;
          return (
            <button key={id} type="button" role="radio" aria-checked={on} onClick={() => p.setOffer(id)} className="relative z-[1] flex h-[52px] cursor-pointer flex-col items-center justify-center rounded-[14px] border-0 bg-transparent text-white">
              <span className="text-[17px] font-bold leading-none tracking-[-0.02em]">{OFFERS[id].title}</span>
              <span className="mt-[3px] text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: on ? "rgba(255,255,255,0.85)" : MUTED }}>{OFFERS[id].who}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-[8px] text-[12px]" style={{ color: SOFT }}>
        <span>{o.extras.join(" ")}</span>
        <span className="size-[3px] rounded-full bg-[#5b6478]" />
        <span className="font-semibold text-white" style={{ fontFamily: MONO }}>{o.code}</span>
        <span className="size-[3px] rounded-full bg-[#5b6478]" />
        {p.offer === "launch" ? <span style={{ color: "#fca5a5", fontFamily: MONO }}>{clock.slice(0, -3)}</span> : <span className="text-[#6ee7b7]">no expiry</span>}
      </div>
    </div>
  );
}

function IdeaA() {
  const p = usePick();
  const r = rules(p);
  const touch = useRef<number | null>(null);
  const go = (d: number) => p.setI(Math.max(0, Math.min(p.sizes.length - 1, p.i + d)));
  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="m-0 text-center text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Choose your <span className="fyt-gradient-text">challenge.</span>
      </h2>

      <OfferSwitch p={p} />
      <Seg items={STEPS} value={p.step} onPick={p.setStep} />

      <div
        className="relative flex select-none flex-col gap-[16px] overflow-hidden rounded-[28px] px-[18px] pb-[18px] pt-[16px]"
        style={{ background: "linear-gradient(150deg,#2347b5 0%,#13286b 40%,#0a1433 75%,#070d1f 100%)", border: "1px solid rgba(147,197,253,0.4)", boxShadow: "0 50px 90px -36px rgba(37,99,235,0.85), inset 0 1px 0 rgba(255,255,255,0.22)" }}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-[70px] -top-[90px] size-[260px] rounded-full" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.5), transparent 65%)" }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 45%, transparent 60%)" }} />

        {/* Type, inside the card */}
        <div className="relative grid grid-cols-2 gap-[6px] rounded-[16px] p-[4px]" style={{ background: "rgba(3,6,13,0.35)" }}>
          {p.plans.map((x) => {
            const on = x.id === p.plan;
            const info = p.step === "Instant" && x.id === "prime" ? INSTANT_PRIME : TYPE_INFO[x.id];
            return (
              <button key={x.id} type="button" aria-pressed={on} onClick={() => p.setPlan(x.id)} className="flex h-[48px] cursor-pointer flex-col items-center justify-center rounded-[12px] border-0 text-white transition-colors" style={{ background: on ? "rgba(255,255,255,0.16)" : "transparent", boxShadow: on ? "inset 0 0 0 1px rgba(255,255,255,0.25)" : "none" }}>
                <span className="text-[14px] font-bold">{x.label}</span>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.1em]" style={{ color: on ? "#86efac" : "#9fb0d6" }}>{info.badge}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex items-center justify-between">
          <button type="button" aria-label="Smaller account" disabled={p.i === 0} onClick={() => go(-1)} className="flex size-[44px] cursor-pointer items-center justify-center rounded-full disabled:opacity-30" style={{ border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.07)" }}>
            <Svg d="M15 6l-6 6 6 6" size={18} color="#fff" w={2.2} />
          </button>
          <span className="flex flex-col items-center gap-[2px]">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#93c5fd]">ACCOUNT SIZE</span>
            <Roll value={money(p.size)} className="text-[44px] font-bold leading-[1.05] tracking-[-0.04em]" />
            <span className="flex gap-[5px] pt-[4px]">
              {p.sizes.map((z, k) => (
                <button key={z} type="button" aria-label={fmtSize(z)} onClick={() => p.setI(k)} className="h-[5px] cursor-pointer rounded-full border-0 p-0 transition-all duration-300" style={{ width: k === p.i ? 20 : 5, background: k === p.i ? "#bfdbfe" : "rgba(255,255,255,0.25)" }} />
              ))}
            </span>
          </span>
          <button type="button" aria-label="Bigger account" disabled={p.i === p.sizes.length - 1} onClick={() => go(1)} className="flex size-[44px] cursor-pointer items-center justify-center rounded-full disabled:opacity-30" style={{ border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.07)" }}>
            <Svg d="M9 6l6 6-6 6" size={18} color="#fff" w={2.2} />
          </button>
        </div>

        <div className="relative grid grid-cols-4 gap-[6px]">
          {r.map(([v, l]) => (
            <span key={l} className="flex flex-col items-center gap-[2px]">
              <span className="text-[15px] font-bold">{v}</span>
              <span className="text-[9.5px] uppercase tracking-[0.08em] text-[#93c5fd]">{l}</span>
            </span>
          ))}
        </div>

        {/* Platform + price */}
        <div className="relative flex flex-col gap-[12px] pt-[14px]" style={{ borderTop: "1px dashed rgba(255,255,255,0.2)" }}>
          <div className="flex gap-[6px]">
            {PLATFORMS.map((pl) => {
              const on = pl.id === p.platform;
              return (
                <button key={pl.id} type="button" aria-pressed={on} onClick={() => p.setPlatform(pl.id)} className="flex h-[36px] flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-full text-[12.5px] font-semibold text-white" style={{ border: `1px solid ${on ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.14)"}`, background: on ? "rgba(255,255,255,0.14)" : "transparent", opacity: on ? 1 : 0.7 }}>
                  <img src={pl.logo} alt="" className="h-[13px] w-auto" style={{ filter: "brightness(0) invert(1)" }} />
                  {pl.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-end justify-between">
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#93c5fd]">You pay today</span>
              <span className="flex items-baseline gap-[8px]">
                <Roll value={money(p.price)} className="text-[34px] font-bold tracking-[-0.03em]" />
                <s className="text-[14px]" style={{ color: "#9fb0d6" }}>{money(p.entry.priceOld)}</s>
              </span>
            </span>
            <span className="rounded-full bg-[#4ade80] px-[10px] py-[6px] text-[12px] font-bold text-[#052e16]">Save {money(p.save)}</span>
          </div>
        </div>
      </div>

      {/* Perks: one swipeable row */}
      <div className="flex flex-col gap-[8px]">
        <Label>Why traders choose this</Label>
        <div className="-mx-[16px] flex gap-[8px] overflow-x-auto px-[16px] pb-[2px]" style={{ scrollbarWidth: "none", maskImage: "linear-gradient(90deg, transparent, #000 16px, #000 calc(100% - 28px), transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 16px, #000 calc(100% - 28px), transparent)" }}>
          {perks(p).map((k) => (
            <span key={k.label} className="flex shrink-0 items-center gap-[8px] rounded-full py-[8px] pl-[8px] pr-[12px] text-[12.5px] font-semibold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,178,255,0.14)" }}>
              <span className="flex size-[24px] items-center justify-center rounded-full" style={{ background: "rgba(34,197,94,0.16)" }}><Svg d={k.d} size={13} color="#4ade80" w={2} /></span>
              {k.label}
              {k.challengeOnly && <span className="text-[10px] font-medium" style={{ color: MUTED }}>challenge</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <a href={p.co.href} className="flex h-[60px] items-center justify-between rounded-full pl-[24px] pr-[8px] text-white no-underline transition-transform hover:-translate-y-[1px]" style={{ background: BLUE, boxShadow: "0 22px 44px -16px rgba(37,99,235,0.95)" }}>
          <span className="text-[16px] font-semibold">Start challenge · {money(p.price)}</span>
          <span className="flex size-[44px] items-center justify-center rounded-full bg-white"><Svg d="M5 12h14M13 6l6 6-6 6" size={18} color="#2563eb" w={2.4} /></span>
        </a>
        <CodeLine p={p} />
      </div>
    </div>
  );
}

/* ================================ E v2 =================================== */

const STAMP_ROT = [-8, 5, -3, 7, -6, 4];

/** A boarding-pass field you can tap to change. */
function PassField({ k, v, onTap, hint }: { k: string; v: string; onTap?: () => void; hint?: string }) {
  const inner = (
    <>
      <span className="flex items-center gap-[4px] text-[9.5px] tracking-[0.16em] text-[#93c5fd]">
        {k}
        {onTap && <Svg d="M7 7h11l-3-3M17 17H6l3 3" size={10} color="#93c5fd" w={2.2} />}
      </span>
      <span className="max-w-full truncate text-[13.5px] font-bold leading-[1.15] text-white">{v}</span>
      {hint && <span className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#86efac]">{hint}</span>}
    </>
  );
  return onTap ? (
    <button type="button" onClick={onTap} className="flex min-w-0 cursor-pointer flex-col items-start gap-[2px] rounded-[12px] border-0 px-[8px] py-[7px] text-left" style={{ background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)" }}>
      {inner}
    </button>
  ) : (
    <span className="flex min-w-0 flex-col gap-[2px] px-[8px] py-[7px]">{inner}</span>
  );
}

function IdeaE() {
  const p = usePick();
  const clock = useClock();
  const e = p.entry;
  const cyclePlan = () => {
    const ids = p.plans.map((x) => x.id);
    p.setPlan(ids[(ids.indexOf(p.plan) + 1) % ids.length]);
  };
  const cyclePlatform = () => p.setPlatform(p.platform === "match-trader" ? "platform-5" : "match-trader");
  const planLabel = p.plans.find((x) => x.id === p.plan)?.label ?? "Prime";
  const badge = (p.step === "Instant" && p.plan === "prime" ? INSTANT_PRIME : TYPE_INFO[p.plan]).badge;
  const targets = p.step === "Instant" ? e.profit ?? "N/A" : p.step === "2-Step" ? `${e.p1}/${e.p2}` : e.p1 ?? "";
  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="m-0 text-center text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Your pass to <span className="fyt-gradient-text">funded.</span>
      </h2>
      <OfferSwitch p={p} />
      <Seg items={STEPS} value={p.step} onPick={p.setStep} />
      <div className="grid grid-cols-5 gap-[6px]">
        {p.sizes.map((z, j) => {
          const on = j === p.i;
          return (
            <button key={z} type="button" aria-pressed={on} onClick={() => p.setI(j)} className="h-[42px] cursor-pointer rounded-[13px] text-[13px] font-bold" style={{ border: `1px solid ${on ? "#60a5fa" : "rgba(148,178,255,0.16)"}`, background: on ? "rgba(59,130,246,0.28)" : "transparent", color: on ? "#fff" : SOFT }}>
              {fmtSize(z)}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-[26px]" style={{ background: "linear-gradient(160deg,#1d4ed8 0%,#1e3a8a 38%,#0b1638 100%)", boxShadow: "0 50px 90px -40px rgba(37,99,235,0.9)", border: "1px solid rgba(147,197,253,0.4)" }}>
        <div className="flex flex-col gap-[14px] px-[18px] pb-[16px] pt-[18px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#bfdbfe]">FYT TRADER PASS</span>
            <span className="rounded-full px-[8px] py-[4px] text-[10.5px] font-semibold" style={{ fontFamily: MONO, background: p.offer === "launch" ? "rgba(239,68,68,0.28)" : "rgba(16,185,129,0.28)", color: p.offer === "launch" ? "#fecaca" : "#a7f3d0" }}>
              {OFFERS[p.offer].code}
              {p.offer === "launch" ? ` · ${clock.slice(0, -3)}` : ""}
            </span>
          </div>
          <div className="flex items-center justify-between px-[8px]">
            <span className="flex flex-col">
              <span className="text-[10px] tracking-[0.18em] text-[#93c5fd]">FROM</span>
              <span className="text-[28px] font-bold tracking-[-0.03em]">You</span>
            </span>
            <svg width="64" height="20" viewBox="0 0 64 20" fill="none" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 4" aria-hidden="true"><path d="M2 10h54M50 4l8 6-8 6" /></svg>
            <span className="flex flex-col items-end">
              <span className="text-[10px] tracking-[0.18em] text-[#93c5fd]">TO</span>
              <Roll value={fmtSize(p.size)} className="text-[28px] font-bold tracking-[-0.03em]" />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-[6px]">
            <PassField k="CLASS" v={planLabel} hint={badge} onTap={cyclePlan} />
            <PassField k="GATE" v={p.platform === "match-trader" ? "MatchTrader" : "Platform 5"} onTap={cyclePlatform} />
            <PassField k="MODEL" v={p.step} />
            <PassField k={p.step === "2-Step" ? "TARGETS" : "TARGET"} v={targets} />
            <PassField k="DAILY / MAX" v={`${e.maxDaily} / ${e.maxOverall}`} />
            <PassField k="SPLIT" v={e.split.replace("Up to ", "")} />
          </div>
          <span className="text-center text-[10.5px]" style={{ color: "#9fb0d6" }}>Tap CLASS or GATE to switch</span>
        </div>

        <div className="relative mx-[18px] h-0" style={{ borderTop: "2px dashed rgba(191,219,254,0.35)" }} />

        <div className="flex flex-col gap-[12px] px-[18px] pb-[18px] pt-[14px]" style={{ background: "rgba(3,6,13,0.35)" }}>
          <span className="text-[10.5px] font-bold tracking-[0.18em] text-[#bfdbfe]">STAMPED · WHY TRADERS CHOOSE THIS</span>
          <div className="grid grid-cols-3 justify-items-center gap-x-[6px] gap-y-[10px]">
            {perks(p).map((k, j) => {
              const c = k.challengeOnly ? "#fcd34d" : j % 2 ? "#86efac" : "#bfdbfe";
              return (
                <span key={k.label} className="flex size-[80px] flex-col items-center justify-center gap-[3px] rounded-full text-center" style={{ border: `2px dashed ${c}`, transform: `rotate(${STAMP_ROT[j]}deg)` }}>
                  <Svg d={k.d} size={18} color={c} />
                  <span className="px-[6px] text-[9.5px] font-bold uppercase leading-[1.1] tracking-[0.04em]" style={{ color: c }}>{k.label}</span>
                  {k.challengeOnly && <span className="text-[8px] font-bold uppercase tracking-[0.06em]" style={{ color: c }}>challenge</span>}
                </span>
              );
            })}
          </div>
          <div className="flex items-end justify-between pt-[4px]">
            <span className="flex flex-col">
              <span className="text-[10px] tracking-[0.18em] text-[#93c5fd]">FARE TODAY</span>
              <span className="flex items-baseline gap-[8px]">
                <Roll value={money(p.price)} className="text-[34px] font-bold tracking-[-0.04em]" />
                <s className="text-[13px]" style={{ color: "#9fb0d6" }}>{money(e.priceOld)}</s>
              </span>
            </span>
            <svg width="88" height="34" viewBox="0 0 96 36" aria-hidden="true"><path d="M2 2v32M6 2v32M9 2v32M14 2v32M16 2v32M21 2v32M26 2v32M28 2v32M33 2v32M37 2v32M40 2v32M45 2v32M47 2v32M52 2v32M57 2v32M59 2v32M64 2v32M68 2v32M71 2v32M76 2v32M78 2v32M83 2v32M88 2v32M90 2v32M94 2v32" stroke="rgba(219,234,254,0.8)" strokeWidth="1.6" /></svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <a href={p.co.href} className="flex h-[60px] items-center justify-between rounded-full pl-[24px] pr-[8px] text-white no-underline transition-transform hover:-translate-y-[1px]" style={{ background: BLUE, boxShadow: "0 22px 44px -16px rgba(37,99,235,0.95)" }}>
          <span className="text-[16px] font-semibold">Board now · {money(p.price)}</span>
          <span className="flex size-[44px] items-center justify-center rounded-full bg-white"><Svg d="M5 12h14M13 6l6 6-6 6" size={18} color="#2563eb" w={2.4} /></span>
        </a>
        <CodeLine p={p} />
      </div>
    </div>
  );
}

/* ================================ C v2 =================================== */

const MODEL_COPY: Record<StepId, { mark: string; line: string }> = {
  "1-Step": { mark: "1", line: "One target. No time limit." },
  "2-Step": { mark: "2", line: "Two phases. More room to trade." },
  Instant: { mark: "0", line: "Skip the evaluation." },
};

function IdeaC() {
  const p = usePick();
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="m-0 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Pick how you
        <br />
        <span className="fyt-gradient-text">want to prove it.</span>
      </h2>

      <OfferPicker p={p} compact />

      <div className="relative flex flex-col gap-[10px]">
        {STEPS.map((m) => {
          const open = m === p.step;
          const fromOld = getEntry(m, "prime", "match-trader", STEP_SIZES[m][0])?.priceOld ?? 0;
          return (
            <motion.div key={m} layout={!reduce} transition={{ duration: 0.45, ease: EASE }} className="relative overflow-hidden rounded-[24px]" style={{ border: `1px solid ${open ? "rgba(96,165,250,0.75)" : LINE}`, background: open ? "linear-gradient(180deg, rgba(37,99,235,0.24) 0%, rgba(10,18,40,0.9) 55%)" : "rgba(255,255,255,0.03)", boxShadow: open ? "0 40px 80px -40px rgba(37,99,235,0.9)" : "none" }}>
              {open && <span aria-hidden="true" className="pointer-events-none absolute -right-[60px] -top-[70px] size-[200px] rounded-full" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.35), transparent 65%)" }} />}
              <motion.button layout={!reduce ? "position" : false} type="button" aria-expanded={open} onClick={() => p.setStep(m)} className="relative flex w-full cursor-pointer items-center gap-[14px] border-0 bg-transparent p-[16px] text-left text-white">
                <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[15px] text-[18px] font-bold" style={{ background: open ? BLUE : "rgba(255,255,255,0.07)", boxShadow: open ? "0 10px 24px -10px rgba(37,99,235,0.9)" : "none" }}>{MODEL_COPY[m].mark}</span>
                <span className="flex flex-1 flex-col gap-[2px]">
                  <span className="text-[18px] font-bold tracking-[-0.01em]">{m}</span>
                  <span className="text-[12px]" style={{ color: MUTED }}>{MODEL_COPY[m].line}</span>
                </span>
                <span className="flex flex-col items-end">
                  <span className="text-[10px]" style={{ color: MUTED }}>from</span>
                  <span className="text-[17px] font-bold text-[#93c5fd]">{money(offerPrice(fromOld, p.offer))}</span>
                </span>
              </motion.button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div key="body" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="relative">
                    <div className="flex flex-col gap-[16px] px-[16px] pb-[16px]">
                      <div className="grid grid-cols-5 gap-[6px]">
                        {p.sizes.map((z, j) => {
                          const on = j === p.i;
                          return (
                            <button key={z} type="button" aria-pressed={on} onClick={() => p.setI(j)} className="h-[44px] cursor-pointer rounded-[13px] text-[13px] font-bold transition-colors" style={{ border: `1px solid ${on ? "#60a5fa" : "rgba(148,178,255,0.16)"}`, background: on ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.02)", color: on ? "#fff" : SOFT }}>
                              {fmtSize(z)}
                            </button>
                          );
                        })}
                      </div>
                      <TypeCards p={p} />
                      <PlatformSeg p={p} />
                      <div className="grid grid-cols-4 gap-[6px] rounded-[16px] p-[10px]" style={{ background: "rgba(0,0,0,0.25)" }}>
                        {rules(p).map(([v, l]) => (
                          <span key={l} className="flex flex-col items-center gap-[2px]">
                            <span className="text-[15px] font-bold">{v}</span>
                            <span className="text-[9.5px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>{l}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-[10px] rounded-[16px] p-[12px]" style={{ background: "rgba(0,0,0,0.22)" }}>
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">Why traders choose this</span>
                        <PerkGrid p={p} cols={2} />
                      </div>
                      <a href={p.co.href} className="flex h-[58px] items-center justify-between rounded-[18px] pl-[18px] pr-[8px] text-white no-underline" style={{ background: BLUE, boxShadow: "0 20px 40px -18px rgba(37,99,235,0.95)" }}>
                        <span className="flex items-baseline gap-[8px]">
                          <Roll value={money(p.price)} className="text-[22px] font-bold" />
                          <s className="text-[12px] text-[#bfdbfe]">{money(p.entry.priceOld)}</s>
                        </span>
                        <span className="rounded-[13px] bg-white px-[16px] py-[11px] text-[14px] font-bold text-[#2563eb]">Start →</span>
                      </a>
                      <CodeLine p={p} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- wrapper --------------------------------- */

const IDEAS: { id: string; name: string; C: () => ReactNode }[] = [
  { id: "A", name: "Account Card v3 (shorter)", C: IdeaA },
  { id: "C", name: "Model Stack v2", C: IdeaC },
  { id: "E", name: "Trader Pass v2", C: IdeaE },
];

export function PricingIdeas() {
  return (
    <>
      {IDEAS.map(({ id, name, C }) => (
        <section key={id} id={`pricing-option-${id.toLowerCase()}`} className="fyt-rd relative w-full shrink-0 overflow-hidden" style={{ background: "radial-gradient(120% 50% at 50% 0%, #0d1d45 0%, #050a17 62%)", color: "#eef0f6" }}>
          <div className="mx-auto flex w-full max-w-[460px] flex-col gap-[20px] px-[16px] pb-[56px] pt-[40px]">
            <div className="flex items-center justify-center gap-[10px]">
              <span className="rounded-full px-[12px] py-[6px] text-[12px] font-bold tracking-[0.12em] text-[#0a1226]" style={{ background: "#fcd34d" }}>
                TEST OPTION {id}
              </span>
              <span className="text-[14px] font-semibold text-[#fcd34d]">{name}</span>
            </div>
            <C />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(252,211,77,0.5), transparent)" }} />
        </section>
      ))}
    </>
  );
}
