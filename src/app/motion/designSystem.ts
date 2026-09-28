
import type { Transition } from "motion/react";

export const EASE_STANDARD = [0.16, 1, 0.3, 1] as const;

export const SPRING_CALM: Transition = { type: "spring", stiffness: 260, damping: 28, mass: 0.5 };
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 380, damping: 26 };

export const DURATION_XS_S = 0.2;
export const DURATION_SM_S = 0.35;
export const DURATION_MD_S = 0.55;
export const DURATION_LG_S = 0.8;

export const LIFT_SUBTLE_PX = 2;
export const LIFT_STANDARD_PX = 4;

export const BRAND_BLUE = "#3b82f6";
export const BRAND_BLUE_LIGHT = "#60a5fa";

export const GLOW_OPACITY_RESTING = 0.08;
export const GLOW_OPACITY_HOVER = 0.18;

export function brandGlow(blurPx: number, opacity: number = GLOW_OPACITY_HOVER): string {
  return `0 0 ${blurPx}px rgba(59,130,246,${opacity})`;
}

export const BREATHE_DURATION_MIN_S = 3;
