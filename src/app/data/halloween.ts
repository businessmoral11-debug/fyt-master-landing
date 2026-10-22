/**
 * Halloween "Haunted Vault" offer (code FYTWEEN).
 * 45% off + BOGO instantly + the trader picks any 2 of 6 treats.
 *
 * Switches itself on and off by date, so nothing needs deploying on the day:
 * it starts the moment the Dashboard Launch Offer (NEWDASH) ends and stops at
 * the end of Halloween night (IST).
 *
 * Preview: add ?halloween=1 to any URL to see it early (or ?halloween=0 to hide it).
 * Vercel preview links show it by default.
 */
import { PROMO_DEADLINE } from "./promoBanner";

export const HALLOWEEN_START = PROMO_DEADLINE;
export const HALLOWEEN_END = "2026-10-31T23:59:59+05:30";
export const HALLOWEEN_CODE = "FYTWEEN";
export const HALLOWEEN_OFF = 0.45;

export type TreatId = "vampire" | "grim" | "midnight" | "zombie" | "cauldron" | "nightmare";

export interface Treat {
  id: TreatId;
  name: string;
  line: string;
  /** 24px stroke icon path. */
  d: string;
}

export const TREATS: Treat[] = [
  { id: "vampire", name: "Vampire's Share", line: "100% payout split", d: "M12 3c3 4 6 7 6 10.5A6 6 0 0 1 6 13.5C6 10 9 7 12 3Z" },
  { id: "midnight", name: "Midnight Rush", line: "First payout in 24 hours", d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5ZM14 8v3l2 1.2" },
  { id: "nightmare", name: "Nightmare Mode", line: "Turn off your daily drawdown", d: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12ZM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" },
  { id: "zombie", name: "Zombie Revival", line: "1 free retry if you fail", d: "M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" },
  { id: "cauldron", name: "Cauldron Cashback", line: "6% back to your FYT Wallet", d: "M4 10h16l-1.5 8a3 3 0 0 1-3 2.5h-7a3 3 0 0 1-3-2.5L4 10ZM3 10h18M9 6c0-1.5 1-2.5 2-2.5M14 6.5c0-1 .8-2 1.8-2" },
  { id: "grim", name: "Grim Points Drop", line: "500 FYT reward points", d: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3Z" },
];

export const TREAT_PICKS = 2;

function previewFlag(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("halloween");
    if (q === "1") return true;
    if (q === "0") return false;
    if (/\.vercel\.app$/i.test(window.location.hostname)) return true;
  } catch {
    // Ignore and fall back to the dates.
  }
  return null;
}

/** True while the Halloween offer is running (or forced on for a preview). */
export function isHalloweenLive(now: number = Date.now()): boolean {
  const forced = previewFlag();
  if (forced !== null) return forced;
  return now >= new Date(HALLOWEEN_START).getTime() && now < new Date(HALLOWEEN_END).getTime();
}

export type HalloweenStage = "open" | "final48" | "tonight";

/** Banner message changes as the end gets closer. */
export function halloweenStage(now: number = Date.now()): HalloweenStage {
  const left = new Date(HALLOWEEN_END).getTime() - now;
  if (left <= 18 * 3600000) return "tonight";
  if (left <= 48 * 3600000) return "final48";
  return "open";
}

export const STAGE_LABEL: Record<HalloweenStage, string> = {
  open: "The Haunted Vault is open",
  final48: "Final 48 hours",
  tonight: "The vault closes tonight",
};

export const HALLOWEEN_DEAL_LINE = "45% off + BOGO Instantly + Pick Any 2 Treats";
export const HALLOWEEN_DEAL_SHORT = "45% off + BOGO + 2 Treats";

/** Checkout link with FYTWEEN and the chosen treats, e.g. &coupon=FYTWEEN&treats=vampire,midnight */
export function withHalloween(baseHref: string, productId: number, treats: TreatId[]): string {
  const extra = `coupon=${HALLOWEEN_CODE}${treats.length ? `&treats=${treats.join(",")}` : ""}`;
  if (baseHref.includes("add-to-cart")) return `${baseHref}&${extra}`;
  return `https://fundingyourtrades.com/checkout-link/?products=${productId}:1&${extra}`;
}
