import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const BASE = "http://127.0.0.1:4173/?halloween=1";
const OUT = "ci-out"; const log = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
for (const vp of [{ n: "desktop", w: 1440, h: 900, m: false }, { n: "laptop", w: 1100, h: 800, m: false }, { n: "mobile", w: 390, h: 844, m: true }, { n: "small", w: 360, h: 740, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.n}] PAGEERROR ${e.message}`));
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  for (const t of [1500, 4500]) { await sleep(t === 1500 ? 1500 : 3000); await page.screenshot({ path: `${OUT}/${vp.n}-top-${t}.png`, clip: { x: 0, y: 0, width: vp.w, height: 220 } }); }
  const bar = page.locator("#fyt-hw-bar");
  log.push(`[${vp.n}] bar h=${await bar.evaluate((e) => e.offsetHeight)} overflowX=${await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)}`);
  await page.locator(".fyt-hw-code").click().catch((e) => log.push("code " + e.message));
  await sleep(700);
  await page.screenshot({ path: `${OUT}/${vp.n}-copied.png`, clip: { x: 0, y: 0, width: vp.w, height: 220 } });
  log.push(`[${vp.n}] hash after code click: ${await page.evaluate(() => location.hash)}`);
  await page.evaluate(() => window.scrollTo(0, 1200)); await sleep(1500);
  await page.screenshot({ path: `${OUT}/${vp.n}-scrolled.png`, clip: { x: 0, y: 0, width: vp.w, height: 160 } });
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/log.txt`, log.join("\n") + "\n");
