export const WORLD_MAP_VIEW_WIDTH = 1264;
export const WORLD_MAP_VIEW_HEIGHT = 632;

export interface ProjectedPoint {
  x: number;
  y: number;
}

export function projectLonLat(lon: number, lat: number): ProjectedPoint {
  const x = ((lon + 180) / 360) * WORLD_MAP_VIEW_WIDTH;
  const y = ((90 - lat) / 180) * WORLD_MAP_VIEW_HEIGHT;
  return { x, y };
}

const ARC_BULGE_PX = 158;

export function arcPath(a: ProjectedPoint, b: ProjectedPoint): string {
  const cx = (a.x + b.x) / 2;
  const cy = Math.min(a.y, b.y) - ARC_BULGE_PX;
  return `M ${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`;
}
