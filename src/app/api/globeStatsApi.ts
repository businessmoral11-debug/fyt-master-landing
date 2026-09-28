
import { API_BASE_URL } from "@/app/api/apiBaseUrl";

const GLOBE_STATS_API_URL = `${API_BASE_URL}/public/globe-stats`;

const FETCH_TIMEOUT_MS = 6000;

export interface PublicGlobeStat {
  countryCode: string;
  countryName: string;
  traderCount: number;
}

interface GlobeStatsEnvelope {
  success: boolean;
  data?: { countries?: unknown };
}

/** Validates one record from the feed — malformed/partial entries are dropped, never thrown on (Phase 8: "Invalid/missing country data: ignore invalid records safely"). */
function isValidGlobeStat(value: unknown): value is PublicGlobeStat {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.countryCode === "string" &&
    v.countryCode.length === 2 &&
    typeof v.countryName === "string" &&
    v.countryName.length > 0 &&
    typeof v.traderCount === "number" &&
    Number.isInteger(v.traderCount) &&
    v.traderCount >= 0
  );
}

let cachedStatsPromise: Promise<Map<string, number>> | null = null;

export function fetchGlobeStats(): Promise<Map<string, number>> {
  if (cachedStatsPromise) return cachedStatsPromise;
  cachedStatsPromise = (async () => {
    try {
      const res = await fetch(GLOBE_STATS_API_URL, {
        cache: "no-store",
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(FETCH_TIMEOUT_MS) : undefined,
      });
      if (!res.ok) throw new Error(`globe-stats fetch failed: ${res.status}`);
      const body = (await res.json()) as GlobeStatsEnvelope;
      const countries = body?.data?.countries;
      if (!Array.isArray(countries)) throw new Error("globe-stats: malformed response");

      const map = new Map<string, number>();
      for (const entry of countries) {
        if (isValidGlobeStat(entry)) {
          map.set(entry.countryCode.toUpperCase(), entry.traderCount);
        }
      }
      return map;
    } catch {
      return new Map<string, number>();
    }
  })();
  return cachedStatsPromise;
}
