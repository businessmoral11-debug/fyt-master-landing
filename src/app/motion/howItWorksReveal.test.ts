import { describe, it, expect } from "vitest";
import {
  HOW_IT_WORKS_SCROLL_HEIGHT_VH,
  HOW_IT_WORKS_STEP_REVEALS,
  HOW_IT_WORKS_LINE_REVEAL,
  HOW_IT_WORKS_RING_BORDER_ALPHA,
  HOW_IT_WORKS_RING_GLOW_ALPHA,
  HOW_IT_WORKS_DOT_BG_ALPHA,
  HOW_IT_WORKS_DOT_GLOW_ALPHA,
  HOW_IT_WORKS_NUMBER_ALPHA,
} from "./howItWorksReveal";

describe("HOW_IT_WORKS_SCROLL_HEIGHT_VH", () => {
  it("is long enough (in viewport-heights) to host a dwell, 4 sequential step reveals, and a hold", () => {
    expect(HOW_IT_WORKS_SCROLL_HEIGHT_VH).toBeGreaterThan(100);
  });
});

describe("HOW_IT_WORKS_STEP_REVEALS", () => {
  it("has one entry per HOW_IT_WORKS_STEPS step (4)", () => {
    expect(HOW_IT_WORKS_STEP_REVEALS).toHaveLength(4);
  });

  it("keeps every fade window inside 0-1 with a positive duration", () => {
    for (const r of HOW_IT_WORKS_STEP_REVEALS) {
      expect(r.fadeStart).toBeGreaterThanOrEqual(0);
      expect(r.fadeEnd).toBeLessThanOrEqual(1);
      expect(r.fadeEnd).toBeGreaterThan(r.fadeStart);
    }
  });

  it("leaves a dwell before the first step starts, so the section reads as fully dim on arrival", () => {
    expect(HOW_IT_WORKS_STEP_REVEALS[0].fadeStart).toBeGreaterThan(0.05);
  });

  it("stages the steps sequentially — each one fully finishes before the next starts (non-overlapping, for a jumpy feel)", () => {
    for (let i = 1; i < HOW_IT_WORKS_STEP_REVEALS.length; i++) {
      const prev = HOW_IT_WORKS_STEP_REVEALS[i - 1];
      const cur = HOW_IT_WORKS_STEP_REVEALS[i];
      expect(cur.fadeStart).toBeGreaterThanOrEqual(prev.fadeEnd);
    }
  });

  it("leaves a hold at full brightness before the section releases (last step finishes by scrollYProgress 0.85)", () => {
    const last = HOW_IT_WORKS_STEP_REVEALS[HOW_IT_WORKS_STEP_REVEALS.length - 1];
    expect(last.fadeEnd).toBeLessThanOrEqual(0.85);
  });
});

describe("HOW_IT_WORKS_LINE_REVEAL", () => {
  it("spans from the first step's activation to the last step's completion, so the line's leading edge tracks the steps lighting up", () => {
    expect(HOW_IT_WORKS_LINE_REVEAL.fadeStart).toBe(HOW_IT_WORKS_STEP_REVEALS[0].fadeStart);
    expect(HOW_IT_WORKS_LINE_REVEAL.fadeEnd).toBe(HOW_IT_WORKS_STEP_REVEALS[HOW_IT_WORKS_STEP_REVEALS.length - 1].fadeEnd);
  });
});

describe("dim/peak alpha targets", () => {
  it("dims well below the previous round's moderate-dim treatment (ring/dot/number under 0.15 alpha at rest)", () => {
    expect(HOW_IT_WORKS_RING_BORDER_ALPHA.dim).toBeLessThan(0.15);
    expect(HOW_IT_WORKS_DOT_BG_ALPHA.dim).toBeLessThan(0.15);
    expect(HOW_IT_WORKS_NUMBER_ALPHA.dim).toBeLessThan(0.15);
  });

  it("boosts peak glow beyond the pre-existing static glow values (ring 0.55, dot 0.7)", () => {
    expect(HOW_IT_WORKS_RING_GLOW_ALPHA.peak).toBeGreaterThan(0.55);
    expect(HOW_IT_WORKS_DOT_GLOW_ALPHA.peak).toBeGreaterThan(0.7);
  });

  it("every dim/peak pair is a valid ascending alpha range within 0-1", () => {
    const pairs = [HOW_IT_WORKS_RING_BORDER_ALPHA, HOW_IT_WORKS_RING_GLOW_ALPHA, HOW_IT_WORKS_DOT_BG_ALPHA, HOW_IT_WORKS_DOT_GLOW_ALPHA, HOW_IT_WORKS_NUMBER_ALPHA];
    for (const pair of pairs) {
      expect(pair.dim).toBeGreaterThanOrEqual(0);
      expect(pair.peak).toBeLessThanOrEqual(1);
      expect(pair.peak).toBeGreaterThan(pair.dim);
    }
  });
});
