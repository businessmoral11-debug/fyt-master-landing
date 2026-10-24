// TEMPORARY: hero video wall + rewards section screenshots.
import { chromium, webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-gu1hdyiw8-bm-med.vercel.app/";
const log = [];
async function shot(browser, name, ctxOpts) {
  const ctx = await browser.newContext({ ...ctxOpts, timezoneId: "Europe/London" });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_known_visitor_v1", "1"); localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); sessionStorage.setItem("fyt_giveaway_teaser_hidden", "1"); } catch {} });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 90)));
  try {
    await page.goto(`${URL}?country=IN`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(6500);
    await page.screenshot({ path: `ci-out/${name}-hero.png` });
    const h1 = await page.evaluate(() => ({ heroH: document.querySelector("h1")?.closest("div.relative")?.getBoundingClientRect().height, overflowX: document.documentElement.scrollWidth - innerWidth, thumbs: document.querySelectorAll("button[aria-label^='Show video']").length, order: Array.from(document.querySelectorAll("button[aria-label^='Show video'], button[aria-label^='Play video']")).map((b) => b.getAttribute("aria-label").replace(/^.*: /, "")) }));
    log.push(`[${name}] hero ${JSON.stringify(h1)} errors=${JSON.stringify([...new Set(errs)])}`);
    // click first thumb, then featured => lightbox
    await page.click("button[aria-label^='Play video']");
    await page.waitForTimeout(1500);
    const dlg = await page.evaluate(() => !!document.querySelector("[role=dialog] video, [role=dialog] iframe"));
    log.push(`[${name}] lightbox video present: ${dlg}`);
    await page.screenshot({ path: `ci-out/${name}-lightbox.png` });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    for (let i = 0; i < 8; i++) { await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView()); await page.evaluate((y) => window.scrollBy(0, y), 100 * i); await page.waitForTimeout(350); }
    await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView());
    await page.waitForTimeout(3500);
    const sec = await page.evaluate(() => { const s = document.getElementById("live-payouts"); const prev = s.previousElementSibling; return { prevText: (prev?.textContent || "").slice(0, 60), text: s.innerText.slice(0, 160).replace(/\n/g, " | ") }; });
    log.push(`[${name}] rewards ${JSON.stringify(sec)}`);
    await page.screenshot({ path: `ci-out/${name}-rewards.png` });
  } catch (e) { log.push(`[${name}] ERR ${String(e).slice(0, 250)}`); }
  await ctx.close();
}
const cr = await chromium.launch();
await shot(cr, "desk1440", { viewport: { width: 1440, height: 900 } });
await shot(cr, "desk1100", { viewport: { width: 1100, height: 800 } });
await cr.close();
const wk = await webkit.launch();
await shot(wk, "iphone", { ...devices["iPhone 14"] });
await wk.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
