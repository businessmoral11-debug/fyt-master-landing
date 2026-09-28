import { describe, it, expect } from "vitest";
import {
  WORLD_MAP_VIEW_WIDTH,
  WORLD_MAP_VIEW_HEIGHT,
  projectLonLat,
  arcPath,
} from "./worldMapProjection";

describe("WORLD_MAP_VIEW_WIDTH / WORLD_MAP_VIEW_HEIGHT", () => {
  it("is a true 2:1 equirectangular viewBox", () => {
    expect(WORLD_MAP_VIEW_WIDTH / WORLD_MAP_VIEW_HEIGHT).toBe(2);
  });
});

describe("projectLonLat", () => {
  it("maps the four corners of the world to the four corners of the viewBox", () => {
    expect(projectLonLat(-180, 90)).toEqual({ x: 0, y: 0 });
    expect(projectLonLat(180, 90)).toEqual({ x: WORLD_MAP_VIEW_WIDTH, y: 0 });
    expect(projectLonLat(-180, -90)).toEqual({ x: 0, y: WORLD_MAP_VIEW_HEIGHT });
    expect(projectLonLat(180, -90)).toEqual({ x: WORLD_MAP_VIEW_WIDTH, y: WORLD_MAP_VIEW_HEIGHT });
  });

  it("maps (0, 0) to the exact center of the viewBox", () => {
    expect(projectLonLat(0, 0)).toEqual({ x: WORLD_MAP_VIEW_WIDTH / 2, y: WORLD_MAP_VIEW_HEIGHT / 2 });
  });

  it("increasing latitude moves the point up (smaller y)", () => {
    expect(projectLonLat(0, 45).y).toBeLessThan(projectLonLat(0, 0).y);
  });

  it("increasing longitude moves the point right (larger x)", () => {
    expect(projectLonLat(45, 0).x).toBeGreaterThan(projectLonLat(0, 0).x);
  });
});

describe("arcPath", () => {
  it("builds a quadratic bezier path string bulging upward between two points", () => {
    const a = { x: 100, y: 200 };
    const b = { x: 300, y: 250 };
    const d = arcPath(a, b);

    expect(d.startsWith("M 100,200 Q ")).toBe(true);
    expect(d.endsWith(" 300,250")).toBe(true);

    const controlY = Number(d.match(/Q [\d.-]+,([\d.-]+)/)?.[1]);
    expect(controlY).toBeLessThan(Math.min(a.y, b.y));
  });

  it("centers the control point horizontally between the two endpoints", () => {
    const a = { x: 100, y: 200 };
    const b = { x: 300, y: 200 };
    const d = arcPath(a, b);
    const controlX = Number(d.match(/Q ([\d.-]+),/)?.[1]);
    expect(controlX).toBe(200);
  });
});
