import { describe, it, expect } from "vitest";
import {
  PRICING_PILL_LIFT_Y,
  PRICING_CARD_FLOAT_AMPLITUDE_PX,
  PRICING_CARD_FLOAT_DURATION_S,
  PRICING_CARD_BREATHE_DURATION_S,
  PRICING_REFLECTION_SWEEP_CYCLE_S,
  PRICING_REFLECTION_SWEEP_DURATION_S,
  PRICING_REFLECTION_SWEEP_REPEAT_DELAY_S,
  PRICING_FLASH_STAGGER_MS,
  PRICING_FLASH_DURATION_MS,
  PRICING_SPOTLIGHT_OPACITY,
  PRICING_COMPLETION_LINE_GLOW_DELAY_S,
  PRICING_COMPLETION_CARD_PULSE_DELAY_S,
  PRICING_COMPLETION_CTA_GLOW_DELAY_S,
} from "./pricingMotion";

describe("pricingMotion timing bounds", () => {
  it("selected pill lifts 3px", () => {
    expect(PRICING_PILL_LIFT_Y).toBe(-3);
  });

  it("card float is 2px over 12s", () => {
    expect(PRICING_CARD_FLOAT_AMPLITUDE_PX).toBe(2);
    expect(PRICING_CARD_FLOAT_DURATION_S).toBe(12);
  });

  it("card border breathes every 10s", () => {
    expect(PRICING_CARD_BREATHE_DURATION_S).toBe(10);
  });

  it("reflection sweep cycles every 15s", () => {
    expect(PRICING_REFLECTION_SWEEP_CYCLE_S).toBe(15);
    expect(PRICING_REFLECTION_SWEEP_DURATION_S + PRICING_REFLECTION_SWEEP_REPEAT_DELAY_S).toBe(PRICING_REFLECTION_SWEEP_CYCLE_S);
  });

  it("value-change flash is 300ms with an 80ms stagger between panels", () => {
    expect(PRICING_FLASH_DURATION_MS).toBe(300);
    expect(PRICING_FLASH_STAGGER_MS).toBe(80);
  });

  it("spotlight is subtle", () => {
    expect(PRICING_SPOTLIGHT_OPACITY).toBeLessThan(0.1);
  });

  it("completion sequence beats are ordered: line -> cards -> CTA", () => {
    expect(PRICING_COMPLETION_LINE_GLOW_DELAY_S).toBeLessThan(PRICING_COMPLETION_CARD_PULSE_DELAY_S);
    expect(PRICING_COMPLETION_CARD_PULSE_DELAY_S).toBeLessThan(PRICING_COMPLETION_CTA_GLOW_DELAY_S);
  });
});
