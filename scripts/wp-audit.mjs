import { chromium } from "playwright";
const B = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/";
await new Promise((r) => setTimeout(r, 140000));
const out = [];
const b = await chromium.launch();
for (const v of ["current", "a", "b", "c"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && !/klaviyo|trustindex|favicon|intercom/i.test(m.text()) && errs.push(m.text().slice(0, 200)));
  await p.goto(B + "?country=IN&layout=" + v, { waitUntil: "load", timeout: 60000 });
  await p.waitForSelector("#challenge", { timeout: 30000 });
  const top = async () => p.evaluate(() => Math.round(document.getElementById("challenge").getBoundingClientRect().top + scrollY));
  const y0 = await top();
  const shot = async (name, y) => { await p.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y); await p.waitForTimeout(900); await p.screenshot({ path: `ci-out/${v}-${name}.png` }); };
  await shot("1", y0);
  if (v === "a") { await shot("2", y0 + 450); }
  if (v === "b") {
    await p.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(600); await p.screenshot({ path: `ci-out/b-2.png` });
    await p.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(600); await p.screenshot({ path: `ci-out/b-3.png` });
    await p.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(600); await p.screenshot({ path: `ci-out/b-4.png` });
  }
  if (v === "c") {
    await shot("2", y0 + 700); await shot("3", y0 + 1300); await shot("4", y0 + 2000); await shot("5", y0 + 2900);
  }
  const h = await p.evaluate(() => document.getElementById("challenge").offsetHeight);
  out.push(`${v}: section height ${h}, errs ${JSON.stringify(errs)}`);
  await ctx.close();
}
// sticky check on A
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(B + "?country=IN&layout=a", { waitUntil: "load" });
  await p.waitForSelector("#challenge");
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  const tops = [];
  for (const d of [200, 300, 400]) {
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y0 + d); await p.waitForTimeout(400);
    tops.push(await p.evaluate(() => { const e = [...document.querySelectorAll("button")].find((x) => /Get funded/.test(x.textContent || "") || false) || [...document.querySelectorAll("a")].find((x) => /Get funded/.test(x.textContent || "") && x.getBoundingClientRect().width > 200); return e ? Math.round(e.getBoundingClientRect().top) : null; }));
  }
  out.push("A buy button top while scrolling: " + JSON.stringify(tops));
}
console.log(out.join("\n"));
await b.close();
