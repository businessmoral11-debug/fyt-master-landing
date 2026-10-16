
export type PromoItemKind = "code" | "plain" | "crypto" | "live";

export interface PromoItem {
  kind: PromoItemKind;
  label?: string;
  text: string;
  sub?: string;
  code?: string;
}

/** Top-banner benefit lines (deal line is separate so mobile can stack cleanly). */
export const PROMO_BENEFITS = [
  "First Reward on Demand",
  "Free Drawdown Reset",
] as const;

/** Deal line shown after benefits on the top banner. */
export const PROMO_DEAL_LINE = "Dashboard Launch Offer: 40% off + Buy 1 Get 2 Instantly + 5% Instant Cashback";

/** Short deal (no "Dashboard Launch Offer:" label) for the phone banner and floating button. */
export const PROMO_DEAL_SHORT = "40% off + Buy 1 Get 2 Instantly";

/** Full banner copy order: deal first, then benefits. */
export const PROMO_BANNER_ITEMS = [PROMO_DEAL_LINE, ...PROMO_BENEFITS] as const;

/** Promo code shown in the top-banner CODE pill (also used at checkout). */
export const PROMO_CODE = "NEWDASH";

/** Alternate welcome offer shown on the pricing card (manual code entry). */
export const ALT_PROMO_LABEL = "For new traders";
export const ALT_PROMO_DEAL = "45% off + Instant BOGO";
export const ALT_PROMO_CODE = "WELCOME45";

/** Kept for pricing-panel badge / coupon references. */
export const PROMO_ITEMS: PromoItem[] = [
  { kind: "code", label: "Dashboard Launch Offer", text: "40% off + Buy 1 Get 2 Instantly + 5% Instant Cashback", code: PROMO_CODE },
];

/** Dashboard Launch Offer (NEWDASH) ends Tuesday 20 Oct 2026, 23:59:59 IST (7 days from launch). */
export const PROMO_DEADLINE = "2026-10-20T23:59:59+05:30";

/** Spots left (not shown while the countdown runs; kept for switching back). Updated by hand from real sales. */
export const PROMO_SPOTS_LEFT = 247;

export interface Countdown {
  days: number;
  hh: string;
  mm: string;
  ss: string;
}

const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export function formatCountdown(deadlineISO: string, nowMs: number): Countdown {
  const deadlineMs = new Date(deadlineISO).getTime();
  const diff = Math.max(0, deadlineMs - nowMs);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hh: pad(hours), mm: pad(minutes), ss: pad(seconds) };
}

export interface HoursLeft {
  expired: boolean;
  hh: string;
  mm: string;
  ss: string;
}

/** Countdown with days folded into hours (e.g. 51h 16m 05s). */
export function formatHoursLeft(deadlineISO: string, nowMs: number): HoursLeft {
  const diff = Math.max(0, new Date(deadlineISO).getTime() - nowMs);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { expired: diff === 0, hh: pad(hours), mm: pad(minutes), ss: pad(seconds) };
}
