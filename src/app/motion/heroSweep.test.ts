import { describe, it, expect } from "vitest";
import {
  DWELL_S,
  MOVE_S,
  GLOW_RAMP_FRAC,
  passDuration,
  sweepStops,
  glowWindow,
  sweepKeyframes,
  glowKeyframes,
  heroSweepCss,
} from "./heroSweep";
const ANGLES = [-58, -38, -12, 12, 38, 58];

describe("pacing constants", () => {
  it("locks the calm preset", () => {
    expect(DWELL_S).toBe(0.8);
    expect(MOVE_S).toBe(0.6);
    expect(GLOW_RAMP_FRAC).toBe(0.5);
  });
  it("one pass over six labels is 7.8s", () => {
    expect(passDuration(6)).toBeCloseTo(7.8, 10);
  });
});

describe("sweepStops", () => {
  const stops = sweepStops(ANGLES);
  it("emits two stops per label (dwell start + dwell end)", () => {
    expect(stops).toHaveLength(12);
    expect(stops[0]).toEqual({ pct: 0, deg: -58, ease: false });
    expect(stops[11].pct).toBeCloseTo(100, 10);
    expect(stops[11].deg).toBe(58);
  });
  it("holds the angle across each dwell", () => {
    for (let i = 0; i < 6; i++) {
      expect(stops[2 * i].deg).toBe(ANGLES[i]);
      expect(stops[2 * i + 1].deg).toBe(ANGLES[i]);
    }
  });
  it("places dwells on the reference schedule", () => {
    expect(stops[1].pct).toBeCloseTo(10.2564, 3);
    expect(stops[2].pct).toBeCloseTo(17.9487, 3);
    expect(stops[4].pct).toBeCloseTo(35.8974, 3);
    expect(stops[10].pct).toBeCloseTo(89.7436, 3);
  });
  it("eases only the move segments (dwell-end stops, except the last)", () => {
    const eased = stops.map((s) => s.ease);
    expect(eased).toEqual([
      false, true, false, true, false, true,
      false, true, false, true, false, false,
    ]);
  });
  it("is strictly monotonic in pct", () => {
    for (let i = 1; i < stops.length; i++) {
      expect(stops[i].pct).toBeGreaterThan(stops[i - 1].pct);
    }
  });
});

describe("glowWindow", () => {
  it("first label starts already held and has no rise", () => {
    const w = glowWindow(0, 6);
    expect(w.riseStartPct).toBeNull();
    expect(w.holdStartPct).toBe(0);
    expect(w.holdEndPct).toBeCloseTo(10.2564, 3);
    expect(w.fallEndPct).toBeCloseTo(14.1026, 3);
  });
  it("last label holds to the end of the pass and has no fall", () => {
    const w = glowWindow(5, 6);
    expect(w.riseStartPct).toBeCloseTo(85.8974, 3);
    expect(w.holdStartPct).toBeCloseTo(89.7436, 3);
    expect(w.holdEndPct).toBeCloseTo(100, 10);
    expect(w.fallEndPct).toBeNull();
  });
  it("interior label rises through the incoming move's second half and falls through the outgoing move's first half", () => {
    const w = glowWindow(2, 6);
    expect(w.riseStartPct).toBeCloseTo(32.0513, 3);
    expect(w.holdStartPct).toBeCloseTo(35.8974, 3);
    expect(w.holdEndPct).toBeCloseTo(46.1538, 3);
    expect(w.fallEndPct).toBeCloseTo(50, 10);
  });
  it("hands off exactly: label i's fall end equals label i+1's rise start", () => {
    for (let i = 0; i < 5; i++) {
      expect(glowWindow(i, 6).fallEndPct).toBeCloseTo(glowWindow(i + 1, 6).riseStartPct!, 10);
    }
  });
});

describe("sweepKeyframes", () => {
  const css = sweepKeyframes(ANGLES);
  it("holds and eases per the schedule", () => {
    expect(css).toContain("@keyframes hero-sweep");
    expect(css).toContain("0% { transform: rotate(-58deg); }");
    expect(css).toContain("10.256% { transform: rotate(-58deg); animation-timing-function: ease-in-out; }");
    expect(css).toContain("17.949% { transform: rotate(-38deg); }");
    expect(css).toContain("89.744% { transform: rotate(58deg); }");
    expect(css).toContain("100% { transform: rotate(58deg); }");
  });
  it("does not ease the final stop", () => {
    expect(css).not.toContain("100% { transform: rotate(58deg); animation-timing-function");
  });
});

describe("glowKeyframes", () => {
  it("interior label: zero → rise → plateau → fall → zero", () => {
    const css = glowKeyframes("hero-glow-2", glowWindow(2, 6));
    expect(css).toContain("@keyframes hero-glow-2");
    expect(css).toContain("0% { opacity: 0; }");
    expect(css).toContain("32.051% { opacity: 0; }");
    expect(css).toContain("35.897% { opacity: 1; }");
    expect(css).toContain("46.154% { opacity: 1; }");
    expect(css).toContain("50% { opacity: 0; }");
    expect(css).toContain("100% { opacity: 0; }");
  });
  it("first label starts held", () => {
    const css = glowKeyframes("hero-glow-0", glowWindow(0, 6));
    expect(css).toContain("0% { opacity: 1; }");
    expect(css).toContain("10.256% { opacity: 1; }");
    expect(css).toContain("14.103% { opacity: 0; }");
    expect(css).toContain("100% { opacity: 0; }");
  });
  it("last label ends held", () => {
    const css = glowKeyframes("hero-glow-5", glowWindow(5, 6));
    expect(css).toContain("0% { opacity: 0; }");
    expect(css).toContain("85.897% { opacity: 0; }");
    expect(css).toContain("89.744% { opacity: 1; }");
    expect(css).toContain("100% { opacity: 1; }");
  });
  it("collapses identical duplicate stops (last label's holdStart)", () => {
    const css = glowKeyframes("hero-glow-5", glowWindow(5, 6));
    const holds = css.match(/89\.744% \{ opacity: 1; \}/g) ?? [];
    expect(holds).toHaveLength(1);
  });
  it("throws on conflicting values at the same rounded stop", () => {
    const w = { riseStartPct: 35.89704, holdStartPct: 35.8971, holdEndPct: 46.1538, fallEndPct: 50 };
    expect(() => glowKeyframes("hero-glow-x", w)).toThrow(/conflicting values/);
  });
});

describe("heroSweepCss", () => {
  const css = heroSweepCss(ANGLES.map((rotate) => ({ rotate })));
  it("keeps the class-name contract and the shared 7.8s alternate timing", () => {
    expect(css).toContain(".hero-sweep-arm");
    expect(css).toContain("animation: hero-sweep 7.8s linear infinite alternate;");
    for (let i = 0; i < ANGLES.length; i++) {
      expect(css).toContain(`@keyframes hero-glow-${i}`);
      expect(css).toContain(`animation: hero-glow-${i} 7.8s linear infinite alternate;`);
    }
  });
  it("disables every animation under prefers-reduced-motion", () => {
    const media = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(media).toContain("animation: none;");
    expect(media).toContain(".hero-sweep-arm");
    for (let i = 0; i < ANGLES.length; i++) {
      expect(media).toContain(`.hero-glow-${i}`);
    }
  });
  it("negates stored bearings into beam angles (starts pointing LEFT at −58°)", () => {
    expect(css).toContain("0% { transform: rotate(58deg); }");
    expect(css).toContain("100% { transform: rotate(-58deg); }");
    expect(css).toContain("10.256% { transform: rotate(58deg); animation-timing-function: ease-in-out; }");
  });
});

describe("sweepKeyframes classSuffix", () => {
  it("defaults to the unsuffixed name (backward compatible)", () => {
    expect(sweepKeyframes(ANGLES)).toContain("@keyframes hero-sweep {");
  });
  it("suffixes the keyframe name when given", () => {
    expect(sweepKeyframes(ANGLES, "-mobile")).toContain("@keyframes hero-sweep-mobile {");
    expect(sweepKeyframes(ANGLES, "-mobile")).not.toContain("@keyframes hero-sweep {");
  });
});

describe("heroSweepCss classSuffix", () => {
  const css = heroSweepCss(ANGLES.map((rotate) => ({ rotate })), "-mobile");
  it("suffixes the beam class, its keyframe name, and the animation shorthand that references it", () => {
    expect(css).toContain(".hero-sweep-arm-mobile {");
    expect(css).toContain("@keyframes hero-sweep-mobile {");
    expect(css).toContain("animation: hero-sweep-mobile 7.8s linear infinite alternate;");
    expect(css).not.toContain(".hero-sweep-arm {");
  });
  it("suffixes every glow class and its keyframe name", () => {
    for (let i = 0; i < ANGLES.length; i++) {
      expect(css).toContain(`@keyframes hero-glow-mobile-${i}`);
      expect(css).toContain(`.hero-glow-mobile-${i} {`);
    }
  });
  it("two differently-suffixed calls never share a keyframe name (regression: an unsuffixed sweepKeyframes call would collide)", () => {
    const a = heroSweepCss(ANGLES.map((rotate) => ({ rotate })), "-a");
    const b = heroSweepCss(ANGLES.map((rotate) => ({ rotate: -rotate })), "-b");
    expect(a).toContain("@keyframes hero-sweep-a {");
    expect(b).toContain("@keyframes hero-sweep-b {");
    expect(a).not.toContain("@keyframes hero-sweep-b");
    expect(b).not.toContain("@keyframes hero-sweep-a");
  });
});
