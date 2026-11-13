/**
 * Diwali Special offer (code DIWALI45).
 * 45% off on every size. 25K and above: Buy 1 Get 3 (2 free bonus accounts).
 * 5K and 10K: Buy 1 Get 2 (1 free bonus account).
 *
 * Switches itself on when Halloween ends and off at 12:15 PM IST on 15 Nov, so nothing needs deploying.
 * Preview: add ?diwali=1 to any URL to see it early (or ?diwali=0 to hide it).
 * Vercel preview links show it by default.
 */
export const DIWALI_START = "2026-11-05T10:00:00+05:30"; // the moment Halloween ends (HALLOWEEN_END is 9:59:59)
export const DIWALI_END = "2026-11-15T12:15:00+05:30"; // front end shows 48 hours from 13 Nov 12:15 PM IST (backend coupon runs to 16 Nov)
export const DIWALI_CODE = "DIWALI45";
export const DIWALI_OFF = 0.45;
export const DIWALI_DEAL_LINE = "45% off + Buy 1 Get 3 Instantly";
export const DIWALI_DEAL_SHORT = "45% off + Buy 1 Get 3";

/** Bonus accounts (free, same size) by account size. */
export function diwaliBonus(size: number): number {
  return size >= 25000 ? 2 : 1;
}

function previewFlag(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("diwali");
    if (q === "1") return true;
    if (q === "0") return false;
    if (/\.vercel\.app$/i.test(window.location.hostname)) return true;
  } catch {
    // Ignore and fall back to the dates.
  }
  return null;
}

/** True while the Diwali offer is running (or forced on for a preview). */
export function isDiwaliLive(now: number = Date.now()): boolean {
  const forced = previewFlag();
  if (forced !== null) return forced;
  return now >= new Date(DIWALI_START).getTime() && now < new Date(DIWALI_END).getTime();
}
