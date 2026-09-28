import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("rewardsApi.ts — portability: featured-payouts/featured-certificates follow the configurable API_BASE_URL", () => {
  it("fetches featured payouts from a client-configured backend, not a hardcoded domain", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.client-domain.com/api/v1");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", data: [], meta: { pagination: {} } }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    vi.resetModules();
    const mod = await import("./rewardsApi");
    await mod.fetchFeaturedPayouts(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl.startsWith("https://api.client-domain.com/api/v1/public/featured-payouts")).toBe(true);
    expect(calledUrl).not.toContain("rewards.fundingyourtrades.com");
  });
});
