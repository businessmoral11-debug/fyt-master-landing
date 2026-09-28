export interface GlobeHotspot {
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lon: number;
  traderRange: [number, number];
}

export const GLOBE_HOTSPOTS: GlobeHotspot[] = [
  { country: "India", countryCode: "IN", flag: "🇮🇳", lat: 19.076, lon: 72.8777, traderRange: [4451, 4452] },
  { country: "Pakistan", countryCode: "PK", flag: "🇵🇰", lat: 24.8607, lon: 67.0011, traderRange: [2409, 2410] },
  { country: "United States", countryCode: "US", flag: "🇺🇸", lat: 40.7128, lon: -74.006, traderRange: [2107, 2108] },
  { country: "Canada", countryCode: "CA", flag: "🇨🇦", lat: 43.6532, lon: -79.3832, traderRange: [1045, 1046] },
  { country: "United Kingdom", countryCode: "GB", flag: "🇬🇧", lat: 51.5074, lon: -0.1278, traderRange: [1652, 1653] },
  { country: "Netherlands", countryCode: "NL", flag: "🇳🇱", lat: 52.3676, lon: 4.9041, traderRange: [593, 594] },
  { country: "France", countryCode: "FR", flag: "🇫🇷", lat: 48.8566, lon: 2.3522, traderRange: [708, 709] },
  { country: "Saudi Arabia", countryCode: "SA", flag: "🇸🇦", lat: 24.7136, lon: 46.6753, traderRange: [1149, 1150] },
  { country: "Malaysia", countryCode: "MY", flag: "🇲🇾", lat: 3.139, lon: 101.6869, traderRange: [1301, 1302] },
  { country: "Australia", countryCode: "AU", flag: "🇦🇺", lat: -33.8688, lon: 151.2093, traderRange: [944, 945] },
  { country: "Czech Republic", countryCode: "CZ", flag: "🇨🇿", lat: 50.0755, lon: 14.4378, traderRange: [406, 407] },
  { country: "Vietnam", countryCode: "VN", flag: "🇻🇳", lat: 10.8231, lon: 106.6297, traderRange: [897, 898] },
  { country: "Norway", countryCode: "NO", flag: "🇳🇴", lat: 59.9139, lon: 10.7522, traderRange: [351, 352] },
  { country: "Portugal", countryCode: "PT", flag: "🇵🇹", lat: 38.7223, lon: -9.1393, traderRange: [442, 443] },
];

export interface GlobeRoute {
  from: string;
  to: string;
}

export const GLOBE_ROUTES: GlobeRoute[] = [
  { from: "United States", to: "India" },
  { from: "India", to: "Malaysia" },
  { from: "United Kingdom", to: "Saudi Arabia" },
  { from: "Australia", to: "Vietnam" },
];

export const GLOBE_OCEAN_COLOR = "#08111F";
export const GLOBE_LAND_COLOR = "#F4F7FF";
export const GLOBE_ROUTE_COLOR = "#4DA3FF";
export const GLOBE_GLOW_COLOR = "rgba(77,163,255,0.25)";
export const GLOBE_MARKER_COLOR = GLOBE_ROUTE_COLOR;
export const GLOBE_ARC_COLOR = GLOBE_ROUTE_COLOR;
export const GLOBE_ATMOSPHERE_COLOR = GLOBE_ROUTE_COLOR;

export const GLOBE_AUTOROTATE_SPEED = 0.8;
export const GLOBE_MARKER_PULSE_PERIOD_S = 3.2;
export const GLOBE_MARKER_UPDATE_INTERVAL_MS = 400;

export const GLOBE_LABEL_COUNT_MIN = 3;
export const GLOBE_LABEL_COUNT_MAX = 5;
export const GLOBE_LABEL_CYCLE_MIN_MS = 4000;
export const GLOBE_LABEL_CYCLE_MAX_MS = 6000;

export const GLOBE_ROUTE_ACTIVE_MIN = 2;
export const GLOBE_ROUTE_ACTIVE_MAX = 4;
export const GLOBE_ROUTE_CYCLE_MS = 7000;
export const GLOBE_ARC_DASH_ANIMATE_MS = 1800;

const fallbackTraderCountCache = new Map<string, number>();

export function randomTraderCount(hotspot: GlobeHotspot): number {
  const cached = fallbackTraderCountCache.get(hotspot.countryCode);
  if (cached !== undefined) return cached;
  const [min, max] = hotspot.traderRange;
  const value = Math.floor(min + Math.random() * (max - min));
  fallbackTraderCountCache.set(hotspot.countryCode, value);
  return value;
}

export function resolveTraderCount(hotspot: GlobeHotspot, liveStats: ReadonlyMap<string, number>): number {
  const live = liveStats.get(hotspot.countryCode);
  return live !== undefined ? live : randomTraderCount(hotspot);
}
