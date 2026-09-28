import { describe, it, expect } from "vitest";
import { PROVE_SKILL_CARD_REVEALS, PROVE_SKILL_SCROLL_HEIGHT_VH, PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH, PROVE_SKILL_MOBILE_CARD_REVEALS } from "./proveSkillReveal";

describe("PROVE_SKILL_CARD_REVEALS", () => {
  it("has one entry per PROVE_SKILL_CARDS card (5)", () => {
    expect(PROVE_SKILL_CARD_REVEALS).toHaveLength(5);
  });

  it("keeps every fade window inside 0-1 with a positive duration", () => {
    for (const r of PROVE_SKILL_CARD_REVEALS) {
      expect(r.fadeStart).toBeGreaterThanOrEqual(0);
      expect(r.fadeEnd).toBeLessThanOrEqual(1);
      expect(r.fadeEnd).toBeGreaterThan(r.fadeStart);
    }
  });

  it("groups cards into 3 scroll steps — 0+1 together, 2+3 together, 4 alone — each step starting no earlier than the previous step finishes", () => {
    const groups: number[][] = [[0, 1], [2, 3], [4]];
    for (const group of groups) {
      if (group.length < 2) continue;
      const [a, b] = group;
      expect(PROVE_SKILL_CARD_REVEALS[a].fadeStart).toBe(PROVE_SKILL_CARD_REVEALS[b].fadeStart);
      expect(PROVE_SKILL_CARD_REVEALS[a].fadeEnd).toBe(PROVE_SKILL_CARD_REVEALS[b].fadeEnd);
    }
    for (let i = 1; i < groups.length; i++) {
      const prevEnd = PROVE_SKILL_CARD_REVEALS[groups[i - 1][0]].fadeEnd;
      const curStart = PROVE_SKILL_CARD_REVEALS[groups[i][0]].fadeStart;
      expect(curStart).toBeGreaterThanOrEqual(prevEnd);
    }
  });

  it("keeps the trailing hold short (last card finishes by scrollYProgress 0.97) so the section doesn't pin on empty scroll distance before releasing", () => {
    const last = PROVE_SKILL_CARD_REVEALS[PROVE_SKILL_CARD_REVEALS.length - 1];
    expect(last.fadeEnd).toBeGreaterThan(0.85);
    expect(last.fadeEnd).toBeLessThanOrEqual(0.97);
  });

  it("converges each card toward its resting spot from the direction matching its on-screen quadrant", () => {
    expect(PROVE_SKILL_CARD_REVEALS[0].fromY).toBeLessThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[1].fromY).toBeLessThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[2].fromY).toBeGreaterThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[3].fromY).toBeGreaterThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[4].fromY).toBeGreaterThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[4].fromX).toBe(0);
    expect(PROVE_SKILL_CARD_REVEALS[0].fromX).toBeLessThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[2].fromX).toBeLessThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[1].fromX).toBeGreaterThan(0);
    expect(PROVE_SKILL_CARD_REVEALS[3].fromX).toBeGreaterThan(0);
  });
});

describe("PROVE_SKILL_SCROLL_HEIGHT_VH", () => {
  it("is long enough (in viewport-heights) to host 5 staggered reveals comfortably", () => {
    expect(PROVE_SKILL_SCROLL_HEIGHT_VH).toBeGreaterThan(100);
  });
});

describe("PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH", () => {
  it("is long enough (in viewport-heights) to host 5 staggered reveals comfortably", () => {
    expect(PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH).toBeGreaterThan(100);
  });
});

describe("PROVE_SKILL_MOBILE_CARD_REVEALS", () => {
  it("has one entry per PROVE_SKILL_CARDS card (5)", () => {
    expect(PROVE_SKILL_MOBILE_CARD_REVEALS).toHaveLength(5);
  });

  it("keeps every fade window inside 0-1 with a positive duration", () => {
    for (const r of PROVE_SKILL_MOBILE_CARD_REVEALS) {
      expect(r.fadeStart).toBeGreaterThanOrEqual(0);
      expect(r.fadeEnd).toBeLessThanOrEqual(1);
      expect(r.fadeEnd).toBeGreaterThan(r.fadeStart);
    }
  });

  it("groups cards into 3 scroll steps — 0+1 together, 2+3 together, 4 alone — each step starting no earlier than the previous step finishes", () => {
    const groups: number[][] = [[0, 1], [2, 3], [4]];
    for (const group of groups) {
      if (group.length < 2) continue;
      const [a, b] = group;
      expect(PROVE_SKILL_MOBILE_CARD_REVEALS[a].fadeStart).toBe(PROVE_SKILL_MOBILE_CARD_REVEALS[b].fadeStart);
      expect(PROVE_SKILL_MOBILE_CARD_REVEALS[a].fadeEnd).toBe(PROVE_SKILL_MOBILE_CARD_REVEALS[b].fadeEnd);
    }
    for (let i = 1; i < groups.length; i++) {
      const prevEnd = PROVE_SKILL_MOBILE_CARD_REVEALS[groups[i - 1][0]].fadeEnd;
      const curStart = PROVE_SKILL_MOBILE_CARD_REVEALS[groups[i][0]].fadeStart;
      expect(curStart).toBeGreaterThanOrEqual(prevEnd);
    }
  });

  it("keeps the trailing hold short (last card finishes by scrollYProgress 0.97) so the section doesn't pin on empty scroll distance before releasing", () => {
    const last = PROVE_SKILL_MOBILE_CARD_REVEALS[PROVE_SKILL_MOBILE_CARD_REVEALS.length - 1];
    expect(last.fadeEnd).toBeGreaterThan(0.85);
    expect(last.fadeEnd).toBeLessThanOrEqual(0.97);
  });

  it("rises straight up with no horizontal slide (cards sit in a vertical stack, not scattered quadrants)", () => {
    for (const r of PROVE_SKILL_MOBILE_CARD_REVEALS) {
      expect(r.fromX).toBe(0);
      expect(r.fromY).toBeGreaterThan(0);
    }
  });
});
