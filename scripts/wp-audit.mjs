import { chromium } from "playwright";
const B = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/";
await new Promise((r) => setTimeout(r, 140000));
const out = [];
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1366, 700]]) for (const v of ["a", "b", "c"]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(B + "?country=IN&layout=" + v, { waitUntil: "load", timeout: 60000 });
  await p.waitForSelector("#challenge");
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  const at = async (n, y) => { await p.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y); await p.waitForTimeout(800); await p.screenshot({ path: `ci-out/${w}-${v}-${n}.png` }); };
  await at(1, y0 + 60);
  if (v === "b") { await p.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(500); await p.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(500); await p.screenshot({ path: `ci-out/${w}-b-3.png` }); }
  if (v === "c") { await at(2, y0 + 600); await at(3, y0 + 1500); }
  out.push(`${w} ${v} errs ${JSON.stringify(errs)}`);
}
console.log(out.join("\n"));
await b.close();
