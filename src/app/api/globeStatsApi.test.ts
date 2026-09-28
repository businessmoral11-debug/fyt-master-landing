import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

async function freshFetchGlobeStats() {
  vi.resetModules();
  const mod = await import("./globeStatsApi");
  return mod.fetchGlobeStats;
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockFetchOnce(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe("fetchGlobeStats", () => {
  it("resolves a Map keyed by upper-cased country code for a well-formed response", async () => {
    mockFetchOnce({
      success: true,
      data: {
        countries: [
          { countryCode: "in", countryName: "India", traderCount: 847 },
          { countryCode: "US", countryName: "United States", traderCount: 1245 },
        ],
      },
    });
    const fetchGlobeStats = await freshFetchGlobeStats();
    const stats = await fetchGlobeStats();
    expect(stats.get("IN")).toBe(847);
    expect(stats.get("US")).toBe(1245);
  });

  it("drops invalid/malformed individual records instead of throwing", async () => {
    mockFetchOnce({
      success: true,
      data: {
        countries: [
          { countryCode: "IN", countryName: "India", traderCount: 847 },
          { countryCode: "USA", countryName: "United States", traderCount: 1245 },
          { countryCode: "DE", countryName: "Germany", traderCount: -5 },
          { countryCode: "GB", countryName: "United Kingdom", traderCount: 12.5 },
          { countryCode: "FR", traderCount: 100 },
          null,
          "not an object",
        ],
      },
    });
    const fetchGlobeStats = await freshFetchGlobeStats();
    const stats = await fetchGlobeStats();
    expect(stats.size).toBe(1);
    expect(stats.get("IN")).toBe(847);
  });

  it("resolves an empty Map (never throws/rejects) on a non-2xx response", async () => {
    mockFetchOnce({ success: false }, { ok: false, status: 500 });
    const fetchGlobeStats = await freshFetchGlobeStats();
    await expect(fetchGlobeStats()).resolves.toEqual(new Map());
  });

  it("resolves an empty Map (never throws/rejects) on a network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;
    const fetchGlobeStats = await freshFetchGlobeStats();
    await expect(fetchGlobeStats()).resolves.toEqual(new Map());
  });

  it("resolves an empty Map (never throws/rejects) on a malformed envelope (missing data.countries)", async () => {
    mockFetchOnce({ success: true, data: {} });
    const fetchGlobeStats = await freshFetchGlobeStats();
    await expect(fetchGlobeStats()).resolves.toEqual(new Map());
  });

  it("resolves an empty Map for an empty countries array", async () => {
    mockFetchOnce({ success: true, data: { countries: [] } });
    const fetchGlobeStats = await freshFetchGlobeStats();
    const stats = await fetchGlobeStats();
    expect(stats.size).toBe(0);
  });

  it("memoizes the result — a second call does not trigger a second fetch", async () => {
    mockFetchOnce({ success: true, data: { countries: [{ countryCode: "IN", countryName: "India", traderCount: 847 }] } });
    const fetchGlobeStats = await freshFetchGlobeStats();
    await fetchGlobeStats();
    await fetchGlobeStats();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
