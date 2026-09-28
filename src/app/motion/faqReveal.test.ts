import { describe, it, expect } from "vitest";
import type { Target, TargetAndTransition } from "motion/react";
import { FAQ_TITLE_WORD, FAQ_ROW_REVEAL, faqRowDelay, FAQ_ROW_STAGGER_S, FAQ_TOPLINE_PERIOD_S } from "./faqReveal";

describe("FAQ_TITLE_WORD", () => {
  it("fades up from blur", () => {
    const hidden = FAQ_TITLE_WORD.hidden as Target;
    const show = FAQ_TITLE_WORD.show as TargetAndTransition;
    expect(hidden.opacity).toBe(0);
    expect(hidden.y).toBeGreaterThan(0);
    expect(hidden.filter).toContain("blur");
    expect(show.opacity).toBe(1);
    expect(show.filter).toBe("blur(0px)");
  });
});

describe("FAQ_ROW_REVEAL", () => {
  it("starts lower, blurred, and invisible", () => {
    const hidden = FAQ_ROW_REVEAL.hidden as Target;
    expect(hidden.opacity).toBe(0);
    expect(hidden.y).toBe(30);
    expect(hidden.filter).toBe("blur(8px)");
  });

  it("settles with a no-overshoot spring", () => {
    const show = FAQ_ROW_REVEAL.show as TargetAndTransition;
    expect(show.opacity).toBe(1);
    expect(show.y).toBe(0);
    expect(show.filter).toBe("blur(0px)");
    const t = show.transition as { type: string; bounce: number };
    expect(t.type).toBe("spring");
    expect(t.bounce).toBe(0);
  });
});

describe("faqRowDelay", () => {
  it("staggers rows by FAQ_ROW_STAGGER_S (0.08s per the brief)", () => {
    expect(FAQ_ROW_STAGGER_S).toBe(0.08);
    expect(faqRowDelay(0)).toBe(0);
    expect(faqRowDelay(1)).toBeCloseTo(0.08);
    expect(faqRowDelay(3)).toBeCloseTo(0.24);
  });
});

describe("FAQ_TOPLINE_PERIOD_S", () => {
  it("is a slow, calm cycle (several seconds, not a fast flash)", () => {
    expect(FAQ_TOPLINE_PERIOD_S).toBeGreaterThanOrEqual(4);
  });
});
