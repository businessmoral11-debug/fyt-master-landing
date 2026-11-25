/**
 * Black Friday offer (code BLACKFRIDAY).
 * 50% off every account + 1 free account of the same size.
 * Bundles (picked at checkout): the more paid accounts, the bigger the discount and the more free accounts.
 */
export const BF_CODE = "BLACKFRIDAY";

export interface BfTier {
  buy: number;
  off: number; // percent
  get: number; // total accounts received
}

export const BF_TIERS: BfTier[] = [
  { buy: 1, off: 50, get: 2 },
  { buy: 2, off: 51, get: 5 },
  { buy: 3, off: 53, get: 7 },
  { buy: 4, off: 55, get: 10 },
];

export const BF_MAX_OFF = 55;

/** Deals shown on the landing page (pricing table and the block above it). Buy 3 and Buy 4 stay available at checkout. */
export const BF_LANDING_TIERS: BfTier[] = BF_TIERS.slice(0, 2);
