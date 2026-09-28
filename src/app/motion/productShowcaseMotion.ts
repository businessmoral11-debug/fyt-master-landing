import type { Transition, Variants } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const SPRING: Transition = { type: "spring", stiffness: 260, damping: 22 };

export const PRODUCT_SECTION_STAGGER = 0.18;
export const productSectionContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: PRODUCT_SECTION_STAGGER, delayChildren: 0.05 } },
};
export const productSectionItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

export const PRODUCT_HEADING_WORD_STAGGER = 0.05;
export const productHeadingContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: PRODUCT_HEADING_WORD_STAGGER } },
};
export const productHeadingWord: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
};

export const PRODUCT_BADGE_STAGGER = 0.08;
export const productBadgeContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: PRODUCT_BADGE_STAGGER } },
};
export const productBadgeIcon: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { ...SPRING, stiffness: 320 } },
};
export const productBadgeLabel: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, delay: 0.1, ease: EASE_OUT_EXPO } },
};

export const productDashboardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};
export const productDashboardBack: Variants = {
  hidden: { opacity: 0, scale: 0.92, rotate: -8 },
  show: { opacity: 1, scale: 1, rotate: -4, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};
export const productDashboardFront: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

export const PRODUCT_DASHBOARD_FLOAT_AMPLITUDE_PX = 4;
export const PRODUCT_DASHBOARD_FLOAT_DURATION_S = 13;
export const productDashboardFloatY = [0, -PRODUCT_DASHBOARD_FLOAT_AMPLITUDE_PX, 0];
export const PRODUCT_DASHBOARD_FLOAT_TRANSITION: Transition = {
  duration: PRODUCT_DASHBOARD_FLOAT_DURATION_S,
  repeat: Infinity,
  ease: "easeInOut",
};
export const PRODUCT_DASHBOARD_TILT_MAX_DEG = 5;

export const PRODUCT_REFLECTION_SWEEP_DURATION_S = 1.8;
export const PRODUCT_REFLECTION_SWEEP_CYCLE_S = 13.5;
export const PRODUCT_REFLECTION_SWEEP_REPEAT_DELAY_S = PRODUCT_REFLECTION_SWEEP_CYCLE_S - PRODUCT_REFLECTION_SWEEP_DURATION_S;
export const PRODUCT_REFLECTION_SWEEP_TRANSITION: Transition = {
  duration: PRODUCT_REFLECTION_SWEEP_DURATION_S,
  repeat: Infinity,
  repeatDelay: PRODUCT_REFLECTION_SWEEP_REPEAT_DELAY_S,
  ease: "easeInOut",
};
export const productReflectionSweep = { x: ["-120%", "420%"] } as const;

export const PRODUCT_AMBIENT_GLOW_DURATION_S = 12;
export const PRODUCT_AMBIENT_GLOW_OPACITY = [0.06, 0.13, 0.06];
export const PRODUCT_AMBIENT_GLOW_TRANSITION: Transition = {
  duration: PRODUCT_AMBIENT_GLOW_DURATION_S,
  repeat: Infinity,
  ease: "easeInOut",
};

export const PRODUCT_CONNECTION_LINE_DELAY_S = 0.3;
export const PRODUCT_CONNECTION_LINE_DURATION_S = 0.6;
export const PRODUCT_CONNECTION_LINE_OPACITY = 0.3;

export interface DustParticle {
  leftPct: number;
  topPct: number;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}
export const PRODUCT_DUST_PARTICLES: readonly DustParticle[] = [
  { leftPct: 8, topPct: 15, size: 5, driftX: 10, driftY: -14, duration: 16, delay: 0 },
  { leftPct: 22, topPct: 62, size: 4, driftX: -8, driftY: 12, duration: 14, delay: 1.2 },
  { leftPct: 48, topPct: 8, size: 6, driftX: 12, driftY: 10, duration: 18, delay: 0.6 },
  { leftPct: 63, topPct: 48, size: 3, driftX: -10, driftY: -8, duration: 12, delay: 2.1 },
  { leftPct: 78, topPct: 20, size: 5, driftX: 8, driftY: 14, duration: 17, delay: 0.9 },
  { leftPct: 90, topPct: 65, size: 4, driftX: -12, driftY: -10, duration: 15, delay: 1.7 },
  { leftPct: 35, topPct: 82, size: 4, driftX: 9, driftY: -9, duration: 13, delay: 2.6 },
];

export const PRODUCT_CARD_HOVER_TRANSITION: Transition = SPRING;
export const productPlatformCardHover = {
  y: -4,
  borderColor: "rgba(59,130,246,0.4)",
  boxShadow: "0 20px 45px -20px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.12)",
} as const;
export const productPlatformPillHover = { y: -2, scale: 1.02 } as const;
export const productIconHoverRotate = { rotate: 8 } as const;

export const productSupportCardHover = { y: -4 } as const;

export const PRODUCT_ONLINE_DOT_TRANSITION: Transition = { duration: 2, repeat: Infinity, ease: "easeInOut" };
export const productOnlineDotPulse = { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } as const;

export const PRODUCT_CHAT_BUTTON_SHEEN_DURATION_S = 7;
export const productChatButtonSheen = { x: ["-115%", "315%"] } as const;
