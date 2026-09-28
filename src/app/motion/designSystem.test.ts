import { describe, it, expect } from "vitest";
import {
  EASE_STANDARD,
  SPRING_CALM,
  SPRING_SNAPPY,
  LIFT_SUBTLE_PX,
  LIFT_STANDARD_PX,
  GLOW_OPACITY_RESTING,
  GLOW_OPACITY_HOVER,
  brandGlow,
  BREATHE_DURATION_MIN_S,
} from "./designSystem";

describe("designSystem", () => {
  it("exposes exactly one standard easing curve", () => {
    expect(EASE_STANDARD).toEqual([0.16, 1, 0.3, 1]);
  });

  it("has exactly two spring personalities, calm softer than snappy", () => {
    expect(SPRING_CALM.stiffness).toBeLessThan(SPRING_SNAPPY.stiffness as number);
  });

  it("hover lift ceiling stays subtle (nothing above 4px)", () => {
    expect(LIFT_SUBTLE_PX).toBeLessThan(LIFT_STANDARD_PX);
    expect(LIFT_STANDARD_PX).toBeLessThanOrEqual(4);
  });

  it("glow ceilings stay calm relative to the shipped CursorSpotlight reference (0.08)", () => {
    expect(GLOW_OPACITY_RESTING).toBe(0.08);
    expect(GLOW_OPACITY_HOVER).toBeLessThanOrEqual(0.2);
  });

  it("brandGlow renders a valid rgba box-shadow string at the hover ceiling by default", () => {
    expect(brandGlow(20)).toBe("0 0 20px rgba(59,130,246,0.18)");
    expect(brandGlow(12, 0.1)).toBe("0 0 12px rgba(59,130,246,0.1)");
  });

  it("idle loops never cycle faster than the calm floor", () => {
    expect(BREATHE_DURATION_MIN_S).toBeGreaterThanOrEqual(3);
  });
});
