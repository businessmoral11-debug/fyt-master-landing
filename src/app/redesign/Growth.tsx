import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { STEP_LABELS, STEP_SIZES, checkoutUrl, fmtSize, getEntry, type PlanId, type StepId } from "@/app/data/pricing";
import { PROMO_CARD_EXTRAS, PROMO_CODE } from "@/app/data/promoBanner";
import { TESTIMONIAL_VIDEOS, type TestimonialVideo } from "@/app/data/testimonials";
import {
  countryFlagUrl,
  fetchFeaturedCertificates,
  fetchFeaturedPayouts,
  formatPayoutAmount,
  type PublicCertificate,
  type PublicPayout,
} from "@/app/api/rewardsApi";
import { COMPARISON_ROWS, VideoLightbox } from "@/app/BelowFold";
import { testimonialVideoSource } from "@/app/motion/videoLightbox";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import {
  readSavedPlan,
  savedPlanLabel,
  selectPlanInPricing,
  stampVisit,
  submitLead,
  writeSavedPlan,
  type SavedPlan,
} from "@/app/data/savedPlan";
import { C, EASE, Eyebrow, Pill, Reveal, Section, SectionTitle, WordsReveal, spotlightMove, staggerChild, staggerParent, useLive, useShimmer } from "./ui";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const DISCORD_INVITE_CODE = "6NYNSAwxeZ";
const DISCORD_URL = `https://discord.gg/${DISCORD_INVITE_CODE}`;

function money(n: number): string {
  const hasFraction = Math.round((n % 1) * 100) !== 0;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: hasFraction ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function relTime(iso: string | null): string {
  if (!iso) return "";
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CheckIcon({ color = "#60a5fa", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M11.6662 3.5L5.25017 9.9162L2.3338 6.99975" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full px-[12px] py-[7px] text-[12.5px] font-semibold text-white" style={{ background: "rgba(37,99,235,0.18)", border: "1px solid rgba(148,178,255,0.28)" }}>
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1.5v11M1.5 7h11" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}

const DARK_CARD = { background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))", border: `1px solid ${C.borderDark}` } as const;
const LIGHT_CARD = { background: "#fff", border: `1px solid ${C.borderLight}`, boxShadow: "0 40px 80px -52px rgba(30,64,175,0.45)" } as const;

/* ------------------------------------------------------------------ */
/* Visitor country (no network call: time zone first, then language)  */
/* ------------------------------------------------------------------ */

const TZ_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Karachi": "PK", "Asia/Dhaka": "BD", "Asia/Kathmandu": "NP", "Asia/Colombo": "LK",
  "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kuwait": "KW", "Asia/Bahrain": "BH", "Asia/Muscat": "OM",
  "Africa/Lagos": "NG", "Africa/Nairobi": "KE", "Africa/Johannesburg": "ZA", "Africa/Accra": "GH", "Africa/Cairo": "EG", "Africa/Casablanca": "MA",
  "Europe/London": "GB", "Europe/Berlin": "DE", "Europe/Paris": "FR", "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL",
  "Europe/Bucharest": "RO", "Europe/Vilnius": "LT", "Europe/Warsaw": "PL", "Europe/Istanbul": "TR",
  "Asia/Kuala_Lumpur": "MY", "Asia/Singapore": "SG", "Asia/Manila": "PH", "Asia/Jakarta": "ID", "Asia/Bangkok": "TH", "Asia/Ho_Chi_Minh": "VN",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "America/Toronto": "CA", "America/Vancouver": "CA",
  "America/Sao_Paulo": "BR", "America/Mexico_City": "MX", "America/Bogota": "CO", "America/Argentina/Buenos_Aires": "AR",
};

export function detectVisitorCountry(): string | null {
  try {
    const override = new URLSearchParams(window.location.search).get("country");
    if (override && /^[a-z]{2}$/i.test(override)) return override.toUpperCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
    for (const lang of navigator.languages ?? [navigator.language]) {
      const m = /-([A-Z]{2})$/i.exec(lang ?? "");
      if (m) return m[1].toUpperCase();
    }
  } catch {
    // Fall through to "worldwide".
  }
  return null;
}

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/* ------------------------------------------------------------------ */
/* Live Discord counter                                                */
/* ------------------------------------------------------------------ */

function useDiscordCounts() {
  const [counts, setCounts] = useState<{ online: number; members: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`https://discord.com/api/v9/invites/${DISCORD_INVITE_CODE}?with_counts=true`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        const online = Number(d.approximate_presence_count);
        const members = Number(d.approximate_member_count);
        if (Number.isFinite(online) && online > 0) setCounts({ online, members: Number.isFinite(members) ? members : 0 });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return counts;
}

export function DiscordLive({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const counts = useDiscordCounts();
  const dark = tone === "dark";
  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex max-w-full items-center gap-[12px] rounded-[16px] py-[10px] pl-[10px] pr-[16px] no-underline transition-transform duration-300 hover:-translate-y-[2px]"
      style={dark ? { background: "rgba(88,101,242,0.12)", border: "1px solid rgba(129,140,248,0.3)" } : { background: "#fff", border: `1px solid ${C.borderLight}`, boxShadow: "0 18px 40px -28px rgba(30,64,175,0.5)" }}
    >
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px]" style={{ background: "#5865f2" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18 18 0 0 0-5.6 0L8.6 3a19.6 19.6 0 0 0-4.9 1.5C.6 9.1-.3 13.7.1 18.2a19.8 19.8 0 0 0 6 3l1.3-2.1-2-1 .5-.4a14 14 0 0 0 12.2 0l.5.4-2 1 1.3 2.1a19.7 19.7 0 0 0 6-3c.5-5.2-.8-9.8-3.6-13.8ZM8.3 15.4c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm7.4 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-[7px] text-[13.5px] font-semibold" style={{ color: dark ? "#fff" : C.textLight }}>
          {counts ? (
            <>
              <span className="relative flex size-[8px]">
                <span className="fyt-rd-ping absolute inset-0 rounded-full bg-[#22c55e]" />
                <span className="relative size-[8px] rounded-full bg-[#22c55e]" />
              </span>
              <span className="tabular">{counts.online.toLocaleString("en-US")} traders online now</span>
            </>
          ) : (
            "Live trader community"
          )}
        </span>
        <span className="truncate text-[12px]" style={{ color: dark ? "#a5b4fc" : C.mutedLight }}>
          {counts && counts.members ? `${counts.members.toLocaleString("en-US")} members · ` : ""}Ask a funded trader on Discord
        </span>
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-[4px] shrink-0 transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true">
        <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke={dark ? "#c7d2fe" : "#2563eb"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Country-matched proof: "People like me get paid"                 */
/* ------------------------------------------------------------------ */

export function CountryProof() {
  const reduce = useReducedMotion();
  const [code, setCode] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<PublicPayout[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [worldwide, setWorldwide] = useState(false);

  useEffect(() => {
    setCode(detectVisitorCountry());
    let cancelled = false;
    Promise.all([fetchFeaturedPayouts(1, 100).catch(() => null), fetchFeaturedPayouts(2, 100).catch(() => null)])
      .then((rs) => {
        if (cancelled) return;
        const all = rs.flatMap((r) => r?.data ?? []).filter((p) => Number(p.amount) > 0);
        setPayouts(all);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const local = useMemo(() => (code ? payouts.filter((p) => (p.countryCode ?? "").toUpperCase() === code) : []), [code, payouts]);
  const hasLocal = local.length >= 3;
  const showLocal = hasLocal && !worldwide;
  const pool = showLocal ? local : payouts;
  const list = pool.slice(0, 6);
  const total = pool.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const countries = useMemo(() => new Set(payouts.map((p) => p.countryCode).filter(Boolean)).size, [payouts]);
  const name = code ? countryName(code) : "";
  const flag = code ? countryFlagUrl(code) : null;

  if (loaded && payouts.length === 0) return null;

  return (
    <Section tone="dark" stars>
      <div className="relative grid grid-cols-1 items-center gap-[40px] lg:grid-cols-12 lg:gap-[56px]">
        <div className="flex flex-col gap-[22px] lg:col-span-5">
          <Eyebrow>People like you</Eyebrow>
          <h2 className="text-[32px] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[40px] lg:text-[52px]" style={{ color: C.textDark }}>
            {showLocal ? (
              <>
                <span className="inline-flex items-center gap-[12px]">
                  Traders from
                  {flag && <img src={flag} alt="" width={44} height={32} className="inline-block h-[0.62em] w-auto rounded-[5px] shadow-[0_6px_18px_rgba(0,0,0,0.4)]" />}
                </span>
                <br />
                <span className="fyt-gradient-text">{name} get paid.</span>
              </>
            ) : (
              <>
                Traders worldwide
                <br />
                <span className="fyt-gradient-text">get paid every week.</span>
              </>
            )}
          </h2>
          <div className="grid grid-cols-3 gap-[10px]">
            {[
              [String(pool.length || "-"), "Rewards"],
              [total ? money(Math.round(total)) : "-", "Total paid"],
              [showLocal ? "24-48h" : String(countries || "-"), showLocal ? "Paid in" : "Countries"],
            ].map(([v, l]) => (
              <div key={l} className="flex min-w-0 flex-col gap-[4px] rounded-[16px] p-[14px]" style={DARK_CARD}>
                <span className="tabular truncate text-[20px] font-semibold tracking-[-0.03em] text-white sm:text-[24px]">{v}</span>
                <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] sm:text-[11px]" style={{ color: C.mutedDark }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
          {hasLocal && (
            <div className="inline-flex w-fit rounded-full p-[4px]" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderDark}` }} role="tablist">
              {[
                [false, name],
                [true, "Worldwide"],
              ].map(([w, label]) => {
                const on = worldwide === w;
                return (
                  <button
                    key={String(label)}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setWorldwide(w as boolean)}
                    className="cursor-pointer rounded-full border-0 px-[16px] py-[8px] text-[13px] font-semibold transition-colors"
                    style={on ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff" } : { background: "transparent", color: C.mutedDark }}
                  >
                    {String(label)}
                  </button>
                );
              })}
            </div>
          )}
          <DiscordLive />
        </div>

        <div className="lg:col-span-7">
          <motion.ul
            key={showLocal ? "local" : "world"}
            className="grid grid-cols-1 gap-[12px] sm:grid-cols-2"
            variants={staggerParent(0.07)}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            {(list.length ? list : Array.from({ length: 6 }, () => null)).map((p, i) => {
              if (!p) return <li key={i} className="h-[86px] animate-pulse rounded-[18px]" style={DARK_CARD} />;
              const f = countryFlagUrl(p.countryCode);
              const proof = p.certificateUrl || p.explorerUrl;
              return (
                <motion.li
                  key={`${p.id ?? i}`}
                  variants={staggerChild}
                  onPointerMove={spotlightMove}
                  className="fyt-spot relative flex items-center gap-[14px] overflow-hidden rounded-[18px] p-[16px]"
                  style={DARK_CARD}
                >
                  <span className="flex size-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ background: "rgba(59,130,246,0.14)", border: "1px solid rgba(96,165,250,0.3)" }}>
                    {f ? <img src={f} alt="" width={44} height={44} loading="lazy" className="size-full object-cover" /> : <span className="text-[14px] font-semibold text-white">{(p.traderName ?? "T").slice(0, 1)}</span>}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[15px] font-semibold text-white">{p.traderName ?? "FYT trader"}</span>
                    <span className="truncate text-[12.5px]" style={{ color: C.mutedDark }}>
                      {p.country ?? ""}
                      {p.country && p.createdAt ? " · " : ""}
                      {relTime(p.createdAt)}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-[4px]">
                    <span className="tabular text-[17px] font-semibold text-[#4ade80]">{formatPayoutAmount(p.amount)}</span>
                    {proof ? (
                      <a href={proof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[4px] text-[11.5px] font-semibold text-[#93c5fd] no-underline hover:underline">
                        <CheckIcon size={11} color="#86efac" /> Verified
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-[4px] text-[11.5px] font-semibold text-[#86efac]">
                        <CheckIcon size={11} color="#86efac" /> Paid
                      </span>
                    )}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
          <Reveal delay={0.15} className="mt-[22px] flex flex-wrap items-center gap-[14px]">
            <Pill href="#plan-finder" onClick={() => pauseHeavyScenesForNav()}>
              Find my plan
            </Pill>
            <a href="https://rewards.fundingyourtrades.com/" target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold text-[#93c5fd] no-underline hover:underline">
              Every reward is verified on-chain
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Plan finder                                                      */
/* ------------------------------------------------------------------ */

type Answer = number;
const FINDER_QUESTIONS: { q: string; options: { label: string; sub?: string; icon: string }[] }[] = [
  {
    q: "How long have you been trading?",
    options: [
      { label: "Less than 1 year", sub: "Still building my edge", icon: "🌱" },
      { label: "1-3 years", sub: "I have a strategy", icon: "📈" },
      { label: "3+ years", sub: "Consistent and proven", icon: "🏆" },
    ],
  },
  {
    q: "How do you usually trade?",
    options: [
      { label: "Scalping", sub: "Minutes, many trades", icon: "⚡" },
      { label: "Day trading", sub: "Hours, closed by evening", icon: "☀️" },
      { label: "Swing trading", sub: "Days, held overnight", icon: "🌙" },
    ],
  },
  {
    q: "Do you trade news releases?",
    options: [
      { label: "Yes, often", sub: "NFP, CPI, rate decisions", icon: "📰" },
      { label: "Sometimes", icon: "🤏" },
      { label: "No, I avoid news", icon: "🛡️" },
    ],
  },
  { q: "What account size feels right?", options: [] },
];

function recommend(ans: Answer[]): { step: StepId; plan: PlanId; why: string[] } {
  const newer = ans[0] === 0;
  const step: StepId = newer ? "2-Step" : "1-Step";
  const plan: PlanId = ans[2] === 0 ? "classic" : "prime";
  const why: string[] = [];
  why.push(newer ? "Two phases with a wide 10% max loss give you room while you build consistency." : "One target and no time limit. The fastest route to your first reward.");
  why.push(plan === "classic" ? "Classic keeps news trading allowed after you are funded too." : "Prime has no consistency rule, so one big day never holds your reward back.");
  if (ans[1] === 2) why.push("Weekend and overnight holding is allowed, made for swing trades.");
  if (ans[1] === 0) why.push("No minimum trading days. Pass as fast as your strategy allows.");
  return { step, plan, why };
}

function FinderOption({ label, sub, icon, onClick }: { label: string; sub?: string; icon?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerMove={spotlightMove}
      className="fyt-spot group flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] p-[15px] text-left transition-[translate,background-color,border-color] duration-200 hover:-translate-y-[1px]"
      style={{ ...DARK_CARD, color: C.textDark }}
    >
      {icon && (
        <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] text-[19px]" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(96,165,250,0.25)" }} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[16px] font-semibold">{label}</span>
        {sub && <span className="text-[13px]" style={{ color: C.mutedDark }}>{sub}</span>}
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-50 transition-[opacity,translate] group-hover:translate-x-[3px] group-hover:opacity-100" aria-hidden="true">
        <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#93c5fd" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function SavePlanForm({ plan, compact = false }: { plan: Omit<SavedPlan, "savedAt">; compact?: boolean }) {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    writeSavedPlan(plan);
    setDone(true);
    await submitLead("saved-plan", email, { plan: savedPlanLabel(plan), ...plan, code: PROMO_CODE });
  };
  if (done)
    return (
      <p className="flex items-center gap-[8px] text-[13.5px] font-medium text-[#86efac]">
        <CheckIcon color="#86efac" /> Saved. Your plan and code {PROMO_CODE} are on the way to your inbox.
      </p>
    );
  return (
    <form onSubmit={onSubmit} className={`flex gap-[8px] ${compact ? "" : "flex-col sm:flex-row"}`}>
      <label className="sr-only" htmlFor={compact ? "fyt-save-plan-email-c" : "fyt-save-plan-email"}>
        Email
      </label>
      <input
        id={compact ? "fyt-save-plan-email-c" : "fyt-save-plan-email"}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Not ready? Email me this plan"
        className="min-w-0 flex-1 rounded-full px-[16px] py-[12px] text-[14px] text-white outline-none placeholder:text-[#7c8699] focus:border-[#60a5fa]"
        style={{ background: "rgba(3,6,13,0.6)", border: "1px solid rgba(255,255,255,0.14)" }}
      />
      <button type="submit" className="cursor-pointer whitespace-nowrap rounded-full px-[18px] py-[12px] text-[14px] font-semibold text-white transition-colors hover:bg-white/10" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.18)" }}>
        Save plan
      </button>
    </form>
  );
}

export function PlanFinder() {
  const reduce = useReducedMotion();
  const [ans, setAns] = useState<Answer[]>([]);
  const step = ans.length;
  const total = FINDER_QUESTIONS.length;
  const done = step >= total;
  const [ringRef, live] = useLive<HTMLDivElement>();

  const rec = done ? recommend(ans) : null;
  const sizes = STEP_SIZES[ans[0] === 0 ? "2-Step" : "1-Step"];
  const size = done ? sizes[ans[3]] ?? 100000 : 100000;
  const entry = rec ? getEntry(rec.step, rec.plan, "match-trader", size) : undefined;
  const chosen = rec ? { step: rec.step, plan: rec.plan, platform: "match-trader" as const, size } : null;

  useEffect(() => {
    if (chosen) writeSavedPlan(chosen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, rec?.step, rec?.plan, size]);

  const pick = (i: number) => setAns((a) => [...a, i]);
  const back = () => setAns((a) => a.slice(0, -1));

  return (
    <Section tone="light" id="plan-finder">
      <div className="relative grid grid-cols-1 items-center gap-[40px] lg:grid-cols-12 lg:gap-[64px]">
        <div className="flex flex-col gap-[20px] lg:col-span-5">
          <Eyebrow tone="light">Plan finder</Eyebrow>
          <SectionTitle tone="light" lead="Find the challenge built for" highlight="how you trade." />
          <Reveal delay={0.1}>
            <p className="max-w-[440px] text-[16px] leading-[1.7] lg:text-[17px]" style={{ color: C.mutedLight }}>
              Four quick questions. We match your model and size, and show your price with 40% off.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="flex flex-col gap-[12px]">
              {["30 seconds", "No sign-up needed", "Save your plan for later"].map((t) => (
                <li key={t} className="flex items-center gap-[10px] text-[15px] font-medium" style={{ color: C.textLight }}>
                  <span className="flex size-[22px] items-center justify-center rounded-full" style={{ background: "rgba(37,99,235,0.1)" }}>
                    <CheckIcon color="#2563eb" size={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div ref={ringRef} className={`fyt-ring rounded-[28px] ${live ? "fyt-live" : ""}`} style={{ boxShadow: "0 60px 120px -60px rgba(30,64,175,0.7)" }}>
            <div className="flex min-h-[500px] flex-col p-[22px] sm:p-[32px]" aria-live="polite">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93c5fd]">{done ? "Your match" : `Question ${step + 1} of ${total}`}</span>
                <span className="tabular text-[12px]" style={{ color: C.mutedDark }}>
                  {Math.round((Math.min(step, total) / total) * 100)}%
                </span>
              </div>
              <div className="mb-[24px] mt-[12px] h-[4px] overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#2563eb,#60a5fa,#bfdbfe)" }} animate={{ width: `${Math.max(6, (Math.min(step, total) / total) * 100)}%` }} transition={{ duration: 0.5, ease: EASE }} />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  className="flex flex-1 flex-col"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {!done && (
                    <>
                      <h3 className="mb-[18px] text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:text-[28px]">{FINDER_QUESTIONS[step].q}</h3>
                      {step < 3 ? (
                        <div className="flex flex-col gap-[10px]">
                          {FINDER_QUESTIONS[step].options.map((o, i) => (
                            <FinderOption key={o.label} {...o} onClick={() => pick(i)} />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3">
                          {sizes.map((s, i) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => pick(i)}
                              className="cursor-pointer rounded-[16px] py-[18px] text-[18px] font-semibold text-white transition-[translate,border-color] duration-200 hover:-translate-y-[1px] hover:border-[#60a5fa]"
                              style={DARK_CARD}
                            >
                              {fmtSize(s)}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {done && rec && entry && chosen && (
                    <div className="flex flex-col gap-[16px]">
                      <span className="flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86efac]">
                        <CheckIcon color="#86efac" size={12} /> Best match for you
                      </span>
                      <div className="flex flex-wrap items-end justify-between gap-[12px]">
                        <h3 className="text-[30px] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[36px]">
                          {fmtSize(size)} {STEP_LABELS[rec.step]} <span className="text-[#93c5fd]">{rec.plan === "prime" ? "Prime" : "Classic"}</span>
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-[6px]">
                        {rec.why.map((w) => (
                          <li key={w} className="flex gap-[8px] text-[14px] leading-[1.5]" style={{ color: "#c7d2e6" }}>
                            <span className="mt-[4px] shrink-0">
                              <CheckIcon size={12} />
                            </span>
                            {w}
                          </li>
                        ))}
                      </ul>
                      <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-4">
                        {[
                          [rec.step === "2-Step" ? `${entry.p1} / ${entry.p2}` : entry.p1 ?? "", "Target"],
                          [entry.maxDaily, "Daily loss"],
                          [entry.maxOverall, "Max loss"],
                          [entry.split.replace("Up to ", ""), "Split"],
                        ].map(([v, l]) => (
                          <div key={l} className="rounded-[12px] px-[8px] py-[10px] text-center" style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${C.borderDark}` }}>
                            <div className="tabular text-[16px] font-semibold text-white">{v}</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.1em]" style={{ color: C.mutedDark }}>
                              {l}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-baseline gap-[10px]">
                        <span className="tabular text-[44px] font-semibold leading-none tracking-[-0.04em] text-white">{money(entry.priceNew)}</span>
                        <s className="tabular text-[18px]" style={{ color: C.mutedDark }}>
                          {money(entry.priceOld)}
                        </s>
                        <span className="rounded-full bg-[#bfdbfe] px-[9px] py-[4px] text-[12px] font-bold text-[#0a1226]">-40%</span>
                      </div>
                      <div className="flex flex-wrap gap-[8px]">
                        {PROMO_CARD_EXTRAS.map((x) => (
                          <PlusChip key={x}>{x}</PlusChip>
                        ))}
                      </div>
                      <div className="flex flex-col gap-[10px] sm:flex-row">
                        <Pill href={checkoutUrl(entry.productId)} className="w-full sm:w-auto">
                          Start challenge
                        </Pill>
                        <Pill variant="secondary" onClick={() => selectPlanInPricing(chosen)} arrow={false} className="w-full sm:w-auto">
                          Compare all plans
                        </Pill>
                      </div>
                      <SavePlanForm plan={chosen} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {step > 0 && (
                <button type="button" onClick={done ? () => setAns([]) : back} className="mt-[18px] w-fit cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium" style={{ color: C.mutedDark }}>
                  {done ? "↺ Start over" : "← Back"}
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Payout board: Biggest rewards / On camera                        */
/* ------------------------------------------------------------------ */

export function PayoutBoard() {
  const [tab, setTab] = useState<"biggest" | "camera">("biggest");
  const [certs, setCerts] = useState<PublicCertificate[]>([]);
  const [active, setActive] = useState(0);
  const [video, setVideo] = useState<TestimonialVideo | null>(null);
  const closeVideo = useCallback(() => setVideo(null), []);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedCertificates(1, 48)
      .then((r) => {
        if (cancelled) return;
        const sorted = [...r.data].filter((c) => Number(c.amount) > 0).sort((a, b) => Number(b.amount) - Number(a.amount));
        setCerts(sorted.slice(0, 7));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const current = certs[active];
  const videos = TESTIMONIAL_VIDEOS.slice(0, 7);

  return (
    <Section tone="light" id="live-payouts">
      <div className="flex flex-col gap-[18px] lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-[16px]">
          <Eyebrow tone="light">On the record</Eyebrow>
          <SectionTitle tone="light" lead="Real traders." highlight="Real rewards." />
        </div>
        <Reveal y={12}>
          <div className="inline-flex rounded-full bg-white p-[5px]" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 12px 30px -20px rgba(30,64,175,0.5)" }} role="tablist">
            {(
              [
                ["biggest", "Biggest rewards"],
                ["camera", "Paid on camera"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className="cursor-pointer rounded-full border-0 px-[18px] py-[10px] text-[14px] font-semibold transition-colors"
                style={tab === id ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff" } : { background: "transparent", color: C.mutedLight }}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-[36px] lg:mt-[48px]">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "biggest" ? (
            <motion.div key="biggest" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }} className="grid grid-cols-1 gap-[20px] lg:grid-cols-12">
              <div className="overflow-hidden rounded-[24px] lg:col-span-7" style={LIGHT_CARD}>
                <div className="flex items-center justify-between px-[20px] py-[16px]" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <span className="text-[15px] font-semibold" style={{ color: C.textLight }}>
                    Payout board
                  </span>
                  <span className="flex items-center gap-[6px] text-[12px] font-semibold text-[#16a34a]">
                    <CheckIcon color="#16a34a" size={12} /> Verified certificates
                  </span>
                </div>
                <ol>
                  {(certs.length ? certs : Array.from({ length: 6 }, () => null)).map((c, i) => {
                    if (!c) return <li key={i} className="h-[64px] animate-pulse" style={{ borderBottom: `1px solid ${C.borderLight}`, background: "#f8faff" }} />;
                    const f = countryFlagUrl(c.countryCode);
                    const on = i === active;
                    return (
                      <li key={c.certificateId} style={{ borderBottom: i < certs.length - 1 ? `1px solid ${C.borderLight}` : undefined }}>
                        <a
                          href={c.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          className="grid grid-cols-[28px_1fr_auto] items-center gap-[14px] px-[20px] py-[14px] no-underline transition-colors"
                          style={{ background: on ? "rgba(37,99,235,0.06)" : "transparent" }}
                        >
                          <span className="tabular text-[13px] font-semibold" style={{ color: i < 3 ? "#2563eb" : C.mutedLight }}>
                            #{i + 1}
                          </span>
                          <span className="flex min-w-0 items-center gap-[12px]">
                            {f && <img src={f} alt="" width={26} height={18} loading="lazy" className="h-[18px] w-[26px] shrink-0 rounded-[3px] object-cover" />}
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate text-[15px] font-semibold" style={{ color: C.textLight }}>
                                {c.traderName ?? "FYT trader"}
                              </span>
                              <span className="truncate text-[12.5px]" style={{ color: C.mutedLight }}>
                                {[c.country, relTime(c.createdAt)].filter(Boolean).join(" · ")}
                              </span>
                            </span>
                          </span>
                          <span className="tabular text-[17px] font-semibold text-[#16a34a]">{formatPayoutAmount(c.amount)}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="hidden lg:col-span-5 lg:block">
                <div className="sticky top-[140px] overflow-hidden rounded-[24px]" style={{ ...LIGHT_CARD, background: "#0a1226" }}>
                  <AnimatePresence mode="wait">
                    {current && (
                      <motion.img
                        key={current.certificateId}
                        src={current.imageUrl}
                        alt={`Payout certificate for ${current.traderName ?? "FYT trader"}`}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="aspect-[1.41] w-full object-cover"
                      />
                    )}
                  </AnimatePresence>
                  <div className="flex items-center justify-between px-[18px] py-[14px] text-[13px] text-[#c7d2e6]">
                    <span>{current ? `${current.traderName ?? "FYT trader"} · ${formatPayoutAmount(current.amount)}` : "Loading certificate"}</span>
                    <span className="flex items-center gap-[5px] font-semibold text-[#86efac]">
                      <CheckIcon color="#86efac" size={12} /> On-chain
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="camera" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }} className="grid grid-cols-2 gap-[14px] lg:grid-cols-4 lg:gap-[18px]">
              {videos.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setVideo(v)}
                  className={`group relative cursor-pointer overflow-hidden rounded-[20px] border-0 p-0 text-left ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                  style={LIGHT_CARD}
                  aria-label={`Play ${v.name}'s payout video`}
                >
                  <span className="relative block overflow-hidden" style={{ aspectRatio: i === 0 ? "16/10.6" : "16/9" }}>
                    <img src={v.posterUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(3,6,13,0.55))" }} />
                    <span className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 ${i === 0 ? "size-[72px]" : "size-[50px]"}`}>
                      <svg width={i === 0 ? 24 : 18} height={i === 0 ? 24 : 18} viewBox="0 0 24 24" fill="#2563eb" aria-hidden="true" className="ml-[3px]">
                        <path d="M7 4.5v15l12-7.5-12-7.5Z" />
                      </svg>
                    </span>
                    <span className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full bg-[#ef4444] px-[9px] py-[4px] text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
                      <span className="size-[6px] rounded-full bg-white" /> Payout call
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-[10px] bg-white px-[14px] py-[12px]">
                    <span className="truncate text-[14px] font-semibold" style={{ color: C.textLight }}>
                      {v.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-[#2563eb]">Watch</span>
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Reveal delay={0.1} className="mt-[36px] flex flex-col items-center justify-center gap-[14px] sm:flex-row">
        <Pill href="#plan-finder" onClick={() => pauseHeavyScenesForNav()}>
          Get on the board
        </Pill>
        <Pill href="https://rewards.fundingyourtrades.com/" target="_blank" rel="noopener noreferrer" variant="secondary" tone="light">
          Check more rewards
        </Pill>
      </Reveal>
      <VideoLightbox source={video ? testimonialVideoSource(video) : null} onClose={closeVideo} />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Reward calculator                                                */
/* ------------------------------------------------------------------ */

export function RewardCalculator() {
  const sizes = STEP_SIZES["1-Step"];
  const [size, setSize] = useState(100000);
  const [gain, setGain] = useState(5);
  const [split, setSplit] = useState(90);
  const entry = getEntry("1-Step", "prime", "match-trader", size);
  const reward = Math.round((size * gain * split) / 10000);
  const fee = entry?.priceNew ?? 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const multiple = fee ? Math.max(1, Math.round(reward / fee)) : 0;
  const bars = [fee, reward, reward * 2, reward * 3];
  const max = Math.max(...bars, 1);

  return (
    <Section tone="dark">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow center>Reward calculator</Eyebrow>
        <SectionTitle tone="dark" center lead="See what" highlight="you could earn." />
      </div>
      <div ref={ref} className="mt-[40px] grid grid-cols-1 gap-[20px] lg:mt-[56px] lg:grid-cols-2">
        <Reveal className="flex flex-col gap-[26px] rounded-[24px] p-[22px] sm:p-[30px]" style={DARK_CARD}>
          <div className="flex flex-col gap-[12px]">
            <span className="text-[13px] font-medium" style={{ color: C.mutedDark }}>
              Account size
            </span>
            <div className="grid grid-cols-5 gap-[8px]">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={s === size}
                  className="cursor-pointer rounded-[12px] py-[12px] text-[13px] font-semibold text-white transition-colors sm:text-[15px]"
                  style={s === size ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", border: "1px solid transparent" } : { background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderDark}` }}
                >
                  {fmtSize(s)}
                </button>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-[12px]" htmlFor="fyt-calc-gain">
            <span className="flex justify-between text-[13px] font-medium" style={{ color: C.mutedDark }}>
              Monthly gain <b className="tabular text-[16px] text-white">{gain}%</b>
            </span>
            <input id="fyt-calc-gain" type="range" min={1} max={10} value={gain} onChange={(e) => setGain(Number(e.target.value))} className="w-full accent-[#3b82f6]" />
          </label>
          <div className="flex flex-col gap-[12px]">
            <span className="text-[13px] font-medium" style={{ color: C.mutedDark }}>
              Reward split
            </span>
            <div className="grid grid-cols-3 gap-[8px]">
              {[80, 90, 100].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSplit(s)}
                  aria-pressed={s === split}
                  className="cursor-pointer rounded-[12px] py-[11px] text-[14px] font-semibold text-white transition-colors"
                  style={s === split ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", border: "1px solid transparent" } : { background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderDark}` }}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
          <p className="text-[12px] leading-[1.6]" style={{ color: "#6f7a94" }}>
            Example only. Your results depend on your trading. All accounts are simulated.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] p-[26px] text-center sm:p-[34px]" style={{ ...DARK_CARD, background: "radial-gradient(80% 70% at 50% 0%, rgba(37,99,235,0.35), transparent 70%), #0a1226" }}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.mutedDark }}>
            Your monthly reward
          </span>
          <motion.span key={reward} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} className="tabular mt-[10px] text-[56px] font-semibold leading-none tracking-[-0.04em] text-[#bbf7d0] sm:text-[76px]">
            {money(reward)}
          </motion.span>
          <span className="mt-[10px] text-[14px]" style={{ color: C.mutedDark }}>
            About <b className="text-white">{multiple}x</b> your account price
          </span>
          <div className="mt-[24px] flex h-[120px] w-full max-w-[320px] items-end justify-center gap-[12px]" aria-hidden="true">
            {bars.map((b, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-t-[8px] rounded-b-[3px]"
                style={{ background: i === 0 ? "rgba(255,255,255,0.16)" : "linear-gradient(180deg,#60a5fa,#1d4ed8)" }}
                initial={{ height: "4%" }}
                animate={{ height: inView ? `${Math.max(4, (b / max) * 100)}%` : "4%" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              />
            ))}
          </div>
          <div className="mt-[8px] flex w-full max-w-[320px] justify-between text-[11px]" style={{ color: C.mutedDark }}>
            <span>Price</span>
            <span>Month 1</span>
            <span>Month 2</span>
            <span>Month 3</span>
          </div>
          <Pill onClick={() => selectPlanInPricing({ step: "1-Step", plan: "prime", size })} className="mt-[26px]">
            Start with {money(fee)}
          </Pill>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. What usually goes wrong at prop firms, and what we do instead    */
/* ------------------------------------------------------------------ */

const PROBLEM_ROWS: { icon: string; criteria: string }[] = [
  { icon: "📉", criteria: "Drawdown Type" },
  { icon: "⏳", criteria: "Time Limit" },
  { icon: "⚖️", criteria: "Consistency Rule" },
  { icon: "📰", criteria: "News Trading" },
  { icon: "🌙", criteria: "Weekend Holding" },
  { icon: "💸", criteria: "Reward Split" },
  { icon: "📅", criteria: "Rewards" },
  { icon: "🧾", criteria: "Conditions" },
];

export function ProblemsVsFyt() {
  const rows = PROBLEM_ROWS.map((r) => ({ ...r, row: COMPARISON_ROWS.find((c) => c.criteria === r.criteria) })).filter((r) => r.row);
  return (
    <Section tone="light">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow tone="light" center>
          Why traders switch
        </Eyebrow>
        <SectionTitle tone="light" center lead="What usually goes wrong at prop firms." highlight="And what we do instead." />
      </div>
      <div className="mt-[44px] grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:mt-[60px]">
        {rows.map(({ icon, criteria, row }, i) => (
          <Reveal key={criteria} delay={(i % 2) * 0.06} y={20}>
            <div onPointerMove={spotlightMove} className="fyt-spot fyt-spot-light grid grid-cols-[48px_1fr] items-center gap-[16px] rounded-[22px] p-[18px] sm:p-[20px]" style={LIGHT_CARD}>
              <span className="flex size-[48px] items-center justify-center rounded-[14px] text-[22px]" style={{ background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.12)" }} aria-hidden="true">
                {icon}
              </span>
              <div className="flex min-w-0 flex-col gap-[6px]">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#8b93a7" }}>
                  {criteria}
                </span>
                <span className="relative w-fit text-[14px]" style={{ color: "#9aa3b5" }}>
                  Others: {row!.others}
                  <motion.span aria-hidden="true" className="absolute left-0 top-1/2 h-[2px] origin-left rounded-full bg-[#ef4444]" style={{ width: "100%" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.6, delay: 0.3 + (i % 2) * 0.06, ease: EASE }} />
                </span>
                <span className="flex items-center gap-[8px] text-[17px] font-semibold tracking-[-0.01em]" style={{ color: "#0b1d4d" }}>
                  <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[#2563eb]">
                    <CheckIcon color="#fff" size={11} />
                  </span>
                  {row!.fyt}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1} className="mt-[36px] flex justify-center">
        <Pill href="#plan-finder" onClick={() => pauseHeavyScenesForNav()}>
          Find my plan
        </Pill>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Zero risk feel: "We take the risk, not you"                      */
/* ------------------------------------------------------------------ */

const RISK_TILES: { k: string; v: string; d: string }[] = [
  { k: "Fee back", v: "100%", d: "Refunded with your reward" },
  { k: "Drawdown reset", v: "Free", d: "After a reward, start fresh" },
  { k: "First reward", v: "On demand", d: "No waiting for a cycle" },
  { k: "Time limit", v: "None", d: "Trade at your own pace" },
];

export function ZeroRisk() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [titleRef, shimmer] = useShimmer<HTMLHeadingElement>();
  const reduce = useReducedMotion();
  const tile = (t: (typeof RISK_TILES)[number]) => (
    <motion.div key={t.k} variants={staggerChild} onPointerMove={spotlightMove} className="fyt-spot flex flex-col gap-[6px] rounded-[22px] p-[20px] sm:p-[24px]" style={DARK_CARD}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.mutedDark }}>
        {t.k}
      </span>
      <span className="text-[34px] font-semibold leading-none tracking-[-0.035em] text-white sm:text-[40px]">{t.v}</span>
      <span className="text-[14px]" style={{ color: "#a6b0c6" }}>
        {t.d}
      </span>
    </motion.div>
  );
  return (
    <Section tone="dark" stars>
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow center>Zero-risk feel</Eyebrow>
        <h2 ref={titleRef} className={`text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[44px] lg:text-[60px] ${shimmer}`} style={{ color: C.textDark }}>
          <WordsReveal text="We take the risk," /> <WordsReveal text="not you." wordClassName="fyt-gradient-text" delay={0.15} />
        </h2>
      </div>
      <motion.div
        ref={ref}
        className={`mt-[44px] grid grid-cols-2 items-center gap-[12px] lg:mt-[64px] lg:grid-cols-[1fr_auto_1fr] lg:gap-[28px] ${live ? "fyt-live" : ""}`}
        variants={staggerParent(0.08)}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="col-span-2 order-2 grid grid-cols-2 gap-[12px] lg:order-1 lg:col-span-1 lg:grid-cols-1">{RISK_TILES.slice(0, 2).map(tile)}</div>
        <div className="order-1 col-span-2 flex justify-center lg:order-2 lg:col-span-1">
          <div className={`fyt-ring relative flex size-[220px] items-center justify-center rounded-full sm:size-[260px] ${live ? "fyt-live" : ""}`}>
            <div className="absolute inset-[18px] rounded-full" style={{ background: "radial-gradient(circle at 50% 35%, rgba(59,130,246,0.35), transparent 70%)" }} />
            <svg width="96" height="110" viewBox="0 0 96 110" fill="none" aria-hidden="true" className="relative drop-shadow-[0_10px_40px_rgba(59,130,246,0.6)]">
              <defs>
                <linearGradient id="fyt-shield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7db2ff" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <path d="M48 4 88 18v32c0 26-17 46-40 56C25 96 8 76 8 50V18L48 4Z" fill="url(#fyt-shield)" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <motion.path d="M30 55 43 68 67 42" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} />
            </svg>
          </div>
        </div>
        <div className="col-span-2 order-3 grid grid-cols-2 gap-[12px] lg:col-span-1 lg:grid-cols-1">{RISK_TILES.slice(2).map(tile)}</div>
      </motion.div>
      <Reveal delay={0.1} className="mt-[36px] flex justify-center">
        <Pill href="#challenge" onClick={() => pauseHeavyScenesForNav()}>
          Start risk-free
        </Pill>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Free 2-day demo                                                  */
/* ------------------------------------------------------------------ */

export function FreeDemo() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
    await submitLead("free-demo", email, { name });
  };
  return (
    <Section tone="light">
      <div className="grid grid-cols-1 items-center gap-[36px] lg:grid-cols-2 lg:gap-[64px]">
        <div className="flex flex-col gap-[18px]">
          <Eyebrow tone="light">Free trial</Eyebrow>
          <SectionTitle tone="light" lead="Try it free" highlight="for 2 days." />
          <Reveal delay={0.1}>
            <ul className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
              {["Real FYT dashboard", "Same rules as a paid account", "No card needed", "Upgrade with 40% off"].map((t) => (
                <li key={t} className="flex items-center gap-[10px] text-[15px] font-medium" style={{ color: C.textLight }}>
                  <span className="flex size-[22px] items-center justify-center rounded-full" style={{ background: "rgba(37,99,235,0.1)" }}>
                    <CheckIcon color="#2563eb" size={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <DiscordLive tone="light" />
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[28px] p-[24px] sm:p-[32px]" style={{ background: "radial-gradient(90% 80% at 0% 0%, rgba(37,99,235,0.3), transparent 60%), #0a1226", boxShadow: "0 60px 120px -60px rgba(30,64,175,0.75)" }}>
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[260px] flex-col items-start justify-center gap-[12px]">
                  <span className="flex size-[52px] items-center justify-center rounded-full bg-[#16a34a]">
                    <CheckIcon color="#fff" size={22} />
                  </span>
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em] text-white">You're in.</h3>
                  <p className="text-[15px]" style={{ color: "#a6b0c6" }}>
                    Your demo login is on its way to {email}.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} className="flex flex-col gap-[14px]" exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-white">Get your demo login</h3>
                  <label className="flex flex-col gap-[6px] text-[13px] font-medium" style={{ color: C.mutedDark }} htmlFor="fyt-demo-name">
                    Name
                    <input id="fyt-demo-name" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-[14px] px-[16px] py-[13px] text-[15px] text-white outline-none focus:border-[#60a5fa]" style={{ background: "rgba(3,6,13,0.6)", border: "1px solid rgba(255,255,255,0.14)" }} />
                  </label>
                  <label className="flex flex-col gap-[6px] text-[13px] font-medium" style={{ color: C.mutedDark }} htmlFor="fyt-demo-email">
                    Email
                    <input id="fyt-demo-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-[14px] px-[16px] py-[13px] text-[15px] text-white outline-none focus:border-[#60a5fa]" style={{ background: "rgba(3,6,13,0.6)", border: "1px solid rgba(255,255,255,0.14)" }} />
                  </label>
                  <button type="submit" className="cta-shine relative mt-[6px] cursor-pointer overflow-hidden rounded-full border-0 py-[15px] text-[15px] font-semibold text-white" style={{ background: "linear-gradient(180deg,#4f8cff,#2563eb)", boxShadow: "0 10px 30px -10px rgba(37,99,235,0.75), inset 0 1px 0 rgba(255,255,255,0.35)" }}>
                    Start my free 2 days
                  </button>
                  <p className="text-[12px]" style={{ color: "#6f7a94" }}>
                    Demo accounts are simulated and can't be withdrawn.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Welcome back (returning visitor with a saved plan)               */
/* ------------------------------------------------------------------ */

const DEMO_PLAN: Omit<SavedPlan, "savedAt"> = { step: "1-Step", plan: "prime", platform: "match-trader", size: 50000 };
const WELCOME_GAP_MS = 30 * 60 * 1000;

export function WelcomeBack() {
  const [plan, setPlan] = useState<Omit<SavedPlan, "savedAt"> | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const last = stampVisit();
    const force = new URLSearchParams(window.location.search).has("welcomeback");
    const saved = readSavedPlan();
    if (force) setPlan(saved ?? DEMO_PLAN);
    else if (saved && last && Date.now() - last > WELCOME_GAP_MS) setPlan(saved);
  }, []);
  useEffect(() => {
    if (!plan) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 1.2) setPlan(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [plan]);
  const entry = plan ? getEntry(plan.step, plan.plan, plan.platform, plan.size) : undefined;
  return (
    <AnimatePresence>
      {plan && entry && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
          className="fyt-rd fixed z-[2147482990] flex flex-col gap-[12px] rounded-[22px] p-[18px] sm:max-w-[380px]"
          style={{
            left: "max(12px, env(safe-area-inset-left, 0px))",
            right: "max(12px, env(safe-area-inset-right, 0px))",
            bottom: "max(12px, env(safe-area-inset-bottom, 0px))",
            background: "rgba(10,18,38,0.97)",
            border: "1px solid rgba(96,165,250,0.4)",
            boxShadow: "0 30px 70px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(191,219,254,0.08)",
          }}
          role="dialog"
          aria-label="Welcome back"
        >
          <button type="button" onClick={() => setPlan(null)} className="absolute right-[12px] top-[10px] cursor-pointer border-0 bg-transparent text-[20px] leading-none text-[#8e98b0]" aria-label="Close">
            ×
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86efac]">👋 Welcome back</span>
          <div className="flex items-end justify-between gap-[12px] pr-[16px]">
            <span className="text-[19px] font-semibold leading-[1.2] tracking-[-0.02em] text-white">Your {savedPlanLabel(plan)} is saved</span>
          </div>
          <div className="flex items-baseline gap-[8px]">
            <span className="tabular text-[28px] font-semibold tracking-[-0.03em] text-white">{money(entry.priceNew)}</span>
            <s className="tabular text-[14px] text-[#8e98b0]">{money(entry.priceOld)}</s>
            <span className="text-[12px] font-semibold text-[#93c5fd]">with {PROMO_CODE}</span>
          </div>
          <div className="flex gap-[8px]">
            <a href={checkoutUrl(entry.productId)} className="cta-shine relative flex-1 overflow-hidden rounded-full py-[12px] text-center text-[14px] font-semibold text-white no-underline" style={{ background: "linear-gradient(180deg,#4f8cff,#2563eb)" }}>
              Continue to checkout
            </a>
            <button
              type="button"
              onClick={() => {
                selectPlanInPricing(plan);
                setPlan(null);
              }}
              className="cursor-pointer rounded-full px-[14px] text-[13px] font-semibold text-[#c7d2e6]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)" }}
            >
              Change
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Save your plan before leaving (desktop exit intent)              */
/* ------------------------------------------------------------------ */

export function ExitSavePlan() {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Omit<SavedPlan, "savedAt">>(DEMO_PLAN);
  useEffect(() => {
    const force = new URLSearchParams(window.location.search).has("exitdemo");
    let shown = false;
    try {
      shown = window.sessionStorage.getItem("fyt_exit_shown") === "1";
    } catch {
      // ignore
    }
    const show = () => {
      if (shown) return;
      shown = true;
      try {
        window.sessionStorage.setItem("fyt_exit_shown", "1");
      } catch {
        // ignore
      }
      setPlan(readSavedPlan() ?? { step: "2-Step", plan: "prime", platform: "match-trader", size: 100000 });
      setOpen(true);
    };
    if (force) {
      const t = window.setTimeout(show, 1200);
      return () => window.clearTimeout(t);
    }
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let armed = false;
    const arm = window.setTimeout(() => (armed = true), 15000);
    const onOut = (e: MouseEvent) => {
      if (armed && !e.relatedTarget && e.clientY < 8) show();
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);
  const entry = getEntry(plan.step, plan.plan, plan.platform, plan.size);
  return (
    <AnimatePresence>
      {open && entry && (
        <motion.div
          className="fyt-rd fixed inset-0 z-[2147483000] flex items-center justify-center p-[16px]"
          style={{ background: "rgba(3,6,13,0.72)", backdropFilter: "blur(6px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.4, ease: EASE }} className="fyt-ring fyt-live w-full max-w-[460px] rounded-[28px]" role="dialog" aria-label="Save your plan">
            <div className="relative flex flex-col gap-[14px] p-[26px] sm:p-[32px]">
              <button type="button" onClick={() => setOpen(false)} className="absolute right-[16px] top-[12px] cursor-pointer border-0 bg-transparent text-[22px] text-[#8e98b0]" aria-label="Close">
                ×
              </button>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">Before you go</span>
              <h3 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">Save your plan + 40% off</h3>
              <p className="text-[15px] leading-[1.55]" style={{ color: "#a6b0c6" }}>
                We'll email your <b className="text-white">{savedPlanLabel(plan)}</b> at <b className="text-white">{money(entry.priceNew)}</b> with {PROMO_CODE} applied. One click brings you back.
              </p>
              <SavePlanForm plan={plan} compact />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
