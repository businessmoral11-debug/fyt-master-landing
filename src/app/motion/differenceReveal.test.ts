import { describe, it, expect } from "vitest";
import {
  DIFFERENCE_HEADING_WORDS,
  DIFFERENCE_HEADING_WORD_STAGGER_S,
  DIFFERENCE_HEADING_WORD_DURATION_S,
  DIFFERENCE_HEADING_PARENT_VARIANTS,
  DIFFERENCE_HEADING_WORD_VARIANTS,
  DIFFERENCE_PIN_SCROLL_HEIGHT_VH,
  DIFFERENCE_HEADING_EXIT_REVEAL,
  DIFFERENCE_CONTENT_ENTER_REVEAL,
} from "./differenceReveal";

describe("DIFFERENCE_HEADING_WORDS", () => {
  it("joins back to the exact heading copy, in order", () => {
    expect(DIFFERENCE_HEADING_WORDS.join(" ")).toBe("The difference is clear.");
  });
});

describe("DIFFERENCE_HEADING_WORD_VARIANTS", () => {
  it("starts nearly invisible and offset to the right, matching the reference site's pre-animation state", () => {
    expect(DIFFERENCE_HEADING_WORD_VARIANTS.hidden).toEqual({ opacity: 0.001, x: 20 });
  });

  it("animates to fully visible and settled, with a positive duration", () => {
    const visible = DIFFERENCE_HEADING_WORD_VARIANTS.visible as Record<string, any>;
    expect(visible.opacity).toBe(1);
    expect(visible.x).toBe(0);
    expect(visible.transition.duration).toBe(DIFFERENCE_HEADING_WORD_DURATION_S);
    expect(visible.transition.duration).toBeGreaterThan(0);
  });
});

describe("DIFFERENCE_HEADING_PARENT_VARIANTS", () => {
  it("staggers its word children by a positive delay", () => {
    const visible = DIFFERENCE_HEADING_PARENT_VARIANTS.visible as Record<string, any>;
    expect(visible.transition.staggerChildren).toBe(DIFFERENCE_HEADING_WORD_STAGGER_S);
    expect(visible.transition.staggerChildren).toBeGreaterThan(0);
  });
});

describe("DIFFERENCE_PIN_SCROLL_HEIGHT_VH", () => {
  it("is long enough (in viewport-heights) to host the heading-exit + content-enter crossfade comfortably", () => {
    expect(DIFFERENCE_PIN_SCROLL_HEIGHT_VH).toBeGreaterThan(100);
  });

  it("gives ~95vh of extra scroll runway beyond the 100vh sticky viewport (guards the 150→195 recalibration)", () => {
    const runwayVh = DIFFERENCE_PIN_SCROLL_HEIGHT_VH - 100;
    expect(runwayVh).toBeGreaterThanOrEqual(90);
    expect(runwayVh).toBeLessThanOrEqual(100);
  });
});

describe("DIFFERENCE_HEADING_EXIT_REVEAL", () => {
  it("has a valid, positive-duration fade window inside 0-1", () => {
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.fadeStart).toBeGreaterThanOrEqual(0);
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.fadeEnd).toBeLessThanOrEqual(1);
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.fadeEnd).toBeGreaterThan(DIFFERENCE_HEADING_EXIT_REVEAL.fadeStart);
  });

  it("no longer varies opacity — hide/reveal is done purely by sliding out of the clipped bounding box (opacity motion values were found to desync from their own inline style under this project's motion/framer-motion versions)", () => {
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.opacityFrom).toBe(DIFFERENCE_HEADING_EXIT_REVEAL.opacityTo);
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.opacityFrom).toBe(1);
  });

  it("slides far enough left to fully exit the section's max-w-[1280px] clipped container, regardless of heading width", () => {
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.xTo).toBeLessThanOrEqual(-1280);
  });

  it("slides the heading away from its resting position (matches the reference site's leftward exit)", () => {
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.xFrom).toBe(0);
    expect(DIFFERENCE_HEADING_EXIT_REVEAL.xTo).toBeLessThan(0);
  });
});

describe("DIFFERENCE_CONTENT_ENTER_REVEAL", () => {
  it("has a valid, positive-duration fade window inside 0-1", () => {
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.fadeStart).toBeGreaterThanOrEqual(0);
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.fadeEnd).toBeLessThanOrEqual(1);
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.fadeEnd).toBeGreaterThan(DIFFERENCE_CONTENT_ENTER_REVEAL.fadeStart);
  });

  it("no longer varies opacity — hide/reveal is done purely by sliding into the clipped bounding box from off-screen", () => {
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.opacityFrom).toBe(DIFFERENCE_CONTENT_ENTER_REVEAL.opacityTo);
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.opacityFrom).toBe(1);
  });

  it("slides far enough right to fully clip the content block out of view, regardless of viewport width (a normal-flow, w-full block only 400px offset would still overlap the visible area — see code comment)", () => {
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.xFrom).toBeGreaterThanOrEqual(1280);
  });

  it("slides the content block in from off-screen to its resting position (widened from the reference site's raw 400px measurement to guarantee full clipping, mirroring the heading's -1400 magnitude)", () => {
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.xFrom).toBe(1400);
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.xTo).toBe(0);
  });

  it("the content's leading edge enters the clip box no later than the heading's trailing edge leaves it (no blank-section gap at any desktop width)", () => {
    const CLIP = [1024 - 160, 1280 - 160];
    const HEADING_MIN_W = 550;
    for (const C of CLIP) {
      const speed = Math.abs(DIFFERENCE_HEADING_EXIT_REVEAL.xTo) /
        (DIFFERENCE_HEADING_EXIT_REVEAL.fadeEnd - DIFFERENCE_HEADING_EXIT_REVEAL.fadeStart);
      const headingGone = DIFFERENCE_HEADING_EXIT_REVEAL.fadeStart + ((C + HEADING_MIN_W) / 2) / speed;
      const c = DIFFERENCE_CONTENT_ENTER_REVEAL;
      const contentArrives = c.fadeStart + (c.fadeEnd - c.fadeStart) * ((c.xFrom - C) / c.xFrom);
      expect(contentArrives).toBeLessThanOrEqual(headingGone);
    }
  });

  it("leaves a hold at full visibility before the section releases (finishes by scrollYProgress 0.85)", () => {
    expect(DIFFERENCE_CONTENT_ENTER_REVEAL.fadeEnd).toBeLessThanOrEqual(0.85);
  });
});
