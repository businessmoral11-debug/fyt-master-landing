// TEMPORARY: desktop + phone screenshots of the live-rewards section.
import { chromium, webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-h1d2wr5kk-bm-med.vercel.app/";
const log = [];
async function shot(browser, name, ctxOpts, cc) {
  const ctx = await browser.newContext({ ...ctxOpts, timezoneId: "Europe/London" });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_known_visitor_v1", "1"); localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); sessionStorage.setItem("fyt_giveaway_teaser_hidden", "1"); } catch {} });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 90)));
  try {
    await page.goto(`${URL}?country=${cc}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2500);
    for (let i = 0; i < 6; i++) { await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView()); await page.evaluate((y) => window.scrollBy(0, y), 120 * i); await page.waitForTimeout(400); }
    await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView());
    await page.waitForTimeout(4000);
    const st = await page.evaluate(() => {
      const s = document.getElementById("live-payouts");
      const imgs = Array.from(s.querySelectorAll("a img[alt^='Payout certificate']"));
      const fixedBottom = Array.from(document.querySelectorAll("*")).filter((e) => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return c.position === "fixed" && r.bottom > innerHeight - 140 && r.width > 0 && /claim|offer|buy/i.test(e.textContent || ""); }).length;
      return { h2: s.querySelector("h2")?.textContent, img: imgs.map((i) => [i.naturalWidth, getComputedStyle(i).opacity]), overflowX: document.documentElement.scrollWidth - innerWidth, floatingOfferEls: fixedBottom, links: Array.from(s.querySelectorAll("a")).filter(a=>/View (certificate|transaction)/.test(a.textContent)).map(a=>[a.textContent.trim(),a.href]) };
    });
    log.push(`[${name} ${cc}] ${JSON.stringify(st)} errors=${JSON.stringify([...new Set(errs)])}`);
    await page.screenshot({ path: `ci-out/${name}-${cc}.png` });
    await page.evaluate(() => window.scrollBy(0, 480)); await page.waitForTimeout(1200);
    await page.screenshot({ path: `ci-out/${name}-${cc}-b.png` });
  } catch (e) { log.push(`[${name} ${cc}] ERR ${String(e).slice(0, 200)}`); }
  await ctx.close();
}
const cr = await chromium.launch();
for (const cc of ["IN", "DE"]) await shot(cr, "desk1440", { viewport: { width: 1440, height: 900 } }, cc);
await shot(cr, "desk1100", { viewport: { width: 1100, height: 800 } }, "IN");
await cr.close();
const wk = await webkit.launch();
for (const cc of ["IN", "DE"]) await shot(wk, "iphone", { ...devices["iPhone 14"] }, cc);
await wk.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
