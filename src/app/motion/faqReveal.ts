import type { Transition, Variants } from "motion/react";


export const FAQ_TITLE_WORD_STAGGER_S = 0.05;

export const FAQ_TITLE_WORD: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

export const FAQ_TITLE_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: FAQ_TITLE_WORD_STAGGER_S } },
};

export const FAQ_ROW_STAGGER_S = 0.08;

const FAQ_SPRING: Transition = { type: "spring", duration: 0.7, bounce: 0 };

export const FAQ_ROWS_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: FAQ_ROW_STAGGER_S } },
};

export const FAQ_ROW_REVEAL: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: FAQ_SPRING },
};

export function faqRowDelay(index: number): number {
  return index * FAQ_ROW_STAGGER_S;
}

export const FAQ_TOPLINE_PERIOD_S = 6;
