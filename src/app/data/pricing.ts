
export type StepId = "1-Step" | "2-Step" | "Instant";
export type PlanId = "classic" | "prime" | "plus";
export type PlatformId = "match-trader" | "platform-5";

export interface PricingEntry {
  productId: number;
  priceOld: number;
  priceNew: number;
  share?: string;
  p1?: string;
  p2?: string;
  profit?: string;
  maxDaily: string;
  maxOverall: string;
  split: string;
  time: string;
  minDays: string;
  payout?: string;
}

export interface PlanOption {
  id: PlanId;
  label: string;
}

type Rules = Omit<PricingEntry, "productId" | "priceOld" | "priceNew">;

interface Row {
  size: number;
  mt: [number, number, number];
  p5: [number, number, number];
  split?: string;
}

type PlatformTable = Record<PlatformId, Record<number, PricingEntry>>;

/** Display sale price: 50% off the list price (BLACKFRIDAY). */
export const SALE_DISCOUNT_FRACTION = 0.5;

/** Black Friday list-price rise, added on top of the base prices in the rows below. */
export function priceBump(size: number): number {
  if (size <= 5000) return 10; // +7, +5, then -2
  if (size <= 10000) return 14; // +7, then +7 more
  if (size <= 25000) return 20; // +10, then +10 more
  if (size <= 50000) return 15; // +10, +10, then -5 (27 Nov)
  return 10; // 100K: +10, +10, then -10 (27 Nov). 200K: +15, +10, -5, then -10 (27 Nov)
}

export function salePrice(priceOld: number): number {
  return Math.round(priceOld * (1 - SALE_DISCOUNT_FRACTION) * 100) / 100;
}

function build(rules: Rules, rows: Row[]): PlatformTable {
  const out: PlatformTable = { "match-trader": {}, "platform-5": {} };
  for (const r of rows) {
    const split = r.split ?? rules.split;
    const mt = r.mt[0] + priceBump(r.size);
    const p5 = r.p5[0] + priceBump(r.size);
    out["match-trader"][r.size] = { ...rules, split, priceOld: mt, priceNew: salePrice(mt), productId: r.mt[2] };
    out["platform-5"][r.size] = { ...rules, split, priceOld: p5, priceNew: salePrice(p5), productId: r.p5[2] };
  }
  return out;
}

const RULES_1STEP: Rules = { share: "18%", p1: "10%", p2: "N/A", maxDaily: "4%", maxOverall: "6%", split: "Up to 100%", time: "None", minDays: "None" };
const RULES_2STEP: Rules = { share: "18%", p1: "10%", p2: "6%", maxDaily: "6%", maxOverall: "10%", split: "Up to 100%", time: "None", minDays: "None" };
const RULES_INSTANT_PLUS: Rules = { profit: "N/A", maxDaily: "N/A", maxOverall: "4%", split: "Up to 90%", time: "None", minDays: "10", payout: "Bi-weekly" };
const RULES_INSTANT_PRIME: Rules = { profit: "4%", maxDaily: "3%", maxOverall: "6%", split: "Up to 90%", time: "None", minDays: "5", payout: "Bi-weekly" };

export const PRICING_DATA: Record<StepId, Partial<Record<PlanId, PlatformTable>>> = {
  "1-Step": {
    classic: build(RULES_1STEP, [
      { size: 5000, mt: [54, 40.2, 1216], p5: [60, 43.8, 12383] }, // list 64 / 70 (BF 32 / 35)
      { size: 10000, mt: [114, 68.4, 1217], p5: [124, 74.4, 12379] },
      { size: 25000, mt: [219, 131.4, 1218], p5: [229, 137.4, 12381] },
      { size: 50000, mt: [309, 185.4, 1219], p5: [319, 191.4, 12382] },
      { size: 100000, mt: [482.5, 303, 1220], p5: [487.5, 309, 12378] }, // list 492.50 / 497.50 = 197 / 199 at 60% (27 Nov)
      { size: 200000, mt: [902, 545.4, 1221], p5: [912, 551.4, 12380] }, // -7 (27 Nov evening)
    ]),
    prime: build(RULES_1STEP, [
      { size: 5000, mt: [54, 40.2, 21272], p5: [64, 46.2, 21273] }, // list 64 / 74 (BF 32 / 37)
      { size: 10000, mt: [114, 68.4, 21264], p5: [124, 74.4, 21265] },
      { size: 25000, mt: [219, 131.4, 21268], p5: [229, 137.4, 21269] },
      { size: 50000, mt: [309, 185.4, 21270], p5: [319, 191.4, 21271] },
      { size: 100000, mt: [482.5, 303, 21262], p5: [487.5, 309, 21263] }, // list 492.50 / 497.50 = 197 / 199 at 60% (27 Nov)
      { size: 200000, mt: [902, 545.4, 21266], p5: [912, 551.4, 21267] }, // -7 (27 Nov evening)
    ]),
  },
  "2-Step": {
    classic: build(RULES_2STEP, [
      { size: 5000, mt: [34.1, 24, 1235], p5: [43, 25.8, 12371], split: "95/5" }, // MT list 44.10 (BF 22.05, crypto 20.95)
      { size: 10000, mt: [95, 57, 1234], p5: [105, 63, 12367], split: "95/5" },
      { size: 25000, mt: [199, 119.4, 1233], p5: [209, 125.4, 12369] },
      { size: 50000, mt: [279, 167.4, 1232], p5: [289, 173.4, 12370] },
      { size: 100000, mt: [459, 275.4, 1231], p5: [469, 281.4, 12366] },
      { size: 200000, mt: [802, 485.4, 1230], p5: [812, 491.4, 12368] }, // -7 (27 Nov evening)
    ]),
    prime: build(RULES_2STEP, [
      { size: 5000, mt: [34.1, 24, 20981], p5: [43, 25.8, 20975], split: "95/5" }, // MT list 44.10 (BF 22.05, crypto 20.95)
      { size: 10000, mt: [95, 52.25, 20980], p5: [105, 57.75, 20974], split: "95/5" },
      { size: 25000, mt: [199, 109.45, 20979], p5: [209, 114.95, 20973] },
      { size: 50000, mt: [279, 153.45, 20978], p5: [289, 158.95, 20972] },
      { size: 100000, mt: [459, 252.45, 20977], p5: [469, 257.95, 20971] },
      { size: 200000, mt: [802, 444.95, 20976], p5: [812, 450.45, 20970] }, // -7 (27 Nov evening)
    ]),
  },
  "Instant": {
    // List prices from live PRODUCTS_CONFIG; sale = 40% off (NEWDASH)
    plus: build(RULES_INSTANT_PLUS, [
      { size: 5000, mt: [109, 59.95, 20619], p5: [119, 65.45, 20620] },
      { size: 10000, mt: [209, 114.95, 20613], p5: [219, 120.45, 20614] },
      { size: 25000, mt: [239, 131.45, 20615], p5: [249, 136.95, 20616] },
      { size: 50000, mt: [469, 257.95, 20617], p5: [479, 263.45, 20618] },
      { size: 100000, mt: [902.5, 516.45, 20621], p5: [902.5, 521.95, 20622] }, // list 912.50 = 365 at 60% (27 Nov)
    ]),
    // fyt-pro INSTANT (Prime) — product IDs from live PRODUCTS_CONFIG; sale = 40% off
    prime: build(RULES_INSTANT_PRIME, [
      { size: 5000, mt: [128, 70.95, 22214], p5: [128, 70.95, 22209] }, // -1 so the Black Friday price reads 69
      { size: 10000, mt: [239, 131.45, 22213], p5: [239, 131.45, 22206] },
      { size: 25000, mt: [309, 169.95, 22212], p5: [309, 169.95, 22207] },
      { size: 50000, mt: [599, 329.45, 22211], p5: [599, 329.45, 22208] },
      { size: 100000, mt: [987.5, 554.95, 22210], p5: [987.5, 554.95, 22205] }, // list 997.50 = 399 at 60% (27 Nov)
    ]),
  },
};

export const STEP_PLANS: Record<StepId, PlanOption[]> = {
  "1-Step": [{ id: "classic", label: "Classic" }, { id: "prime", label: "Prime" }],
  "2-Step": [{ id: "classic", label: "Classic" }, { id: "prime", label: "Prime" }],
  "Instant": [{ id: "plus", label: "Plus" }, { id: "prime", label: "Prime" }],
};

export interface PlatformOption {
  id: PlatformId;
  label: string;
}

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: "match-trader", label: "MatchTrader" },
  { id: "platform-5", label: "Platform 5" },
];

export const STEP_SIZES: Record<StepId, number[]> = {
  "1-Step": [5000, 10000, 25000, 50000, 100000, 200000],
  "2-Step": [5000, 10000, 25000, 50000, 100000, 200000],
  "Instant": [5000, 10000, 25000, 50000, 100000],
};

export const STEP_LABELS: Record<StepId, string> = {
  "1-Step": "One-Step",
  "2-Step": "Two-Step",
  "Instant": "Instant",
};

export function refundLine(plan: PlanId): string {
  return plan === "classic"
    ? "Fee 100% refundable after your second reward."
    : "Fee 100% refundable after your first reward.";
}

export function planFlag(plan: PlanId): string | undefined {
  return plan === "prime" ? "No Consistency" : undefined;
}

export function getEntry(step: StepId, plan: PlanId, platform: PlatformId, size: number): PricingEntry | undefined {
  return PRICING_DATA[step]?.[plan]?.[platform]?.[size];
}

// WooCommerce shareable checkout-link applies the coupon reliably for challenge SKUs.
// Instant Prime SKUs use plain add-to-cart (checkout-link is unreliable for those products).
const CHECKOUT_LINK_BASE = "https://fundingyourtrades.com/checkout-link/?products=";
const CHECKOUT_ADD_TO_CART_BASE = "https://fundingyourtrades.com/checkout/?add-to-cart=";
export const CHECKOUT_COUPON_CODE = "BLACKFRIDAY";

const INSTANT_PRIME_PRODUCT_IDS = new Set<number>([
  22214, 22213, 22212, 22211, 22210,
  22209, 22206, 22207, 22208, 22205,
]);

export function checkoutUrl(productId: number): string {
  if (INSTANT_PRIME_PRODUCT_IDS.has(productId)) {
    return `${CHECKOUT_ADD_TO_CART_BASE}${productId}`;
  }
  return `${CHECKOUT_LINK_BASE}${productId}:1&coupon=${CHECKOUT_COUPON_CODE}`;
}

export function fmtSize(n: number): string {
  return `$${n / 1000}K`;
}
