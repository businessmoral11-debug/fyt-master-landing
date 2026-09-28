
export const HERO_STAGE_WIDTH = 1440;
export const HERO_STAGE_HEIGHT = 1080;

export function heroStageScale(viewportWidth: number): number {
  return viewportWidth / HERO_STAGE_WIDTH;
}

export const HERO_LABEL_BOOST = 0.5;

export function heroLabelScale(stageScale: number): number {
  return HERO_LABEL_BOOST / stageScale;
}
