import { describe, it, expect } from "vitest";
import { extractArrayLiteral, sanitizeToJson } from "./parseProductsConfig.mjs";

describe("extractArrayLiteral", () => {
  it("extracts a simple array literal after the marker", () => {
    const html = `<script>const X = [1, 2, 3];</script>`;
    expect(extractArrayLiteral(html, "const X =")).toBe("[1, 2, 3]");
  });

  it("is bracket-depth aware across nested objects and arrays", () => {
    const html = `const X = [{ a: [1, 2], b: { c: [3] } }, { d: 4 }];`;
    expect(extractArrayLiteral(html, "const X =")).toBe(
      "[{ a: [1, 2], b: { c: [3] } }, { d: 4 }]"
    );
  });

  it("does not get confused by [ or ] characters inside quoted strings", () => {
    const html = `const X = [{ note: "array-ish [not really]" }, { n: 2 }];`;
    expect(extractArrayLiteral(html, "const X =")).toBe(
      '[{ note: "array-ish [not really]" }, { n: 2 }]'
    );
  });

  it("extracts only the first of two same-named blocks", () => {
    const html = `const X = [1];\nconst X = [2, 3];`;
    expect(extractArrayLiteral(html, "const X =")).toBe("[1]");
  });

  it("throws when the marker is not found", () => {
    expect(() => extractArrayLiteral("no marker here", "const X =")).toThrow();
  });

  it("throws when the array literal is unterminated", () => {
    expect(() => extractArrayLiteral("const X = [1, 2", "const X =")).toThrow();
  });
});

describe("sanitizeToJson", () => {
  it("quotes bare identifier and numeric keys", () => {
    const out = sanitizeToJson(`[{ id: "fyt", 10000: { priceOld: 114 } }]`);
    expect(JSON.parse(out)).toEqual([{ id: "fyt", "10000": { priceOld: 114 } }]);
  });

  it("strips // line comments without touching // inside a URL string", () => {
    const src = [
      "[",
      "  // a leading comment describing the next entry",
      '  { url: "https://fundingyourtrades.com/checkout/?add-to-cart=1219", priceOld: 309 }',
      "]",
    ].join("\n");
    const parsed = JSON.parse(sanitizeToJson(src));
    expect(parsed).toEqual([
      { url: "https://fundingyourtrades.com/checkout/?add-to-cart=1219", priceOld: 309 },
    ]);
  });

  it("converts single-quoted strings to valid double-quoted JSON strings", () => {
    const out = sanitizeToJson(`[{ name: 'FYT CLASSIC' }]`);
    expect(JSON.parse(out)).toEqual([{ name: "FYT CLASSIC" }]);
  });

  it("removes trailing commas before a closing bracket or brace", () => {
    const out = sanitizeToJson(`[{ a: 1, b: 2, },]`);
    expect(JSON.parse(out)).toEqual([{ a: 1, b: 2 }]);
  });

  it("round-trips a realistic nested product entry", () => {
    const src = [
      "[",
      "  {",
      '    id: "fyt",',
      '    name: "FYT CLASSIC",',
      "    plans: {",
      '      "match-trader": {',
      '        "1-STEP": {',
      '          10000: { share: "18%", priceOld: 114, priceNew: 68.40, url: "https://fundingyourtrades.com/checkout/?add-to-cart=1217" }',
      "        }",
      "      }",
      "    }",
      "  }",
      "]",
    ].join("\n");
    const parsed = JSON.parse(sanitizeToJson(src));
    expect(parsed[0].plans["match-trader"]["1-STEP"]["10000"]).toEqual({
      share: "18%",
      priceOld: 114,
      priceNew: 68.4,
      url: "https://fundingyourtrades.com/checkout/?add-to-cart=1217",
    });
  });
});
