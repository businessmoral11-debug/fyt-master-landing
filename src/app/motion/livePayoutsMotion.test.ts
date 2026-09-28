import { describe, it, expect } from "vitest";
import {
  LIVE_PAYOUTS_ROW_STAGGER_S,
  livePayoutsRowHover,
  LIVE_PAYOUTS_DOT_BREATHE_DURATION_S,
  LIVE_PAYOUTS_BADGE_PULSE_DURATION_S,
  LIVE_PAYOUTS_SCAN_LIGHT_CYCLE_S,
  LIVE_PAYOUTS_SCAN_LIGHT_DURATION_S,
  LIVE_PAYOUTS_SCAN_LIGHT_REPEAT_DELAY_S,
  LIVE_PAYOUTS_BG_GLOW_OPACITY,
  LIVE_PAYOUTS_VIGNETTE_OPACITY,
  LIVE_PAYOUTS_SPOTLIGHT_OPACITY,
  LIVE_PAYOUTS_AMOUNT_DELAY_S,
  LIVE_PAYOUTS_CHECK_DELAY_S,
  LIVE_PAYOUTS_DOT_DELAY_S,
  LIVE_PAYOUTS_CTA_FLOAT_AMPLITUDE_PX,
  LIVE_PAYOUTS_CTA_FLOAT_DURATION_S,
  LIVE_PAYOUTS_HEADER_STICKY_TOP_PX,
} from "./livePayoutsMotion";

describe("livePayoutsMotion timing bounds", () => {
  it("rows stagger 70ms apart", () => {
    expect(LIVE_PAYOUTS_ROW_STAGGER_S).toBe(0.07);
  });

  it("row hover lifts 2px", () => {
    expect(livePayoutsRowHover.y).toBe(-2);
  });

  it("dot breathe and badge pulse are gentle multi-second loops", () => {
    expect(LIVE_PAYOUTS_DOT_BREATHE_DURATION_S).toBeGreaterThan(2);
    expect(LIVE_PAYOUTS_BADGE_PULSE_DURATION_S).toBeGreaterThan(2);
  });

  it("header scanning light cycles every ~6s", () => {
    expect(LIVE_PAYOUTS_SCAN_LIGHT_CYCLE_S).toBe(6);
    expect(LIVE_PAYOUTS_SCAN_LIGHT_DURATION_S + LIVE_PAYOUTS_SCAN_LIGHT_REPEAT_DELAY_S).toBe(LIVE_PAYOUTS_SCAN_LIGHT_CYCLE_S);
  });

  it("background/spotlight opacities stay subtle", () => {
    expect(LIVE_PAYOUTS_BG_GLOW_OPACITY).toBeLessThanOrEqual(0.08);
    expect(LIVE_PAYOUTS_VIGNETTE_OPACITY).toBeLessThan(0.1);
    expect(LIVE_PAYOUTS_SPOTLIGHT_OPACITY).toBeLessThan(0.2);
  });

  it("cascading reveal offsets are ordered: amount -> checkmark -> dot", () => {
    expect(LIVE_PAYOUTS_AMOUNT_DELAY_S).toBeLessThan(LIVE_PAYOUTS_CHECK_DELAY_S);
    expect(LIVE_PAYOUTS_CHECK_DELAY_S).toBeLessThan(LIVE_PAYOUTS_DOT_DELAY_S);
  });

  it("button idle float is slow and small", () => {
    expect(LIVE_PAYOUTS_CTA_FLOAT_AMPLITUDE_PX).toBeLessThanOrEqual(5);
    expect(LIVE_PAYOUTS_CTA_FLOAT_DURATION_S).toBeGreaterThan(5);
  });

  it("sticky header offset is a sane positive pixel value", () => {
    expect(LIVE_PAYOUTS_HEADER_STICKY_TOP_PX).toBeGreaterThan(0);
  });
});
