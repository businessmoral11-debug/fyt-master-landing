import { describe, it, expect } from "vitest";
import { HERO_ORBIT_LABELS, HERO_ORBIT_RINGS, MOBILE_ORBIT_LABELS, MOBILE_LABEL_LAYOUT, mobileLabelBoxCss } from "./heroOrbit";
import { heroSweepCss } from "./heroSweep";

describe("HERO_ORBIT_LABELS", () => {
  it("has the five spec feature callouts in arc order", () => {
    expect(HERO_ORBIT_LABELS.map((l) => l.label)).toEqual([
      "No Consistency Rule",
      "Up to 100% Splits",
      "Rewards on Demand",
      "Static Drawdown",
      "200% Refundable Fee",
    ]);
  });
  it("uses symmetric beam-bearing angles around the center dwell", () => {
    expect(HERO_ORBIT_LABELS.map((l) => l.rotate)).toEqual([-70.5, -40.7, 0, 40.7, 70.5]);
  });
  it("positions dots symmetrically left-to-right, dipping lowest at the center", () => {
    const tops = HERO_ORBIT_LABELS.map((l) => l.top);
    expect(tops[2]).toBeGreaterThan(tops[0]);
    expect(tops[2]).toBeGreaterThan(tops[4]);
    expect(tops[0]).toBeCloseTo(tops[4], 1);
    expect(tops[1]).toBeCloseTo(tops[3], 1);
  });
  it("has no dotColor or textOpacity fields (v4 labels use one uniform color, no rotation)", () => {
    for (const l of HERO_ORBIT_LABELS) {
      expect(l).not.toHaveProperty("dotColor");
      expect(l).not.toHaveProperty("textOpacity");
    }
  });
  it("keeps rotate consistent with each dot's position relative to the node center (720,720)", () => {
    for (const l of HERO_ORBIT_LABELS) {
      expect((Math.atan2(l.left - 720, l.top - 720) * 180) / Math.PI).toBeCloseTo(l.rotate, 1);
    }
  });
  it("produces valid sweep CSS for the real label set", () => {
    expect(() => heroSweepCss(HERO_ORBIT_LABELS)).not.toThrow();
    expect(heroSweepCss(HERO_ORBIT_LABELS)).toContain("6.4s linear infinite alternate");
  });
});

describe("HERO_ORBIT_RINGS", () => {
  it("has four concentric rings growing outward", () => {
    expect(HERO_ORBIT_RINGS).toHaveLength(4);
    for (let i = 1; i < 4; i++) {
      expect(HERO_ORBIT_RINGS[i].rx).toBeGreaterThan(HERO_ORBIT_RINGS[i - 1].rx);
    }
  });
});

describe("MOBILE_ORBIT_LABELS", () => {
  it("has the same 5 spec feature callouts, in the same order, as HERO_ORBIT_LABELS", () => {
    expect(MOBILE_ORBIT_LABELS.map((l) => l.label)).toEqual(HERO_ORBIT_LABELS.map((l) => l.label));
  });
  it("positions differ from HERO_ORBIT_LABELS at every index — a genuinely different 2-row layout, not a rescaled copy", () => {
    for (let i = 0; i < MOBILE_ORBIT_LABELS.length; i++) {
      const mobile = MOBILE_ORBIT_LABELS[i];
      const desktop = HERO_ORBIT_LABELS[i];
      expect(mobile.left === desktop.left && mobile.top === desktop.top).toBe(false);
    }
  });
  it("keeps rotate consistent with each dot's position relative to the node center (720,720)", () => {
    for (const l of MOBILE_ORBIT_LABELS) {
      expect((Math.atan2(l.left - 720, l.top - 720) * 180) / Math.PI).toBeCloseTo(l.rotate, 1);
    }
  });
  it("splits into a 2-item top row (indices 0,4) and a 3-item bottom row (indices 1,2,3), top row above bottom row", () => {
    const tops = MOBILE_ORBIT_LABELS.map((l) => l.top);
    expect(tops[0]).toBeCloseTo(tops[4], 1);
    expect(tops[1]).toBeCloseTo(tops[3], 1);
    expect(tops[1]).toBeGreaterThan(tops[0]);
    expect(tops[2]).toBeGreaterThan(tops[0]);
    expect(tops[3]).toBeGreaterThan(tops[4]);
  });
  it("keeps the top row above the rings' own top edge (local y < 580) and inside the stage (y > 0)", () => {
    const ringTop = Math.min(...HERO_ORBIT_RINGS.map((r) => r.cy - r.ry));
    expect(MOBILE_ORBIT_LABELS[0].top).toBeLessThan(ringTop);
    expect(MOBILE_ORBIT_LABELS[4].top).toBeLessThan(ringTop);
    expect(MOBILE_ORBIT_LABELS[0].top).toBeGreaterThan(0);
  });
  it("produces valid sweep CSS with a distinct class suffix", () => {
    expect(() => heroSweepCss(MOBILE_ORBIT_LABELS, "-mobile")).not.toThrow();
    expect(heroSweepCss(MOBILE_ORBIT_LABELS, "-mobile")).toContain(".hero-sweep-arm-mobile {");
  });
});

describe("MOBILE_LABEL_LAYOUT", () => {
  it("is index-aligned with MOBILE_ORBIT_LABELS (same length)", () => {
    expect(MOBILE_LABEL_LAYOUT).toHaveLength(MOBILE_ORBIT_LABELS.length);
  });
  it("anchors the top-row pair outward (start/end) and the bottom-row trio centered", () => {
    expect(MOBILE_LABEL_LAYOUT.map((l) => l.anchor)).toEqual(["start", "center", "center", "center", "end"]);
  });
  it("gives every entry a positive wrapWidth", () => {
    for (const l of MOBILE_LABEL_LAYOUT) {
      expect(l.wrapWidth).toBeGreaterThan(0);
    }
  });
});

describe("mobileLabelBoxCss", () => {
  it("defaults to center anchoring", () => {
    expect(mobileLabelBoxCss()).toEqual({
      items: "items-center",
      textAlign: "center",
      translateX: "-50%",
      transformOrigin: "top center",
    });
  });
  it("maps start/end to outward-growing boxes", () => {
    expect(mobileLabelBoxCss("start").translateX).toBe("0%");
    expect(mobileLabelBoxCss("end").translateX).toBe("-100%");
  });
});
