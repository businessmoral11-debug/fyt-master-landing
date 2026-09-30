import { describe, it, expect } from "vitest";
import { formatCountdown, formatHoursLeft, PROMO_ITEMS, PROMO_BENEFITS, PROMO_BANNER_ITEMS, PROMO_CODE, PROMO_DEAL_LINE, PROMO_DEADLINE } from "./promoBanner";

describe("PROMO_BENEFITS", () => {
  it("lists the top-banner benefit lines", () => {
    expect(PROMO_BENEFITS).toEqual([
      "First Reward on Demand",
      "Free Drawdown Reset",
    ]);
  });
});

describe("PROMO_DEAL_LINE", () => {
  it("includes the Instantly deal copy shown on the banner", () => {
    expect(PROMO_DEAL_LINE).toBe("Limited Time: 40% off + Buy 1 Get 3 Instantly");
  });
});

describe("PROMO_BANNER_ITEMS", () => {
  it("puts the deal first, then the benefits", () => {
    expect(PROMO_BANNER_ITEMS).toEqual([
      "Limited Time: 40% off + Buy 1 Get 3 Instantly",
      "First Reward on Demand",
      "Free Drawdown Reset",
    ]);
  });
});

describe("PROMO_CODE", () => {
  it("exposes the banner/checkout coupon code", () => {
    expect(PROMO_CODE).toBe("AWARD40");
  });
});

describe("formatHoursLeft", () => {
  it("folds days into hours (51h before deadline shows 51:00:00)", () => {
    const deadlineMs = new Date(PROMO_DEADLINE).getTime();
    expect(formatHoursLeft(PROMO_DEADLINE, deadlineMs - 51 * 3600000)).toEqual({ expired: false, hh: "51", mm: "00", ss: "00" });
  });

  it("zero-pads and reports expired at/after the deadline", () => {
    const deadlineMs = new Date(PROMO_DEADLINE).getTime();
    expect(formatHoursLeft(PROMO_DEADLINE, deadlineMs - (3 * 3600000 + 7 * 60000 + 9000))).toEqual({ expired: false, hh: "03", mm: "07", ss: "09" });
    expect(formatHoursLeft(PROMO_DEADLINE, deadlineMs)).toEqual({ expired: true, hh: "00", mm: "00", ss: "00" });
    expect(formatHoursLeft(PROMO_DEADLINE, deadlineMs + 5000)).toEqual({ expired: true, hh: "00", mm: "00", ss: "00" });
  });
});

describe("ALT_PROMO", () => {
  it("exposes the highlighted new-trader welcome offer on the pricing card", async () => {
    const { ALT_PROMO_LABEL, ALT_PROMO_DEAL, ALT_PROMO_CODE } = await import("./promoBanner");
    expect(ALT_PROMO_LABEL).toBe("For new traders");
    expect(ALT_PROMO_DEAL).toBe("45% off + BOGO");
    expect(ALT_PROMO_CODE).toBe("WELCOME45");
  });
});

describe("PROMO_ITEMS", () => {
  it("keeps the current deal badge/coupon copy at 40% off + Buy 1 Get 3", () => {
    expect(PROMO_ITEMS).toHaveLength(1);
    expect(PROMO_ITEMS[0]).toEqual({ kind: "code", label: "The NEW FYT Deal", text: "40% off + Buy 1 Get 3", code: "AWARD40" });
  });
});

describe("formatCountdown", () => {
  it("returns zeroed values at exactly the deadline", () => {
    const deadlineMs = new Date(PROMO_DEADLINE).getTime();
    expect(formatCountdown(PROMO_DEADLINE, deadlineMs)).toEqual({ days: 0, hh: "00", mm: "00", ss: "00" });
  });

  it("clamps to zero after the deadline has passed (never goes negative)", () => {
    const deadlineMs = new Date(PROMO_DEADLINE).getTime();
    expect(formatCountdown(PROMO_DEADLINE, deadlineMs + 999999)).toEqual({ days: 0, hh: "00", mm: "00", ss: "00" });
  });

  it("computes day rollover correctly (25 hours before deadline = 1 day + 1 hour)", () => {
    const deadlineMs = new Date(PROMO_DEADLINE).getTime();
    const nowMs = deadlineMs - 25 * 60 * 60 * 1000;
    expect(formatCountdown(PROMO_DEADLINE, nowMs)).toEqual({ days: 1, hh: "01", mm: "00", ss: "00" });
  });

  it("zero-pads single-digit hours/minutes/seconds", () => {
    const deadlineMs = new Date(PROMO_DEADLINE).getTime();
    const nowMs = deadlineMs - (5 * 3600000 + 5 * 60000 + 5000);
    expect(formatCountdown(PROMO_DEADLINE, nowMs)).toEqual({ days: 0, hh: "05", mm: "05", ss: "05" });
  });
});
