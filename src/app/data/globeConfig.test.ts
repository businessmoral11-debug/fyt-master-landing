import { describe, it, expect } from "vitest";
import {
  GLOBE_HOTSPOTS,
  GLOBE_ROUTES,
  GLOBE_LABEL_COUNT_MIN,
  GLOBE_LABEL_COUNT_MAX,
  GLOBE_ROUTE_ACTIVE_MIN,
  GLOBE_ROUTE_ACTIVE_MAX,
  randomTraderCount,
  resolveTraderCount,
} from "./globeConfig";

describe("GLOBE_HOTSPOTS", () => {
  it("includes the 14 named countries from the brief", () => {
    const names = GLOBE_HOTSPOTS.map((h) => h.country);
    for (const expected of ["India", "Pakistan", "United States", "Canada", "United Kingdom", "Netherlands", "France", "Saudi Arabia", "Malaysia", "Australia", "Czech Republic", "Vietnam", "Norway", "Portugal"]) {
      expect(names).toContain(expected);
    }
  });

  it("keeps every lat/lon within valid real-world bounds", () => {
    for (const h of GLOBE_HOTSPOTS) {
      expect(h.lat).toBeGreaterThanOrEqual(-90);
      expect(h.lat).toBeLessThanOrEqual(90);
      expect(h.lon).toBeGreaterThanOrEqual(-180);
      expect(h.lon).toBeLessThanOrEqual(180);
    }
  });

  it("gives every hotspot a valid, positive trader range", () => {
    for (const h of GLOBE_HOTSPOTS) {
      const [min, max] = h.traderRange;
      expect(min).toBeGreaterThan(0);
      expect(max).toBeGreaterThan(min);
    }
  });

  it("gives every hotspot a unique, well-formed ISO alpha-2 country code (the Globe Stats API join key)", () => {
    const codes = GLOBE_HOTSPOTS.map((h) => h.countryCode);
    for (const code of codes) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("resolveTraderCount", () => {
  it("uses the live figure when the hotspot's country code is present in liveStats", () => {
    const hotspot = GLOBE_HOTSPOTS.find((h) => h.countryCode === "IN")!;
    const liveStats = new Map([["IN", 900]]);
    expect(resolveTraderCount(hotspot, liveStats)).toBe(900);
  });

  it("uses the live figure even when it is 0 (a real, admin-set zero, not \"no data\")", () => {
    const hotspot = GLOBE_HOTSPOTS.find((h) => h.countryCode === "IN")!;
    const liveStats = new Map([["IN", 0]]);
    expect(resolveTraderCount(hotspot, liveStats)).toBe(0);
  });

  it("falls back to randomTraderCount's range when liveStats has no entry for this hotspot", () => {
    const hotspot = GLOBE_HOTSPOTS.find((h) => h.countryCode === "IN")!;
    const liveStats = new Map([["US", 3000]]);
    const n = resolveTraderCount(hotspot, liveStats);
    expect(n).toBeGreaterThanOrEqual(hotspot.traderRange[0]);
    expect(n).toBeLessThan(hotspot.traderRange[1]);
  });

  it("falls back to randomTraderCount's range when liveStats is empty (API unavailable)", () => {
    const hotspot = GLOBE_HOTSPOTS.find((h) => h.countryCode === "IN")!;
    const n = resolveTraderCount(hotspot, new Map());
    expect(n).toBeGreaterThanOrEqual(hotspot.traderRange[0]);
    expect(n).toBeLessThan(hotspot.traderRange[1]);
  });
});

describe("GLOBE_ROUTES", () => {
  it("references only valid hotspot countries", () => {
    const names = new Set(GLOBE_HOTSPOTS.map((h) => h.country));
    for (const r of GLOBE_ROUTES) {
      expect(names.has(r.from)).toBe(true);
      expect(names.has(r.to)).toBe(true);
      expect(r.from).not.toBe(r.to);
    }
  });

  it("has enough routes to support the requested 2-4 active at once", () => {
    expect(GLOBE_ROUTES.length).toBeGreaterThanOrEqual(GLOBE_ROUTE_ACTIVE_MAX);
  });
});

describe("randomTraderCount", () => {
  it("always falls within the hotspot's own range", () => {
    const hotspot = GLOBE_HOTSPOTS[0];
    for (let i = 0; i < 50; i++) {
      const n = randomTraderCount(hotspot);
      expect(n).toBeGreaterThanOrEqual(hotspot.traderRange[0]);
      expect(n).toBeLessThan(hotspot.traderRange[1]);
    }
  });

  it("returns the same value on every call for the same country (session-stable fallback, not regenerated per call)", () => {
    const hotspot = GLOBE_HOTSPOTS.find((h) => h.countryCode === "CA")!;
    const first = randomTraderCount(hotspot);
    for (let i = 0; i < 20; i++) {
      expect(randomTraderCount(hotspot)).toBe(first);
    }
  });

  it("caches independently per country", () => {
    const us = GLOBE_HOTSPOTS.find((h) => h.countryCode === "US")!;
    const ca = GLOBE_HOTSPOTS.find((h) => h.countryCode === "CA")!;
    const usValue = randomTraderCount(us);
    const caValue = randomTraderCount(ca);
    expect(randomTraderCount(us)).toBe(usValue);
    expect(randomTraderCount(ca)).toBe(caValue);
  });
});

describe("resolveTraderCount: live data always wins over a cached fallback", () => {
  it("switches to the live value immediately once liveStats has the country, even after fallback was already cached", () => {
    const hotspot = GLOBE_HOTSPOTS.find((h) => h.countryCode === "MY")!;
    const fallback = resolveTraderCount(hotspot, new Map());
    expect(fallback).toBeGreaterThanOrEqual(hotspot.traderRange[0]);
    const live = resolveTraderCount(hotspot, new Map([["MY", 775]]));
    expect(live).toBe(775);
  });
});

describe("label/route count bounds", () => {
  it("keeps label count within the requested 3-5", () => {
    expect(GLOBE_LABEL_COUNT_MIN).toBeGreaterThanOrEqual(3);
    expect(GLOBE_LABEL_COUNT_MAX).toBeLessThanOrEqual(5);
  });

  it("keeps active route count within the requested 2-4", () => {
    expect(GLOBE_ROUTE_ACTIVE_MIN).toBeGreaterThanOrEqual(2);
    expect(GLOBE_ROUTE_ACTIVE_MAX).toBeLessThanOrEqual(4);
  });
});
