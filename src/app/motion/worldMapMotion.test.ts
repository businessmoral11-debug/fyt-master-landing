import { describe, it, expect } from "vitest";
import {
  hubBreatheDelay,
  WORLD_MAP_HUB_STAGGER_S,
  routeActivateDuration,
  WORLD_MAP_ROUTE_ACTIVATE_MIN_S,
  WORLD_MAP_ROUTE_ACTIVATE_MAX_S,
  routeActivateDelay,
  WORLD_MAP_PARALLAX_MAX_PX,
} from "./worldMapMotion";

describe("hubBreatheDelay", () => {
  it("staggers each subsequent hub by WORLD_MAP_HUB_STAGGER_S", () => {
    expect(hubBreatheDelay(0)).toBe("0.00s");
    expect(hubBreatheDelay(1)).toBe(`${WORLD_MAP_HUB_STAGGER_S.toFixed(2)}s`);
    expect(hubBreatheDelay(2)).toBe(`${(WORLD_MAP_HUB_STAGGER_S * 2).toFixed(2)}s`);
  });
});

describe("routeActivateDuration", () => {
  it("spreads durations across the min-max window", () => {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const dur = routeActivateDuration(i, count);
      expect(dur).toBeGreaterThanOrEqual(WORLD_MAP_ROUTE_ACTIVATE_MIN_S);
      expect(dur).toBeLessThanOrEqual(WORLD_MAP_ROUTE_ACTIVATE_MAX_S);
    }
  });

  it("never divides by zero for a single route", () => {
    expect(routeActivateDuration(0, 1)).toBe(WORLD_MAP_ROUTE_ACTIVATE_MIN_S);
  });
});

describe("routeActivateDelay", () => {
  it("gives each route a distinct, increasing delay", () => {
    const delays = [0, 1, 2, 3].map((i) => Number.parseFloat(routeActivateDelay(i)));
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
  });
});

describe("WORLD_MAP_PARALLAX_MAX_PX", () => {
  it("stays within the requested 3-5px window", () => {
    expect(WORLD_MAP_PARALLAX_MAX_PX).toBeGreaterThanOrEqual(3);
    expect(WORLD_MAP_PARALLAX_MAX_PX).toBeLessThanOrEqual(5);
  });
});
