import { describe, it, expect } from "vitest";
import { WORLD_MAP_HUBS, WORLD_MAP_ROUTES } from "./worldMapNetwork";

describe("WORLD_MAP_HUBS", () => {
  it("has 6-8 major hubs, per the brief", () => {
    expect(WORLD_MAP_HUBS.length).toBeGreaterThanOrEqual(6);
    expect(WORLD_MAP_HUBS.length).toBeLessThanOrEqual(8);
  });

  it("keeps every latitude/longitude within valid real-world bounds", () => {
    for (const hub of WORLD_MAP_HUBS) {
      expect(hub.lat).toBeGreaterThanOrEqual(-90);
      expect(hub.lat).toBeLessThanOrEqual(90);
      expect(hub.lon).toBeGreaterThanOrEqual(-180);
      expect(hub.lon).toBeLessThanOrEqual(180);
    }
  });

  it("includes the named financial hubs from the brief", () => {
    const labels = WORLD_MAP_HUBS.map((h) => h.label);
    for (const expected of ["New York", "London", "Dubai", "Singapore", "Tokyo", "Sydney"]) {
      expect(labels).toContain(expected);
    }
  });
});

describe("WORLD_MAP_ROUTES", () => {
  it("has 8-12 routes, per the brief", () => {
    expect(WORLD_MAP_ROUTES.length).toBeGreaterThanOrEqual(8);
    expect(WORLD_MAP_ROUTES.length).toBeLessThanOrEqual(12);
  });

  it("references only valid WORLD_MAP_HUBS indices", () => {
    for (const route of WORLD_MAP_ROUTES) {
      expect(WORLD_MAP_HUBS[route.from]).toBeDefined();
      expect(WORLD_MAP_HUBS[route.to]).toBeDefined();
      expect(route.from).not.toBe(route.to);
    }
  });

  it("gives every route a positive, finite duration and delay", () => {
    for (const route of WORLD_MAP_ROUTES) {
      expect(route.duration).toBeGreaterThan(0);
      expect(route.delay).toBeGreaterThanOrEqual(0);
    }
  });

  it("has at least one, but not every, route pause", () => {
    const pausing = WORLD_MAP_ROUTES.filter((r) => r.pauses).length;
    expect(pausing).toBeGreaterThan(0);
    expect(pausing).toBeLessThan(WORLD_MAP_ROUTES.length);
  });

  it("never gives any single hub more than 4 connections (no spaghetti)", () => {
    const degree = new Map<number, number>();
    for (const route of WORLD_MAP_ROUTES) {
      degree.set(route.from, (degree.get(route.from) ?? 0) + 1);
      degree.set(route.to, (degree.get(route.to) ?? 0) + 1);
    }
    for (const count of degree.values()) {
      expect(count).toBeLessThanOrEqual(4);
    }
  });
});
