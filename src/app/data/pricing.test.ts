import { describe, it, expect } from "vitest";
import {
  PRICING_DATA,
  STEP_PLANS,
  STEP_SIZES,
  getEntry,
  checkoutUrl,
  fmtSize,
  STEP_LABELS,
  refundLine,
  planFlag,
  PLATFORM_OPTIONS,
  type StepId,
  type PlatformId,
} from "./pricing";

const STEPS: StepId[] = ["1-Step", "2-Step", "Instant"];
const PLATFORMS: PlatformId[] = ["match-trader", "platform-5"];

describe("STEP_SIZES / STEP_PLANS", () => {
  it("uses the correct step-dependent sizes", () => {
    expect(STEP_SIZES["1-Step"]).toEqual([10000, 25000, 50000, 100000, 200000]);
    expect(STEP_SIZES["2-Step"]).toEqual([10000, 25000, 50000, 100000, 200000]);
    expect(STEP_SIZES["Instant"]).toEqual([5000, 10000, 25000, 50000, 100000]);
  });

  it("uses the correct step-dependent plan labels", () => {
    expect(STEP_PLANS["1-Step"].map((p) => p.label)).toEqual(["Classic", "Prime"]);
    expect(STEP_PLANS["2-Step"].map((p) => p.label)).toEqual(["Classic", "Prime"]);
    expect(STEP_PLANS["Instant"].map((p) => p.label)).toEqual(["Plus", "Prime"]);
  });
});

describe("PLATFORM_OPTIONS", () => {
  it("lists match-trader before platform-5, with display labels MatchTrader / Platform 5", () => {
    expect(PLATFORM_OPTIONS.map((p) => p.id)).toEqual(["match-trader", "platform-5"]);
    expect(PLATFORM_OPTIONS.map((p) => p.label)).toEqual(["MatchTrader", "Platform 5"]);
  });
});

describe("every declared combination resolves to a complete entry", () => {
  for (const step of STEPS) {
    for (const plan of STEP_PLANS[step]) {
      for (const platform of PLATFORMS) {
        for (const size of STEP_SIZES[step]) {
          it(`${step}/${plan.id}/${platform}/${size}`, () => {
            const e = getEntry(step, plan.id, platform, size);
            expect(e, "entry exists").toBeDefined();
            if (!e) return;
            expect(Number.isInteger(e.productId) && e.productId > 0).toBe(true);
            expect(e.priceOld).toBeGreaterThan(0);
            expect(e.priceNew).toBeGreaterThan(0);
            expect(e.priceOld).toBeGreaterThanOrEqual(e.priceNew);
            for (const f of ["maxDaily", "maxOverall", "split", "time", "minDays"] as const) {
              expect(e[f], f).toBeTruthy();
            }
            if (step === "Instant") {
              expect(e.profit, "profit").toBeTruthy();
              expect(e.payout, "payout").toBeTruthy();
            } else {
              expect(e.share).toBe("18%");
              expect(e.p1, "p1").toBeTruthy();
              expect(e.p2, "p2").toBeTruthy();
            }
          });
        }
      }
    }
  }
});

describe("product IDs are globally unique", () => {
  it("no ID repeats across the whole matrix", () => {
    const ids: number[] = [];
    for (const step of STEPS)
      for (const plan of STEP_PLANS[step])
        for (const platform of PLATFORMS)
          for (const size of STEP_SIZES[step])
            ids.push(getEntry(step, plan.id, platform, size)!.productId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("mirror-live equivalence (identical stats/price, different ID)", () => {
  it("2-Step Classic vs Prime match-trader $100K", () => {
    const c = getEntry("2-Step", "classic", "match-trader", 100000)!;
    const p = getEntry("2-Step", "prime", "match-trader", 100000)!;
    expect([c.p1, c.p2, c.maxDaily, c.maxOverall, c.split, c.priceOld, c.priceNew])
      .toEqual([p.p1, p.p2, p.maxDaily, p.maxOverall, p.split, p.priceOld, p.priceNew]);
    expect(c.productId).not.toBe(p.productId);
  });
  it("1-Step Classic vs Prime match-trader $10K", () => {
    const c = getEntry("1-Step", "classic", "match-trader", 10000)!;
    const p = getEntry("1-Step", "prime", "match-trader", 10000)!;
    expect([c.p1, c.maxDaily, c.maxOverall, c.priceOld, c.priceNew])
      .toEqual([p.p1, p.maxDaily, p.maxOverall, p.priceOld, p.priceNew]);
    expect(c.productId).not.toBe(p.productId);
  });
});

describe("known product IDs and prices (spot checks against live config)", () => {
  it("2-Step Classic match-trader $100K → 1231 @ 459 with 40% off", () => {
    const e = getEntry("2-Step", "classic", "match-trader", 100000)!;
    expect(e.productId).toBe(1231);
    expect(e.priceOld).toBe(459);
    expect(e.priceNew).toBe(275.4);
  });
  it("1-Step Classic match-trader $10K → 1217 @ 114 with 40% off", () => {
    const e = getEntry("1-Step", "classic", "match-trader", 10000)!;
    expect(e.productId).toBe(1217);
    expect(e.priceOld).toBe(114);
    expect(e.priceNew).toBe(68.4);
  });
  it("1-Step Prime platform-5 $100K → 21263", () => {
    expect(getEntry("1-Step", "prime", "platform-5", 100000)!.productId).toBe(21263);
  });
  it("Instant Plus match-trader $5K → 20619 @ 109 with 40% off", () => {
    const e = getEntry("Instant", "plus", "match-trader", 5000)!;
    expect(e.productId).toBe(20619);
    expect(e.priceOld).toBe(109);
    expect(e.priceNew).toBe(65.4);
  });
  it("Instant Plus platform-5 sizes use list prices with 40% off", () => {
    expect(getEntry("Instant", "plus", "platform-5", 5000)).toMatchObject({ productId: 20620, priceOld: 119, priceNew: 71.4 });
    expect(getEntry("Instant", "plus", "platform-5", 10000)).toMatchObject({ productId: 20614, priceOld: 219, priceNew: 131.4 });
    expect(getEntry("Instant", "plus", "platform-5", 25000)).toMatchObject({ productId: 20616, priceOld: 249, priceNew: 149.4 });
    expect(getEntry("Instant", "plus", "platform-5", 50000)).toMatchObject({ productId: 20618, priceOld: 479, priceNew: 287.4 });
    expect(getEntry("Instant", "plus", "platform-5", 100000)).toMatchObject({ productId: 20622, priceOld: 949, priceNew: 569.4 });
  });
  it("Instant Prime match-trader $100K → 22210 @ 1009/605.4", () => {
    const e = getEntry("Instant", "prime", "match-trader", 100000)!;
    expect(e.productId).toBe(22210);
    expect(e.priceOld).toBe(1009);
    expect(e.priceNew).toBe(605.4);
  });
  it("Instant Prime platform-5 $100K → 22205 @ 1009/605.4", () => {
    const p5 = getEntry("Instant", "prime", "platform-5", 100000)!;
    expect(p5.productId).toBe(22205);
    expect(p5.priceOld).toBe(1009);
    expect(p5.priceNew).toBe(605.4);
  });
  it("Instant Prime match-trader sizes use 40% off list prices", () => {
    expect(getEntry("Instant", "prime", "match-trader", 5000)).toMatchObject({ productId: 22214, priceOld: 129, priceNew: 77.4 });
    expect(getEntry("Instant", "prime", "match-trader", 10000)).toMatchObject({ productId: 22213, priceOld: 239, priceNew: 143.4 });
    expect(getEntry("Instant", "prime", "match-trader", 25000)).toMatchObject({ productId: 22212, priceOld: 309, priceNew: 185.4 });
    expect(getEntry("Instant", "prime", "match-trader", 50000)).toMatchObject({ productId: 22211, priceOld: 599, priceNew: 359.4 });
    expect(getEntry("Instant", "prime", "match-trader", 100000)).toMatchObject({ productId: 22210, priceOld: 1009, priceNew: 605.4 });
  });
  it("Instant Prime uses plain add-to-cart checkout URLs", () => {
    expect(checkoutUrl(22214)).toBe("https://fundingyourtrades.com/checkout/?add-to-cart=22214");
    expect(checkoutUrl(22205)).toBe("https://fundingyourtrades.com/checkout/?add-to-cart=22205");
  });
  it("2-Step $10K split is 95/5", () => {
    expect(getEntry("2-Step", "classic", "match-trader", 10000)!.split).toBe("95/5");
  });
  it("same step/plan/size resolves to a different productId per platform (checkout link must change when platform changes)", () => {
    const mt = getEntry("1-Step", "classic", "match-trader", 50000)!;
    const p5 = getEntry("1-Step", "classic", "platform-5", 50000)!;
    expect(mt.productId).not.toBe(p5.productId);
    expect(checkoutUrl(mt.productId)).not.toBe(checkoutUrl(p5.productId));
  });
});

describe("helpers", () => {
  it("checkoutUrl uses WooCommerce checkout-link so AWARD40 applies (not auto summer40)", () => {
    expect(checkoutUrl(1231)).toBe(
      "https://fundingyourtrades.com/checkout-link/?products=1231:1&coupon=AWARD40"
    );
  });

  it("fmtSize formats thousands as $NK", () => {
    expect(fmtSize(5000)).toBe("$5K");
    expect(fmtSize(200000)).toBe("$200K");
  });
});

describe("STEP_LABELS", () => {
  it("maps step ids to spec display labels", () => {
    expect(STEP_LABELS["1-Step"]).toBe("One-Step");
    expect(STEP_LABELS["2-Step"]).toBe("Two-Step");
    expect(STEP_LABELS["Instant"]).toBe("Instant");
  });
});

describe("refundLine", () => {
  it("uses second reward for classic", () => {
    expect(refundLine("classic")).toBe("Fee 100% refundable after your second reward.");
  });
  it("uses first reward for prime and plus", () => {
    expect(refundLine("prime")).toBe("Fee 100% refundable after your first reward.");
    expect(refundLine("plus")).toBe("Fee 100% refundable after your first reward.");
  });
});

describe("planFlag", () => {
  it("flags prime as having no consistency rule", () => {
    expect(planFlag("prime")).toBe("No Consistency");
  });
  it("returns undefined for classic and plus", () => {
    expect(planFlag("classic")).toBeUndefined();
    expect(planFlag("plus")).toBeUndefined();
  });
});

describe("Instant Plus has no daily loss limit", () => {
  it("maxDaily is N/A for every Instant Plus row", () => {
    for (const platform of PLATFORMS) {
      for (const size of STEP_SIZES["Instant"]) {
        const e = getEntry("Instant", "plus", platform, size)!;
        expect(e.maxDaily).toBe("N/A");
      }
    }
  });
});
