import { describe, it, expect } from "vitest";
import {
  productSectionContainer,
  PRODUCT_SECTION_STAGGER,
  productHeadingContainer,
  productHeadingWord,
  productDashboardBack,
  productDashboardFront,
  PRODUCT_DASHBOARD_FLOAT_AMPLITUDE_PX,
  PRODUCT_DASHBOARD_TILT_MAX_DEG,
  PRODUCT_REFLECTION_SWEEP_CYCLE_S,
  PRODUCT_REFLECTION_SWEEP_DURATION_S,
  PRODUCT_REFLECTION_SWEEP_REPEAT_DELAY_S,
  PRODUCT_BADGE_STAGGER,
  PRODUCT_DUST_PARTICLES,
  PRODUCT_CONNECTION_LINE_OPACITY,
  productPlatformCardHover,
  productSupportCardHover,
  PRODUCT_ONLINE_DOT_TRANSITION,
} from "./productShowcaseMotion";

describe("productShowcaseMotion timing bounds", () => {
  it("section reveal order (heading -> dashboard -> platform card -> support card) is one staggerChildren sequence", () => {
    const show = productSectionContainer.show as { transition?: { staggerChildren?: number } };
    expect(show.transition?.staggerChildren).toBe(PRODUCT_SECTION_STAGGER);
  });

  it("heading reveals progressively via a nested word-stagger container", () => {
    expect(productHeadingContainer.hidden).toEqual({});
    const show = productHeadingContainer.show as { transition?: { staggerChildren?: number } };
    expect(show.transition?.staggerChildren).toBeGreaterThan(0);
    expect(productHeadingWord.hidden).toMatchObject({ opacity: 0 });
  });

  it("dashboard back layer matches the requested opacity/scale/rotate assembly", () => {
    expect(productDashboardBack.hidden).toMatchObject({ opacity: 0, scale: 0.92, rotate: -8 });
    expect(productDashboardBack.show).toMatchObject({ opacity: 1, scale: 1, rotate: -4 });
  });

  it("dashboard front layer matches the requested y/scale/opacity assembly", () => {
    expect(productDashboardFront.hidden).toMatchObject({ opacity: 0, y: 40, scale: 0.9 });
    expect(productDashboardFront.show).toMatchObject({ opacity: 1, y: 0, scale: 1 });
  });

  it("dashboard float amplitude is within the requested 3-5px window", () => {
    expect(PRODUCT_DASHBOARD_FLOAT_AMPLITUDE_PX).toBeGreaterThanOrEqual(3);
    expect(PRODUCT_DASHBOARD_FLOAT_AMPLITUDE_PX).toBeLessThanOrEqual(5);
  });

  it("mouse parallax caps at the requested 5 degrees", () => {
    expect(PRODUCT_DASHBOARD_TILT_MAX_DEG).toBe(5);
  });

  it("reflection sweep cycles within the requested 12-15s window", () => {
    expect(PRODUCT_REFLECTION_SWEEP_CYCLE_S).toBeGreaterThanOrEqual(12);
    expect(PRODUCT_REFLECTION_SWEEP_CYCLE_S).toBeLessThanOrEqual(15);
    expect(PRODUCT_REFLECTION_SWEEP_DURATION_S + PRODUCT_REFLECTION_SWEEP_REPEAT_DELAY_S).toBe(PRODUCT_REFLECTION_SWEEP_CYCLE_S);
  });

  it("feature badge stagger is 80ms", () => {
    expect(PRODUCT_BADGE_STAGGER).toBe(0.08);
  });

  it("dust particle count is within the requested 5-8 range", () => {
    expect(PRODUCT_DUST_PARTICLES.length).toBeGreaterThanOrEqual(5);
    expect(PRODUCT_DUST_PARTICLES.length).toBeLessThanOrEqual(8);
  });

  it("connection line opacity matches the requested 30%", () => {
    expect(PRODUCT_CONNECTION_LINE_OPACITY).toBe(0.3);
  });

  it("Trusted Platform card lifts 4px on hover", () => {
    expect(productPlatformCardHover.y).toBe(-4);
  });

  it("Trusted Support card lifts on hover", () => {
    expect(productSupportCardHover.y).toBeLessThan(0);
  });

  it("online indicator pulses on a 2s loop", () => {
    expect(PRODUCT_ONLINE_DOT_TRANSITION.duration).toBe(2);
    expect(PRODUCT_ONLINE_DOT_TRANSITION.repeat).toBe(Infinity);
  });
});
