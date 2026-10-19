// TEMPORARY - testing branch only (used by .github/workflows/redesign-preview.yml).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.SCREENS_URL || "http://127.0.0.1:4173/";
const OUT = "ci-out";
const log = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });

async function open(vp, query = "") {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, timezoneId: "Asia/Kolkata", locale: "en-IN" });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.name}${query}] PAGEERROR: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") log.push(`[${vp.name}${query}] console.error: ${m.text().slice(0, 300)}`); });
  await page.goto(BASE + query, { waitUntil: "load", timeout: 60000 });
  await sleep(3000);
  return { ctx, page };
}

// Log the shape of the rewards feeds (helps match payouts to certificate images).
try {
  const api = "https://rewards.fundingyourtrades.com/api/v1/public";
  const p = await (await fetch(`${api}/featured-payouts?limit=3&page=1&sort=latest`)).json();
  const c = await (await fetch(`${api}/featured-certificates?limit=3&page=1&sort=latest`)).json();
  log.push("[api] payouts " + JSON.stringify(p.data?.slice(0, 3)));
  log.push("[api] certificates " + JSON.stringify(c.data?.slice(0, 3)));
  log.push("[api] payouts total " + JSON.stringify(p.meta) + " certs total " + JSON.stringify(c.meta));
} catch (e) { log.push("[api] fail " + e.message); }

const viewports = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

for (const vp of viewports) {
  const { ctx, page } = await open(vp);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < h; y += vp.height) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(i).padStart(2, "0")}.png` });
    i++;
  }
  log.push(`[${vp.name}] scrollHeight ${h}, shots ${i}`);
  // Plan finder: answer the 4 questions and capture the result.
  const finder = page.locator("#plan-finder");
  if (await finder.count()) {
    await finder.scrollIntoViewIfNeeded();
    await sleep(800);
    for (const label of ["1-3 years", "Scalping", "Sometimes"]) {
      await page.getByRole("button", { name: new RegExp(label) }).first().click().catch((e) => log.push("finder click fail " + label + " " + e.message.split("\n")[0]));
      await sleep(600);
    }
    await finder.getByRole("button", { name: "$100K" }).first().click().catch((e) => log.push("finder size fail " + e.message.split("\n")[0]));
    await sleep(1200);
    await finder.screenshot({ path: `${OUT}/${vp.name}-finder-result.png` }).catch((e) => log.push("finder shot " + e.message));
  }
  // Payout board "Paid on camera" tab.
  const cam = page.getByRole("tab", { name: "Paid on camera" });
  if (await cam.count()) {
    await cam.scrollIntoViewIfNeeded();
    await cam.click();
    await sleep(1500);
    await page.locator("#live-payouts").screenshot({ path: `${OUT}/${vp.name}-board-camera.png` }).catch((e) => log.push("cam shot " + e.message));
  }
  await ctx.close();
}

for (const [q, name] of [["?welcomeback=1", "welcome"], ["?exitdemo=1", "exit"]]) {
  for (const vp of viewports) {
    const { ctx, page } = await open(vp, q);
    await sleep(2000);
    await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png` });
    await ctx.close();
  }
}

writeFileSync(`${OUT}/screens-log.txt`, log.join("\n") + "\n");
await browser.close();
