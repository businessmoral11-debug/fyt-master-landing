import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import imgFytMark from "@/imports/FytLandingPage/c3e1b41ac1a944e4221b3b1465d4e68b855d759f.png";
import imgDashboard from "@/assets/images/trader-dashboard.png";
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
import { API_BASE_URL } from "@/app/api/apiBaseUrl";
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
import { OrbVisual } from "./SectionsTop";

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
/* Icons (same line style as the rest of the redesign)                 */
/* ------------------------------------------------------------------ */

type IconName =
  | "seed" | "chart" | "trophy" | "bolt" | "sun" | "moon" | "news" | "pulse" | "shield"
  | "trend" | "clock" | "scale" | "calendar" | "split" | "doc" | "refund" | "reset" | "infinity" | "users" | "globe" | "check" | "card" | "monitor";

export function GIcon({ name, size = 20, color = "#60a5fa" }: { name: IconName; size?: number; color?: string }) {
  const p = { stroke: color, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const paths: Record<IconName, ReactNode> = {
    seed: <><path d="M12 21v-8" {...p} /><path d="M12 13c0-4 3-7 8-7 0 4-3 7-8 7Z" {...p} /><path d="M12 15c0-3-2.5-5.5-7-5.5 0 3 2.5 5.5 7 5.5Z" {...p} /></>,
    chart: <><path d="M4 19h16" {...p} /><path d="m5 15 4-4 3 3 6-7" {...p} /><path d="M15 7h3v3" {...p} /></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" {...p} /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7" {...p} /></>,
    bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" {...p} />,
    sun: <><circle cx="12" cy="12" r="4" {...p} /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" {...p} /></>,
    moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" {...p} />,
    news: <><rect x="4" y="5" width="13" height="14" rx="2" {...p} /><path d="M17 9h3v8a2 2 0 0 1-2 2M7.5 9h6M7.5 12.5h6M7.5 16h4" {...p} /></>,
    pulse: <path d="M3 12h4l2-5 4 10 2-5h6" {...p} />,
    shield: <><path d="M12 3 19 6v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3Z" {...p} /><path d="m9 12 2.2 2.2L15.5 10" {...p} /></>,
    trend: <><path d="M4 17 10 11l4 4 6-7" {...p} /><path d="M15 8h5v5" {...p} /></>,
    clock: <><circle cx="12" cy="12" r="8" {...p} /><path d="M12 8v4.5l3 2" {...p} /></>,
    scale: <><path d="M12 4v16M7 20h10M5 8h14" {...p} /><path d="m5 8-2.5 6a3 3 0 0 0 5 0L5 8ZM19 8l-2.5 6a3 3 0 0 0 5 0L19 8Z" {...p} /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" {...p} /><path d="M4 10h16M9 3v4M15 3v4" {...p} /></>,
    split: <><circle cx="12" cy="12" r="8" {...p} /><path d="M12 4v8l6 4" {...p} /></>,
    doc: <><path d="M7 3h7l4 4v14H7V3Z" {...p} /><path d="M14 3v4h4M10 12h5M10 16h5" {...p} /></>,
    refund: <><path d="M4 12a8 8 0 1 0 2.5-5.8" {...p} /><path d="M4 4v4h4M12 8v8M14.5 9.5h-3.2a1.6 1.6 0 0 0 0 3.2h1.4a1.6 1.6 0 0 1 0 3.2H9.5" {...p} /></>,
    reset: <><path d="M20 12a8 8 0 1 1-2.3-5.7" {...p} /><path d="M20 4v4h-4" {...p} /></>,
    infinity: <path d="M7 15.5a3.5 3.5 0 1 1 0-7c3 0 7 7 10 7a3.5 3.5 0 1 0 0-7c-3 0-7 7-10 7Z" {...p} />,
    users: <><circle cx="9" cy="9" r="3.2" {...p} /><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 6.2a3 3 0 0 1 0 5.6M18 14.3c1.6.7 2.6 2.4 2.6 4.7" {...p} /></>,
    globe: <><circle cx="12" cy="12" r="8" {...p} /><path d="M4 12h16M12 4c2.5 2.5 3.5 5 3.5 8s-1 5.5-3.5 8c-2.5-2.5-3.5-5-3.5-8s1-5.5 3.5-8Z" {...p} /></>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" {...p} />,
    card: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M3 10.5h18M7 15h3" {...p} /></>,
    monitor: <><rect x="3" y="4" width="18" height="12" rx="2" {...p} /><path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4" {...p} /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function IconTile({ name, tone = "dark", size = 44 }: { name: IconName; tone?: "dark" | "light"; size?: number }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-[13px]"
      style={{
        width: size,
        height: size,
        ...(tone === "dark"
          ? { background: "linear-gradient(180deg, rgba(59,130,246,0.2), rgba(59,130,246,0.06))", border: "1px solid rgba(96,165,250,0.3)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px -12px rgba(37,99,235,0.8)" }
          : { background: "linear-gradient(180deg, #eef4ff, #e3ecff)", border: "1px solid rgba(37,99,235,0.16)", boxShadow: "inset 0 1px 0 #fff" }),
      }}
    >
      <GIcon name={name} size={Math.round(size * 0.48)} color={tone === "dark" ? "#7db2ff" : "#2563eb"} />
    </span>
  );
}

function initials(name: string | null): string {
  return (name ?? "FT")
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Number that springs to its new value (same feel as the pricing price). */
function SpringNumber({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 120, damping: 22, mass: 0.6 });
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  useMotionValueEvent(spring, "change", (v) => {
    if (ref.current) ref.current.textContent = format(v);
  });
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Country-matched proof: "People like me get paid"                 */
/* ------------------------------------------------------------------ */

type ProofItem = PublicPayout & { cert?: PublicCertificate };

function certKey(name: string | null, amount: string): string {
  return `${(name ?? "").trim().toLowerCase()}|${Number(amount).toFixed(2)}`;
}

/** Joins each payout to its certificate image (same feeds the rewards widgets use). */
function attachCertificates(payouts: PublicPayout[], certs: PublicCertificate[]): ProofItem[] {
  const byUrl = new Map<string, PublicCertificate>();
  const byKey = new Map<string, PublicCertificate>();
  for (const c of certs) {
    if (c.certificateUrl) byUrl.set(c.certificateUrl, c);
    byKey.set(certKey(c.traderName, c.amount), c);
  }
  return payouts.map((p) => ({ ...p, cert: (p.certificateUrl && byUrl.get(p.certificateUrl)) || byKey.get(certKey(p.traderName, p.amount)) || certFromPayout(p) }));
}

/** Every payout links to /certificate/{id}; the image lives at /public/certificates/{id}/image. */
function certFromPayout(p: PublicPayout): PublicCertificate | undefined {
  const id = /\/certificate\/([0-9a-f-]{16,})/i.exec(p.certificateUrl ?? "")?.[1];
  if (!id || !p.certificateUrl) return undefined;
  return {
    certificateId: id,
    traderName: p.traderName,
    country: p.country,
    countryCode: p.countryCode,
    amount: p.amount,
    createdAt: p.createdAt ?? "",
    imageUrl: `${API_BASE_URL}/public/certificates/${id}/image`,
    certificateUrl: p.certificateUrl,
  };
}

function FeedRow({ p, active, onPick }: { p: ProofItem; active: boolean; onPick: () => void }) {
  const f = countryFlagUrl(p.countryCode);
  const link = p.cert?.certificateUrl || p.certificateUrl || p.explorerUrl;
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        className="flex w-full cursor-pointer items-center gap-[12px] rounded-[16px] border-0 px-[10px] py-[10px] text-left transition-colors"
        style={{
          background: active ? "linear-gradient(90deg, rgba(59,130,246,0.22), rgba(59,130,246,0.06))" : "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
          border: `1px solid ${active ? "rgba(96,165,250,0.55)" : C.borderDark}`,
        }}
      >
        {p.cert ? (
          <span className="relative h-[40px] w-[56px] shrink-0 overflow-hidden rounded-[8px]" style={{ border: "1px solid rgba(148,178,255,0.25)" }}>
            <img src={p.cert.imageUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
          </span>
        ) : (
          <span className="flex h-[40px] w-[56px] shrink-0 items-center justify-center rounded-[8px] text-[13px] font-semibold text-white" style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}>
            {initials(p.traderName)}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-[6px] truncate text-[14.5px] font-semibold text-white">
            {f && <img src={f} alt="" width={16} height={12} loading="lazy" className="h-[12px] w-[16px] shrink-0 rounded-[2px] object-cover" />}
            <span className="truncate">{p.traderName ?? "FYT trader"}</span>
          </span>
          <span className="truncate text-[12px]" style={{ color: C.mutedDark }}>
            {relTime(p.createdAt)}
            {link ? " · Certificate" : ""}
          </span>
        </span>
        <span className="tabular shrink-0 text-[16px] font-semibold text-[#4ade80]">+{formatPayoutAmount(p.amount)}</span>
      </button>
    </li>
  );
}

function CertificateStage({ item }: { item: ProofItem | undefined }) {
  const reduce = useReducedMotion();
  const cert = item?.cert;
  const link = cert?.certificateUrl || item?.certificateUrl || item?.explorerUrl || undefined;
  const f = item ? countryFlagUrl(item.countryCode) : null;
  return (
    <div className="flex flex-col gap-[12px]">
      <a href={link} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-[18px] no-underline" style={{ background: "#060b16", border: "1px solid rgba(148,178,255,0.22)", boxShadow: "0 30px 60px -30px rgba(37,99,235,0.8)" }}>
        <div className="relative aspect-[1.41] w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {cert ? (
              <motion.img
                key={cert.certificateId}
                src={cert.imageUrl}
                alt={`Payout certificate for ${cert.traderName ?? "FYT trader"}`}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            ) : (
              <motion.div key="empty" className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="size-full animate-pulse" style={{ background: "linear-gradient(135deg,#0b1430,#0a1226)" }} />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full px-[10px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#86efac]" style={{ background: "rgba(3,6,13,0.75)", border: "1px solid rgba(34,197,94,0.35)", backdropFilter: "blur(6px)" }}>
            <CheckIcon size={10} color="#86efac" /> Verified certificate
          </span>
        </div>
      </a>
      {item && (
        <div className="flex items-center justify-between gap-[12px] px-[4px]">
          <span className="flex min-w-0 items-center gap-[10px]">
            {f && <img src={f} alt="" width={24} height={17} className="h-[17px] w-[24px] shrink-0 rounded-[3px] object-cover" />}
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] font-semibold text-white">{item.traderName ?? "FYT trader"}</span>
              <span className="truncate text-[12px]" style={{ color: C.mutedDark }}>
                {[item.country, relTime(item.createdAt)].filter(Boolean).join(" · ")}
              </span>
            </span>
          </span>
          <span className="tabular fyt-gradient-text shrink-0 text-[26px] font-semibold tracking-[-0.03em]">{formatPayoutAmount(item.amount)}</span>
        </div>
      )}
    </div>
  );
}

export function CountryProof() {
  const [code, setCode] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<PublicPayout[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [worldwide, setWorldwide] = useState(false);
  const [pick, setPick] = useState(0);
  const [auto, setAuto] = useState(true);
  const [panelRef, panelLive] = useLive<HTMLDivElement>();

  useEffect(() => {
    setCode(detectVisitorCountry());
    let cancelled = false;
    Promise.all([fetchFeaturedPayouts(1, 100).catch(() => null), fetchFeaturedPayouts(2, 100).catch(() => null), fetchFeaturedPayouts(3, 100).catch(() => null)])
      .then((rs) => {
        if (cancelled) return;
        setPayouts(rs.flatMap((r) => r?.data ?? []).filter((p) => Number(p.amount) > 0));
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => attachCertificates(payouts, []), [payouts]);
  const local = useMemo(() => (code ? items.filter((p) => (p.countryCode ?? "").toUpperCase() === code) : []), [code, items]);
  const hasLocal = local.length >= 3;
  const showLocal = hasLocal && !worldwide;
  const pool = showLocal ? local : items;
  // Certificates first so the stage always has something to show.
  const ordered = useMemo(() => [...pool.filter((p) => p.cert), ...pool.filter((p) => !p.cert)].slice(0, 8), [pool]);
  const total = pool.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const countries = useMemo(() => new Set(items.map((p) => p.countryCode).filter(Boolean)).size, [items]);
  const name = code ? countryName(code) : "";
  const flag = code ? countryFlagUrl(code) : null;
  const withCert = ordered.filter((p) => p.cert).length;

  useEffect(() => setPick(0), [showLocal]);
  useEffect(() => {
    if (!auto || !panelLive || withCert < 2) return;
    const t = window.setInterval(() => setPick((i) => (i + 1) % withCert), 4500);
    return () => window.clearInterval(t);
  }, [auto, panelLive, withCert]);

  if (loaded && payouts.length === 0) return null;

  return (
    <Section tone="dark" stars>
      <div className="relative grid grid-cols-1 items-center gap-[44px] lg:grid-cols-12 lg:gap-[56px]">
        <div className="flex flex-col gap-[24px] lg:col-span-4">
          <Eyebrow>People like you</Eyebrow>
          <h2 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[42px] lg:text-[52px]" style={{ color: C.textDark }}>
            {showLocal ? (
              <>
                <span className="inline-flex flex-wrap items-center gap-x-[14px]">
                  Traders from
                  {flag && <img src={flag} alt="" width={56} height={40} className="inline-block h-[0.66em] w-auto rounded-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-1 ring-white/20" />}
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
              [money(Math.round(total)), "Total paid"],
              [String(pool.length || "-"), "Rewards"],
              [showLocal ? "24-48h" : String(countries || "-"), showLocal ? "Paid in" : "Countries"],
            ].map(([v, l]) => (
              <div key={l} className="flex min-w-0 flex-col gap-[4px] rounded-[16px] p-[12px]" style={DARK_CARD}>
                <span className="tabular truncate text-[18px] font-semibold tracking-[-0.03em] text-white sm:text-[20px]">{v}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
          {hasLocal && (
            <div className="inline-flex w-fit rounded-full p-[4px]" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderDark}` }} role="tablist">
              {([false, true] as const).map((w) => {
                const on = worldwide === w;
                return (
                  <button
                    key={String(w)}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setWorldwide(w)}
                    className="flex cursor-pointer items-center gap-[8px] rounded-full border-0 px-[16px] py-[9px] text-[13px] font-semibold transition-colors"
                    style={on ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff", boxShadow: "0 8px 20px -10px rgba(37,99,235,0.9)" } : { background: "transparent", color: C.mutedDark }}
                  >
                    {!w && flag ? <img src={flag} alt="" width={18} height={13} className="h-[13px] w-[18px] rounded-[2px] object-cover" /> : <GIcon name="globe" size={14} color={on ? "#fff" : "#8e98b0"} />}
                    {w ? "Worldwide" : name}
                  </button>
                );
              })}
            </div>
          )}
          <DiscordLive />
        </div>

        <Reveal delay={0.1} className="lg:col-span-8">
          <div ref={panelRef} className={`fyt-ring relative rounded-[28px] ${panelLive ? "fyt-live" : ""}`} style={{ boxShadow: "0 60px 120px -60px rgba(37,99,235,0.8)" }}>
            <div className="relative flex flex-col gap-[18px] p-[16px] sm:p-[22px]">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="flex items-center gap-[10px] text-[13px] font-semibold text-white">
                  {showLocal && flag ? <img src={flag} alt="" width={22} height={16} className="h-[16px] w-[22px] rounded-[3px] object-cover" /> : <GIcon name="globe" size={16} />}
                  Latest rewards {showLocal ? `in ${name}` : "worldwide"}
                </span>
                <span className="flex items-center gap-[7px] rounded-full px-[10px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#86efac]" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)" }}>
                  <span className="relative flex size-[7px]">
                    <span className="fyt-rd-ping-gated absolute inset-0 rounded-full bg-[#22c55e]" />
                    <span className="relative size-[7px] rounded-full bg-[#22c55e]" />
                  </span>
                  Live
                </span>
              </div>
              <div className="grid grid-cols-1 gap-[16px] md:grid-cols-[1.15fr_1fr]">
                <CertificateStage item={ordered[pick] ?? ordered[0]} />
                <ul className="flex max-h-[420px] flex-col gap-[8px] overflow-y-auto pr-[2px] md:max-h-none">
                  {ordered.length
                    ? ordered.slice(0, 6).map((p, i) => (
                        <FeedRow
                          key={`${p.id ?? "x"}-${i}`}
                          p={p}
                          active={i === pick}
                          onPick={() => {
                            setAuto(false);
                            setPick(i);
                          }}
                        />
                      ))
                    : Array.from({ length: 5 }, (_, i) => <li key={i} className="h-[62px] animate-pulse rounded-[16px]" style={DARK_CARD} />)}
                </ul>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-[12px] border-t pt-[14px]" style={{ borderColor: C.borderDark }}>
                <a href="https://rewards.fundingyourtrades.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[6px] text-[13px] font-semibold text-[#93c5fd] no-underline hover:underline">
                  <GIcon name="shield" size={15} /> Every reward verified on-chain
                </a>
                <Pill href="#plan-finder" onClick={() => pauseHeavyScenesForNav()} className="px-[22px]! py-[12px]! text-[14px]!">
                  Find my plan
                </Pill>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Plan finder                                                      */
/* ------------------------------------------------------------------ */

type Answer = number;
const FINDER_QUESTIONS: { q: string; options: { label: string; sub?: string; icon: IconName }[] }[] = [
  {
    q: "How long have you been trading?",
    options: [
      { label: "Less than 1 year", sub: "Still building my edge", icon: "seed" },
      { label: "1-3 years", sub: "I have a strategy", icon: "chart" },
      { label: "3+ years", sub: "Consistent and proven", icon: "trophy" },
    ],
  },
  {
    q: "How do you usually trade?",
    options: [
      { label: "Scalping", sub: "Minutes, many trades", icon: "bolt" },
      { label: "Day trading", sub: "Hours, closed by evening", icon: "sun" },
      { label: "Swing trading", sub: "Days, held overnight", icon: "moon" },
    ],
  },
  {
    q: "Do you trade news releases?",
    options: [
      { label: "Yes, often", sub: "NFP, CPI, rate decisions", icon: "news" },
      { label: "Sometimes", sub: "Only big events", icon: "pulse" },
      { label: "No, I avoid news", sub: "Calm markets only", icon: "shield" },
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

function FinderOption({ label, sub, icon, onClick }: { label: string; sub?: string; icon: IconName; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerMove={spotlightMove}
      className="fyt-spot group flex w-full cursor-pointer items-center gap-[14px] rounded-[18px] p-[14px] text-left transition-[translate,background-color] duration-200 hover:-translate-y-[2px] hover:bg-white/[0.06] sm:p-[16px]"
      style={{ ...DARK_CARD, color: C.textDark }}
    >
      <IconTile name={icon} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[16px] font-semibold">{label}</span>
        {sub && <span className="text-[13px]" style={{ color: C.mutedDark }}>{sub}</span>}
      </span>
      <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-[#2563eb]" style={{ border: `1px solid ${C.borderDark}` }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#c7d2fe" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
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
  const id = compact ? "fyt-save-plan-email-c" : "fyt-save-plan-email";
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-[6px] rounded-full p-[5px] pl-[18px] transition-colors focus-within:border-[#60a5fa]" style={{ background: "rgba(3,6,13,0.6)", border: "1px solid rgba(255,255,255,0.14)" }}>
      <label className="sr-only" htmlFor={id}>
        Email
      </label>
      <input
        id={id}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email me this plan"
        className="min-w-0 flex-1 border-0 bg-transparent py-[8px] text-[14px] text-white outline-none placeholder:text-[#7c8699]"
      />
      <button type="submit" className="cursor-pointer whitespace-nowrap rounded-full border-0 px-[16px] py-[10px] text-[13.5px] font-semibold text-[#0a1226] transition-transform hover:-translate-y-[1px]" style={{ background: "#fff" }}>
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
        <div className="flex flex-col gap-[22px] lg:col-span-5">
          <Eyebrow tone="light">Plan finder</Eyebrow>
          <SectionTitle tone="light" lead="Find the challenge built for" highlight="how you trade." />
          <Reveal delay={0.1}>
            <p className="max-w-[440px] text-[16px] leading-[1.7] lg:text-[17px]" style={{ color: C.mutedLight }}>
              Four quick questions. We match your model and size, and show your price with 40% off.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid max-w-[460px] grid-cols-3 gap-[10px]">
              {(
                [
                  ["clock", "30 sec"],
                  ["users", "No sign-up"],
                  ["doc", "Saved for later"],
                ] as const
              ).map(([icon, t]) => (
                <div key={t} className="flex flex-col items-start gap-[10px] rounded-[16px] bg-white p-[14px]" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 18px 40px -30px rgba(30,64,175,0.5)" }}>
                  <IconTile name={icon} tone="light" size={36} />
                  <span className="text-[13.5px] font-semibold" style={{ color: C.textLight }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-[40px] rounded-[48px] opacity-80" style={{ background: "radial-gradient(60% 60% at 60% 40%, rgba(59,130,246,0.25), transparent 70%)" }} />
            <div ref={ringRef} className={`fyt-ring relative rounded-[30px] ${live ? "fyt-live" : ""}`} style={{ boxShadow: "0 70px 140px -60px rgba(30,64,175,0.75)" }}>
              <div className="flex min-h-[520px] flex-col p-[22px] sm:p-[34px]" aria-live="polite">
                <div className="flex items-center justify-between gap-[12px]">
                  <div className="flex items-center gap-[8px]">
                    {FINDER_QUESTIONS.map((_, i) => (
                      <span key={i} className="h-[6px] rounded-full transition-all duration-500" style={{ width: i === step ? 28 : 6, background: i < step || done ? "#60a5fa" : i === step ? "linear-gradient(90deg,#2563eb,#93c5fd)" : "rgba(255,255,255,0.14)" }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93c5fd]">{done ? "Your match" : `Step ${step + 1} of ${total}`}</span>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    className="mt-[26px] flex flex-1 flex-col"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -28, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {!done && (
                      <>
                        <h3 className="mb-[20px] text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[32px]">{FINDER_QUESTIONS[step].q}</h3>
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
                                onPointerMove={spotlightMove}
                                className="fyt-spot group flex cursor-pointer flex-col items-start gap-[6px] rounded-[18px] p-[16px] text-left transition-[translate] duration-200 hover:-translate-y-[2px]"
                                style={DARK_CARD}
                              >
                                <span className="text-[24px] font-semibold tracking-[-0.03em] text-white">{fmtSize(s)}</span>
                                <span className="tabular text-[12.5px]" style={{ color: C.mutedDark }}>
                                  from {money(getEntry(ans[0] === 0 ? "2-Step" : "1-Step", "prime", "match-trader", s)?.priceNew ?? 0)}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {done && rec && entry && chosen && (
                      <div className="flex flex-col gap-[18px]">
                        <div className="flex flex-wrap items-start justify-between gap-[14px]">
                          <div className="flex flex-col gap-[8px]">
                            <span className="inline-flex w-fit items-center gap-[7px] rounded-full px-[10px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#86efac]" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)" }}>
                              <CheckIcon color="#86efac" size={11} /> Best match for you
                            </span>
                            <h3 className="text-[32px] font-semibold leading-none tracking-[-0.035em] text-white sm:text-[40px]">
                              {fmtSize(size)} {STEP_LABELS[rec.step]}
                            </h3>
                            <span className="text-[15px] font-semibold text-[#93c5fd]">{rec.plan === "prime" ? "Prime · No consistency rule" : "Classic · News trading allowed"}</span>
                          </div>
                          <div className="flex flex-col items-start gap-[2px] sm:items-end">
                            <span className="tabular fyt-gradient-text text-[44px] font-semibold leading-none tracking-[-0.04em]">{money(entry.priceNew)}</span>
                            <span className="flex items-center gap-[8px]">
                              <s className="tabular text-[15px]" style={{ color: C.mutedDark }}>
                                {money(entry.priceOld)}
                              </s>
                              <span className="rounded-full bg-[#bfdbfe] px-[8px] py-[3px] text-[11px] font-bold text-[#0a1226]">-40%</span>
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 overflow-hidden rounded-[16px] sm:grid-cols-4" style={{ border: `1px solid ${C.borderDark}` }}>
                          {[
                            [rec.step === "2-Step" ? `${entry.p1} / ${entry.p2}` : entry.p1 ?? "", "Target"],
                            [entry.maxDaily, "Daily loss"],
                            [entry.maxOverall, "Max loss"],
                            [entry.split.replace("Up to ", ""), "Split"],
                          ].map(([v, l], i) => (
                            <div key={l} className="flex flex-col gap-[2px] px-[14px] py-[12px]" style={{ background: "rgba(255,255,255,0.03)", borderLeft: i % 2 || i === 2 ? `1px solid ${C.borderDark}` : undefined, borderTop: i >= 2 ? `1px solid ${C.borderDark}` : undefined }}>
                              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
                                {l}
                              </span>
                              <span className="tabular text-[18px] font-semibold text-white">{v}</span>
                            </div>
                          ))}
                        </div>
                        <ul className="flex flex-col gap-[8px]">
                          {rec.why.map((w) => (
                            <li key={w} className="flex gap-[10px] text-[14px] leading-[1.5]" style={{ color: "#c7d2e6" }}>
                              <span className="mt-[2px] flex size-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(59,130,246,0.18)" }}>
                                <CheckIcon size={10} color="#93c5fd" />
                              </span>
                              {w}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-[8px]">
                          {PROMO_CARD_EXTRAS.map((x) => (
                            <PlusChip key={x}>{x}</PlusChip>
                          ))}
                        </div>
                        <div className="flex flex-col gap-[10px] sm:flex-row">
                          <Pill href={checkoutUrl(entry.productId)} className="w-full sm:flex-1">
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
                  <button type="button" onClick={done ? () => setAns([]) : back} className="mt-[18px] w-fit cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium transition-colors hover:text-white" style={{ color: C.mutedDark }}>
                    {done ? "↺ Start over" : "← Back"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Payout board: winners' podium + paid on camera                   */
/* ------------------------------------------------------------------ */

const MEDALS = [
  { label: "1st", ring: "linear-gradient(135deg,#fde68a,#f59e0b 55%,#b45309)", glow: "rgba(245,158,11,0.45)" },
  { label: "2nd", ring: "linear-gradient(135deg,#f1f5f9,#94a3b8 55%,#475569)", glow: "rgba(148,163,184,0.45)" },
  { label: "3rd", ring: "linear-gradient(135deg,#fed7aa,#c2410c 55%,#7c2d12)", glow: "rgba(194,65,12,0.4)" },
];

function PodiumCard({ c, rank }: { c: PublicCertificate; rank: number }) {
  const m = MEDALS[rank];
  const f = countryFlagUrl(c.countryCode);
  return (
    <a
      href={c.certificateUrl}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={spotlightMove}
      className={`fyt-spot fyt-spot-light group relative flex flex-col overflow-hidden rounded-[24px] bg-white no-underline transition-[translate,box-shadow] duration-300 hover:-translate-y-[4px] ${rank === 0 ? "lg:-translate-y-[22px] lg:hover:-translate-y-[26px]" : ""}`}
      style={{ border: `1px solid ${C.borderLight}`, boxShadow: `0 40px 80px -46px ${m.glow}, 0 30px 60px -40px rgba(30,64,175,0.45)` }}
    >
      <span className="relative block overflow-hidden" style={{ background: "#0a1226" }}>
        <img src={c.imageUrl} alt={`Payout certificate for ${c.traderName ?? "FYT trader"}`} loading="lazy" decoding="async" className="aspect-[1.41] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-[14px] top-[14px] flex size-[44px] items-center justify-center rounded-full text-[13px] font-bold text-[#1f1300]" style={{ background: m.ring, boxShadow: `0 8px 24px ${m.glow}, inset 0 1px 0 rgba(255,255,255,0.6)` }}>
          {m.label}
        </span>
      </span>
      <span className="flex items-center justify-between gap-[12px] px-[18px] py-[16px]">
        <span className="flex min-w-0 items-center gap-[10px]">
          {f && <img src={f} alt="" width={24} height={17} loading="lazy" className="h-[17px] w-[24px] shrink-0 rounded-[3px] object-cover" />}
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[16px] font-semibold" style={{ color: C.textLight }}>
              {c.traderName ?? "FYT trader"}
            </span>
            <span className="text-[12px]" style={{ color: C.mutedLight }}>
              {relTime(c.createdAt)} · View certificate ↗
            </span>
          </span>
        </span>
        <span className="tabular shrink-0 text-[22px] font-semibold tracking-[-0.03em] text-[#16a34a]">{formatPayoutAmount(c.amount)}</span>
      </span>
    </a>
  );
}

export function PayoutBoard() {
  const [tab, setTab] = useState<"biggest" | "camera">("biggest");
  const [certs, setCerts] = useState<PublicCertificate[]>([]);
  const [video, setVideo] = useState<TestimonialVideo | null>(null);
  const closeVideo = useCallback(() => setVideo(null), []);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchFeaturedCertificates(1, 48), fetchFeaturedPayouts(1, 100).catch(() => null), fetchFeaturedPayouts(2, 100).catch(() => null)])
      .then(([r, p1, p2]) => {
        if (cancelled) return;
        // Certificates carry no country; borrow it from the matching payout.
        const country = new Map<string, PublicPayout>();
        for (const p of [...(p1?.data ?? []), ...(p2?.data ?? [])]) if (p.certificateUrl) country.set(p.certificateUrl, p);
        setCerts(
          [...r.data]
            .filter((c) => Number(c.amount) > 0)
            .sort((a, b) => Number(b.amount) - Number(a.amount))
            .slice(0, 8)
            .map((c) => {
              const p = country.get(c.certificateUrl);
              return p ? { ...c, country: c.country ?? p.country, countryCode: c.countryCode ?? p.countryCode } : c;
            }),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const top = certs.slice(0, 3);
  const rest = certs.slice(3, 8);
  const podiumOrder = top.length === 3 ? [1, 0, 2] : top.map((_, i) => i);
  const videos = TESTIMONIAL_VIDEOS.slice(0, 7);

  return (
    <Section tone="light" id="live-payouts">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow tone="light" center>
          On the record
        </Eyebrow>
        <SectionTitle tone="light" center lead="Real traders." highlight="Real rewards." />
        <Reveal y={12}>
          <div className="mt-[6px] inline-flex rounded-full bg-white p-[5px]" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 16px 40px -24px rgba(30,64,175,0.55)" }} role="tablist">
            {(
              [
                ["biggest", "Biggest rewards", "trophy"],
                ["camera", "Paid on camera", "monitor"],
              ] as const
            ).map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className="flex cursor-pointer items-center gap-[8px] rounded-full border-0 px-[20px] py-[11px] text-[14px] font-semibold transition-colors"
                style={tab === id ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff", boxShadow: "0 10px 24px -12px rgba(37,99,235,0.9)" } : { background: "transparent", color: C.mutedLight }}
              >
                <GIcon name={icon} size={16} color={tab === id ? "#fff" : "#5b6478"} />
                {label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-[44px] lg:mt-[64px]">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "biggest" ? (
            <motion.div key="biggest" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <motion.div className="grid grid-cols-1 items-end gap-[18px] sm:grid-cols-3" variants={staggerParent(0.1)} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                {(top.length ? podiumOrder : [1, 0, 2]).map((rank) => (
                  <motion.div key={rank} variants={staggerChild} className={rank === 0 ? "order-first sm:order-none" : ""}>
                    {top[rank] ? <PodiumCard c={top[rank]} rank={rank} /> : <div className="aspect-[1.1] animate-pulse rounded-[24px] bg-white" style={{ border: `1px solid ${C.borderLight}` }} />}
                  </motion.div>
                ))}
              </motion.div>
              {rest.length > 0 && (
                <div className="mt-[22px] overflow-hidden rounded-[22px] bg-white" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 30px 60px -46px rgba(30,64,175,0.45)" }}>
                  {rest.map((c, i) => {
                    const f = countryFlagUrl(c.countryCode);
                    return (
                      <a
                        key={c.certificateId}
                        href={c.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid grid-cols-[36px_1fr_auto] items-center gap-[14px] px-[18px] py-[14px] no-underline transition-colors hover:bg-[#f5f8ff] sm:px-[24px]"
                        style={{ borderTop: i ? `1px solid ${C.borderLight}` : undefined }}
                      >
                        <span className="tabular flex size-[30px] items-center justify-center rounded-full text-[12px] font-bold" style={{ background: "#eef3ff", color: "#2563eb" }}>
                          {i + 4}
                        </span>
                        <span className="flex min-w-0 items-center gap-[10px]">
                          {f && <img src={f} alt="" width={22} height={16} loading="lazy" className="h-[16px] w-[22px] shrink-0 rounded-[2px] object-cover" />}
                          <span className="truncate text-[15px] font-semibold" style={{ color: C.textLight }}>
                            {c.traderName ?? "FYT trader"}
                          </span>
                          <span className="hidden text-[12.5px] sm:inline" style={{ color: C.mutedLight }}>
                            {relTime(c.createdAt)}
                          </span>
                        </span>
                        <span className="flex items-center gap-[10px]">
                          <span className="tabular text-[16px] font-semibold text-[#16a34a]">{formatPayoutAmount(c.amount)}</span>
                          <span className="hidden items-center gap-[4px] text-[12px] font-semibold text-[#2563eb] sm:flex">
                            <CheckIcon size={11} color="#2563eb" /> Certificate
                          </span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="camera" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }} className="grid grid-cols-2 gap-[14px] lg:grid-cols-4 lg:gap-[18px]">
              {videos.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setVideo(v)}
                  className={`group relative cursor-pointer overflow-hidden rounded-[22px] border-0 p-0 text-left ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                  style={{ boxShadow: "0 40px 80px -46px rgba(30,64,175,0.6)" }}
                  aria-label={`Play ${v.name}'s payout video`}
                >
                  <span className="relative block h-full overflow-hidden" style={{ aspectRatio: i === 0 ? undefined : "16/10" }}>
                    <img src={v.posterUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0) 45%, rgba(3,6,13,0.85))" }} />
                    <span className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${i === 0 ? "size-[78px]" : "size-[52px]"}`} style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.45)" }}>
                      <span className={`flex items-center justify-center rounded-full bg-white ${i === 0 ? "size-[58px]" : "size-[38px]"}`}>
                        <svg width={i === 0 ? 22 : 15} height={i === 0 ? 22 : 15} viewBox="0 0 24 24" fill="#2563eb" aria-hidden="true" className="ml-[3px]">
                          <path d="M7 4.5v15l12-7.5-12-7.5Z" />
                        </svg>
                      </span>
                    </span>
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-[10px] p-[14px] sm:p-[16px]">
                      <span className="flex flex-col">
                        <span className="mb-[4px] flex w-fit items-center gap-[6px] rounded-full bg-[#ef4444] px-[8px] py-[3px] text-[9.5px] font-bold uppercase tracking-[0.1em] text-white">
                          <span className="size-[5px] rounded-full bg-white" /> Payout call
                        </span>
                        <span className={`font-semibold text-white ${i === 0 ? "text-[20px]" : "text-[14px]"}`}>{v.name}</span>
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Reveal delay={0.1} className="mt-[40px] flex flex-col items-center justify-center gap-[14px] sm:flex-row">
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

function GrowthChart({ fee, reward, on }: { fee: number; reward: number; on: boolean }) {
  const W = 420;
  const H = 170;
  const pts = [0, reward, reward * 2, reward * 3];
  const max = Math.max(reward * 3, fee * 1.5, 1);
  const x = (i: number) => 24 + (i * (W - 48)) / 3;
  const y = (v: number) => H - 24 - (v / max) * (H - 48);
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(3)} ${H - 24} L${x(0)} ${H - 24} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="fyt-calc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fyt-calc-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="24" x2={W - 24} y1={24 + g * (H - 48)} y2={24 + g * (H - 48)} stroke="rgba(148,178,255,0.1)" />
      ))}
      <line x1="24" x2={W - 24} y1={y(fee)} y2={y(fee)} stroke="rgba(255,255,255,0.35)" strokeDasharray="4 5" />
      <text x={W - 24} y={y(fee) - 6} textAnchor="end" fontSize="11" fill="#8e98b0">
        Account price
      </text>
      <motion.path d={area} fill="url(#fyt-calc-fill)" initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} />
      <motion.path d={line} fill="none" stroke="url(#fyt-calc-line)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }} />
      {pts.map((v, i) => (
        <motion.circle key={i} r={i === 3 ? 6 : 4} fill={i === 3 ? "#bbf7d0" : "#60a5fa"} stroke="#0a1226" strokeWidth="2" initial={false} animate={{ cx: x(i), cy: y(v), opacity: on ? 1 : 0 }} transition={{ duration: 0.6, delay: on ? 0.15 * i : 0, ease: EASE }} />
      ))}
      {["Start", "Month 1", "Month 2", "Month 3"].map((t, i) => (
        <text key={t} x={x(i)} y={H - 4} textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"} fontSize="11" fill="#8e98b0">
          {t}
        </text>
      ))}
    </svg>
  );
}

export function RewardCalculator() {
  const sizes = STEP_SIZES["1-Step"];
  const [size, setSize] = useState(100000);
  const [gain, setGain] = useState(5);
  const [split, setSplit] = useState(90);
  const entry = getEntry("1-Step", "prime", "match-trader", size);
  const reward = Math.round((size * gain * split) / 10000);
  const fee = entry?.priceNew ?? 0;
  const [ref, live] = useLive<HTMLDivElement>();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const multiple = fee ? Math.max(1, Math.round(reward / fee)) : 0;

  return (
    <Section tone="dark">
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow center>Reward calculator</Eyebrow>
        <SectionTitle tone="dark" center lead="See what" highlight="you could earn." />
      </div>
      <div ref={ref} className={`mt-[44px] grid grid-cols-1 gap-[20px] lg:mt-[60px] lg:grid-cols-12 ${live ? "fyt-live" : ""}`}>
        <Reveal className="flex flex-col gap-[28px] rounded-[26px] p-[22px] sm:p-[30px] lg:col-span-5" style={DARK_CARD}>
          <div className="flex flex-col gap-[14px]">
            <span className="flex items-center gap-[10px] text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
              <GIcon name="card" size={16} /> Account size
            </span>
            <div className="grid grid-cols-5 gap-[6px] rounded-[16px] p-[5px]" style={{ background: "rgba(3,6,13,0.5)", border: `1px solid ${C.borderDark}` }}>
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={s === size}
                  className="cursor-pointer rounded-[12px] border-0 py-[11px] text-[13px] font-semibold transition-all sm:text-[14px]"
                  style={s === size ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff", boxShadow: "0 8px 20px -10px rgba(37,99,235,0.9)" } : { background: "transparent", color: "#a6b0c6" }}
                >
                  {fmtSize(s)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[14px]">
            <label htmlFor="fyt-calc-gain" className="flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
              <span className="flex items-center gap-[10px]">
                <GIcon name="trend" size={16} /> Monthly gain
              </span>
              <span className="tabular rounded-full px-[10px] py-[4px] text-[14px] text-white" style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(96,165,250,0.3)" }}>
                {gain}%
              </span>
            </label>
            <input id="fyt-calc-gain" type="range" min={1} max={10} value={gain} onChange={(e) => setGain(Number(e.target.value))} className="fyt-range" style={{ ["--p" as string]: `${((gain - 1) / 9) * 100}%` }} />
            <div className="flex justify-between text-[11px]" style={{ color: "#6f7a94" }}>
              <span>1%</span>
              <span>10%</span>
            </div>
          </div>
          <div className="flex flex-col gap-[14px]">
            <span className="flex items-center gap-[10px] text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
              <GIcon name="split" size={16} /> Reward split
            </span>
            <div className="grid grid-cols-3 gap-[6px] rounded-[16px] p-[5px]" style={{ background: "rgba(3,6,13,0.5)", border: `1px solid ${C.borderDark}` }}>
              {[80, 90, 100].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSplit(s)}
                  aria-pressed={s === split}
                  className="cursor-pointer rounded-[12px] border-0 py-[11px] text-[14px] font-semibold transition-all"
                  style={s === split ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff", boxShadow: "0 8px 20px -10px rgba(37,99,235,0.9)" } : { background: "transparent", color: "#a6b0c6" }}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
          <p className="mt-auto text-[12px] leading-[1.6]" style={{ color: "#6f7a94" }}>
            Example only. Your results depend on your trading. All accounts are simulated.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="fyt-ring relative h-full rounded-[26px]" style={{ boxShadow: "0 60px 120px -60px rgba(37,99,235,0.8)" }}>
            <div className="relative flex h-full flex-col gap-[18px] p-[22px] sm:p-[30px]" style={{ background: "radial-gradient(70% 60% at 80% 0%, rgba(37,99,235,0.28), transparent 70%)" }}>
              <div className="flex flex-wrap items-end justify-between gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.mutedDark }}>
                    Your monthly reward
                  </span>
                  <SpringNumber value={reward} format={(n) => money(Math.round(n))} className="tabular text-[52px] font-semibold leading-none tracking-[-0.045em] text-[#bbf7d0] sm:text-[72px]" />
                </div>
                <div className="flex gap-[10px]">
                  {[
                    [money(fee), "Account price"],
                    [`${multiple}x`, "Return"],
                  ].map(([v, l]) => (
                    <div key={l} className="flex flex-col gap-[2px] rounded-[14px] px-[14px] py-[10px]" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderDark}` }}>
                      <span className="tabular text-[18px] font-semibold text-white">{v}</span>
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mutedDark }}>
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[18px] p-[10px]" style={{ background: "rgba(3,6,13,0.45)", border: `1px solid ${C.borderDark}` }}>
                <GrowthChart fee={fee} reward={reward} on={inView} />
              </div>
              <div className="flex flex-col items-center justify-between gap-[14px] sm:flex-row">
                <span className="text-[14px]" style={{ color: "#a6b0c6" }}>
                  3 months at this pace: <b className="tabular text-white">{money(reward * 3)}</b>
                </span>
                <Pill onClick={() => selectPlanInPricing({ step: "1-Step", plan: "prime", size })} className="w-full sm:w-auto">
                  Start with {money(fee)}
                </Pill>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Prove your market expertise: the unfair rule vs what FYT does    */
/* ------------------------------------------------------------------ */

const EXPERTISE_CARDS: { icon: IconName; problem: string; fix: string; tag: string }[] = [
  { icon: "scale", problem: "Consistency rules limit natural performance.", fix: "No consistency rule. Trade your natural style.", tag: "Consistency" },
  { icon: "clock", problem: "Time limits create pressure.", fix: "No time limit. Pass at your own pace.", tag: "Time" },
  { icon: "doc", problem: "Hidden rules cause breaches.", fix: "Every rule written down, nothing added at payout.", tag: "Rules" },
  { icon: "trend", problem: "Relative drawdown punishes progress.", fix: "Static drawdown that never moves against you.", tag: "Drawdown" },
  { icon: "calendar", problem: "Delayed rewards damage trust.", fix: "Weekly rewards. First one on demand, in 24-48h.", tag: "Rewards" },
  { icon: "news", problem: "News and weekend bans block your strategy.", fix: "News trading and weekend holding allowed.", tag: "Freedom" },
];

/** Text that gets a red strike-through (on every wrapped line) once it scrolls into view. */
function StrikeText({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 1 });
  const reduce = useReducedMotion();
  const on = seen || !!reduce;
  return (
    <span
      ref={ref}
      className="text-[15.5px] leading-[1.45]"
      style={{
        color: "#8b93a7",
        textDecorationLine: "line-through",
        textDecorationThickness: "1.5px",
        textDecorationColor: on ? "rgba(239,68,68,0.75)" : "rgba(239,68,68,0)",
        transition: `text-decoration-color 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </span>
  );
}

export function ProveYourExpertise() {
  const reduce = useReducedMotion();
  const [titleRef, shimmer] = useShimmer<HTMLHeadingElement>();
  return (
    <Section tone="light">
      <div className="grid grid-cols-1 items-center gap-[44px] lg:grid-cols-12 lg:gap-[56px]">
        <div className="flex flex-col gap-[22px] lg:col-span-5">
          <Eyebrow tone="light">Why FYT</Eyebrow>
          <h2 ref={titleRef} className={`text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[38px] lg:text-[50px] ${shimmer}`} style={{ color: C.textLight }}>
            <WordsReveal text="Prove Your Market Expertise." />
            <br />
            <span className="font-normal" style={{ color: "#3c465c" }}>
              <WordsReveal text="Not your ability to survive" delay={0.15} />
            </span>{" "}
            <WordsReveal text="unfair rules." wordClassName="fyt-gradient-text font-semibold" delay={0.3} />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-[420px] text-[16px] leading-[1.7]" style={{ color: C.mutedLight }}>
              Most traders don't fail on skill. They fail on rules built to trip them up. We removed them.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="hidden lg:block">
            <OrbVisual size={340} />
          </Reveal>
        </div>

        <motion.ul
          className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:col-span-7"
          variants={staggerParent(0.09)}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {EXPERTISE_CARDS.map((c, i) => (
            <motion.li
              key={c.tag}
              variants={staggerChild}
              onPointerMove={spotlightMove}
              className="fyt-spot fyt-spot-light group relative flex flex-col overflow-hidden rounded-[22px] bg-white transition-[translate,box-shadow] duration-500 hover:-translate-y-[4px] hover:shadow-[0_32px_70px_-30px_rgba(37,99,235,0.5)]"
              style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 18px 40px -30px rgba(15,23,42,0.35)" }}
            >
              <div className="flex flex-col gap-[14px] p-[20px] pb-[16px] lg:p-[24px] lg:pb-[18px]">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-[8px] text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#b4bccd" }}>
                    <span className="flex size-[18px] items-center justify-center rounded-full" style={{ background: "#fdecec" }}>
                      <svg width="8" height="8" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="#ef4444" strokeWidth="2.6" strokeLinecap="round" />
                      </svg>
                    </span>
                    Other firms
                  </span>
                  <span className="tabular text-[12px] font-semibold tracking-[0.1em]" style={{ color: "#a3b3d4" }} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <StrikeText delay={0.5 + i * 0.08}>{c.problem}</StrikeText>
              </div>
              <div className="relative mt-auto flex items-center gap-[14px] px-[20px] py-[16px] transition-colors duration-500 group-hover:bg-[#2563eb] lg:px-[24px] lg:py-[18px]" style={{ background: "linear-gradient(180deg, #f3f7ff, #eaf1ff)", borderTop: "1px solid #e3eaf7" }}>
                <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[13px] bg-white text-[#2563eb] shadow-[0_8px_20px_-10px_rgba(37,99,235,0.6)] transition-colors duration-500 group-hover:bg-white/15 group-hover:text-white">
                  <GIcon name={c.icon} size={20} color="currentColor" />
                </span>
                <span className="text-[16px] font-semibold leading-[1.4] tracking-[-0.01em] transition-colors duration-500 group-hover:text-white lg:text-[17px]" style={{ color: "#0b1d4d" }}>
                  {c.fix}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Zero risk feel: "We take the risk, not you"                      */
/* ------------------------------------------------------------------ */

const RISK_TILES: { k: string; v: string; d: string; icon: IconName }[] = [
  { k: "Fee back", v: "100%", d: "Refunded with your reward", icon: "refund" },
  { k: "Drawdown reset", v: "Free", d: "After a reward, start fresh", icon: "reset" },
  { k: "First reward", v: "On demand", d: "No waiting for a cycle", icon: "bolt" },
  { k: "Time limit", v: "None", d: "Trade at your own pace", icon: "infinity" },
];

export function ZeroRisk() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [titleRef, shimmer] = useShimmer<HTMLHeadingElement>();
  const reduce = useReducedMotion();
  const tile = (t: (typeof RISK_TILES)[number], align: "left" | "right") => (
    <motion.div
      key={t.k}
      variants={staggerChild}
      onPointerMove={spotlightMove}
      className={`fyt-spot group relative flex flex-col gap-[12px] overflow-hidden rounded-[24px] p-[20px] sm:p-[26px] ${align === "right" ? "lg:items-end lg:text-right" : ""}`}
      style={DARK_CARD}
    >
      <span aria-hidden="true" className={`absolute -top-[50px] size-[150px] rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${align === "right" ? "-left-[50px]" : "-right-[50px]"}`} style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)" }} />
      <IconTile name={t.icon} />
      <span className="relative text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.mutedDark }}>
        {t.k}
      </span>
      <span className="relative text-[34px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[44px]">{t.v}</span>
      <span className="relative text-[14px]" style={{ color: "#a6b0c6" }}>
        {t.d}
      </span>
    </motion.div>
  );
  return (
    <Section tone="dark" stars>
      <div className="flex flex-col items-center gap-[18px] text-center">
        <Eyebrow center>Zero-risk feel</Eyebrow>
        <h2 ref={titleRef} className={`text-[36px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[48px] lg:text-[64px] ${shimmer}`} style={{ color: C.textDark }}>
          <WordsReveal text="We take the risk," /> <WordsReveal text="not you." wordClassName="fyt-gradient-text" delay={0.15} />
        </h2>
      </div>
      <motion.div
        ref={ref}
        className={`mt-[48px] grid grid-cols-2 items-center gap-[12px] lg:mt-[68px] lg:grid-cols-[1fr_auto_1fr] lg:gap-[32px] ${live ? "fyt-live" : ""}`}
        variants={staggerParent(0.09)}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="order-2 col-span-2 grid grid-cols-2 gap-[12px] lg:order-1 lg:col-span-1 lg:grid-cols-1 lg:gap-[18px]">{RISK_TILES.slice(0, 2).map((t) => tile(t, "right"))}</div>
        <div className="order-1 col-span-2 flex justify-center py-[8px] lg:order-2 lg:col-span-1">
          <div className="relative flex size-[240px] items-center justify-center sm:size-[300px]">
            <svg viewBox="0 0 300 300" className="fyt-orbit absolute inset-0 size-full" aria-hidden="true">
              <circle cx="150" cy="150" r="146" fill="none" stroke="rgba(96,165,250,0.35)" strokeDasharray="2 10" />
              <circle cx="150" cy="4" r="4" fill="#93c5fd" />
            </svg>
            <svg viewBox="0 0 300 300" className="fyt-orbit-rev absolute inset-[30px] size-[calc(100%-60px)]" aria-hidden="true">
              <circle cx="150" cy="150" r="146" fill="none" stroke="rgba(96,165,250,0.22)" />
              <circle cx="296" cy="150" r="5" fill="#60a5fa" />
              <circle cx="4" cy="150" r="3" fill="#bfdbfe" />
            </svg>
            <div className="absolute inset-[60px] rounded-full" style={{ background: "radial-gradient(circle at 50% 35%, rgba(59,130,246,0.55), rgba(37,99,235,0.12) 60%, transparent 72%)", filter: "blur(2px)" }} />
            <div className="relative flex size-[130px] items-center justify-center rounded-full sm:size-[150px]" style={{ background: "linear-gradient(180deg,#0f1b36,#0a1226)", border: "1px solid rgba(96,165,250,0.45)", boxShadow: "0 0 80px rgba(59,130,246,0.55), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
              <svg width="70" height="80" viewBox="0 0 96 110" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="fyt-shield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <path d="M48 4 88 18v32c0 26-17 46-40 56C25 96 8 76 8 50V18L48 4Z" fill="url(#fyt-shield)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                <motion.path d="M30 55 43 68 67 42" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} />
              </svg>
            </div>
          </div>
        </div>
        <div className="order-3 col-span-2 grid grid-cols-2 gap-[12px] lg:col-span-1 lg:grid-cols-1 lg:gap-[18px]">{RISK_TILES.slice(2).map((t) => tile(t, "left"))}</div>
      </motion.div>
      <Reveal delay={0.1} className="mt-[40px] flex justify-center">
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
  const [ref, live] = useLive<HTMLDivElement>();
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
    await submitLead("free-demo", email, { name });
  };
  const field = "w-full rounded-[14px] px-[16px] py-[14px] text-[15px] text-white outline-none transition-colors placeholder:text-[#6f7a94] focus:border-[#60a5fa]";
  const fieldStyle = { background: "rgba(3,6,13,0.6)", border: "1px solid rgba(255,255,255,0.14)" };
  return (
    <Section tone="light">
      <div ref={ref} className={`grid grid-cols-1 items-center gap-[44px] lg:grid-cols-12 lg:gap-[56px] ${live ? "fyt-live" : ""}`}>
        <div className="flex flex-col gap-[22px] lg:col-span-5">
          <Eyebrow tone="light">Free trial</Eyebrow>
          <SectionTitle tone="light" lead="Try FYT free" highlight="for 2 days." />
          <Reveal delay={0.1}>
            <p className="max-w-[440px] text-[16px] leading-[1.7]" style={{ color: C.mutedLight }}>
              Trade on the real dashboard with the same rules. No card. When you're ready, upgrade with 40% off.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-[10px]">
              {(
                [
                  ["monitor", "Real dashboard"],
                  ["shield", "Same rules"],
                  ["card", "No card needed"],
                  ["clock", "48 hours access"],
                ] as const
              ).map(([icon, t]) => (
                <div key={t} className="flex items-center gap-[12px] rounded-[16px] bg-white p-[12px]" style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 18px 40px -30px rgba(30,64,175,0.5)" }}>
                  <IconTile name={icon} size={36} tone="light" />
                  <span className="text-[14px] font-semibold" style={{ color: C.textLight }}>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <DiscordLive tone="light" />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative pb-[40px] lg:pb-0 lg:pr-[0px]">
            <div className="fyt-float relative overflow-hidden rounded-[22px]" style={{ border: "1px solid rgba(148,178,255,0.2)", boxShadow: "0 60px 120px -50px rgba(37,99,235,0.8)", transform: "perspective(1400px) rotateY(-6deg) rotateX(3deg)" }}>
              <img src={imgDashboard} alt="FYT trader dashboard" loading="lazy" decoding="async" className="block w-full" />
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(3,6,13,0.75))" }} />
              <span className="absolute left-[16px] top-[16px] flex items-center gap-[8px] rounded-full px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.1em] text-[#0a1226]" style={{ background: "linear-gradient(180deg,#bbf7d0,#4ade80)", boxShadow: "0 10px 24px -8px rgba(34,197,94,0.7)" }}>
                2 days free
              </span>
            </div>
            <div className="relative z-[2] mx-auto -mt-[70px] w-[94%] sm:-mt-[110px] sm:w-[78%] lg:absolute lg:-bottom-[40px] lg:right-[-10px] lg:mt-0 lg:w-[380px]">
              <div className="fyt-ring fyt-live rounded-[24px]" style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)" }}>
                <div className="relative p-[20px] sm:p-[24px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-[10px] py-[10px]">
                        <span className="flex size-[48px] items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg,#4ade80,#16a34a)", boxShadow: "0 10px 30px -8px rgba(34,197,94,0.8)" }}>
                          <CheckIcon color="#fff" size={20} />
                        </span>
                        <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-white">You're in.</h3>
                        <p className="text-[14px]" style={{ color: "#a6b0c6" }}>
                          Your demo login is on its way to {email}.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form key="form" onSubmit={onSubmit} className="flex flex-col gap-[10px]" exit={{ opacity: 0, y: -10 }}>
                        <h3 className="mb-[4px] text-[20px] font-semibold tracking-[-0.03em] text-white">Get your demo login</h3>
                        <label className="sr-only" htmlFor="fyt-demo-name">
                          Name
                        </label>
                        <input id="fyt-demo-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className={field} style={fieldStyle} />
                        <label className="sr-only" htmlFor="fyt-demo-email">
                          Email
                        </label>
                        <input id="fyt-demo-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" className={field} style={fieldStyle} />
                        <button type="submit" className="cta-shine relative mt-[4px] cursor-pointer overflow-hidden rounded-full border-0 py-[15px] text-[15px] font-semibold text-white transition-transform hover:-translate-y-[1px]" style={{ background: "linear-gradient(180deg,#4f8cff,#2563eb)", boxShadow: "0 10px 30px -10px rgba(37,99,235,0.75), inset 0 1px 0 rgba(255,255,255,0.35)" }}>
                          Start my free 2 days
                        </button>
                        <p className="text-center text-[11.5px]" style={{ color: "#6f7a94" }}>
                          Demo accounts are simulated and can't be withdrawn.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
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
