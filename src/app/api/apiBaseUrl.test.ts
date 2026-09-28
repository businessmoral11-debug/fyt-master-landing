import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

async function freshApiBaseUrl() {
  vi.resetModules();
  const mod = await import("./apiBaseUrl");
  return mod.API_BASE_URL;
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("API_BASE_URL — portability: the backend origin must be configurable without a source edit", () => {
  it("falls back to the real production backend when VITE_API_BASE_URL is unset (zero-config local dev/eval)", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    const url = await freshApiBaseUrl();
    expect(url).toBe("https://rewards.fundingyourtrades.com/api/v1");
  });

  it("uses VITE_API_BASE_URL when set — this is the ONLY thing a client deploying to a different domain needs to change", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.client-domain.com/api/v1");
    const url = await freshApiBaseUrl();
    expect(url).toBe("https://api.client-domain.com/api/v1");
  });

  it("strips a trailing slash so callers can safely append their own leading slash", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.client-domain.com/api/v1/");
    const url = await freshApiBaseUrl();
    expect(url).toBe("https://api.client-domain.com/api/v1");
  });
});
