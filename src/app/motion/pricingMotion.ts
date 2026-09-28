import type { Transition } from "motion/react";

export const PRICING_PILL_LIFT_Y = -3;
export const PRICING_PILL_LIFT_TRANSITION: Transition = { type: "spring", stiffness: 420, damping: 30 };

export const PRICING_CARD_FLOAT_AMPLITUDE_PX = 2;
export const PRICING_CARD_FLOAT_DURATION_S = 12;
export const pricingCardFloatY = [0, -PRICING_CARD_FLOAT_AMPLITUDE_PX, 0];
export const PRICING_CARD_FLOAT_TRANSITION: Transition = {
  duration: PRICING_CARD_FLOAT_DURATION_S,
  repeat: Infinity,
  ease: "easeInOut",
};

export const PRICING_CARD_BREATHE_DURATION_S = 10;
export const PRICING_CARD_BREATHE_OPACITY = [0, 1, 0];

export const PRICING_REFLECTION_SWEEP_DURATION_S = 2;
export const PRICING_REFLECTION_SWEEP_CYCLE_S = 15;
export const PRICING_REFLECTION_SWEEP_REPEAT_DELAY_S = PRICING_REFLECTION_SWEEP_CYCLE_S - PRICING_REFLECTION_SWEEP_DURATION_S;
export const PRICING_REFLECTION_SWEEP_TRANSITION: Transition = {
  duration: PRICING_REFLECTION_SWEEP_DURATION_S,
  repeat: Infinity,
  repeatDelay: PRICING_REFLECTION_SWEEP_REPEAT_DELAY_S,
  ease: "easeInOut",
};
export const pricingReflectionSweep = { x: ["-115%", "315%"] } as const;
export const PRICING_REFLECTION_SWEEP_INITIAL_X = "-115%";

export const PRICING_FLASH_STAGGER_MS = 80;
export const PRICING_FLASH_DURATION_MS = 300;
export const pricingFlashOpacity = [0, 0.16, 0];
export const PRICING_FLASH_TRANSITION: Transition = { duration: PRICING_FLASH_DURATION_MS / 1000, ease: "easeOut" };

export const PRICING_SWEEP_DURATION_S = 0.55;
export const PRICING_SWEEP_TRANSITION: Transition = { duration: PRICING_SWEEP_DURATION_S, ease: "easeInOut" };
export const pricingSweepOpacity = [0, 0.85, 0.85, 0];
export const pricingContentDipOpacity = [1, 0.8, 0.8, 1];

export const PRICING_SPOTLIGHT_OPACITY = 0.06;

export const PRICING_CTA_GRADIENT_DURATION_S = 10;
export const pricingCtaGradientPosition = { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } as const;

export const PRICING_PRICE_SPRING: Transition = { stiffness: 90, damping: 20, mass: 1 };

export const PRICING_PROGRESS_SEGMENT_TRANSITION: Transition = { duration: 0.4, ease: "easeOut" };

export const PRICING_COMPLETION_LINE_GLOW_DELAY_S = 0;
export const PRICING_COMPLETION_LINE_GLOW_DURATION_S = 0.6;
export const PRICING_COMPLETION_CARD_PULSE_DELAY_S = 0.3;
export const PRICING_COMPLETION_CARD_PULSE_DURATION_S = 0.7;
export const pricingCompletionCardPulse = { scale: [1, 1.02, 1] } as const;
export const PRICING_COMPLETION_CTA_GLOW_DELAY_S = 0.8;
export const PRICING_COMPLETION_CTA_GLOW_DURATION_S = 1.2;
export const pricingCompletionCtaGlow = {
  boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 40px 8px rgba(59,130,246,0.55)", "0 0 0px rgba(59,130,246,0)"],
} as const;
