import { describe, it, expect } from "vitest";
import { parseCountUpSegments, renderCountUp } from "./countUp";

describe("parseCountUpSegments / renderCountUp round-trip", () => {
  const cases = ["$2.6M+", "14,000+", "105+", "24-48H"];

  it.each(cases)("renders the exact original string at t=1 for %s", (raw) => {
    expect(renderCountUp(parseCountUpSegments(raw), 1)).toBe(raw);
  });

  it.each(cases)("renders all numeric parts as zero at t=0 for %s", (raw) => {
    const rendered = renderCountUp(parseCountUpSegments(raw), 0);
    for (const seg of parseCountUpSegments(raw)) {
      if (seg.kind === "number") {
        expect(rendered).not.toMatch(new RegExp(seg.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      }
    }
  });

  it("clamps progress outside [0, 1]", () => {
    const segments = parseCountUpSegments("105+");
    expect(renderCountUp(segments, -0.5)).toBe(renderCountUp(segments, 0));
    expect(renderCountUp(segments, 1.5)).toBe(renderCountUp(segments, 1));
  });

  it("preserves thousands separators mid-animation", () => {
    const segments = parseCountUpSegments("14,000+");
    expect(renderCountUp(segments, 0.5)).toBe("7,000+");
  });

  it("preserves decimal places mid-animation", () => {
    const segments = parseCountUpSegments("$2.6M+");
    expect(renderCountUp(segments, 0.5)).toBe("$1.3M+");
  });
});
