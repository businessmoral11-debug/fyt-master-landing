import { chromium, webkit, devices } from "playwright";
const B = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/?country=IN";
await new Promise((r) => setTimeout(r, 140000));
const out = [];
for (const [k, name, o] of [[webkit, "iphone", { ...devices["iPhone 14"] }], [chromium, "pixel", { ...devices["Pixel 7"] }], [chromium, "desk", { viewport: { width: 1440, height: 900 } }]]) {
  const b = await k.launch(); const p = await (await b.newContext(o)).newPage();
  await p.goto(B, { waitUntil: "load", timeout: 60000 }); await p.waitForTimeout(3000);
  for (const y of [0, 1500]) {
    await p.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y); await p.waitForTimeout(600);
    const before = await p.evaluate(() => Math.round(scrollY));
    await p.evaluate(() => document.querySelector('button[aria-label^="Play video:"]').click());
    await p.waitForSelector('button[aria-label="Close video"]'); await p.waitForTimeout(800);
    await p.click('button[aria-label="Close video"]'); await p.waitForTimeout(900);
    const after = await p.evaluate(() => Math.round(scrollY));
    out.push(`${name} start ${y}: before ${before} after ${after}`);
  }
  // deck stats: how often Gabriel appears across 40 loads
  await b.close();
}
{
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  let g = 0, lastPos = [];
  for (let i = 0; i < 30; i++) {
    await p.goto(B + "&r=" + i, { waitUntil: "domcontentloaded" }); await p.waitForTimeout(1200);
    const names = await p.evaluate(() => [document.querySelector('button[aria-label^="Play video:"]')?.getAttribute("aria-label"), ...[...document.querySelectorAll('button[aria-label^="Show video:"]')].map((t) => t.getAttribute("aria-label"))].join("|"));
    if (/Gabriel/.test(names)) g++;
  }
  out.push("Gabriel in first 5 (30 loads, IN): " + g);
  await b.close();
}
console.log(out.join("\n"));
