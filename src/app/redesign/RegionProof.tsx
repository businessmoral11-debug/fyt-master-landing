import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMotionValue, useMotionValueEvent, useSpring } from "motion/react";
import { API_BASE_URL } from "@/app/api/apiBaseUrl";
import { countryFlagUrl, fetchFeaturedPayouts, formatPayoutAmount, type PublicCertificate, type PublicPayout } from "@/app/api/rewardsApi";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import { C, Eyebrow, Pill, Reveal, Section, useLive } from "./ui";

/* ------------------------------------------------------------------ */
/* Live rewards, matched to the visitor: country -> region -> world.   */
/*                                                                     */
/* Rules (agreed):                                                     */
/*  - every number is for the LAST 30 DAYS and the page says so        */
/*  - the visitor's country is shown only if it has 3+ payouts         */
/*  - otherwise their region (Europe, South Asia, ...) if it has 3+    */
/*  - otherwise worldwide                                              */
/* ------------------------------------------------------------------ */

const WINDOW_DAYS = 30;
const MIN_PAYOUTS = 3;
const DAY = 86_400_000;
const DISCORD_INVITE_CODE = "6NYNSAwxeZ";
const DISCORD_URL = `https://discord.gg/${DISCORD_INVITE_CODE}`;

/* ------------------------------- regions -------------------------------- */

type RegionId = "south-asia" | "southeast-asia" | "east-asia" | "middle-east" | "europe" | "north-america" | "latin-america" | "oceania" | "africa";

const REGION_NAME: Record<RegionId, string> = {
  "south-asia": "South Asia",
  "southeast-asia": "Southeast Asia",
  "east-asia": "East Asia",
  "middle-east": "the Middle East",
  europe: "Europe",
  "north-america": "North America",
  "latin-america": "Latin America",
  oceania: "Oceania",
  africa: "Africa",
};

const REGION_CHIP: Record<RegionId, string> = {
  "south-asia": "South Asia",
  "southeast-asia": "Southeast Asia",
  "east-asia": "East Asia",
  "middle-east": "Middle East",
  europe: "Europe",
  "north-america": "North America",
  "latin-america": "Latin America",
  oceania: "Oceania",
  africa: "Africa",
};

const REGION_COUNTRIES: Record<RegionId, string[]> = {
  "south-asia": ["IN", "PK", "BD", "LK", "NP", "BT", "MV"],
  "southeast-asia": ["MY", "PH", "ID", "VN", "SG", "TH", "KH", "LA", "MM", "BN"],
  "east-asia": ["HK", "JP", "KR", "CN", "TW", "MO", "MN"],
  "middle-east": ["SA", "AE", "OM", "BH", "QA", "KW", "JO", "LB", "IL", "IQ", "IR", "TR", "YE", "SY", "PS"],
  europe: [
    "GB", "IE", "FR", "DE", "NL", "BE", "LU", "CH", "AT", "IT", "ES", "PT", "GR", "CY", "MT", "SE", "NO", "DK", "FI", "IS", "PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "RS", "BA",
    "AL", "MK", "ME", "XK", "UA", "BY", "MD", "LT", "LV", "EE", "RU", "AZ", "GE", "AM",
  ],
  "north-america": ["US", "CA", "MX", "PR"],
  "latin-america": ["BR", "AR", "CO", "CL", "PE", "UY", "EC", "VE", "BO", "PY", "CR", "PA", "DO", "GT", "JM", "TT"],
  oceania: ["AU", "NZ", "FJ", "PG"],
  africa: ["ZA", "NG", "KE", "EG", "MA", "DZ", "TN", "GH", "ET", "TZ", "UG", "SN", "CI", "CM", "ZM", "ZW", "MU", "NA", "BW", "RW", "AO", "MZ", "LY", "SD"],
};

const COUNTRY_REGION: Record<string, RegionId> = {};
for (const [region, list] of Object.entries(REGION_COUNTRIES) as [RegionId, string[]][]) for (const cc of list) COUNTRY_REGION[cc] = region;

function regionOf(code: string | null | undefined): RegionId | null {
  return code ? COUNTRY_REGION[code.toUpperCase()] ?? null : null;
}

/* ------------------------------ visitor ------------------------------- */

const TZ_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Karachi": "PK", "Asia/Dhaka": "BD", "Asia/Kathmandu": "NP", "Asia/Colombo": "LK",
  "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kuwait": "KW", "Asia/Bahrain": "BH", "Asia/Muscat": "OM", "Asia/Amman": "JO", "Asia/Beirut": "LB",
  "Asia/Jerusalem": "IL", "Asia/Baghdad": "IQ", "Asia/Tehran": "IR", "Asia/Baku": "AZ", "Asia/Tbilisi": "GE", "Asia/Yerevan": "AM",
  "Africa/Lagos": "NG", "Africa/Nairobi": "KE", "Africa/Johannesburg": "ZA", "Africa/Accra": "GH", "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Algiers": "DZ",
  "Africa/Tunis": "TN", "Africa/Addis_Ababa": "ET", "Africa/Dar_es_Salaam": "TZ", "Africa/Kampala": "UG", "Africa/Dakar": "SN", "Africa/Abidjan": "CI",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Berlin": "DE", "Europe/Paris": "FR", "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE", "Europe/Zurich": "CH", "Europe/Vienna": "AT", "Europe/Prague": "CZ", "Europe/Bratislava": "SK", "Europe/Budapest": "HU", "Europe/Warsaw": "PL",
  "Europe/Bucharest": "RO", "Europe/Sofia": "BG", "Europe/Athens": "GR", "Europe/Lisbon": "PT", "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI", "Europe/Vilnius": "LT", "Europe/Riga": "LV", "Europe/Tallinn": "EE", "Europe/Kyiv": "UA", "Europe/Kiev": "UA", "Europe/Istanbul": "TR",
  "Europe/Moscow": "RU", "Europe/Belgrade": "RS", "Europe/Zagreb": "HR",
  "Asia/Kuala_Lumpur": "MY", "Asia/Singapore": "SG", "Asia/Manila": "PH", "Asia/Jakarta": "ID", "Asia/Bangkok": "TH", "Asia/Ho_Chi_Minh": "VN", "Asia/Saigon": "VN",
  "Asia/Hong_Kong": "HK", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Shanghai": "CN", "Asia/Taipei": "TW",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Pacific/Auckland": "NZ",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US", "Pacific/Honolulu": "US",
  "America/Detroit": "US", "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Winnipeg": "CA", "America/Halifax": "CA",
  "America/Sao_Paulo": "BR", "America/Mexico_City": "MX", "America/Bogota": "CO", "America/Lima": "PE", "America/Santiago": "CL", "America/Argentina/Buenos_Aires": "AR", "America/Buenos_Aires": "AR",
};

/** Country from time zone first, then browser language. No network call, nothing tracked. `?country=DE` forces one for testing. */
export function detectVisitor(): { code: string | null; region: RegionId | null } {
  try {
    const override = new URLSearchParams(window.location.search).get("country");
    if (override && /^[a-z]{2}$/i.test(override)) {
      const code = override.toUpperCase();
      return { code, region: regionOf(code) };
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (TZ_COUNTRY[tz]) {
      const code = TZ_COUNTRY[tz];
      return { code, region: regionOf(code) };
    }
    for (const lang of navigator.languages ?? [navigator.language]) {
      const m = /-([A-Z]{2})$/i.exec(lang ?? "");
      if (m) {
        const code = m[1].toUpperCase();
        if (regionOf(code)) return { code, region: regionOf(code) };
      }
    }
    // Unknown country: a region can still be read from the time zone name.
    if (tz.startsWith("Europe/")) return { code: null, region: "europe" };
    if (tz.startsWith("Africa/")) return { code: null, region: "africa" };
    if (tz.startsWith("Australia/") || tz.startsWith("Pacific/")) return { code: null, region: "oceania" };
  } catch {
    // Falls through to worldwide.
  }
  return { code: null, region: null };
}

const NAME_THE: Record<string, string> = { US: "the USA", GB: "the UK", AE: "the UAE", NL: "the Netherlands", PH: "the Philippines" };
const NAME_PLAIN: Record<string, string> = { US: "USA", GB: "UK", AE: "UAE", CZ: "Czechia" };

function countryPlain(code: string): string {
  if (NAME_PLAIN[code]) return NAME_PLAIN[code];
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
function countryThe(code: string): string {
  return NAME_THE[code] ?? countryPlain(code);
}

/* ------------------------------- helpers -------------------------------- */

type ProofItem = PublicPayout & { cert?: PublicCertificate };
type Scope = { kind: "country"; code: string } | { kind: "region"; id: RegionId } | { kind: "world" };

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

function initials(name: string | null): string {
  return (name ?? "FT")
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Every payout links to /certificate/{id}; the image lives at /public/certificates/{id}/image. */
function withCertificate(p: PublicPayout): ProofItem {
  const id = /\/certificate\/([0-9a-f-]{16,})/i.exec(p.certificateUrl ?? "")?.[1];
  if (!id || !p.certificateUrl) return p;
  return {
    ...p,
    cert: {
      certificateId: id,
      traderName: p.traderName,
      country: p.country,
      countryCode: p.countryCode,
      amount: p.amount,
      createdAt: p.createdAt ?? "",
      imageUrl: `${API_BASE_URL}/public/certificates/${id}/image`,
      certificateUrl: p.certificateUrl,
    },
  };
}

/** The last 30 days of payouts (newest first). Loads page 1, then only as many more pages as the window needs. */
async function loadWindowPayouts(): Promise<PublicPayout[]> {
  const cutoff = Date.now() - WINDOW_DAYS * DAY;
  const first = await fetchFeaturedPayouts(1, 100);
  const rows: PublicPayout[] = [...first.data];
  const pages = first.meta?.pagination?.totalPages ?? 1;
  const oldest = rows.length ? Date.parse(rows[rows.length - 1].createdAt ?? "") : 0;
  if (pages > 1 && Number.isFinite(oldest) && oldest > cutoff) {
    const more = await Promise.all(Array.from({ length: Math.min(pages, 8) - 1 }, (_, i) => fetchFeaturedPayouts(i + 2, 100).catch(() => null)));
    for (const r of more) if (r) rows.push(...r.data);
  }
  return rows.filter((p) => Number(p.amount) > 0 && p.createdAt && Date.parse(p.createdAt) >= cutoff);
}

/** Springs a number to its new value (same feel as the pricing price). */
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

function Check({ size = 12, color = "#86efac" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Globe({ size = 16, color = "#93c5fd" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3Z" />
    </svg>
  );
}

/* ------------------------------- Discord -------------------------------- */

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

function DiscordStrip() {
  const counts = useDiscordCounts();
  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex max-w-full items-center gap-[12px] rounded-[16px] py-[10px] pl-[10px] pr-[14px] no-underline transition-transform duration-300 hover:-translate-y-[2px]"
      style={{ background: "#fff", border: `1px solid ${C.borderLight}`, boxShadow: "0 18px 40px -28px rgba(30,64,175,0.5)" }}
    >
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px]" style={{ background: "#5865f2" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18 18 0 0 0-5.6 0L8.6 3a19.6 19.6 0 0 0-4.9 1.5C.6 9.1-.3 13.7.1 18.2a19.8 19.8 0 0 0 6 3l1.3-2.1-2-1 .5-.4a14 14 0 0 0 12.2 0l.5.4-2 1 1.3 2.1a19.7 19.7 0 0 0 6-3c.5-5.2-.8-9.8-3.6-13.8ZM8.3 15.4c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm7.4 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-[7px] text-[13.5px] font-semibold" style={{ color: C.textLight }}>
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
        <span className="truncate text-[12px]" style={{ color: C.mutedLight }}>
          {counts && counts.members ? `${counts.members.toLocaleString("en-US")} members · ` : ""}Ask a funded trader on Discord
        </span>
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true">
        <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* ----------------------- left column: the numbers ----------------------- */

/** 30 thin bars, one per day; the last 7 days are the bright ones. */
function DayBars({ items }: { items: ProofItem[] }) {
  const bars = useMemo(() => {
    const now = Date.now();
    const sums = Array.from({ length: WINDOW_DAYS }, () => 0);
    for (const p of items) {
      const age = Math.floor((now - Date.parse(p.createdAt ?? "")) / DAY);
      if (age >= 0 && age < WINDOW_DAYS) sums[WINDOW_DAYS - 1 - age] += Number(p.amount) || 0;
    }
    const max = Math.max(1, ...sums);
    return sums.map((s) => s / max);
  }, [items]);
  return (
    <div className="flex h-[52px] items-end gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => {
        const recent = i >= WINDOW_DAYS - 7;
        return (
          <span
            key={i}
            className="flex-1 rounded-[3px]"
            style={{
              height: `${Math.max(8, Math.round(h * 100))}%`,
              background: recent ? "linear-gradient(180deg,#60a5fa,#2563eb)" : "linear-gradient(180deg,#dbe7ff,#bfd3ff)",
              opacity: h === 0 ? 0.55 : 1,
              transition: "height .6s cubic-bezier(.16,1,.3,1)",
            }}
          />
        );
      })}
    </div>
  );
}

function StatTile({ label, children, accent = false }: { label: string; children: ReactNode; accent?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-[6px] rounded-[18px] p-[14px]" style={{ background: "#fff", border: `1px solid ${C.borderLight}`, boxShadow: "0 24px 50px -36px rgba(30,64,175,0.5)" }}>
      <span className="tabular flex items-center gap-[8px] truncate text-[24px] font-semibold leading-none tracking-[-0.03em]" style={{ color: C.textLight }}>
        {accent && (
          <span className="relative flex size-[8px] shrink-0">
            <span className="fyt-rd-ping absolute inset-0 rounded-full bg-[#2563eb]" />
            <span className="relative size-[8px] rounded-full bg-[#2563eb]" />
          </span>
        )}
        {children}
      </span>
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.13em]" style={{ color: C.mutedLight }}>
        {label}
      </span>
    </div>
  );
}

/* ----------------------- right column: certificate ---------------------- */

function CertificateStage({ item }: { item: ProofItem | undefined }) {
  // The text certificate is always underneath; the real image fades in on top once it has loaded,
  // so a slow or failed image never leaves an empty black box (seen on iPhone).
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const cert = item?.cert;
  const link = cert?.certificateUrl || item?.certificateUrl || item?.explorerUrl || undefined;
  const f = item ? countryFlagUrl(item.countryCode) : null;
  const showImage = !!cert && failed !== cert.certificateId;
  const ready = !!cert && loaded === cert.certificateId;
  return (
    <div className="flex min-w-0 flex-col gap-[14px]">
      <a href={link} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-[20px] no-underline" style={{ background: "#eef4ff", border: "1px solid rgba(37,99,235,0.14)", boxShadow: "0 34px 70px -38px rgba(30,64,175,0.55), 0 2px 6px rgba(15,23,42,0.06)" }}>
        <div className="relative aspect-[1.41] w-full">
          <span className="absolute inset-0" style={{ background: "radial-gradient(85% 75% at 50% 35%, #ffffff, #e3edff 70%, #d6e4ff)" }} />
          {item && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-[6px] text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563eb]">Performance reward</span>
              <span className="tabular fyt-gradient-text text-[44px] font-semibold tracking-[-0.03em]">{formatPayoutAmount(item.amount)}</span>
              <span className="text-[14px] font-semibold" style={{ color: C.textLight }}>{item.traderName ?? "FYT trader"}</span>
            </span>
          )}
          {showImage && (
            <img
              key={cert!.certificateId}
              src={cert!.imageUrl}
              alt={`Payout certificate for ${cert!.traderName ?? "FYT trader"}`}
              decoding="async"
              onLoad={() => setLoaded(cert!.certificateId)}
              onError={() => setFailed(cert!.certificateId)}
              className="absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.03]"
              style={{ opacity: ready ? 1 : 0 }}
            />
          )}
          <span className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full px-[10px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#15803d]" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(34,197,94,0.35)", boxShadow: "0 6px 16px -8px rgba(15,23,42,0.35)", backdropFilter: "blur(6px)" }}>
            <Check size={10} /> Verified on-chain
          </span>
        </div>
      </a>
      {item && (
        <div className="flex items-center justify-between gap-[12px] px-[4px]">
          <span className="flex min-w-0 items-center gap-[10px]">
            {f && <img src={f} alt="" width={26} height={18} className="h-[18px] w-[26px] shrink-0 rounded-[3px] object-cover" />}
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] font-semibold" style={{ color: C.textLight }}>{item.traderName ?? "FYT trader"}</span>
              <span className="truncate text-[12px]" style={{ color: C.mutedLight }}>
                {[item.country, relTime(item.createdAt)].filter(Boolean).join(" · ")}
              </span>
            </span>
          </span>
          <span className="tabular fyt-gradient-text shrink-0 text-[28px] font-semibold tracking-[-0.03em]">{formatPayoutAmount(item.amount)}</span>
        </div>
      )}
    </div>
  );
}

function FeedRow({ p, active, running, onPick, className = "" }: { p: ProofItem; active: boolean; running: boolean; onPick: () => void; className?: string }) {
  const f = countryFlagUrl(p.countryCode);
  return (
    <li className={className}>
      <button
        type="button"
        onClick={onPick}
        className="relative flex w-full cursor-pointer items-center gap-[12px] overflow-hidden rounded-[16px] border-0 px-[10px] py-[10px] text-left transition-colors"
        style={{
          background: active ? "linear-gradient(90deg, #eaf1ff, #f6f9ff)" : "#fff",
          border: `1px solid ${active ? "rgba(37,99,235,0.45)" : C.borderLight}`,
          boxShadow: active ? "0 14px 30px -20px rgba(37,99,235,0.6)" : "0 1px 2px rgba(15,23,42,0.04)",
        }}
      >
        {p.cert ? (
          <span className="relative h-[40px] w-[56px] shrink-0 overflow-hidden rounded-[8px]" style={{ border: "1px solid rgba(37,99,235,0.16)", background: "#e6eeff" }}>
            <img src={p.cert.imageUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
          </span>
        ) : (
          <span className="flex h-[40px] w-[56px] shrink-0 items-center justify-center rounded-[8px] text-[13px] font-semibold text-white" style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}>
            {initials(p.traderName)}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-[6px] truncate text-[14.5px] font-semibold" style={{ color: C.textLight }}>
            {f && <img src={f} alt="" width={16} height={12} loading="lazy" className="h-[12px] w-[16px] shrink-0 rounded-[2px] object-cover" />}
            <span className="truncate">{p.traderName ?? "FYT trader"}</span>
          </span>
          <span className="truncate text-[12px]" style={{ color: C.mutedLight }}>
            {relTime(p.createdAt)}
          </span>
        </span>
        <span className="tabular shrink-0 text-[16px] font-semibold text-[#16a34a]">+{formatPayoutAmount(p.amount)}</span>
        {active && running && <span aria-hidden="true" className="fyt-rp-progress absolute inset-x-0 bottom-0 h-[2px] origin-left" style={{ background: "linear-gradient(90deg,#2563eb,#60a5fa)" }} />}
      </button>
    </li>
  );
}

/* -------------------------------- section -------------------------------- */

export function RegionProof({ fallback = null }: { fallback?: ReactNode }) {
  const [visitor, setVisitor] = useState<{ code: string | null; region: RegionId | null }>({ code: null, region: null });
  const [rows, setRows] = useState<ProofItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "empty">("loading");
  const [worldwide, setWorldwide] = useState(false);
  const [pick, setPick] = useState(0);
  const [auto, setAuto] = useState(true);
  const [more, setMore] = useState(false);
  const [panelRef, panelLive] = useLive<HTMLDivElement>();

  useEffect(() => {
    setVisitor(detectVisitor());
    let cancelled = false;
    loadWindowPayouts()
      .then((list) => {
        if (cancelled) return;
        const items = list.map(withCertificate);
        setRows(items);
        setState(items.length ? "ready" : "empty");
      })
      .catch(() => {
        if (!cancelled) setState("empty");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const countryRows = useMemo(() => (visitor.code ? rows.filter((p) => (p.countryCode ?? "").toUpperCase() === visitor.code) : []), [rows, visitor.code]);
  const regionRows = useMemo(() => (visitor.region ? rows.filter((p) => regionOf(p.countryCode) === visitor.region) : []), [rows, visitor.region]);

  // The ladder: country (3+) -> region (3+) -> worldwide.
  const local: Scope = countryRows.length >= MIN_PAYOUTS && visitor.code ? { kind: "country", code: visitor.code } : regionRows.length >= MIN_PAYOUTS && visitor.region ? { kind: "region", id: visitor.region } : { kind: "world" };
  const scope: Scope = worldwide ? { kind: "world" } : local;
  const pool = scope.kind === "country" ? countryRows : scope.kind === "region" ? regionRows : rows;

  const stats = useMemo(() => {
    const now = Date.now();
    const total = pool.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const week = pool.filter((p) => now - Date.parse(p.createdAt ?? "") <= 7 * DAY).length;
    return { total, count: pool.length, week };
  }, [pool]);

  const ordered = useMemo(() => [...pool].sort((a, b) => Date.parse(b.createdAt ?? "") - Date.parse(a.createdAt ?? "")).slice(0, 5), [pool]);
  const scopeKey = scope.kind === "country" ? scope.code : scope.kind === "region" ? scope.id : "world";
  useEffect(() => setPick(0), [scopeKey]);
  useEffect(() => {
    if (!auto || !panelLive || ordered.length < 2) return;
    const t = window.setInterval(() => setPick((i) => (i + 1) % ordered.length), 4500);
    return () => window.clearInterval(t);
  }, [auto, panelLive, ordered.length]);

  if (state === "empty") return <>{fallback}</>;

  const flag = scope.kind === "country" ? countryFlagUrl(scope.code) : null;
  const localFlag = local.kind === "country" ? countryFlagUrl(local.code) : null;
  const localChip = local.kind === "country" ? countryPlain(local.code) : local.kind === "region" ? REGION_CHIP[local.id] : "";
  const scopeShort = scope.kind === "country" ? countryThe(scope.code) : scope.kind === "region" ? REGION_NAME[scope.id] : "worldwide";
  const loading = state === "loading";

  return (
    <Section tone="light" id="live-payouts">
      <div className="relative grid grid-cols-1 items-center gap-[40px] lg:grid-cols-12 lg:gap-[56px]">
        <div className="flex min-w-0 flex-col gap-[22px] lg:col-span-5 xl:col-span-4">
          <Eyebrow tone="light">Live rewards</Eyebrow>
          <h2 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-[42px] lg:text-[40px] xl:text-[42px] min-[1400px]:text-[46px]" style={{ color: C.textLight }}>
            {scope.kind === "country" ? (
              <>
                <span className="inline-flex flex-nowrap items-center gap-x-[12px] whitespace-nowrap">
                  Traders from
                  {flag && <img src={flag} alt="" width={56} height={40} className="inline-block h-[0.62em] w-auto shrink-0 rounded-[6px] shadow-[0_8px_24px_rgba(15,23,42,0.25)] ring-1 ring-black/10" />}
                </span>
                <br />
                <span className="fyt-gradient-text">{countryThe(scope.code)} get paid.</span>
              </>
            ) : scope.kind === "region" ? (
              <>
                Traders across
                <br />
                <span className="fyt-gradient-text">{REGION_NAME[scope.id]} get paid.</span>
              </>
            ) : (
              <>
                Traders worldwide
                <br />
                <span className="fyt-gradient-text">get paid.</span>
              </>
            )}
          </h2>

          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-col gap-[14px] rounded-[22px] p-[18px]" style={{ background: "#fff", border: `1px solid ${C.borderLight}`, boxShadow: "0 40px 80px -52px rgba(30,64,175,0.55)" }}>
              <div className="flex items-center justify-between gap-[10px]">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.13em]" style={{ color: C.mutedLight }}>
                  Total paid
                </span>
                <span className="rounded-full px-[10px] py-[4px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#1d4ed8]" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.16)" }}>
                  Last {WINDOW_DAYS} days
                </span>
              </div>
              <span className="tabular text-[44px] font-semibold leading-none tracking-[-0.04em] lg:text-[48px]" style={{ color: C.textLight }}>
                {loading ? "-" : <SpringNumber value={Math.round(stats.total)} format={(n) => money(Math.round(n))} />}
              </span>
              <DayBars items={pool} />
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <StatTile label="Payouts">{loading ? "-" : <SpringNumber value={stats.count} format={(n) => String(Math.round(n))} />}</StatTile>
              <StatTile label="This week" accent>
                {loading ? "-" : <SpringNumber value={stats.week} format={(n) => String(Math.round(n))} />}
              </StatTile>
            </div>
          </div>

          {local.kind !== "world" && (
            <div className="inline-flex w-fit max-w-full rounded-full p-[4px]" style={{ background: "#fff", border: `1px solid ${C.borderLight}` }} role="tablist" aria-label="Show payouts for">
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
                    style={on ? { background: "linear-gradient(180deg,#4f8cff,#2563eb)", color: "#fff", boxShadow: "0 8px 20px -10px rgba(37,99,235,0.9)" } : { background: "transparent", color: C.mutedLight }}
                  >
                    {!w && localFlag ? <img src={localFlag} alt="" width={18} height={13} className="h-[13px] w-[18px] rounded-[2px] object-cover" /> : <Globe size={14} color={on ? "#fff" : "#5b6478"} />}
                    {w ? "Worldwide" : localChip}
                  </button>
                );
              })}
            </div>
          )}
          <DiscordStrip />
        </div>

        <Reveal delay={0.1} className="min-w-0 lg:col-span-7 xl:col-span-8">
          <div ref={panelRef} className={`relative rounded-[28px] ${panelLive ? "fyt-live" : ""}`} style={{ background: "linear-gradient(180deg,#ffffff,#f6f9ff)", border: `1px solid ${C.borderLight}`, boxShadow: "0 50px 100px -56px rgba(30,64,175,0.55), 0 2px 8px rgba(15,23,42,0.05)" }}>
            <div className="relative flex flex-col gap-[18px] p-[16px] sm:p-[24px]">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="flex items-center gap-[10px] text-[14px] font-semibold" style={{ color: C.textLight }}>
                    {flag ? <img src={flag} alt="" width={22} height={16} className="h-[16px] w-[22px] shrink-0 rounded-[3px] object-cover" /> : <Globe />}
                    <span className="truncate">Recent rewards {scope.kind === "world" ? "worldwide" : `from ${scopeShort}`}</span>
                  </span>
                  <span className="text-[11.5px]" style={{ color: C.mutedLight }}>
                    Last {WINDOW_DAYS} days
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-[7px] rounded-full px-[10px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#15803d]" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <span className="relative flex size-[7px]">
                    <span className="fyt-rd-ping-gated absolute inset-0 rounded-full bg-[#22c55e]" />
                    <span className="relative size-[7px] rounded-full bg-[#22c55e]" />
                  </span>
                  Live
                </span>
              </div>
              <div className="grid grid-cols-1 gap-[16px] md:grid-cols-[1.15fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.15fr_1fr]">
                <CertificateStage item={ordered[pick] ?? ordered[0]} />
                <ul className="flex min-w-0 flex-col gap-[8px]">
                  {ordered.length
                    ? ordered.map((p, i) => (
                        <FeedRow
                          className={i >= 3 && !more ? "hidden md:block" : ""}
                          key={`${p.id ?? "x"}-${i}`}
                          p={p}
                          active={i === pick}
                          running={auto && panelLive && ordered.length > 1}
                          onPick={() => {
                            setAuto(false);
                            setPick(i);
                          }}
                        />
                      ))
                    : Array.from({ length: 5 }, (_, i) => <li key={i} className="h-[62px] animate-pulse rounded-[16px]" style={{ background: "#eef3fb", border: `1px solid ${C.borderLight}` }} />)}
                  {ordered.length > 3 && !more && (
                    <li className="md:hidden">
                      <button type="button" onClick={() => setMore(true)} className="w-full cursor-pointer rounded-[14px] border-0 py-[12px] text-[13.5px] font-semibold text-[#1d4ed8]" style={{ background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.2)" }}>
                        View more
                      </button>
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-[12px] border-t pt-[14px]" style={{ borderColor: C.borderLight }}>
                <a href="https://rewards.fundingyourtrades.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[7px] text-[13px] font-semibold text-[#1d4ed8] no-underline hover:underline">
                  <Check size={14} color="#1d4ed8" /> See every reward on-chain
                </a>
                <Pill href="#challenge" onClick={() => pauseHeavyScenesForNav()} className="px-[22px]! py-[12px]! text-[14px]!">
                  Start my challenge
                </Pill>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
