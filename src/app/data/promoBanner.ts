
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
  "200% Refund",
  "Free Drawdown Reset",
  "Daily Reward Processing",
] as const;

/** Deal line shown after benefits on the top banner. */
export const PROMO_DEAL_LINE = "35% off + Buy 1 Get 2 Instantly";

/** Full desktop banner copy order: benefits + deal. */
export const PROMO_BANNER_ITEMS = [...PROMO_BENEFITS, PROMO_DEAL_LINE] as const;

/** Promo code shown in the top-banner CODE pill (also used at checkout). */
export const PROMO_CODE = "FYT35";

/** Alternate welcome offer shown on the pricing card (manual code entry). */
export const ALT_PROMO_LABEL = "For new traders";
export const ALT_PROMO_DEAL = "45% off + BOGO";
export const ALT_PROMO_CODE = "WELCOME45";

/** Kept for pricing-panel badge / coupon references. */
export const PROMO_ITEMS: PromoItem[] = [
  { kind: "code", label: "The NEW FYT Deal", text: "35% off + Buy 1 Get 2", code: PROMO_CODE },
];

/** Offer ends Wednesday 30 Sep 07:59:59 (UTC+6) — extended 2h from the prior deadline of Wed 30 Sep 05:59:59 (UTC+6). */
export const PROMO_DEADLINE = "2026-09-30T07:59:59+06:00";

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
