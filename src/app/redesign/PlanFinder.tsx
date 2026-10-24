import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STEP_LABELS, fmtSize, getEntry, type StepId } from "@/app/data/pricing";
import { selectPlanInPricing } from "@/app/data/savedPlan";

/* ------------------------------------------------------------------ */
/* "Find my best fit": a small launcher pill (next to the Discord and  */
/* chat buttons) that opens a 5-tap guide. It recommends Instant       */
/* Funding or a Challenge, then selects it in the pricing table.       */
/* Rules based and instant. Every number comes from the pricing data.  */
/* ------------------------------------------------------------------ */

type Score = Partial<Record<StepId, number>>;
interface Option {
  id: string;
  label: string;
  sub?: string;
  score?: Score;
  size?: number;
}
interface Question {
  key: "exp" | "style" | "session" | "pace" | "size";
  title: string;
  options: Option[];
  cols?: 2;
}

const QUESTIONS: Question[] = [
  {
    key: "exp",
    title: "How long have you been trading?",
    options: [
      { id: "new", label: "Just starting", sub: "Under a year", score: { "2-Step": 1 } },
      { id: "mid", label: "1 to 3 years", score: { "1-Step": 1 } },
      { id: "pro", label: "3+ years", sub: "Experienced", score: { Instant: 1 } },
    ],
  },
  {
    key: "style",
    title: "What is your trading style?",
    options: [
      { id: "scalp", label: "Scalping", sub: "Quick in and out", score: { Instant: 1 } },
      { id: "day", label: "Day trading", sub: "Closed by end of day", score: { "1-Step": 1 } },
      { id: "swing", label: "Swing trading", sub: "Hold for days", score: { "2-Step": 1 } },
      { id: "mixed", label: "A bit of everything" },
    ],
  },
  {
    key: "session",
    title: "Which session do you trade most?",
    cols: 2,
    options: [
      { id: "Asian", label: "Asian" },
      { id: "London", label: "London" },
      { id: "New York", label: "New York" },
      { id: "Mixed", label: "A mix" },
    ],
  },
  {
    key: "pace",
    title: "Slow and steady, or fast?",
    options: [
      { id: "slow", label: "Slow and steady", sub: "Room to breathe", score: { "2-Step": 2 } },
      { id: "bal", label: "Balanced", sub: "One clear target", score: { "1-Step": 2 } },
      { id: "fast", label: "Fast", sub: "Funded straight away", score: { Instant: 2 } },
    ],
  },
  {
    key: "size",
    title: "Pick your starting size",
    cols: 2,
    options: [10000, 25000, 50000, 100000].map((s) => ({ id: String(s), label: fmtSize(s), size: s })),
  },
];

const ORDER: StepId[] = ["Instant", "1-Step", "2-Step"]; // ties go to Instant

type Picked = Record<string, Option>;

function recommend(p: Picked): { step: StepId; size: number } {
  const tally: Record<StepId, number> = { Instant: 0, "1-Step": 0, "2-Step": 0 };
  for (const o of Object.values(p)) for (const [k, v] of Object.entries(o.score ?? {})) tally[k as StepId] += v ?? 0;
  const step = ORDER.reduce((best, s) => (tally[s] > tally[best] ? s : best), ORDER[0]);
  return { step, size: p.size?.size ?? 25000 };
}

function Sparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l1.9 5.6a3 3 0 0 0 1.9 1.9l5.6 1.9-5.6 1.9a3 3 0 0 0-1.9 1.9L12 21.3l-1.9-5.6a3 3 0 0 0-1.9-1.9L2.6 11.9l5.6-1.9a3 3 0 0 0 1.9-1.9L12 2.5Z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Result({ picked, onGo, onRetake }: { picked: Picked; onGo: (step: StepId, size: number) => void; onRetake: () => void }) {
  const { step, size } = recommend(picked);
  const entry = getEntry(step, "prime", "match-trader", size);
  const instant = step === "Instant";
  const session = picked.session?.id;
  const why: string[] = instant
    ? ["No phases. You trade a funded account from day one.", `${entry?.maxDaily ?? "-"} daily loss and ${entry?.maxOverall ?? "-"} max loss: keep your risk tight.`, picked.style?.id === "scalp" ? "Made for quick scalps: no targets to wait on." : "Payouts every two weeks."]
    : step === "1-Step"
      ? ["One phase, then you are funded.", `${entry?.p1 ?? "-"} target, ${entry?.maxDaily ?? "-"} daily loss, ${entry?.maxOverall ?? "-"} max loss.`, session && session !== "Mixed" ? `No time limit, so your ${session} session works at your pace.` : "No time limit. Trade at your own pace."]
      : ["Two phases with the widest limits.", `${entry?.maxDaily ?? "-"} daily loss and ${entry?.maxOverall ?? "-"} max loss: real room to breathe.`, session && session !== "Mixed" ? `No time limit, so your ${session} session works at your pace.` : "No time limit. Trade at your own pace."];
  return (
    <div key="result" className="fyt-pf-in flex flex-col gap-[18px]">
      <span className="w-fit rounded-full px-[11px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#86efac]" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
        Best for you
      </span>
      <div className="flex flex-col gap-[4px]">
        <span className="text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[36px]">
          {instant ? (
            <>
              Instant <span className="fyt-gradient-text">Funding</span>
            </>
          ) : (
            <>
              {STEP_LABELS[step]} <span className="fyt-gradient-text">Challenge</span>
            </>
          )}
        </span>
        <span className="text-[14px] text-[#9fb0d4]">
          {fmtSize(size)} · Prime · no consistency rule
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
        {why.map((w) => (
          <li key={w} className="flex items-start gap-[10px] text-[14px] leading-[1.4] text-[#d6e0f5]">
            <span className="mt-[2px] flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[rgba(34,197,94,0.18)]">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 6.3 5 8.8 9.5 3.6" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {w}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onGo(step, size)}
        className="mt-[4px] flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-full border-0 px-[22px] py-[15px] text-[15.5px] font-semibold text-white transition-transform duration-300 hover:-translate-y-[2px]"
        style={{ background: "linear-gradient(180deg,#5a9bff,#2563eb)", boxShadow: "0 14px 30px -14px rgba(37,99,235,0.95), inset 0 1px 0 rgba(255,255,255,0.35)" }}
      >
        Get my account
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={onRetake} className="cursor-pointer self-center border-0 bg-transparent p-0 text-[13px] font-semibold text-[#93c5fd]">
        Retake
      </button>
    </div>
  );
}

export function PlanFinder() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [picked, setPicked] = useState<Picked>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const idx = QUESTIONS.findIndex((q) => !picked[q.key]);
  const done = idx === -1;

  useEffect(() => {
    const on = () => setShown(window.scrollY > 520);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  function go(step: StepId, size: number) {
    close();
    // Let the sheet close first, then select the plan and scroll to the table.
    window.setTimeout(() => selectPlanInPricing({ step, plan: "prime", platform: "match-trader", size }), 60);
  }

  if (typeof document === "undefined") return null;
  const q = QUESTIONS[Math.min(idx === -1 ? QUESTIONS.length - 1 : idx, QUESTIONS.length - 1)];

  return createPortal(
    <>
      {!open && shown && (
        <button
          type="button"
          onClick={() => {
            setPicked({});
            setOpen(true);
          }}
          aria-label="Find my best fit: Instant Funding or Challenge"
          className="fyt-pf-pill fixed left-1/2 flex h-[48px] -translate-x-1/2 cursor-pointer items-center gap-[9px] whitespace-nowrap rounded-full border-0 pl-[14px] pr-[18px] text-[14px] font-semibold text-white transition-transform duration-300 hover:-translate-y-[2px]"
          style={{
            bottom: "max(20px, env(safe-area-inset-bottom, 0px))",
            zIndex: 2147482980,
            background: "linear-gradient(180deg, rgba(20,34,72,0.96), rgba(8,14,32,0.96))",
            boxShadow: "0 0 0 1px rgba(96,165,250,0.5), 0 14px 34px -10px rgba(37,99,235,0.75)",
          }}
        >
          <span className="flex size-[26px] items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(180deg,#5a9bff,#2563eb)" }}>
            <Sparkle size={13} />
          </span>
          Find my best fit
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Find my best fit"
          onClick={(e) => e.target === e.currentTarget && close()}
          className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-[24px]"
          style={{ zIndex: 2147483001, background: "rgba(3,6,13,0.72)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        >
          <div className="fyt-pf-in relative flex max-h-[92vh] w-full max-w-[520px] flex-col gap-[18px] overflow-y-auto rounded-t-[26px] p-[22px] pb-[max(22px,env(safe-area-inset-bottom,0px))] sm:rounded-[26px] sm:p-[30px]" style={{ background: "linear-gradient(180deg,#0e1a3a 0%,#070d1c 55%)", border: "1px solid rgba(148,178,255,0.22)", boxShadow: "0 60px 120px -40px rgba(37,99,235,0.7)", color: "#fff" }}>
            <div className="flex items-center justify-between gap-[12px]">
              <span className="flex items-center gap-[8px] text-[12px] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
                <Sparkle size={13} /> Find my best fit
              </span>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="flex size-[32px] cursor-pointer items-center justify-center rounded-full border-0 text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex gap-[5px]" aria-hidden="true">
              {QUESTIONS.map((x, i) => (
                <span key={x.key} className="h-[4px] flex-1 rounded-full transition-colors duration-500" style={{ background: done || i <= idx ? "#60a5fa" : "rgba(255,255,255,0.14)" }} />
              ))}
            </div>

            {done ? (
              <Result picked={picked} onGo={go} onRetake={() => setPicked({})} />
            ) : (
              <div key={q.key} className="fyt-pf-in flex flex-col gap-[16px]">
                <h3 className="m-0 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[26px]">{q.title}</h3>
                <div className={q.cols === 2 ? "grid grid-cols-2 gap-[10px]" : "grid grid-cols-1 gap-[10px]"}>
                  {q.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setPicked((p) => ({ ...p, [q.key]: o }))}
                      className="group flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[16px] px-[16px] py-[14px] text-left text-white transition-all duration-300 hover:-translate-y-[2px]"
                      style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(148,178,255,0.2)" }}
                    >
                      <span className="flex min-w-0 flex-col gap-[2px]">
                        <span className="text-[16px] font-semibold">{o.label}</span>
                        {o.sub && <span className="text-[12.5px] text-[#8e98b0]">{o.sub}</span>}
                      </span>
                      {q.cols !== 2 && <Arrow />}
                    </button>
                  ))}
                </div>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPicked((p) => {
                        const n = { ...p };
                        delete n[QUESTIONS[idx - 1].key];
                        return n;
                      })
                    }
                    className="cursor-pointer self-start border-0 bg-transparent p-0 text-[13px] font-semibold text-[#93c5fd]"
                  >
                    Back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
