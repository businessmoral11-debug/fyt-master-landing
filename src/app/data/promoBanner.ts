
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
export const PROMO_DEAL_LINE = "Limited Time: 40% off + Buy 1 Get 3 Instantly";

/** Full banner copy order: deal first, then benefits. */
export const PROMO_BANNER_ITEMS = [PROMO_DEAL_LINE, ...PROMO_BENEFITS] as const;

/** Promo code shown in the top-banner CODE pill (also used at checkout). */
export const PROMO_CODE = "AWARD40";

/** Alternate welcome offer shown on the pricing card (manual code entry). */
export const ALT_PROMO_LABEL = "For new traders";
export const ALT_PROMO_DEAL = "45% off + BOGO";
export const ALT_PROMO_CODE = "WELCOME45";

/** Kept for pricing-panel badge / coupon references. */
export const PROMO_ITEMS: PromoItem[] = [
  { kind: "code", label: "The NEW FYT Deal", text: "40% off + Buy 1 Get 3", code: PROMO_CODE },
];

/** 7-day AWARD40 offer: ends Wednesday 7 Oct 17:59:59 IST (UTC+5:30). */
export const PROMO_DEADLINE = "2026-10-07T17:59:59+05:30";

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
