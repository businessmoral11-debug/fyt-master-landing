export interface WorldMapHub {
  label: string;
  lat: number;
  lon: number;
}

export const WORLD_MAP_HUBS: WorldMapHub[] = [
  { label: "New York", lat: 40.7128, lon: -74.006 },
  { label: "London", lat: 51.5074, lon: -0.1278 },
  { label: "Dubai", lat: 25.2048, lon: 55.2708 },
  { label: "Singapore", lat: 1.3521, lon: 103.8198 },
  { label: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { label: "Sydney", lat: -33.8688, lon: 151.2093 },
];

export interface WorldMapRoute {
  from: number;
  to: number;
  duration: number;
  /** SMIL animateMotion begin offset, so packets don't all launch at once. */
  delay: number;
  pauses?: boolean;
}

export const WORLD_MAP_ROUTES: WorldMapRoute[] = [
  { from: 0, to: 1, duration: 5.5, delay: 0, pauses: true },
  { from: 1, to: 2, duration: 6.5, delay: 0.8 },
  { from: 2, to: 3, duration: 5, delay: 1.6, pauses: true },
  { from: 3, to: 4, duration: 4.5, delay: 2.4 },
  { from: 4, to: 5, duration: 6, delay: 3.2 },
  { from: 0, to: 2, duration: 7, delay: 1.1 },
  { from: 1, to: 3, duration: 7.5, delay: 2.0, pauses: true },
  { from: 2, to: 4, duration: 5.8, delay: 0.5 },
  { from: 5, to: 3, duration: 5.2, delay: 2.9 },
  { from: 0, to: 4, duration: 8, delay: 1.7 },
];
