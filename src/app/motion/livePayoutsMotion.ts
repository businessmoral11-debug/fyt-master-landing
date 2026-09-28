import type { Transition } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const LIVE_PAYOUTS_ROW_STAGGER_S = 0.07;
export const LIVE_PAYOUTS_ROW_DURATION_S = 0.5;
export const LIVE_PAYOUTS_ROW_BLUR_PX = 6;

export const LIVE_PAYOUTS_AMOUNT_DELAY_S = 0.12;
export const LIVE_PAYOUTS_CHECK_DELAY_S = 0.4;
export const LIVE_PAYOUTS_DOT_DELAY_S = 0.5;

export const LIVE_PAYOUTS_ROW_HOVER_TRANSITION: Transition = { type: "spring", stiffness: 340, damping: 26 };
export const livePayoutsRowHover = {
  y: -2,
  backgroundColor: "rgba(59,130,246,0.05)",
  borderColor: "rgba(59,130,246,0.28)",
} as const;

export const LIVE_PAYOUTS_DOT_BREATHE_DURATION_S = 3;
export const livePayoutsDotBreathe = { opacity: [1, 0.45, 1], scale: [1, 1.15, 1] } as const;

export const LIVE_PAYOUTS_AMOUNT_SPRING: Transition = { stiffness: 90, damping: 20, mass: 1 };
export const LIVE_PAYOUTS_AMOUNT_GLOW = "0 0 16px rgba(59,130,246,0.3)";
export const LIVE_PAYOUTS_AMOUNT_GLOW_HOVER = "0 0 26px rgba(59,130,246,0.5)";
export const LIVE_PAYOUTS_AMOUNT_SHIMMER_S = "7s";

export const LIVE_PAYOUTS_CHECK_DRAW_DURATION_S = 0.5;
export const LIVE_PAYOUTS_BADGE_PULSE_DURATION_S = 4;
export const livePayoutsBadgePulse = { opacity: [1, 0.65, 1] } as const;

export const LIVE_PAYOUTS_HEADER_STICKY_TOP_PX = 120;
export const LIVE_PAYOUTS_DIVIDER_TRANSITION: Transition = { duration: 0.7, ease: EASE_OUT_EXPO };
export const LIVE_PAYOUTS_COLUMN_LABEL_STAGGER_S = 0.06;
export const LIVE_PAYOUTS_HEADER_DOT_TRANSITION: Transition = { duration: 1.8, repeat: Infinity, ease: "easeInOut" };
export const livePayoutsHeaderDotPulse = { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] } as const;
export const LIVE_PAYOUTS_SCAN_LIGHT_DURATION_S = 1.6;
export const LIVE_PAYOUTS_SCAN_LIGHT_CYCLE_S = 6;
export const LIVE_PAYOUTS_SCAN_LIGHT_REPEAT_DELAY_S = LIVE_PAYOUTS_SCAN_LIGHT_CYCLE_S - LIVE_PAYOUTS_SCAN_LIGHT_DURATION_S;
export const LIVE_PAYOUTS_SCAN_LIGHT_TRANSITION: Transition = {
  duration: LIVE_PAYOUTS_SCAN_LIGHT_DURATION_S,
  repeat: Infinity,
  repeatDelay: LIVE_PAYOUTS_SCAN_LIGHT_REPEAT_DELAY_S,
  ease: "easeInOut",
};
export const livePayoutsScanLight = { x: ["-120%", "420%"] } as const;
export const LIVE_PAYOUTS_SCAN_LIGHT_INITIAL_X = "-120%";
export const LIVE_PAYOUTS_BADGE_BLINK_DURATION_S = 0.5;
export const livePayoutsBadgeBlink = { opacity: [1, 0.3, 1], scale: [1, 1.25, 1] } as const;

export const LIVE_PAYOUTS_CTA_GRADIENT_DURATION_S = 8;
export const livePayoutsCtaGradientPosition = { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } as const;
export const LIVE_PAYOUTS_CTA_FLOAT_AMPLITUDE_PX = 3;
export const LIVE_PAYOUTS_CTA_FLOAT_DURATION_S = 10;
export const livePayoutsCtaFloatY = [0, -LIVE_PAYOUTS_CTA_FLOAT_AMPLITUDE_PX, 0];
export const LIVE_PAYOUTS_CTA_FLOAT_TRANSITION: Transition = {
  duration: LIVE_PAYOUTS_CTA_FLOAT_DURATION_S,
  repeat: Infinity,
  ease: "easeInOut",
};

export const LIVE_PAYOUTS_BG_GLOW_OPACITY = 0.07;
export const LIVE_PAYOUTS_VIGNETTE_OPACITY = 0.05;
export const LIVE_PAYOUTS_NOISE_OPACITY = 0.02;

export const LIVE_PAYOUTS_SPOTLIGHT_OPACITY = 0.12;
