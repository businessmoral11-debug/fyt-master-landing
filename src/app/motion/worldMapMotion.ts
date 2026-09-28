
export const WORLD_MAP_HUB_BREATHE_DURATION_S = 3.6;
export const WORLD_MAP_HUB_STAGGER_S = 0.7;

export function hubBreatheDelay(hubIndex: number): string {
  return `${(hubIndex * WORLD_MAP_HUB_STAGGER_S).toFixed(2)}s`;
}

export const WORLD_MAP_ROUTE_ACTIVATE_MIN_S = 10;
export const WORLD_MAP_ROUTE_ACTIVATE_MAX_S = 16;

export function routeActivateDuration(routeIndex: number, routeCount: number): number {
  if (routeCount <= 1) return WORLD_MAP_ROUTE_ACTIVATE_MIN_S;
  const span = WORLD_MAP_ROUTE_ACTIVATE_MAX_S - WORLD_MAP_ROUTE_ACTIVATE_MIN_S;
  return WORLD_MAP_ROUTE_ACTIVATE_MIN_S + (routeIndex / (routeCount - 1)) * span;
}

export function routeActivateDelay(routeIndex: number): string {
  return `${(routeIndex * 0.9).toFixed(2)}s`;
}

export const WORLD_MAP_PARALLAX_MAX_PX = 4;

export const WORLD_MAP_PARTICLE_COUNT = 8;

export const WORLD_MAP_GLOW_BREATHE_PERIOD_S = 12;
