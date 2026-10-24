// TEMPORARY: IP-based country test (browser time zone = India, real IP / mocked IP).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-ig1l53c7d-bm-med.vercel.app/";
const log = [];
async function run(name, mock) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, timezoneId: "Asia/Kolkata", locale: "en-IN" });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_known_visitor_v1", "1"); localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); sessionStorage.setItem("fyt_giveaway_teaser_hidden", "1"); } catch {} });
  const page = await ctx.newPage();
  if (mock) {
    await page.route("**/api.country.is/**", (r) => r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ ip: "1.1.1.1", country: mock }) }));
    await page.route("**/cdn-cgi/trace", (r) => r.fulfill({ status: 200, contentType: "text/plain", headers: { "access-control-allow-origin": "*" }, body: "loc=" + mock + "\n" }));
  }
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector("#live-payouts", { timeout: 45000 });
    await page.evaluate(() => window.scrollTo({ top: document.getElementById("live-payouts").offsetTop - 100, behavior: "instant" }));
    await page.waitForTimeout(5000);
    log.push("[" + name + "] " + (await page.evaluate(() => { const s = document.getElementById("live-payouts"); return (s.querySelector("h2")?.textContent || "") + " || " + (s.innerText.match(/Recent rewards[^\n]*/)?.[0] || ""); })) + " errors=" + JSON.stringify([...new Set(errs)]));
    await page.screenshot({ path: "ci-out/" + name + ".png" });
    const btn = await page.evaluate(() => Array.from(document.querySelectorAll("#live-payouts a")).map((a) => a.textContent.trim()).filter((t) => /funded|challenge/i.test(t)));
    log.push("[" + name + "] buttons " + JSON.stringify(btn));
  } catch (e) { log.push("[" + name + "] ERR " + String(e).slice(0, 250)); }
  await browser.close();
}
await run("real-ip", null);
await run("mock-GB", "GB");
await run("mock-US", "US");
await run("mock-DE", "DE");
await run("mock-NG", "NG");
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
