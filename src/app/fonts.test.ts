import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, p), "utf8");

describe("DM Sans font wiring", () => {
  it("declares @fontsource/dm-sans as a dependency", () => {
    const pkg = JSON.parse(read("../../package.json"));
    expect(pkg.dependencies["@fontsource/dm-sans"]).toBeTruthy();
  });

  it("imports the DM Sans weights used in the app (400/500/600/700 — 600 is the redesign's semibold)", () => {
    const main = read("../main.tsx");
    for (const w of [400, 500, 600, 700]) {
      expect(main).toContain(`@fontsource/dm-sans/${w}.css`);
    }
  });
});

describe("display font migration", () => {
  it("App.tsx no longer references Newsreader", () => {
    const app = read("./App.tsx");
    expect(app.includes("Newsreader")).toBe(false);
  });

  it("App.tsx uses the DM Sans family class", () => {
    const app = read("./App.tsx");
    expect(app).toContain("font-['DM_Sans',sans-serif]");
  });
});
