import type { Transition, Variants } from "motion/react";

const TESTIMONIAL_SPRING: Transition = { type: "spring", duration: 1, bounce: 0 };

export const TESTIMONIAL_HEADING_REVEAL: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export const TESTIMONIAL_GRID_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export type TestimonialColumnRole = "left" | "center" | "right";

export function testimonialColumnRole(index: number, length: number): TestimonialColumnRole {
  if (length <= 1) return "center";
  if (index === 0) return "left";
  if (index === length - 1) return "right";
  return "center";
}

const RESTING_SHADOW = "0 4px 14px rgba(0,0,0,0.05)";
const PEAK_GLOW_SHADOW = "0 24px 48px -12px rgba(59,130,246,0.28)";
const SETTLED_SHADOW = "0 10px 28px -10px rgba(15,23,42,0.12)";

export const TESTIMONIAL_CARD_REVEAL: Variants = {
  hidden: (role: TestimonialColumnRole) => {
    if (role === "left") return { x: -180, y: 0, opacity: 0, filter: "blur(14px)", scale: 0.96, rotateY: -8, boxShadow: RESTING_SHADOW };
    if (role === "right") return { x: 180, y: 0, opacity: 0, filter: "blur(14px)", scale: 0.96, rotateY: 8, boxShadow: RESTING_SHADOW };
    return { x: 0, y: 40, opacity: 0, filter: "blur(10px)", scale: 1, rotateY: 0, boxShadow: RESTING_SHADOW };
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    rotateY: 0,
    boxShadow: [RESTING_SHADOW, PEAK_GLOW_SHADOW, SETTLED_SHADOW],
    transition: {
      default: TESTIMONIAL_SPRING,
      boxShadow: { duration: 1, times: [0, 0.6, 1], ease: "easeOut" },
    },
  },
};

export const TESTIMONIAL_CARD_HOVER = { y: -6, scale: 1.02, boxShadow: "0 20px 45px -10px rgba(59,130,246,0.35)" };
export const TESTIMONIAL_CARD_HOVER_TRANSITION: Transition = { duration: 0.25, ease: "easeOut" };

export const TESTIMONIAL_CTA_REVEAL: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } },
};

export const TESTIMONIAL_MOBILE_CARD_REVEAL: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: TESTIMONIAL_SPRING },
};
