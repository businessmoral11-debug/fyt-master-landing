/**
 * TEST ONLY: six mobile-first pricing layouts shown one after another so the
 * team can compare them on the preview. Remove all but the winner before main.
 */
import { useEffect, useState, type ReactNode } from "react";
import { STEP_PLANS, STEP_SIZES, checkoutUrl, fmtSize, getEntry, type PlanId, type PlatformId, type StepId } from "@/app/data/pricing";
import { PROMO_DEADLINE } from "@/app/data/promoBanner";

const STEPS: StepId[] = ["1-Step", "2-Step", "Instant"];
const BLUE = "linear-gradient(180deg,#4f8cff,#2563eb)";
const LINE = "rgba(148,178,255,0.14)";
const MUTED = "#8e98b0";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* ------------------------------ shared state ----------------------------- */

function usePick(initial: { step?: StepId; plan?: PlanId; platform?: PlatformId; i?: number } = {}) {
  const [step, setStep] = useState<StepId>(initial.step ?? "2-Step");
  const [planRaw, setPlan] = useState<PlanId>(initial.plan ?? "prime");
  const [platform, setPlatform] = useState<PlatformId>(initial.platform ?? "match-trader");
  const [i, setI] = useState(initial.i ?? 3);
  const plans = STEP_PLANS[step];
  const plan: PlanId = plans.some((p) => p.id === planRaw) ? planRaw : "prime";
  const sizes = STEP_SIZES[step];
  const size = sizes[Math.min(i, sizes.length - 1)];
  const entry = getEntry(step, plan, platform, size)!;
  const save = Math.round((entry.priceOld - entry.priceNew) * 100) / 100;
  return {
    step, plan, platform, i, plans, sizes, size, entry, save,
    href: checkoutUrl(entry.productId),
    setStep: (s: StepId) => { setStep(s); setPlan("prime"); },
    setPlan, setPlatform, setI,
    planLabel: plans.find((p) => p.id === plan)?.label ?? "Prime",
  };
}
type Pick = ReturnType<typeof usePick>;

function money(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function useClock(withSeconds = true): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const left = Math.max(0, new Date(PROMO_DEADLINE).getTime() - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  const base = `${Math.floor(left / 864e5)}d ${pad(Math.floor(left / 36e5) % 24)}:${pad(Math.floor(left / 6e4) % 60)}`;
  return withSeconds ? `${base}:${pad(Math.floor(left / 1e3) % 60)}` : base;
}

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
} as const;
type Perk = { d: string; label: string; challengeOnly: boolean };

/** Same lists as the live "Why traders choose this" panel. */
function perks(p: Pick): Perk[] {
  if (p.step === "Instant")
    return [
      { d: IC.split, label: "90% split", challengeOnly: false },
      { d: IC.wk, label: "Weekends", challengeOnly: false },
      { d: IC.cal, label: "Bi-weekly pay", challengeOnly: false },
    ];
  const prime = p.plan === "prime";
  return [
    { d: IC.split, label: "100% split", challengeOnly: false },
    { d: IC.news, label: "News trading", challengeOnly: prime },
    { d: IC.hedge, label: "Hedging", challengeOnly: prime },
    { d: IC.ea, label: "EA and copy", challengeOnly: true },
    { d: IC.sl, label: "No SL rule", challengeOnly: false },
    { d: IC.wk, label: "Weekends", challengeOnly: false },
  ];
}

function Svg({ d, size = 18, color = "#93c5fd", w = 1.8 }: { d: string; size?: number; color?: string; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

function Seg<T extends string>({ items, value, onPick, labels }: { items: readonly T[]; value: T; onPick: (v: T) => void; labels?: Record<string, string> }) {
  return (
    <div className="grid gap-[4px] rounded-full p-[4px]" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`, background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
      {items.map((it) => {
        const on = it === value;
        return (
          <button key={it} type="button" onClick={() => onPick(it)} className="h-[44px] cursor-pointer rounded-full border-0 text-[14px] font-semibold transition-colors" style={on ? { background: BLUE, color: "#fff", boxShadow: "0 8px 20px -10px rgba(37,99,235,0.9)" } : { background: "transparent", color: MUTED }}>
            {labels?.[it] ?? it}
          </button>
        );
      })}
    </div>
  );
}

function SizeChips({ p }: { p: Pick }) {
  return (
    <div className="grid grid-cols-5 gap-[6px]">
      {p.sizes.map((z, j) => {
        const on = j === p.i;
        return (
          <button key={z} type="button" onClick={() => p.setI(j)} className="h-[44px] cursor-pointer rounded-[14px] text-[13px] font-bold" style={{ border: `1px solid ${on ? "#60a5fa" : "rgba(148,178,255,0.16)"}`, background: on ? "rgba(59,130,246,0.25)" : "transparent", color: on ? "#fff" : "#c7d2e6" }}>
            {fmtSize(z)}
          </button>
        );
      })}
    </div>
  );
}

function Cta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="flex h-[58px] items-center justify-center rounded-full text-[16px] font-semibold text-white no-underline transition-transform hover:-translate-y-[1px]" style={{ background: BLUE, boxShadow: "0 20px 40px -16px rgba(37,99,235,0.9)" }}>
      {children}
    </a>
  );
}

function Eyebrow({ children, center }: { children: ReactNode; center?: boolean }) {
  return <span className={`text-[11px] font-semibold tracking-[0.18em] text-[#93c5fd] ${center ? "text-center" : ""}`}>{children}</span>;
}

/* --------------------------------- A ------------------------------------- */

function IdeaA() {
  const p = usePick();
  const clock = useClock();
  const r = rules(p);
  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="m-0 text-center text-[32px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Choose your <span className="fyt-gradient-text">challenge.</span>
      </h2>
      <div className="flex items-center gap-[12px] rounded-[16px] py-[10px] pl-[14px] pr-[12px]" style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.16), rgba(37,99,235,0.14))", border: "1px solid rgba(248,113,113,0.3)" }}>
        <span className="text-[22px] font-bold tracking-[-0.03em]">40% OFF</span>
        <span className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.14)" }} />
        <span className="flex flex-1 flex-col text-[11px] leading-[1.3] text-[#c7d2e6]">
          <span>+1 bonus account</span>
          <span>+5% cashback</span>
        </span>
        <span className="flex flex-col items-end">
          <span className="text-[9px] font-semibold tracking-[0.16em] text-[#fca5a5]">ENDS IN</span>
          <span className="text-[14px] font-semibold" style={{ fontFamily: MONO }}>{clock}</span>
        </span>
      </div>
      <Seg items={STEPS} value={p.step} onPick={p.setStep} />
      <div className="relative flex flex-col gap-[22px] overflow-hidden rounded-[26px] px-[22px] pb-[20px] pt-[22px]" style={{ background: "linear-gradient(145deg,#1e3a8a 0%,#0f1f4d 45%,#070d1f 100%)", border: "1px solid rgba(147,197,253,0.35)", boxShadow: "0 40px 80px -30px rgba(37,99,235,0.75), inset 0 1px 0 rgba(255,255,255,0.18)" }}>
        <span aria-hidden="true" className="absolute -right-[60px] -top-[80px] size-[240px] rounded-full" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.45), transparent 65%)" }} />
        <div className="relative flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-[0.14em] text-[#bfdbfe]">FYT · {p.step.toUpperCase()}</span>
          <span className="rounded-full px-[9px] py-[5px] text-[11px] font-bold tracking-[0.08em]" style={{ background: "rgba(255,255,255,0.12)" }}>{p.planLabel.toUpperCase()}</span>
        </div>
        <div className="relative flex items-center justify-between">
          <button type="button" aria-label="Smaller account" onClick={() => p.setI(Math.max(0, p.i - 1))} className="size-[44px] cursor-pointer rounded-full text-[20px] text-white" style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)" }}>‹</button>
          <span className="flex flex-col items-center">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#93c5fd]">ACCOUNT</span>
            <span className="text-[46px] font-bold leading-none tracking-[-0.04em]">{money(p.size)}</span>
          </span>
          <button type="button" aria-label="Bigger account" onClick={() => p.setI(Math.min(p.sizes.length - 1, p.i + 1))} className="size-[44px] cursor-pointer rounded-full text-[20px] text-white" style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)" }}>›</button>
        </div>
        <div className="relative flex justify-center gap-[6px]">
          {p.sizes.map((z, k) => (
            <span key={z} className="h-[6px] rounded-full transition-all" style={{ width: k === p.i ? 22 : 6, background: k === p.i ? "#93c5fd" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <div className="relative flex items-end justify-between pt-[16px]" style={{ borderTop: "1px dashed rgba(255,255,255,0.18)" }}>
          <span className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#93c5fd]">One-time fee</span>
            <span className="flex items-baseline gap-[8px]">
              <span className="text-[34px] font-bold tracking-[-0.03em]">{money(p.entry.priceNew)}</span>
              <s className="text-[14px]" style={{ color: MUTED }}>{money(p.entry.priceOld)}</s>
            </span>
          </span>
          <span className="rounded-full bg-[#4ade80] px-[10px] py-[6px] text-[12px] font-bold text-[#052e16]">Save {money(p.save)}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[8px]">
        {r.map(([v, l]) => (
          <div key={l} className="flex flex-col items-center gap-[4px] rounded-[16px] px-[4px] py-[12px]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,178,255,0.12)" }}>
            <span className="text-[16px] font-bold">{v}</span>
            <span className="text-[10.5px]" style={{ color: MUTED }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[10px]">
        <Eyebrow>WHY TRADERS CHOOSE THIS</Eyebrow>
        <div className="grid grid-cols-3 gap-[8px]">
          {perks(p).map((k) => (
            <div key={k.label} className="relative flex flex-col items-center gap-[6px] rounded-[16px] px-[6px] pb-[10px] pt-[12px] text-center" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(148,178,255,0.12)" }}>
              <span className="flex size-[34px] items-center justify-center rounded-[11px]" style={{ background: "rgba(59,130,246,0.14)" }}>
                <Svg d={k.d} />
              </span>
              <span className="text-[12px] font-semibold leading-[1.2]">{k.label}</span>
              <span className="text-[9.5px] tracking-[0.06em]" style={{ color: k.challengeOnly ? MUTED : "#86efac" }}>{k.challengeOnly ? "IN CHALLENGE" : "ALWAYS"}</span>
              <span className="absolute right-[8px] top-[8px] flex size-[14px] items-center justify-center rounded-full bg-[#22c55e]">
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#04210f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.2l2.2 2.2 4.8-5" /></svg>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <Row label="Type"><Seg items={p.plans.map((x) => x.id)} value={p.plan} onPick={p.setPlan} labels={Object.fromEntries(p.plans.map((x) => [x.id, x.label]))} /></Row>
        <Row label="Platform"><Seg items={["match-trader", "platform-5"] as PlatformId[]} value={p.platform} onPick={p.setPlatform} labels={{ "match-trader": "MatchTrader", "platform-5": "Platform 5" }} /></Row>
      </div>
      <Cta href={p.href}>Start challenge · {money(p.entry.priceNew)} →</Cta>
      <span className="text-center text-[12px]" style={{ color: MUTED }}>Card or crypto · Code NEWDASH applied</span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-[10px]">
      <span className="text-[13px]" style={{ color: MUTED }}>{label}</span>
      <div className="w-[230px]">{children}</div>
    </div>
  );
}

/* --------------------------------- B ------------------------------------- */

const HINTS: Record<StepId, string> = { "1-Step": "One phase", "2-Step": "More room", Instant: "Skip the test" };

function IdeaB() {
  const p = usePick();
  const clock = useClock();
  const pct = (p.i / (p.sizes.length - 1)) * 100;
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-semibold tracking-[-0.03em]">Your challenge</span>
        <span className="flex items-center gap-[8px] rounded-full py-[6px] pl-[12px] pr-[6px]" style={{ background: "rgba(239,68,68,0.14)", border: "1px solid rgba(248,113,113,0.35)" }}>
          <span className="text-[12px] font-bold text-[#fecaca]">-40%</span>
          <span className="rounded-full px-[8px] py-[4px] text-[12px]" style={{ fontFamily: MONO, background: "rgba(0,0,0,0.35)" }}>{clock}</span>
        </span>
      </div>
      <div className="flex gap-[8px]">
        {STEPS.map((m) => {
          const on = m === p.step;
          return (
            <button key={m} type="button" onClick={() => p.setStep(m)} className="flex flex-1 cursor-pointer flex-col items-start gap-[4px] rounded-[18px] px-[12px] py-[14px] text-left text-white" style={{ border: `1px solid ${on ? "rgba(96,165,250,0.9)" : LINE}`, background: on ? "linear-gradient(180deg, rgba(59,130,246,0.35), rgba(37,99,235,0.12))" : "rgba(255,255,255,0.03)" }}>
              <span className="text-[15px] font-bold">{m}</span>
              <span className="text-[11px]" style={{ color: on ? "#bfdbfe" : MUTED }}>{HINTS[m]}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-[6px] pt-[10px]">
        <span className="text-[11px] font-semibold tracking-[0.24em] text-[#93c5fd]">ACCOUNT SIZE</span>
        <span className="text-[72px] font-bold leading-none tracking-[-0.05em]" style={{ background: "linear-gradient(180deg,#ffffff,#93c5fd)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{fmtSize(p.size)}</span>
      </div>
      <div className="flex flex-col gap-[10px]">
        <label htmlFor="fyt-idea-b-size" className="sr-only">Account size</label>
        <input id="fyt-idea-b-size" type="range" min={0} max={p.sizes.length - 1} step={1} value={p.i} onChange={(e) => p.setI(Number(e.target.value))} className="fyt-range w-full" style={{ ["--p" as string]: `${pct}%` }} />
        <div className="flex justify-between text-[11px]">
          {p.sizes.map((z, j) => (
            <span key={z} style={{ color: j === p.i ? "#fff" : MUTED, fontWeight: j === p.i ? 700 : 500 }}>{fmtSize(z)}</span>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-[10px]">
        {p.plans.map((x) => {
          const on = x.id === p.plan;
          return (
            <button key={x.id} type="button" onClick={() => p.setPlan(x.id)} className="flex h-[40px] cursor-pointer items-center gap-[8px] rounded-full px-[16px] text-[13px] font-semibold text-white" style={{ border: `1px solid ${on ? "rgba(96,165,250,0.8)" : "rgba(148,178,255,0.18)"}`, background: on ? "rgba(59,130,246,0.18)" : "transparent" }}>
              <span className="size-[14px] rounded-full" style={{ border: `2px solid ${on ? "#60a5fa" : "#5b6478"}`, background: on ? "#60a5fa" : "transparent" }} />
              {x.label}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center gap-[22px] py-[14px]" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        {rules(p).map(([v, l]) => (
          <span key={l} className="flex flex-col items-center gap-[2px]">
            <span className="text-[17px] font-bold">{v}</span>
            <span className="text-[10.5px]" style={{ color: MUTED }}>{l}</span>
          </span>
        ))}
      </div>
      <div className="flex items-end justify-center gap-[10px]">
        <span className="text-[52px] font-bold leading-none tracking-[-0.04em]">{money(p.entry.priceNew)}</span>
        <span className="flex flex-col gap-[2px] pb-[6px]">
          <s className="text-[15px]" style={{ color: MUTED }}>{money(p.entry.priceOld)}</s>
          <span className="text-[11px] font-semibold text-[#86efac]">you save {money(p.save)}</span>
        </span>
      </div>
      <div className="flex flex-col gap-[12px]">
        <Eyebrow center>WHY TRADERS CHOOSE THIS</Eyebrow>
        <div className="flex flex-wrap justify-center gap-[8px]">
          {perks(p).map((k) => (
            <span key={k.label} className="flex h-[36px] items-center gap-[7px] rounded-full pl-[8px] pr-[12px] text-[12.5px] font-semibold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,178,255,0.16)" }}>
              <span className="flex size-[22px] items-center justify-center rounded-full" style={{ background: "rgba(34,197,94,0.16)" }}><Svg d={k.d} size={12} color="#4ade80" w={2} /></span>
              {k.label}{k.challengeOnly ? " (challenge)" : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-[8px] text-[12px] text-[#c7d2e6]">
        <span className="rounded-full px-[10px] py-[6px]" style={{ background: "rgba(59,130,246,0.12)" }}>+1 bonus account</span>
        <span className="rounded-full px-[10px] py-[6px]" style={{ background: "rgba(59,130,246,0.12)" }}>+5% cashback</span>
      </div>
      <Cta href={p.href}>Start challenge →</Cta>
    </div>
  );
}

/* --------------------------------- C ------------------------------------- */

function IdeaC() {
  const p = usePick();
  const clock = useClock();
  return (
    <div className="flex flex-col gap-[14px]">
      <h2 className="m-0 mb-[4px] text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Pick how you
        <br />
        <span className="text-[#60a5fa]">want to prove it.</span>
      </h2>
      <div className="flex items-center justify-between rounded-[14px] px-[14px] py-[10px]" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
        <span className="text-[13px]"><b>40% off</b> <span style={{ color: MUTED }}>+ bonus account + 5% cashback</span></span>
        <span className="text-[12px] text-[#fca5a5]" style={{ fontFamily: MONO }}>{clock}</span>
      </div>
      {STEPS.map((m, n) => {
        const open = m === p.step;
        const from = getEntry(m, "prime", "match-trader", STEP_SIZES[m][0])?.priceNew ?? 0;
        return (
          <div key={m} className="overflow-hidden rounded-[22px] transition-shadow" style={{ border: `1px solid ${open ? "rgba(96,165,250,0.7)" : LINE}`, background: open ? "linear-gradient(180deg, rgba(37,99,235,0.22), rgba(255,255,255,0.02))" : "rgba(255,255,255,0.03)", boxShadow: open ? "0 30px 60px -30px rgba(37,99,235,0.8)" : "none" }}>
            <button type="button" onClick={() => p.setStep(m)} className="flex w-full cursor-pointer items-center gap-[14px] border-0 bg-transparent p-[16px] text-left text-white">
              <span className="flex size-[44px] items-center justify-center rounded-[14px] text-[15px] font-bold" style={{ background: open ? BLUE : "rgba(255,255,255,0.08)" }}>{m === "Instant" ? "0" : n + 1}</span>
              <span className="flex flex-1 flex-col gap-[2px]">
                <span className="text-[17px] font-bold">{m}</span>
                <span className="text-[12px]" style={{ color: MUTED }}>{m === "1-Step" ? "One target, no time limit" : m === "2-Step" ? "Two phases, more room" : "Skip the evaluation"}</span>
              </span>
              <span className="flex flex-col items-end">
                <span className="text-[10px]" style={{ color: MUTED }}>from</span>
                <span className="text-[17px] font-bold text-[#93c5fd]">{money(from)}</span>
              </span>
            </button>
            {open && (
              <div className="flex flex-col gap-[16px] px-[16px] pb-[16px]">
                <SizeChips p={p} />
                <div className="flex justify-between text-[12px] text-[#c7d2e6]">
                  {rules(p).map(([v, l]) => (
                    <span key={l}><b className="text-white">{v}</b> {l.toLowerCase()}</span>
                  ))}
                </div>
                <div className="flex flex-col gap-[8px] rounded-[16px] p-[12px]" style={{ background: "rgba(0,0,0,0.22)" }}>
                  <span className="text-[10.5px] font-semibold tracking-[0.16em] text-[#93c5fd]">WHY TRADERS CHOOSE THIS</span>
                  <div className="grid grid-cols-2 gap-x-[10px] gap-y-[8px]">
                    {perks(p).map((k) => (
                      <span key={k.label} className="flex items-center gap-[8px] text-[12.5px] font-medium">
                        <Svg d={k.d} size={16} color="#4ade80" w={2} />
                        {k.label}{k.challengeOnly ? "*" : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <a href={p.href} className="flex h-[54px] items-center justify-between rounded-[16px] pl-[20px] pr-[8px] text-white no-underline" style={{ background: BLUE }}>
                  <span className="flex items-baseline gap-[8px]">
                    <span className="text-[20px] font-bold">{money(p.entry.priceNew)}</span>
                    <s className="text-[12px] text-[#bfdbfe]">{money(p.entry.priceOld)}</s>
                  </span>
                  <span className="rounded-[12px] bg-white px-[14px] py-[10px] text-[14px] font-bold text-[#2563eb]">Start →</span>
                </a>
              </div>
            )}
          </div>
        );
      })}
      <span className="text-center text-[12px]" style={{ color: MUTED }}>* during the challenge · Prime shown, Classic at checkout</span>
    </div>
  );
}

/* --------------------------------- D ------------------------------------- */

function IdeaD() {
  const p = usePick();
  const clock = useClock(false);
  const [edit, setEdit] = useState<string | null>(null);
  const rows: { id: string; k: string; v: string; opts: { l: string; on: boolean; pick: () => void }[] }[] = [
    { id: "model", k: "Model", v: p.step, opts: STEPS.map((m) => ({ l: m, on: m === p.step, pick: () => p.setStep(m) })) },
    { id: "plan", k: "Type", v: p.planLabel, opts: p.plans.map((x) => ({ l: x.label, on: x.id === p.plan, pick: () => p.setPlan(x.id) })) },
    { id: "platform", k: "Platform", v: p.platform === "match-trader" ? "MatchTrader" : "Platform 5", opts: (["match-trader", "platform-5"] as PlatformId[]).map((x) => ({ l: x === "match-trader" ? "MatchTrader" : "Platform 5", on: x === p.platform, pick: () => p.setPlatform(x) })) },
    { id: "size", k: "Account size", v: fmtSize(p.size), opts: p.sizes.map((z, j) => ({ l: fmtSize(z), on: j === p.i, pick: () => p.setI(j) })) },
  ];
  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="m-0 text-center text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Build your <span className="text-[#60a5fa]">challenge.</span>
      </h2>
      <div className="overflow-hidden rounded-[24px]" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(148,178,255,0.16)" }}>
        {rows.map((r, j) => (
          <div key={r.id} style={{ borderTop: j ? "1px solid rgba(148,178,255,0.12)" : undefined }}>
            <button type="button" onClick={() => setEdit(edit === r.id ? null : r.id)} className="flex h-[58px] w-full cursor-pointer items-center justify-between gap-[10px] border-0 bg-transparent px-[18px] text-white">
              <span className="text-[13px]" style={{ color: MUTED }}>{r.k}</span>
              <span className="flex items-center gap-[8px] text-[16px] font-semibold">
                {r.v}
                <span className="text-[12px] text-[#60a5fa]">{edit === r.id ? "Done" : "Change"}</span>
              </span>
            </button>
            {edit === r.id && (
              <div className="flex flex-wrap gap-[6px] px-[18px] pb-[16px]">
                {r.opts.map((o) => (
                  <button key={o.l} type="button" onClick={() => { o.pick(); setEdit(null); }} className="h-[40px] cursor-pointer rounded-full px-[14px] text-[13px] font-semibold text-white" style={{ border: `1px solid ${o.on ? "#60a5fa" : "rgba(148,178,255,0.18)"}`, background: o.on ? "rgba(59,130,246,0.3)" : "transparent" }}>
                    {o.l}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="relative rounded-[24px] px-[20px] pb-[18px] pt-[20px] text-[#0b1430]" style={{ background: "#f7f9ff", boxShadow: "0 40px 80px -36px rgba(37,99,235,0.8)" }}>
        <div className="flex items-center justify-between pb-[14px]" style={{ borderBottom: "1px dashed #c9d4ee" }}>
          <span className="text-[11px] font-bold tracking-[0.18em] text-[#2563eb]">YOUR RECEIPT</span>
          <span className="text-[12px] font-semibold text-[#dc2626]" style={{ fontFamily: MONO }}>offer ends {clock}</span>
        </div>
        <div className="flex flex-col gap-[10px] py-[14px] text-[14px]">
          <Line k={`${fmtSize(p.size)} ${p.step} ${p.planLabel}`} v={money(p.entry.priceOld)} />
          <Line k="NEWDASH · 40% off" v={`-${money(p.save)}`} green />
          <Line k="Bonus account" v="Free" green />
          <Line k="Instant cashback" v="5% back" green />
        </div>
        <div className="flex items-end justify-between pt-[14px]" style={{ borderTop: "1px dashed #c9d4ee" }}>
          <span className="text-[13px] font-semibold text-[#4a5570]">Today</span>
          <span className="text-[40px] font-bold leading-none tracking-[-0.04em]">{money(p.entry.priceNew)}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[8px] text-center">
        {rules(p).map(([v, l]) => (
          <span key={l} className="flex flex-col gap-[2px]">
            <span className="text-[16px] font-bold">{v}</span>
            <span className="text-[10.5px]" style={{ color: MUTED }}>{l}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-[10px]">
        <Eyebrow>INCLUDED WITH THIS PLAN</Eyebrow>
        <div className="grid grid-cols-2 gap-[8px]">
          {perks(p).map((k) => (
            <span key={k.label} className="flex items-center gap-[10px] rounded-[14px] px-[12px] py-[10px] text-[13px] font-semibold" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(148,178,255,0.12)" }}>
              <Svg d={k.d} color="#60a5fa" />
              <span className="flex flex-col">
                <span>{k.label}</span>
                <span className="text-[10px] font-medium" style={{ color: k.challengeOnly ? MUTED : "#86efac" }}>{k.challengeOnly ? "In challenge" : "Always"}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
      <Cta href={p.href}>Pay {money(p.entry.priceNew)} and start →</Cta>
    </div>
  );
}

function Line({ k, v, green }: { k: string; v: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#4a5570]">{k}</span>
      <span className={green ? "font-semibold text-[#16a34a]" : ""}>{v}</span>
    </div>
  );
}

/* --------------------------------- E ------------------------------------- */

const STAMP_ROT = [-8, 5, -3, 7, -6, 4];

function IdeaE() {
  const p = usePick();
  const clock = useClock(false);
  const e = p.entry;
  const fields: [string, string][] =
    p.step === "Instant"
      ? [["TARGET", e.profit ?? "N/A"], ["DAILY", e.maxDaily], ["MAX LOSS", e.maxOverall], ["SPLIT", e.split.replace("Up to ", "")], ["MIN DAYS", e.minDays], ["REWARD", "Bi-weekly"]]
      : [[p.step === "2-Step" ? "TARGETS" : "TARGET", p.step === "2-Step" ? `${e.p1}/${e.p2}` : e.p1 ?? ""], ["DAILY", e.maxDaily], ["MAX LOSS", e.maxOverall], ["SPLIT", e.split.replace("Up to ", "")], ["TIME LIMIT", e.time], ["REWARD", "24-48h"]];
  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="m-0 text-center text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Your pass to <span className="text-[#60a5fa]">funded.</span>
      </h2>
      <Seg items={STEPS} value={p.step} onPick={p.setStep} />
      <SizeChips p={p} />
      <div className="relative overflow-hidden rounded-[26px]" style={{ background: "linear-gradient(160deg,#1d4ed8 0%,#1e3a8a 38%,#0b1638 100%)", boxShadow: "0 50px 90px -40px rgba(37,99,235,0.9)", border: "1px solid rgba(147,197,253,0.4)" }}>
        <div className="flex flex-col gap-[16px] px-[20px] pb-[18px] pt-[20px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#bfdbfe]">FYT TRADER PASS</span>
            <span className="rounded-full px-[8px] py-[4px] text-[11px] text-[#fecaca]" style={{ fontFamily: MONO, background: "rgba(239,68,68,0.25)" }}>-40% · {clock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex flex-col">
              <span className="text-[10px] tracking-[0.18em] text-[#93c5fd]">FROM</span>
              <span className="text-[30px] font-bold tracking-[-0.03em]">You</span>
            </span>
            <svg width="70" height="20" viewBox="0 0 70 20" fill="none" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 4" aria-hidden="true"><path d="M2 10h60M56 4l8 6-8 6" /></svg>
            <span className="flex flex-col items-end">
              <span className="text-[10px] tracking-[0.18em] text-[#93c5fd]">TO</span>
              <span className="text-[30px] font-bold tracking-[-0.03em]">{fmtSize(p.size)}</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            {fields.map(([k, v]) => (
              <span key={k} className="flex flex-col gap-[2px]">
                <span className="text-[9.5px] tracking-[0.16em] text-[#93c5fd]">{k}</span>
                <span className="text-[15px] font-bold">{v}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="relative mx-[18px] h-0" style={{ borderTop: "2px dashed rgba(191,219,254,0.35)" }} />
        <div className="flex flex-col gap-[14px] px-[20px] pb-[20px] pt-[16px]" style={{ background: "rgba(3,6,13,0.35)" }}>
          <span className="text-[10.5px] font-bold tracking-[0.18em] text-[#bfdbfe]">STAMPED: WHY TRADERS CHOOSE THIS</span>
          <div className="grid grid-cols-3 justify-items-center gap-x-[8px] gap-y-[12px]">
            {perks(p).map((k, j) => {
              const c = j % 2 ? "#86efac" : "#bfdbfe";
              return (
                <span key={k.label} className="flex size-[86px] flex-col items-center justify-center gap-[3px] rounded-full text-center" style={{ border: `2px dashed ${c}`, transform: `rotate(${STAMP_ROT[j]}deg)` }}>
                  <Svg d={k.d} size={20} color={c} />
                  <span className="px-[6px] text-[10px] font-bold uppercase leading-[1.1] tracking-[0.04em]" style={{ color: c }}>{k.label}{k.challengeOnly ? " in challenge" : ""}</span>
                </span>
              );
            })}
          </div>
          <div className="flex items-end justify-between pt-[6px]">
            <span className="flex flex-col">
              <span className="text-[10px] tracking-[0.18em] text-[#93c5fd]">FARE TODAY</span>
              <span className="flex items-baseline gap-[8px]">
                <span className="text-[36px] font-bold tracking-[-0.04em]">{money(e.priceNew)}</span>
                <s className="text-[13px]" style={{ color: MUTED }}>{money(e.priceOld)}</s>
              </span>
            </span>
            <svg width="96" height="36" viewBox="0 0 96 36" aria-hidden="true"><path d="M2 2v32M6 2v32M9 2v32M14 2v32M16 2v32M21 2v32M26 2v32M28 2v32M33 2v32M37 2v32M40 2v32M45 2v32M47 2v32M52 2v32M57 2v32M59 2v32M64 2v32M68 2v32M71 2v32M76 2v32M78 2v32M83 2v32M88 2v32M90 2v32M94 2v32" stroke="rgba(219,234,254,0.8)" strokeWidth="1.6" /></svg>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-[8px]">
        {p.plans.map((x) => {
          const on = x.id === p.plan;
          return (
            <button key={x.id} type="button" onClick={() => p.setPlan(x.id)} className="h-[40px] cursor-pointer rounded-full px-[18px] text-[13px] font-semibold text-white" style={{ border: `1px solid ${on ? "#60a5fa" : "rgba(148,178,255,0.18)"}`, background: on ? "rgba(59,130,246,0.25)" : "transparent" }}>
              {x.id === "prime" && p.step !== "Instant" ? "Prime · no consistency" : x.label}
            </button>
          );
        })}
      </div>
      <Cta href={p.href}>Board now · {money(e.priceNew)} →</Cta>
      <span className="text-center text-[12px]" style={{ color: MUTED }}>+1 bonus account · +5% cashback · code NEWDASH</span>
    </div>
  );
}

/* --------------------------------- F ------------------------------------- */

function IdeaF() {
  const p = usePick();
  const clock = useClock();
  const instant = p.step === "Instant";
  const ids = p.plans.map((x) => x.id);
  const entries = ids.map((id) => getEntry(p.step, id, p.platform, p.size)!);
  const names = p.plans.map((x) => x.label);
  const lines = instant ? ["One rule: 4% max loss", "Lower minimum days"] : ["News and hedging always allowed", "No consistency rule, ever"];
  const tags = instant ? ["FEWEST RULES", "FEWER DAYS"] : ["NEWS ALWAYS", "NO CONSISTENCY"];
  const Y = "Yes", C = "Challenge";
  const table: [string, string, string][] = instant
    ? [["Reward split", "90%", "90%"], ["Profit target", "None", entries[1].profit ?? "-"], ["Daily loss", "None", entries[1].maxDaily], ["Max loss", entries[0].maxOverall, entries[1].maxOverall], ["Min trading days", entries[0].minDays, entries[1].minDays], ["Weekend holding", Y, Y], ["Rewards", "Bi-weekly", "Bi-weekly"]]
    : [["Reward split", "100%", "100%"], ["Consistency rule", "Applies", "None"], ["News trading", Y, C], ["Hedging", Y, C], ["EA and copy", C, C], ["No SL rule", Y, Y], ["Weekend holding", Y, Y]];
  const col = (v: string) => (v === "Yes" || v === "None" ? "#4ade80" : v === "Challenge" ? "#fcd34d" : "#eef0f6");
  const chosen = ids.indexOf(p.plan);
  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="m-0 text-center text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
        Two ways to <span className="text-[#60a5fa]">get funded.</span>
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-[10px] text-[13px]">
        <span className="rounded-full bg-[#ef4444] px-[10px] py-[5px] font-bold">40% OFF</span>
        <span className="text-[#c7d2e6]">+ bonus account + 5% cashback</span>
        <span className="text-[#fca5a5]" style={{ fontFamily: MONO }}>{clock}</span>
      </div>
      <Seg items={STEPS} value={p.step} onPick={p.setStep} />
      <SizeChips p={p} />
      <div className="grid grid-cols-2 gap-[10px]">
        {ids.map((id, j) => {
          const on = j === chosen;
          return (
            <button key={id} type="button" onClick={() => p.setPlan(id)} className="relative flex cursor-pointer flex-col items-start gap-[8px] rounded-[22px] px-[14px] py-[16px] text-left text-white" style={{ border: `1.5px solid ${on ? "#60a5fa" : "rgba(148,178,255,0.16)"}`, background: on ? "linear-gradient(180deg, rgba(59,130,246,0.3), rgba(37,99,235,0.08))" : "rgba(255,255,255,0.03)", boxShadow: on ? "0 30px 60px -30px rgba(37,99,235,0.9)" : "none" }}>
              <span className="rounded-full px-[8px] py-[4px] text-[10px] font-bold tracking-[0.12em]" style={{ background: on ? "#fff" : "rgba(255,255,255,0.08)", color: on ? "#1d4ed8" : "#c7d2e6" }}>{tags[j]}</span>
              <span className="text-[22px] font-bold tracking-[-0.02em]">{names[j]}</span>
              <span className="text-[12px] leading-[1.35] text-[#c7d2e6]">{lines[j]}</span>
              <span className="mt-[4px] flex items-baseline gap-[6px]">
                <span className="text-[24px] font-bold">{money(entries[j].priceNew)}</span>
                <s className="text-[12px]" style={{ color: MUTED }}>{money(entries[j].priceOld)}</s>
              </span>
              <span className="absolute right-[14px] top-[14px] size-[22px] rounded-full" style={{ border: `2px solid ${on ? "#60a5fa" : "#5b6478"}`, background: on ? "#60a5fa" : "transparent" }} />
            </button>
          );
        })}
      </div>
      <div className="overflow-hidden rounded-[22px]" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE}` }}>
        <div className="grid grid-cols-[1.4fr_1fr_1fr] px-[14px] py-[12px] text-[10.5px] font-bold tracking-[0.14em] text-[#93c5fd]" style={{ borderBottom: "1px solid rgba(148,178,255,0.12)" }}>
          <span>WHY TRADERS CHOOSE</span>
          <span className="text-center">{names[0].toUpperCase()}</span>
          <span className="text-center">{names[1].toUpperCase()}</span>
        </div>
        {table.map(([k, a, b], j) => (
          <div key={k} className="grid grid-cols-[1.4fr_1fr_1fr] items-center px-[14px] py-[11px] text-[13px]" style={{ borderTop: j ? "1px solid rgba(148,178,255,0.08)" : undefined }}>
            <span className="text-[#c7d2e6]">{k}</span>
            <span className="text-center font-semibold" style={{ color: col(a) }}>{a}</span>
            <span className="text-center font-semibold" style={{ color: col(b) }}>{b}</span>
          </div>
        ))}
      </div>
      <Cta href={p.href}>Start {p.planLabel} · {money(p.entry.priceNew)} →</Cta>
    </div>
  );
}

/* ------------------------------- wrapper --------------------------------- */

const IDEAS: { id: string; name: string; C: () => ReactNode }[] = [
  { id: "A", name: "Account Card", C: IdeaA },
  { id: "B", name: "Size Slider", C: IdeaB },
  { id: "C", name: "Model Stack", C: IdeaC },
  { id: "D", name: "Checkout Receipt", C: IdeaD },
  { id: "E", name: "Trader Pass", C: IdeaE },
  { id: "F", name: "Prime vs Classic", C: IdeaF },
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
