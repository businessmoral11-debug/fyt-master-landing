// TEMPORARY: plan finder flow + section order.
import { chromium, webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-9v1dbu2ua-bm-med.vercel.app/";
const log = [];
async function run(browser, name, opts) {
  const ctx = await browser.newContext({ ...opts, timezoneId: "Europe/London" });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_known_visitor_v1", "1"); localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); sessionStorage.setItem("fyt_giveaway_teaser_hidden", "1"); } catch {} });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
  try {
    await page.goto(`${URL}?country=IN`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(3000);
    for (let i = 0; i < 10; i++) { await page.evaluate(() => document.getElementById("plan-finder")?.scrollIntoView()); await page.evaluate((y) => window.scrollBy(0, y), 80 * i); await page.waitForTimeout(300); }
    const order = await page.evaluate(() => Array.from(document.querySelectorAll("section[id], section")).slice(0, 14).map((s) => s.id || (s.querySelector("h2")?.textContent || "").slice(0, 25)));
    log.push(`[${name}] order ${JSON.stringify(order)}`);
    await page.evaluate(() => document.getElementById("plan-finder")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `ci-out/${name}-q1.png` });
    await page.click("text=One simple target"); await page.waitForTimeout(1600);
    await page.screenshot({ path: `ci-out/${name}-q2.png` });
    await page.click("#plan-finder button:has-text('$50K')"); await page.waitForTimeout(1600);
    await page.click("#plan-finder button:has-text('MatchTrader')"); await page.waitForTimeout(1600);
    await page.screenshot({ path: `ci-out/${name}-result.png` });
    const res = await page.evaluate(() => document.getElementById("plan-finder").innerText.replace(/\n/g, " | ").slice(0, 300));
    log.push(`[${name}] result ${res}`);
    const href = await page.evaluate(() => Array.from(document.querySelectorAll("#plan-finder a")).map((a) => a.href));
    log.push(`[${name}] cta ${JSON.stringify(href)}`);
    await page.click("text=See it in the table"); await page.waitForTimeout(1800);
    const tbl = await page.evaluate(() => (document.getElementById("challenge")?.innerText || "").slice(0, 400).replace(/\n/g, " | "));
    log.push(`[${name}] table after click: ${tbl}`);
    await page.screenshot({ path: `ci-out/${name}-table.png` });
  } catch (e) { log.push(`[${name}] ERR ${String(e).slice(0, 300)}`); }
  log.push(`[${name}] errors ${JSON.stringify([...new Set(errs)])}`);
  await ctx.close();
}
const cr = await chromium.launch();
await run(cr, "desk", { viewport: { width: 1440, height: 900 } });
await cr.close();
const wk = await webkit.launch();
await run(wk, "iphone", { ...devices["iPhone 14"] });
await wk.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
