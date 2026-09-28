import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, p), "utf8");

describe("Hero CTA anchor targets", () => {
  it("has a #challenge anchor target for the primary CTA", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('id="challenge"');
  });

  it("has a #how-it-works anchor target for the secondary CTA", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('id="how-it-works"');
  });

  it("has a #live-payouts anchor target for the footer's Payout ledger link", () => {
    const app = read("./BelowFold.tsx");
    expect(app).toContain('id="live-payouts"');
  });
});
