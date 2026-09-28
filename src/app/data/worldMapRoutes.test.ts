import { describe, it, expect } from "vitest";
import { WORLD_MAP_CITIES, WORLD_MAP_ARCS } from "./worldMapRoutes";

describe("WORLD_MAP_CITIES", () => {
  it("has the same 22 cities as the original implementation, in the same order", () => {
    expect(WORLD_MAP_CITIES.map((c) => c.label)).toEqual([
      "New York",
      "Los Angeles",
      "Chicago",
      "São Paulo",
      "Buenos Aires",
      "London",
      "Paris",
      "Berlin",
      "Moscow",
      "Cairo",
      "Lagos",
      "Nairobi",
      "Johannesburg",
      "Dubai",
      "Mumbai",
      "Delhi",
      "Singapore",
      "Beijing",
      "Tokyo",
      "Shanghai",
      "Sydney",
      "Auckland",
    ]);
  });

  it("keeps every latitude/longitude within valid real-world bounds", () => {
    for (const city of WORLD_MAP_CITIES) {
      expect(city.lat).toBeGreaterThanOrEqual(-90);
      expect(city.lat).toBeLessThanOrEqual(90);
      expect(city.lon).toBeGreaterThanOrEqual(-180);
      expect(city.lon).toBeLessThanOrEqual(180);
    }
  });

  it("places southern-hemisphere cities with negative latitude", () => {
    const byLabel = Object.fromEntries(WORLD_MAP_CITIES.map((c) => [c.label, c]));
    for (const label of ["São Paulo", "Buenos Aires", "Nairobi", "Johannesburg", "Sydney", "Auckland"]) {
      expect(byLabel[label].lat).toBeLessThan(0);
    }
  });

  it("places each city in the correct hemisphere relative to the prime meridian", () => {
    const byLabel = Object.fromEntries(WORLD_MAP_CITIES.map((c) => [c.label, c]));
    for (const label of ["New York", "Los Angeles", "Chicago", "São Paulo", "Buenos Aires", "London"]) {
      expect(byLabel[label].lon).toBeLessThan(0);
    }
    for (const label of ["Dubai", "Mumbai", "Delhi", "Singapore", "Beijing", "Tokyo", "Shanghai", "Sydney"]) {
      expect(byLabel[label].lon).toBeGreaterThan(0);
    }
  });
});

describe("WORLD_MAP_ARCS", () => {
  it("has the same 6 arcs as the original implementation, with the same timing", () => {
    expect(WORLD_MAP_ARCS).toEqual([
      { from: 0, to: 5, dur: "3s", begin: "0s", trailBegin: "0.3s" },
      { from: 5, to: 13, dur: "2.8s", begin: "1s", trailBegin: "1.3s" },
      { from: 13, to: 18, dur: "3.2s", begin: "2s", trailBegin: "2.3s" },
      { from: 0, to: 3, dur: "2.5s", begin: "0.5s", trailBegin: "0.8s" },
      { from: 18, to: 20, dur: "2.6s", begin: "1.5s", trailBegin: "1.8s" },
      { from: 5, to: 10, dur: "2.4s", begin: "3s", trailBegin: "3.3s" },
    ]);
  });

  it("references only valid WORLD_MAP_CITIES indices", () => {
    for (const arc of WORLD_MAP_ARCS) {
      expect(WORLD_MAP_CITIES[arc.from]).toBeDefined();
      expect(WORLD_MAP_CITIES[arc.to]).toBeDefined();
    }
  });

  it("connects the same named city pairs as the original implementation", () => {
    const label = (i: number) => WORLD_MAP_CITIES[i].label;
    expect(WORLD_MAP_ARCS.map((a) => [label(a.from), label(a.to)])).toEqual([
      ["New York", "London"],
      ["London", "Dubai"],
      ["Dubai", "Tokyo"],
      ["New York", "São Paulo"],
      ["Tokyo", "Sydney"],
      ["London", "Lagos"],
    ]);
  });
});
