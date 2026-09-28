import type { Transition, Variants } from "motion/react";

const FOOTER_SPRING: Transition = { type: "spring", duration: 0.7, bounce: 0 };

export const FOOTER_LOGO_REVEAL: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const FOOTER_COLUMN_STAGGER_S = 0.12;

export const FOOTER_COLUMNS_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: FOOTER_COLUMN_STAGGER_S } },
};

export const FOOTER_COLUMN_REVEAL: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: FOOTER_SPRING },
};

export const FOOTER_TOPLINE_PERIOD_S = 13;

export const FOOTER_CTA_REVEAL: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: FOOTER_SPRING },
};

export const FOOTER_CTA_GLOW_PULSE_PERIOD_S = 5;
