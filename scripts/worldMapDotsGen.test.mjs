import { describe, it, expect } from "vitest";
import { pointInRing, pointInMultiPolygon, sampleLandGrid } from "./worldMapDotsGen.mjs";

describe("pointInRing", () => {
  const square = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ];

  it("returns true for a point inside the ring", () => {
    expect(pointInRing(5, 5, square)).toBe(true);
  });

  it("returns false for a point outside the ring", () => {
    expect(pointInRing(15, 15, square)).toBe(false);
    expect(pointInRing(5, -1, square)).toBe(false);
  });
});

describe("pointInMultiPolygon", () => {
  it("excludes points inside a hole", () => {
    const outer = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ];
    const hole = [
      [3, 3],
      [7, 3],
      [7, 7],
      [3, 7],
    ];
    const multiPolygon = [[outer, hole]];

    expect(pointInMultiPolygon(5, 5, multiPolygon)).toBe(false);
    expect(pointInMultiPolygon(1, 1, multiPolygon)).toBe(true);
  });

  it("finds points across disjoint polygons", () => {
    const squareA = [
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
      ],
    ];
    const squareB = [
      [
        [20, 20],
        [30, 20],
        [30, 30],
        [20, 30],
      ],
    ];
    const multiPolygon = [squareA[0], squareB[0]].map((ring) => [ring]);

    expect(pointInMultiPolygon(25, 25, multiPolygon)).toBe(true);
    expect(pointInMultiPolygon(15, 15, multiPolygon)).toBe(false);
  });
});

describe("sampleLandGrid", () => {
  it("samples only grid points that fall inside the polygon, on the given step", () => {
    const square = [
      [
        [-3, -3],
        [13, -3],
        [13, 13],
        [-3, 13],
      ],
    ];
    const points = sampleLandGrid([square], 5);

    expect(points).toHaveLength(9);
    expect(points).toContainEqual([0, 0]);
    expect(points).toContainEqual([5, 5]);
    expect(points).toContainEqual([10, 10]);
    expect(points).not.toContainEqual([15, 15]);
    expect(points).not.toContainEqual([-180, -90]);
  });
});
