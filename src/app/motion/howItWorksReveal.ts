import type { Variants } from "motion/react";

export interface StepReveal {
  fadeStart: number;
  fadeEnd: number;
}

export const HOW_IT_WORKS_SCROLL_HEIGHT_VH = 200;

export const HOW_IT_WORKS_STEP_REVEALS: readonly StepReveal[] = [
  { fadeStart: 0.12, fadeEnd: 0.22 },
  { fadeStart: 0.32, fadeEnd: 0.42 },
  { fadeStart: 0.52, fadeEnd: 0.62 },
  { fadeStart: 0.72, fadeEnd: 0.82 },
];

export const HOW_IT_WORKS_LINE_REVEAL: StepReveal = {
  fadeStart: HOW_IT_WORKS_STEP_REVEALS[0].fadeStart,
  fadeEnd: HOW_IT_WORKS_STEP_REVEALS[HOW_IT_WORKS_STEP_REVEALS.length - 1].fadeEnd,
};

export const HOW_IT_WORKS_RING_RGB = "59,130,246";
export const HOW_IT_WORKS_DOT_RGB = "238,240,246";
export const HOW_IT_WORKS_NUMBER_RGB = "96,165,250";

export const HOW_IT_WORKS_RING_BORDER_ALPHA = { dim: 0.1, peak: 1 } as const;
export const HOW_IT_WORKS_RING_GLOW_ALPHA = { dim: 0.05, peak: 0.75 } as const;
export const HOW_IT_WORKS_DOT_BG_ALPHA = { dim: 0.1, peak: 1 } as const;
export const HOW_IT_WORKS_DOT_GLOW_ALPHA = { dim: 0, peak: 0.9 } as const;
export const HOW_IT_WORKS_NUMBER_ALPHA = { dim: 0.1, peak: 1 } as const;

export const HOW_IT_WORKS_ICON_BORDER_ALPHA = { dim: 0.08, peak: 0.4 } as const;

export const HOW_IT_WORKS_ICON_GLYPH_OPACITY = { dim: 0.15, peak: 1 } as const;

export const HOW_IT_WORKS_LABEL_DIM_HEX = "#4a4f63";
export const HOW_IT_WORKS_LABEL_PEAK_HEX = "#ffffff";

export const HOW_IT_WORKS_DESC_DIM_HEX = "#8a90a3";
export const HOW_IT_WORKS_DESC_PEAK_HEX = "#ffffff";

export const HOW_IT_WORKS_LINE_GLOW = "0 0 12px rgba(59,130,246,0.6)";

export const HOW_IT_WORKS_MOBILE_SPOTLIGHT_TRANSITION_S = 0.4;

export const HOW_IT_WORKS_MOBILE_SPOTLIGHT_CARD: Variants = {
  rest: {
    scale: 1,
    boxShadow: `0 0 0 0px rgba(${HOW_IT_WORKS_RING_RGB},0), 0 0 0px rgba(${HOW_IT_WORKS_RING_RGB},0)`,
  },
  active: {
    scale: 1.02,
    boxShadow: `0 0 0 1.5px rgba(${HOW_IT_WORKS_RING_RGB},0.9), 0 0 20px rgba(${HOW_IT_WORKS_RING_RGB},0.4)`,
  },
};

export const HOW_IT_WORKS_MOBILE_SPOTLIGHT_ICON: Variants = {
  rest: { filter: "brightness(1)" },
  active: { filter: "brightness(1.18)" },
};
