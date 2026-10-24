// TEMPORARY: best-fit guide flow.
import { chromium, webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-k06ddcb30-bm-med.vercel.app/";
const log = [];
async function run(browser, name, opts, answers) {
  const ctx = await browser.newContext({ ...opts, timezoneId: "Europe/London" });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_known_visitor_v1", "1"); localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); sessionStorage.setItem("fyt_giveaway_teaser_hidden", "1"); } catch {} });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
  try {
    await page.goto(URL + "?country=IN", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => document.getElementById('live-payouts')?.scrollIntoView()); await page.waitForTimeout(600); await page.evaluate(() => window.scrollBy(0, 40));
    await page.waitForTimeout(800);
    await page.screenshot({ path: "ci-out/" + name + "-pill.png" });
    log.push("[" + name + "] DBG " + (await page.evaluate(() => JSON.stringify({ sy: window.scrollY, po: window.pageYOffset, st: document.documentElement.scrollTop, bt: document.body.scrollTop, btn: document.querySelectorAll("button[aria-label^='Find my best fit']").length, ch: document.getElementById("challenge")?.getBoundingClientRect().top, lp: document.getElementById("live-payouts")?.getBoundingClientRect().top, ih: innerHeight, sh: document.documentElement.scrollHeight }))));
    await page.click("button[aria-label^='Find my best fit']");
    await page.waitForTimeout(700);
    await page.screenshot({ path: "ci-out/" + name + "-q1.png" });
    for (const a of answers) { await page.click("[role=dialog][aria-label='Find my best fit'] button:has-text('" + a + "')"); await page.waitForTimeout(450); }
    await page.waitForTimeout(700);
    log.push("[" + name + "] result " + (await page.evaluate(() => document.querySelector("[role=dialog][aria-label='Find my best fit']").innerText.replace(/\n/g, " | ").slice(0, 400))));
    await page.locator("[role=dialog][aria-label='Find my best fit'] > div").screenshot({ path: "ci-out/" + name + "-result.png" });
    await page.click("[role=dialog][aria-label='Find my best fit'] button:has-text('Get my account')");
    await page.waitForTimeout(2200);
    log.push("[" + name + "] after go: dialog open=" + (await page.evaluate(() => !!document.querySelector("[role=dialog][aria-label='Find my best fit']"))) + " table: " + (await page.evaluate(() => { const s = document.getElementById("challenge"); const on = Array.from(s.querySelectorAll("[aria-pressed=true]")).map((b) => b.textContent.trim().replace(/\s+/g, " ").slice(0, 28)); return JSON.stringify(on); })));
    await page.screenshot({ path: "ci-out/" + name + "-table.png" });
  } catch (e) { log.push("[" + name + "] ERR " + String(e).slice(0, 300)); }
  log.push("[" + name + "] errors " + JSON.stringify([...new Set(errs)]));
  await ctx.close();
}
const cr = await chromium.launch();
await run(cr, "deskFast", { viewport: { width: 1440, height: 900 } }, ["3+ years", "Scalping", "London", "Fast", "$25K"]);
await run(cr, "deskSlow", { viewport: { width: 1440, height: 900 } }, ["Just starting", "Swing trading", "A mix", "Slow and steady", "$50K"]);
await cr.close();
const wk = await webkit.launch();
await run(wk, "iphone", { ...devices["iPhone 14"] }, ["1 to 3 years", "Day trading", "New York", "Balanced", "$10K"]);
await wk.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
