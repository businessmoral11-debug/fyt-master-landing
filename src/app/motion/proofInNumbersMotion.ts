import type { TargetAndTransition, Transition, Variants } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const PROOF_SPRING: Transition = { type: "spring", stiffness: 90, damping: 18, mass: 1 };

export const PROOF_SIDE_SLIDE_X = 80;

/**
 * Deliberately has no opacity/x of its own -- ProofInNumbers' heading and
 * paragraph render statically (see BelowFold.tsx) and would otherwise still
 * appear to slide/fade in just from being nested inside this animated
 * container. Kept purely to fire the staggerChildren/delayChildren timing
 * that the badge (proofRevealItem) and button (proofButtonReveal) still use
 * for their own entrance -- same pattern as proofHeadlineContainer below.
 */
export const proofLeftReveal: Variants = {
  hidden: {},
  show: {
    transition: { ...PROOF_SPRING, staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const proofRightReveal: Variants = {
  hidden: { opacity: 0, x: PROOF_SIDE_SLIDE_X },
  show: {
    opacity: 1,
    x: 0,
    transition: { ...PROOF_SPRING, staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

export const proofRevealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

export const proofHeadlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
export const proofHeadlineLine: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

export const proofButtonReveal: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

export const PROOF_CARD_STAGGER = 0.08;
export const proofCardReveal: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

export const PROOF_FLOAT_DURATION_S = 16;
export const PROOF_FLOAT_TRANSITION: Transition = {
  duration: PROOF_FLOAT_DURATION_S,
  repeat: Infinity,
  ease: "easeInOut",
};
export const PROOF_FLOAT_Y = [0, -5, 0];

export const PROOF_AMBIENT_GLOW_DURATION_S = 12;
export const PROOF_AMBIENT_GLOW_OPACITY = [0.08, 0.16, 0.08];
export const PROOF_AMBIENT_GLOW_TRANSITION: Transition = {
  duration: PROOF_AMBIENT_GLOW_DURATION_S,
  repeat: Infinity,
  ease: "easeInOut",
};

export const PROOF_CARD_FLOAT_AMPLITUDE_PX = 2.5;
export const PROOF_CARD_FLOAT_DURATION_S = 11;
export const PROOF_CARD_FLOAT_STAGGER_S = 1.1;

export const PROOF_CARD_HOVER_TRANSITION: Transition = { type: "spring", stiffness: 300, damping: 22 };
export const proofCardHover = {
  y: -4,
  scale: 1.015,
  borderColor: "rgba(96,165,250,0.5)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 40px rgba(59,130,246,0.06), " +
    "0 24px 60px -18px rgba(59,130,246,0.4), 0 0 0 1px rgba(96,165,250,0.25)",
} as const;

export const PROOF_CARD_BREATHE_DURATION_S = 10;
export const PROOF_CARD_BREATHE_OPACITY = [0, 1, 0];
export const PROOF_CARD_BREATHE_STAGGER_S = 0.4;

const PROOF_ICON_CYCLE_S = 9;
export const PROOF_ICON_DOLLAR_PULSE: Transition = { duration: PROOF_ICON_CYCLE_S, repeat: Infinity, ease: "easeInOut" };
export const proofIconDollarPulse = { scale: [1, 1.08, 1] } as const;

export const PROOF_ICON_NETWORK_RING_TRANSITION: Transition = {
  duration: PROOF_ICON_CYCLE_S,
  repeat: Infinity,
  ease: "easeInOut",
  delay: 1,
};
export const proofIconNetworkRing = { scale: [1, 1.5], opacity: [0.5, 0] } as const;

export const PROOF_ICON_GLOBE_SPIN_TRANSITION: Transition = { duration: PROOF_ICON_CYCLE_S, repeat: Infinity, ease: "linear", delay: 2 };
export const proofIconGlobeSpin = { rotate: 360 } as const;

export const PROOF_ICON_LIGHTNING_TRANSITION: Transition = {
  duration: PROOF_ICON_CYCLE_S,
  repeat: Infinity,
  ease: "easeInOut",
  times: [0, 0.15, 1],
  delay: 3,
};
export const proofIconLightningPulse = { opacity: [1, 0.5, 1], scale: [1, 1.05, 1] } as const;

export type ProofIconKind = "dollar" | "people" | "globe" | "lightning";
export const PROOF_ICON_MOTION: Record<ProofIconKind, { animate?: TargetAndTransition; transition?: Transition }> = {
  dollar: { animate: proofIconDollarPulse, transition: PROOF_ICON_DOLLAR_PULSE },
  people: {},
  globe: { animate: proofIconGlobeSpin, transition: PROOF_ICON_GLOBE_SPIN_TRANSITION },
  lightning: { animate: proofIconLightningPulse, transition: PROOF_ICON_LIGHTNING_TRANSITION },
};

export const PROOF_SHIMMER_CYCLE_S = 9;
export const PROOF_SHIMMER_DELAY_S = 1.6;

export const PROOF_BUTTON_SWEEP_DURATION_S = 1.6;
export const PROOF_BUTTON_SWEEP_CYCLE_S = 8;
export const PROOF_BUTTON_SWEEP_REPEAT_DELAY_S = PROOF_BUTTON_SWEEP_CYCLE_S - PROOF_BUTTON_SWEEP_DURATION_S;
export const PROOF_BUTTON_SWEEP_TRANSITION: Transition = {
  duration: PROOF_BUTTON_SWEEP_DURATION_S,
  repeat: Infinity,
  repeatDelay: PROOF_BUTTON_SWEEP_REPEAT_DELAY_S,
  ease: "easeInOut",
};
export const proofButtonSweep = { x: ["-115%", "315%"] } as const;

export interface DataLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
export const PROOF_DATA_LINES: readonly DataLine[] = [
  { x1: 22, y1: 22, x2: 50, y2: 50 },
  { x1: 78, y1: 22, x2: 50, y2: 50 },
  { x1: 22, y1: 78, x2: 50, y2: 50 },
  { x1: 78, y1: 78, x2: 50, y2: 50 },
];
export const PROOF_DATA_LINE_LIGHT_CYCLE_S = 3.6;
export const PROOF_DATA_LINE_LIGHT_DURATION_S = 1.1;
export const PROOF_DATA_LINE_LIGHT_STAGGER_S = 0.5;

export const PROOF_CONNECTION_LINE_DELAY_S = 0.7;
export const PROOF_CONNECTION_LINE_DURATION_S = 0.5;
export const PROOF_CONNECTION_LINE_OPACITY = 0.3;
export const PROOF_CONNECTION_LINE_TRAVEL_DELAY_S = PROOF_CONNECTION_LINE_DELAY_S + PROOF_CONNECTION_LINE_DURATION_S;
export const PROOF_CONNECTION_LINE_TRAVEL_DURATION_S = 1;

export const PROOF_SPOTLIGHT_OPACITY = 0.05;
