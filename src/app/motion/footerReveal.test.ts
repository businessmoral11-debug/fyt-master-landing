import { describe, it, expect } from "vitest";
import type { Target, TargetAndTransition } from "motion/react";
import {
  FOOTER_LOGO_REVEAL,
  FOOTER_COLUMN_REVEAL,
  FOOTER_COLUMN_STAGGER_S,
  FOOTER_TOPLINE_PERIOD_S,
  FOOTER_CTA_REVEAL,
  FOOTER_CTA_GLOW_PULSE_PERIOD_S,
} from "./footerReveal";

describe("FOOTER_LOGO_REVEAL", () => {
  it("fades in from a small rise", () => {
    const hidden = FOOTER_LOGO_REVEAL.hidden as Target;
    const show = FOOTER_LOGO_REVEAL.show as TargetAndTransition;
    expect(hidden.opacity).toBe(0);
    expect(show.opacity).toBe(1);
  });
});

describe("FOOTER_COLUMN_REVEAL", () => {
  it("starts lower, blurred, and invisible, and settles with no overshoot", () => {
    const hidden = FOOTER_COLUMN_REVEAL.hidden as Target;
    const show = FOOTER_COLUMN_REVEAL.show as TargetAndTransition;
    expect(hidden.opacity).toBe(0);
    expect(hidden.filter).toBe("blur(6px)");
    expect(show.opacity).toBe(1);
    expect(show.filter).toBe("blur(0px)");
    const t = show.transition as { type: string; bounce: number };
    expect(t.type).toBe("spring");
    expect(t.bounce).toBe(0);
  });

  it("stagger is positive so left-to-right DOM order reads as sequential", () => {
    expect(FOOTER_COLUMN_STAGGER_S).toBeGreaterThan(0);
  });
});

describe("FOOTER_TOPLINE_PERIOD_S", () => {
  it("stays within the requested 12-15s window", () => {
    expect(FOOTER_TOPLINE_PERIOD_S).toBeGreaterThanOrEqual(12);
    expect(FOOTER_TOPLINE_PERIOD_S).toBeLessThanOrEqual(15);
  });
});

describe("FOOTER_CTA_REVEAL", () => {
  it("fades and scales up from slightly smaller", () => {
    const hidden = FOOTER_CTA_REVEAL.hidden as Target;
    const show = FOOTER_CTA_REVEAL.show as TargetAndTransition;
    expect(hidden.opacity).toBe(0);
    expect(hidden.scale).toBeLessThan(1);
    expect(show.opacity).toBe(1);
    expect(show.scale).toBe(1);
  });
});

describe("FOOTER_CTA_GLOW_PULSE_PERIOD_S", () => {
  it("is a slow, calm cycle", () => {
    expect(FOOTER_CTA_GLOW_PULSE_PERIOD_S).toBeGreaterThanOrEqual(3);
  });
});
