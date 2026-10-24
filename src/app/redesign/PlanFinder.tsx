import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PLATFORM_OPTIONS, STEP_LABELS, STEP_SIZES, checkoutUrl, fmtSize, getEntry, type PlatformId, type StepId } from "@/app/data/pricing";
import { SELECT_PLAN_EVENT, selectPlanInPricing } from "@/app/data/savedPlan";
import { C, EASE, Eyebrow, Section } from "./ui";

/* ------------------------------------------------------------------ */
/* "Find my challenge": 3 taps (goal, size, platform) -> best match.   */
/* Rules based and instant. Everything shown comes from the pricing    */
/* data, so it can never disagree with the table below.                */
/* ------------------------------------------------------------------ */

const GOALS: { step: StepId; title: string; sub: string; why: string }[] = [
  { step: "Instant", title: "Start trading today", sub: "Instant account, no phases", why: "Instant starts you on a funded account straight away." },
  { step: "1-Step", title: "One simple target", sub: "Pass one phase, then you're funded", why: "One-Step keeps it to a single phase." },
  { step: "2-Step", title: "More room to breathe", sub: "Two phases, wider drawdown limits", why: "Two-Step gives the widest daily and overall limits." },
];

type Answers = { step?: StepId; size?: number; platform?: PlatformId };

function targetText(step: StepId, p1?: string, p2?: string, profit?: string): string {
  if (step === "1-Step") return p1 ?? "-";
  if (step === "2-Step") return `${p1 ?? "-"} then ${p2 ?? "-"}`;
  return !profit || profit === "N/A" ? "None" : profit;
}

function Dots({ at }: { at: number }) {
  return (
    <div className="flex items-center gap-[6px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[6px] rounded-full transition-all duration-500" style={{ width: i === at ? 26 : 8, background: i <= at ? "#60a5fa" : "rgba(255,255,255,0.18)" }} />
      ))}
    </div>
  );
}

function Choice({ title, sub, onClick, icon }: { title: string; sub?: string; onClick: () => void; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[18px] px-[18px] py-[16px] text-left text-white transition-all duration-300 hover:-translate-y-[2px]"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,178,255,0.2)" }}
    >
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[16px] font-semibold">
          {icon ? <span className="mr-[8px]">{icon}</span> : null}
          {title}
        </span>
        {sub && (
          <span className="text-[12.5px]" style={{ color: C.mutedDark }}>
            {sub}
          </span>
        )}
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true">
        <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function PlanFinder() {
  const [a, setA] = useState<Answers>({});
  const stage = a.step === undefined ? 0 : a.size === undefined ? 1 : a.platform === undefined ? 2 : 3;
  const goal = GOALS.find((g) => g.step === a.step);
  const entry = a.step && a.size && a.platform ? getEntry(a.step, "prime", a.platform, a.size) : undefined;

  function pickPlatform(platform: PlatformId) {
    setA((prev) => ({ ...prev, platform }));
    // Get the table ready in the background so "Show me" is instant.
    if (a.step && a.size) window.dispatchEvent(new CustomEvent(SELECT_PLAN_EVENT, { detail: { step: a.step, plan: "prime", platform, size: a.size } }));
  }

  const question = ["What do you want most?", "How big should your account be?", "Which platform do you trade on?"][Math.min(stage, 2)];

  return (
    <Section tone="dark" id="plan-finder" grid={false} innerClassName="!py-[48px] lg:!py-[72px]">
      <div className="mx-auto flex max-w-[860px] flex-col gap-[22px]">
        <div className="flex flex-col items-center gap-[12px] text-center">
          <Eyebrow center>Not sure where to start?</Eyebrow>
          <h2 className="m-0 text-[30px] font-semibold leading-[1.06] tracking-[-0.03em] text-white lg:text-[44px]">
            Find your challenge <span className="fyt-gradient-text">in 3 taps.</span>
          </h2>
        </div>

        <div className="rounded-[26px] p-[18px] sm:p-[28px]" style={{ background: "linear-gradient(180deg, rgba(37,99,235,0.14), rgba(255,255,255,0.02))", border: "1px solid rgba(148,178,255,0.2)", boxShadow: "0 50px 100px -56px rgba(37,99,235,0.8)" }}>
          <AnimatePresence mode="wait" initial={false}>
            {stage < 3 ? (
              <motion.div key={`q${stage}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: EASE }} className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between gap-[12px]">
                  <Dots at={stage} />
                  {stage > 0 && (
                    <button type="button" onClick={() => setA((p) => (stage === 1 ? {} : { step: p.step }))} className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[#93c5fd]">
                      Back
                    </button>
                  )}
                </div>
                <h3 className="m-0 text-[20px] font-semibold text-white sm:text-[24px]">{question}</h3>
                <div className={stage === 1 ? "grid grid-cols-2 gap-[10px] sm:grid-cols-3" : "grid grid-cols-1 gap-[10px]"}>
                  {stage === 0 && GOALS.map((g) => <Choice key={g.step} title={g.title} sub={g.sub} onClick={() => setA({ step: g.step })} />)}
                  {stage === 1 &&
                    a.step &&
                    STEP_SIZES[a.step].filter((s) => getEntry(a.step!, "prime", "match-trader", s)).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setA((p) => ({ ...p, size: s }))}
                        className="cursor-pointer rounded-[16px] px-[12px] py-[18px] text-[20px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,178,255,0.2)" }}
                      >
                        {fmtSize(s)}
                      </button>
                    ))}
                  {stage === 2 && PLATFORM_OPTIONS.map((o) => <Choice key={o.id} title={o.label} onClick={() => pickPlatform(o.id)} />)}
                </div>
              </motion.div>
            ) : (
              entry &&
              a.step &&
              a.size &&
              a.platform && (
                <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-[18px]">
                  <div className="flex items-center justify-between gap-[12px]">
                    <span className="rounded-full px-[11px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#86efac]" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                      Your best match
                    </span>
                    <button type="button" onClick={() => setA({})} className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[#93c5fd]">
                      Start over
                    </button>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[44px]">
                      {fmtSize(a.size)} <span className="fyt-gradient-text">{STEP_LABELS[a.step]} Prime</span>
                    </span>
                    <span className="text-[13.5px]" style={{ color: C.mutedDark }}>
                      {goal?.why} Prime has no consistency rule, on {PLATFORM_OPTIONS.find((o) => o.id === a.platform)?.label}.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-4">
                    {[
                      ["Profit target", targetText(a.step, entry.p1, entry.p2, entry.profit)],
                      ["Daily loss", entry.maxDaily],
                      ["Max loss", entry.maxOverall],
                      ["Profit split", entry.split],
                    ].map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-[4px] rounded-[14px] px-[14px] py-[12px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(148,178,255,0.16)" }}>
                        <span className="text-[16px] font-semibold text-white">{v}</span>
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
                          {k}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-[10px] sm:flex-row">
                    <a href={checkoutUrl(entry.productId)} className="flex flex-1 items-center justify-center rounded-full px-[22px] py-[14px] text-[15px] font-semibold text-white no-underline transition-transform duration-300 hover:-translate-y-[2px]" style={{ background: "linear-gradient(180deg,#4f8cff,#2563eb)", boxShadow: "0 12px 28px -12px rgba(37,99,235,0.9)" }}>
                      Get this challenge
                    </a>
                    <button
                      type="button"
                      onClick={() => selectPlanInPricing({ step: a.step, plan: "prime", platform: a.platform, size: a.size })}
                      className="flex-1 cursor-pointer rounded-full border-0 px-[22px] py-[14px] text-[15px] font-semibold text-white"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)" }}
                    >
                      See it in the table
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
