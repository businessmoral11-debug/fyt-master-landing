import { describe, it, expect } from "vitest";
import {
  HERO_STAGE_WIDTH,
  HERO_STAGE_HEIGHT,
  heroStageScale,
  HERO_LABEL_BOOST,
  heroLabelScale,
} from "./heroResponsive";
import { MOBILE_ORBIT_LABELS, MOBILE_LABEL_LAYOUT, mobileLabelBoxCss } from "./heroOrbit";

describe("HERO_STAGE_WIDTH / HERO_STAGE_HEIGHT", () => {
  it("matches the desktop hero stage's fixed 1440x1080 size", () => {
    expect(HERO_STAGE_WIDTH).toBe(1440);
    expect(HERO_STAGE_HEIGHT).toBe(1080);
  });
});

describe("heroStageScale", () => {
  it("returns 1 when the viewport exactly matches the stage width", () => {
    expect(heroStageScale(1440)).toBe(1);
  });

  it("scales down proportionally for narrower viewports", () => {
    expect(heroStageScale(375)).toBeCloseTo(375 / 1440, 10);
    expect(heroStageScale(1023)).toBeCloseTo(1023 / 1440, 10);
  });

  it("scales linearly with width", () => {
    expect(heroStageScale(720)).toBeCloseTo(heroStageScale(360) * 2, 10);
  });

  it("returns 0 for a zero-width viewport", () => {
    expect(heroStageScale(0)).toBe(0);
  });
});

describe("heroLabelScale", () => {
  it("equals HERO_LABEL_BOOST when the stage is at 1:1 (desktop)", () => {
    expect(heroLabelScale(1)).toBe(HERO_LABEL_BOOST);
  });

  it("is larger than 1 for any shrunk mobile stage scale", () => {
    expect(heroLabelScale(heroStageScale(375))).toBeGreaterThan(1);
  });

  it("combined with the stage scale, yields a constant net label size regardless of viewport", () => {
    const netAt375 = heroLabelScale(heroStageScale(375)) * heroStageScale(375);
    const netAt1024 = heroLabelScale(heroStageScale(1024)) * heroStageScale(1024);
    expect(netAt375).toBeCloseTo(HERO_LABEL_BOOST, 10);
    expect(netAt375).toBeCloseTo(netAt1024, 10);
  });
});

describe("HERO_LABEL_BOOST (mobile)", () => {
  it("shrinks mobile labels below their true desktop size", () => {
    expect(HERO_LABEL_BOOST).toBeLessThan(1);
    expect(HERO_LABEL_BOOST).toBeGreaterThan(0);
  });
});

describe("MOBILE_ORBIT_LABELS layout — no overlap, no edge clipping (regression guard)", () => {
  const UNSCALED_BLOCK_HEIGHT = 10 + 12 + 34 * 2;
  const MIN_SAFE_MARGIN_PX = 12;

  function screenX0FromTranslateX(translateX: string, screenLeft: number, screenWidth: number): number {
    if (translateX === "0%") return screenLeft;
    if (translateX === "-100%") return screenLeft - screenWidth;
    return screenLeft - screenWidth / 2;
  }

  function labelBox(index: number, viewportWidth: number) {
    const stageScale = heroStageScale(viewportWidth);
    const netScale = HERO_LABEL_BOOST;
    const { left, top } = MOBILE_ORBIT_LABELS[index];
    const { anchor, wrapWidth } = MOBILE_LABEL_LAYOUT[index];
    const { translateX } = mobileLabelBoxCss(anchor);
    const screenLeft = left * stageScale;
    const screenTop = top * stageScale;
    const screenWidth = wrapWidth * netScale;
    const x0 = screenX0FromTranslateX(translateX, screenLeft, screenWidth);
    return {
      x0,
      x1: x0 + screenWidth,
      y0: screenTop,
      y1: screenTop + UNSCALED_BLOCK_HEIGHT * netScale,
    };
  }

  it("never lets two same-row mobile labels' boxes come within 12px of each other, at any width 320-1023px", () => {
    for (let width = 320; width <= 1023; width++) {
      const boxes = MOBILE_ORBIT_LABELS.map((_, i) => labelBox(i, width));
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const yOverlaps = a.y0 < b.y1 && b.y0 < a.y1;
          if (!yOverlaps) continue;
          const xGap = Math.max(b.x0 - a.x1, a.x0 - b.x1);
          expect(
            xGap,
            `width=${width} ${MOBILE_ORBIT_LABELS[i].label} vs ${MOBILE_ORBIT_LABELS[j].label}`,
          ).toBeGreaterThanOrEqual(MIN_SAFE_MARGIN_PX);
        }
      }
    }
  });

  it("never lets a mobile label's box clip the viewport's left/right edge, at any width 320-1023px", () => {
    for (let width = 320; width <= 1023; width++) {
      for (let i = 0; i < MOBILE_ORBIT_LABELS.length; i++) {
        const box = labelBox(i, width);
        expect(box.x0, `width=${width} ${MOBILE_ORBIT_LABELS[i].label} left edge`).toBeGreaterThanOrEqual(
          MIN_SAFE_MARGIN_PX,
        );
        expect(box.x1, `width=${width} ${MOBILE_ORBIT_LABELS[i].label} right edge`).toBeLessThanOrEqual(
          width - MIN_SAFE_MARGIN_PX,
        );
      }
    }
  });

  it("confirms the top row never vertically overlaps the bottom row, at the narrowest width (320px)", () => {
    const top = labelBox(0, 320);
    const bottom = labelBox(1, 320);
    expect(top.y1).toBeLessThan(bottom.y0);
  });

  const MOBILE_RADAR_BOTTOM_GAP_PX = 40;

  it("keeps the bottom row's label boxes within the mobile radar's reserved vertical clearance at the narrowest width", () => {
    for (const index of [1, 2, 3]) {
      const box = labelBox(index, 320);
      const limit = 1080 * heroStageScale(320) + MOBILE_RADAR_BOTTOM_GAP_PX;
      expect(
        box.y1,
        `width=320 ${MOBILE_ORBIT_LABELS[index].label} bottom edge (margin ${(limit - box.y1).toFixed(1)}px)`,
      ).toBeLessThanOrEqual(limit);
    }
  });
});
