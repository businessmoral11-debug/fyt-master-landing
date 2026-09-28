
export interface CardReveal {
  fadeStart: number;
  fadeEnd: number;
  fromX: number;
  fromY: number;
}

export const PROVE_SKILL_SCROLL_HEIGHT_VH = 220;

export const PROVE_SKILL_CARD_REVEALS: readonly CardReveal[] = [
  { fadeStart: 0,    fadeEnd: 0.3,  fromX: -24, fromY: -24 },
  { fadeStart: 0,    fadeEnd: 0.3,  fromX: 24,  fromY: -24 },
  { fadeStart: 0.38, fadeEnd: 0.6,  fromX: -24, fromY: 24 },
  { fadeStart: 0.38, fadeEnd: 0.6,  fromX: 24,  fromY: 24 },
  { fadeStart: 0.68, fadeEnd: 0.97, fromX: 0,   fromY: 24 },
];

export const PROVE_SKILL_MOBILE_SCROLL_HEIGHT_VH = 200;

export const PROVE_SKILL_MOBILE_CARD_REVEALS: readonly CardReveal[] = [
  { fadeStart: 0,    fadeEnd: 0.3,  fromX: 0, fromY: 24 },
  { fadeStart: 0,    fadeEnd: 0.3,  fromX: 0, fromY: 24 },
  { fadeStart: 0.38, fadeEnd: 0.6,  fromX: 0, fromY: 24 },
  { fadeStart: 0.38, fadeEnd: 0.6,  fromX: 0, fromY: 24 },
  { fadeStart: 0.68, fadeEnd: 0.97, fromX: 0, fromY: 24 },
];
