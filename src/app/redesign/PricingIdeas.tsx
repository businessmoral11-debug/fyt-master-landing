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

/* ================================ A v2 =================================== */

function IdeaA() {
  const p = usePick();
  const r = rules(p);
  const touch = useRef<number | null>(null);
  const go = (d: number) => p.setI(Math.max(0, Math.min(p.sizes.length - 1, p.i + d)));
  const typeLabel = p.plans.find((x) => x.id === p.plan)?.label ?? "Prime";
  const typeBadge = (p.step === "Instant" && p.plan === "prime" ? INSTANT_PRIME : TYPE_INFO[p.plan]).badge;
  return (
    <div className="flex flex-col gap-[20px]">
      <h2 className="m-0 text-center text-[32px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Choose your <span className="fyt-gradient-text">challenge.</span>
      </h2>

      <OfferPicker p={p} />

      <Seg items={STEPS} value={p.step} onPick={p.setStep} />

      {/* The account card */}
      <div
        className="group relative flex select-none flex-col gap-[20px] overflow-hidden rounded-[28px] px-[22px] pb-[20px] pt-[20px]"
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
        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-[10px]">
            <span aria-hidden="true" className="h-[26px] w-[36px] rounded-[6px]" style={{ background: "linear-gradient(135deg,#fde68a,#d4a72c 55%,#a37a13)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)" }} />
            <span className="text-[12px] font-semibold tracking-[0.16em] text-[#dbeafe]">{p.step.toUpperCase()} · {typeLabel.toUpperCase()}</span>
          </span>
          <span className="rounded-full px-[9px] py-[4px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#86efac]" style={{ background: "rgba(34,197,94,0.15)" }}>{typeBadge}</span>
        </div>
        <div className="relative flex items-center justify-between">
          <button type="button" aria-label="Smaller account" disabled={p.i === 0} onClick={() => go(-1)} className="flex size-[44px] cursor-pointer items-center justify-center rounded-full text-white disabled:opacity-30" style={{ border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.07)" }}>
            <Svg d="M15 6l-6 6 6 6" size={18} color="#fff" w={2.2} />
          </button>
          <span className="flex flex-col items-center gap-[2px]">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#93c5fd]">ACCOUNT SIZE</span>
            <Roll value={money(p.size)} className="text-[46px] font-bold leading-[1.05] tracking-[-0.04em]" />
          </span>
          <button type="button" aria-label="Bigger account" disabled={p.i === p.sizes.length - 1} onClick={() => go(1)} className="flex size-[44px] cursor-pointer items-center justify-center rounded-full text-white disabled:opacity-30" style={{ border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.07)" }}>
            <Svg d="M9 6l6 6-6 6" size={18} color="#fff" w={2.2} />
          </button>
        </div>
        <div className="relative flex justify-center gap-[6px]">
          {p.sizes.map((z, k) => (
            <button key={z} type="button" aria-label={fmtSize(z)} onClick={() => p.setI(k)} className="h-[6px] cursor-pointer rounded-full border-0 p-0 transition-all duration-300" style={{ width: k === p.i ? 24 : 6, background: k === p.i ? "#bfdbfe" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <div className="relative grid grid-cols-4 gap-[6px] rounded-[16px] p-[10px]" style={{ background: "rgba(3,6,13,0.35)" }}>
          {r.map(([v, l]) => (
            <span key={l} className="flex flex-col items-center gap-[2px]">
              <span className="text-[15px] font-bold">{v}</span>
              <span className="text-[9.5px] uppercase tracking-[0.08em] text-[#93c5fd]">{l}</span>
            </span>
          ))}
        </div>
        <div className="relative flex items-end justify-between pt-[14px]" style={{ borderTop: "1px dashed rgba(255,255,255,0.2)" }}>
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

      <div className="flex flex-col gap-[10px]">
        <Label>Type</Label>
        <TypeCards p={p} />
      </div>
      <div className="flex flex-col gap-[10px]">
        <Label>Platform</Label>
        <PlatformSeg p={p} />
      </div>
      <div className="flex flex-col gap-[10px]">
        <Label>Why traders choose this</Label>
        <PerkGrid p={p} />
      </div>

      <div className="flex flex-col gap-[12px]">
        <a href={p.co.href} className="flex h-[60px] items-center justify-between rounded-full pl-[24px] pr-[8px] text-white no-underline transition-transform hover:-translate-y-[1px]" style={{ background: BLUE, boxShadow: "0 22px 44px -16px rgba(37,99,235,0.95)" }}>
          <span className="text-[16px] font-semibold">Start challenge · {money(p.price)}</span>
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
  { id: "A", name: "Account Card v2", C: IdeaA },
  { id: "C", name: "Model Stack v2", C: IdeaC },
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
