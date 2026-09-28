import { describe, it, expect } from "vitest";
import {
  TESTIMONIAL_HEADING_REVEAL,
  testimonialColumnRole,
  TESTIMONIAL_CARD_REVEAL,
  TESTIMONIAL_CARD_HOVER,
  TESTIMONIAL_CTA_REVEAL,
} from "./testimonialsReveal";
import type { Target, TargetAndTransition } from "motion/react";

describe("TESTIMONIAL_HEADING_REVEAL", () => {
  it("fades up from y:40 to y:0 over 0.8s easeOut", () => {
    const hidden = TESTIMONIAL_HEADING_REVEAL.hidden as Target;
    const show = TESTIMONIAL_HEADING_REVEAL.show as TargetAndTransition;
    expect(hidden.opacity).toBe(0);
    expect(hidden.y).toBe(40);
    expect(show.opacity).toBe(1);
    expect(show.y).toBe(0);
    expect(show.transition).toEqual({ duration: 0.8, ease: "easeOut" });
  });
});

describe("testimonialColumnRole", () => {
  it("puts the first item on the left and the last on the right", () => {
    expect(testimonialColumnRole(0, 3)).toBe("left");
    expect(testimonialColumnRole(2, 3)).toBe("right");
    expect(testimonialColumnRole(1, 3)).toBe("center");
  });

  it("treats a lone single-item row as center (no partner to slide in from either side)", () => {
    expect(testimonialColumnRole(0, 1)).toBe("center");
  });

  it("handles a 2-item row as left/right with no center", () => {
    expect(testimonialColumnRole(0, 2)).toBe("left");
    expect(testimonialColumnRole(1, 2)).toBe("right");
  });

  it("handles longer rows: only the first and last are left/right, the rest are center", () => {
    expect(testimonialColumnRole(0, 4)).toBe("left");
    expect(testimonialColumnRole(1, 4)).toBe("center");
    expect(testimonialColumnRole(2, 4)).toBe("center");
    expect(testimonialColumnRole(3, 4)).toBe("right");
  });
});

describe("TESTIMONIAL_CARD_REVEAL", () => {
  function hiddenFor(role: "left" | "center" | "right") {
    const fn = TESTIMONIAL_CARD_REVEAL.hidden as (custom: string) => Target;
    return fn(role);
  }

  it("left cards start off-screen left, blurred, slightly scaled down, opacity 0", () => {
    const h = hiddenFor("left");
    expect(h.x).toBe(-180);
    expect(h.opacity).toBe(0);
    expect(h.filter).toBe("blur(14px)");
    expect(h.scale).toBe(0.96);
  });

  it("right cards start off-screen right, mirroring left", () => {
    const h = hiddenFor("right");
    expect(h.x).toBe(180);
    expect(h.filter).toBe("blur(14px)");
    expect(h.scale).toBe(0.96);
  });

  it("center cards start lower, blurred less, no x offset", () => {
    const h = hiddenFor("center");
    expect(h.x).toBe(0);
    expect(h.y).toBe(40);
    expect(h.filter).toBe("blur(10px)");
  });

  it("show state settles every axis back to its resting value", () => {
    const show = TESTIMONIAL_CARD_REVEAL.show as TargetAndTransition;
    expect(show.x).toBe(0);
    expect(show.y).toBe(0);
    expect(show.opacity).toBe(1);
    expect(show.filter).toBe("blur(0px)");
    expect(show.scale).toBe(1);
  });

  it("uses a critically-damped spring (bounce: 0) — no overshoot", () => {
    const show = TESTIMONIAL_CARD_REVEAL.show as TargetAndTransition;
    const transition = show.transition as { default: { type: string; bounce: number; duration: number } };
    expect(transition.default.type).toBe("spring");
    expect(transition.default.bounce).toBe(0);
    expect(transition.default.duration).toBeGreaterThanOrEqual(0.9);
    expect(transition.default.duration).toBeLessThanOrEqual(1.1);
  });

  it("the glow shows a peak mid-flight and settles to a glow-free shadow", () => {
    const show = TESTIMONIAL_CARD_REVEAL.show as TargetAndTransition;
    const shadow = show.boxShadow as string[];
    expect(shadow).toHaveLength(3);
    expect(shadow[1]).toContain("59,130,246");
    expect(shadow[2]).not.toContain("59,130,246");
  });
});

describe("TESTIMONIAL_CARD_HOVER", () => {
  it("lifts and scales up slightly with a blue glow shadow", () => {
    expect(TESTIMONIAL_CARD_HOVER.y).toBe(-6);
    expect(TESTIMONIAL_CARD_HOVER.scale).toBe(1.02);
    expect(TESTIMONIAL_CARD_HOVER.boxShadow).toContain("59,130,246");
  });
});

describe("TESTIMONIAL_CTA_REVEAL", () => {
  it("fades and rises in last, delayed 0.4s behind the grid", () => {
    const hidden = TESTIMONIAL_CTA_REVEAL.hidden as Target;
    const show = TESTIMONIAL_CTA_REVEAL.show as TargetAndTransition;
    expect(hidden.opacity).toBe(0);
    expect(show.opacity).toBe(1);
    expect((show.transition as { delay: number }).delay).toBe(0.4);
  });
});
