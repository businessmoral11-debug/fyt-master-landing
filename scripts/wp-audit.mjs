import { chromium } from "playwright";
const B = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/";
await new Promise((r) => setTimeout(r, 140000));
const out = [];
const b = await chromium.launch();
for (const [w, h, dis] of [[1280, 660, false], [1440, 900, true]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(B + "?country=IN&layout=a", { waitUntil: "load", timeout: 60000 });
  await p.waitForSelector("#challenge");
  if (!dis) { await p.evaluate(() => document.getElementById("noyona_desktop_top_disclaimer")?.remove()); }
  await p.waitForTimeout(1500);
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  const tops = [];
  for (const d of [100, 250, 400]) {
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y0 + d); await p.waitForTimeout(700);
    await p.screenshot({ path: `ci-out/${w}-a-${d}.png` });
    tops.push(await p.evaluate(() => { const e = [...document.querySelectorAll("a")].find((x) => /Get funded/.test(x.textContent || "") && x.getBoundingClientRect().width > 250); return e ? Math.round(e.getBoundingClientRect().top) : null; }));
  }
  out.push(`${w}x${h} wide button top at scroll 100/250/400: ${JSON.stringify(tops)} errs ${JSON.stringify(errs)}`);
}
console.log(out.join("\n"));
await b.close();
