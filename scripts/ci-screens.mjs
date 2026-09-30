// TEMPORARY - used only by .github/workflows/redesign-preview.yml.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const URL = "http://127.0.0.1:4173/";
const OUT = "ci-out";
const log = [];

const viewports = [
  { name: "desktop", width: 1440, height: 900, dpr: 1, mobile: false },
  { name: "mobile", width: 390, height: 844, dpr: 2, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  // Screenshot-only: block the Klaviyo marketing popup so it doesn't cover the page.
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") log.push(`[${vp.name}] console.${m.type()}: ${m.text()}`); });
  page.on("pageerror", (e) => log.push(`[${vp.name}] PAGEERROR: ${e.message}`));
  page.on("response", (r) => { if (r.status() >= 400) log.push(`[${vp.name}] HTTP ${r.status()} ${r.url()}`); });
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "load", timeout: 60000 });
  log.push(`[${vp.name}] load in ${Date.now() - t0}ms`);
  await sleep(3500);
  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const lcp = performance.getEntriesByType("largest-contentful-paint").pop();
    const res = performance.getEntriesByType("resource");
    return {
      dcl: nav && Math.round(nav.domContentLoadedEventEnd),
      load: nav && Math.round(nav.loadEventEnd),
      lcp: lcp && Math.round(lcp.startTime),
      jsKB: Math.round(res.filter((r) => r.initiatorType === "script").reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
      totalKB: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
    };
  });
  log.push(`[${vp.name}] perf ${JSON.stringify(perf)}`);
  await page.screenshot({ path: `${OUT}/${vp.name}-00-top.png` });

  // Walk down the page one viewport at a time (lets scroll-triggered
  // animations fire) and capture each stop.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 1;
  for (let y = vp.height; y < h; y += vp.height) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(1300);
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(i).padStart(2, "0")}-y${y}.png` });
    i++;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });
  log.push(`[${vp.name}] scrollHeight ${h}`);
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/log.txt`, log.join("\n") + "\n");
console.log(log.join("\n"));
