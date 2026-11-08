/** Special Diwali gift by FYT: every paid order inside this window gets a surprise gift box (30 hours). */
export const GIFT_START = "2026-11-08T12:00:00+05:30";
export const GIFT_END = "2026-11-09T18:00:00+05:30";

/** Preview links (.vercel.app) always show the strip so it can be checked before 12:00 PM. */
export function giftPreview(): boolean {
  try {
    return typeof window !== "undefined" && (window.location.hostname.endsWith(".vercel.app") || new URLSearchParams(window.location.search).get("gift") === "1");
  } catch {
    return false;
  }
}

export function isGiftLive(now: number = Date.now()): boolean {
  if (giftPreview() && now < new Date(GIFT_END).getTime()) return true;
  return now >= new Date(GIFT_START).getTime() && now < new Date(GIFT_END).getTime();
}
