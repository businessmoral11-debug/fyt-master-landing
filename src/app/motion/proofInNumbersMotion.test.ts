import { describe, it, expect } from "vitest";
import {
  PROOF_SIDE_SLIDE_X,
  proofLeftReveal,
  proofRightReveal,
  proofRevealItem,
  proofHeadlineContainer,
  proofHeadlineLine,
  proofButtonReveal,
  PROOF_CARD_STAGGER,
  proofCardReveal,
  PROOF_FLOAT_DURATION_S,
  PROOF_CARD_FLOAT_AMPLITUDE_PX,
  PROOF_CARD_FLOAT_DURATION_S,
  PROOF_AMBIENT_GLOW_DURATION_S,
  PROOF_AMBIENT_GLOW_OPACITY,
  proofCardHover,
  PROOF_CARD_BREATHE_DURATION_S,
  PROOF_SHIMMER_CYCLE_S,
  PROOF_SHIMMER_DELAY_S,
  PROOF_BUTTON_SWEEP_DURATION_S,
  PROOF_BUTTON_SWEEP_CYCLE_S,
  PROOF_BUTTON_SWEEP_REPEAT_DELAY_S,
  PROOF_DATA_LINES,
  PROOF_ICON_MOTION,
  PROOF_CONNECTION_LINE_DELAY_S,
  PROOF_CONNECTION_LINE_DURATION_S,
  PROOF_CONNECTION_LINE_OPACITY,
  PROOF_CONNECTION_LINE_TRAVEL_DELAY_S,
  PROOF_SPOTLIGHT_OPACITY,
} from "./proofInNumbersMotion";

describe("proofInNumbersMotion timing bounds", () => {
  it("right block (stat cards) slides in from PROOF_SIDE_SLIDE_X", () => {
    expect((proofRightReveal.hidden as { x?: number }).x).toBe(PROOF_SIDE_SLIDE_X);
    expect((proofRightReveal.show as { x?: number }).x).toBe(0);
  });

  it("left block (heading/paragraph) has no opacity/x of its own -- its heading and paragraph render statically -- but still orchestrates the badge/button stagger", () => {
    expect(proofLeftReveal.hidden).toEqual({});
    expect((proofLeftReveal.hidden as { x?: number; opacity?: number }).x).toBeUndefined();
    expect((proofLeftReveal.hidden as { x?: number; opacity?: number }).opacity).toBeUndefined();
    const show = proofLeftReveal.show as { x?: number; opacity?: number; transition?: { staggerChildren?: number; delayChildren?: number } };
    expect(show.x).toBeUndefined();
    expect(show.opacity).toBeUndefined();
    expect(show.transition?.staggerChildren).toBe(0.12);
    expect(show.transition?.delayChildren).toBe(0.1);
  });

  it("card stagger is 80ms, applied via the right block's own staggerChildren", () => {
    expect(PROOF_CARD_STAGGER).toBe(0.08);
    const show = proofRightReveal.show as { transition?: { staggerChildren?: number } };
    expect(show.transition?.staggerChildren).toBe(PROOF_CARD_STAGGER);
  });

  it("card reveal has the requested y/scale/opacity shape", () => {
    expect(proofCardReveal.hidden).toMatchObject({ opacity: 0, y: 20, scale: 0.96 });
    expect(proofCardReveal.show).toMatchObject({ opacity: 1, y: 0, scale: 1 });
  });

  it("button reveal fades up with a slight scale, distinct from the plain badge/paragraph fade", () => {
    expect(proofButtonReveal.hidden).toMatchObject({ opacity: 0, scale: 0.96 });
    expect(proofButtonReveal.show).toMatchObject({ opacity: 1, scale: 1 });
    expect(proofRevealItem.hidden).not.toHaveProperty("scale");
  });

  it("heading reveals line-by-line via a nested stagger container", () => {
    expect(proofHeadlineContainer.hidden).toEqual({});
    const show = proofHeadlineContainer.show as { transition?: { staggerChildren?: number } };
    expect(show.transition?.staggerChildren).toBeGreaterThan(0);
    expect(proofHeadlineLine.hidden).toMatchObject({ opacity: 0 });
  });

  it("panel float duration is within the requested 14-18s window", () => {
    expect(PROOF_FLOAT_DURATION_S).toBeGreaterThanOrEqual(14);
    expect(PROOF_FLOAT_DURATION_S).toBeLessThanOrEqual(18);
  });

  it("per-card float amplitude/duration are within the requested 2-3px / 10-12s windows", () => {
    expect(PROOF_CARD_FLOAT_AMPLITUDE_PX).toBeGreaterThanOrEqual(2);
    expect(PROOF_CARD_FLOAT_AMPLITUDE_PX).toBeLessThanOrEqual(3);
    expect(PROOF_CARD_FLOAT_DURATION_S).toBeGreaterThanOrEqual(10);
    expect(PROOF_CARD_FLOAT_DURATION_S).toBeLessThanOrEqual(12);
  });

  it("card hover lifts 4px", () => {
    expect(proofCardHover.y).toBe(-4);
  });

  it("card border breathes every 10s", () => {
    expect(PROOF_CARD_BREATHE_DURATION_S).toBe(10);
  });

  it("ambient glow cycles over 12s between the requested opacity bounds", () => {
    expect(PROOF_AMBIENT_GLOW_DURATION_S).toBe(12);
    expect(PROOF_AMBIENT_GLOW_OPACITY).toEqual([0.08, 0.16, 0.08]);
  });

  it("number shimmer repeats within the requested 8-10s window, after the ~1.2s count-up finishes", () => {
    expect(PROOF_SHIMMER_CYCLE_S).toBeGreaterThanOrEqual(8);
    expect(PROOF_SHIMMER_CYCLE_S).toBeLessThanOrEqual(10);
    expect(PROOF_SHIMMER_DELAY_S).toBeGreaterThan(1.2);
  });

  it("button reflection sweep totals ~8s per cycle (sweep + pause)", () => {
    expect(PROOF_BUTTON_SWEEP_DURATION_S + PROOF_BUTTON_SWEEP_REPEAT_DELAY_S).toBe(PROOF_BUTTON_SWEEP_CYCLE_S);
    expect(PROOF_BUTTON_SWEEP_CYCLE_S).toBe(8);
  });

  it("exactly 4 data-connection lines, one per stat card, all converging on the shared center", () => {
    expect(PROOF_DATA_LINES).toHaveLength(4);
    for (const line of PROOF_DATA_LINES) {
      expect(line.x2).toBe(50);
      expect(line.y2).toBe(50);
    }
  });

  it("every icon kind has a motion entry within the 8-10s cycle window, and 'people' defers to the separate ring animation", () => {
    expect(Object.keys(PROOF_ICON_MOTION).sort()).toEqual(["dollar", "globe", "lightning", "people"]);
    expect(PROOF_ICON_MOTION.people).toEqual({});
    for (const kind of ["dollar", "globe", "lightning"] as const) {
      expect(PROOF_ICON_MOTION[kind].animate).toBeDefined();
      const duration = PROOF_ICON_MOTION[kind].transition?.duration as number;
      expect(duration).toBeGreaterThanOrEqual(8);
      expect(duration).toBeLessThanOrEqual(10);
    }
  });

  it("connection line grows once both sides have had time to arrive, at 30% opacity", () => {
    expect(PROOF_CONNECTION_LINE_OPACITY).toBe(0.3);
    expect(PROOF_CONNECTION_LINE_DURATION_S).toBe(0.5);
    expect(PROOF_CONNECTION_LINE_DELAY_S).toBeGreaterThan(0);
    expect(PROOF_CONNECTION_LINE_TRAVEL_DELAY_S).toBeGreaterThan(PROOF_CONNECTION_LINE_DELAY_S);
  });

  it("section-wide spotlight is much more subtle than each card's own hover glow", () => {
    expect(PROOF_SPOTLIGHT_OPACITY).toBe(0.05);
  });
});
