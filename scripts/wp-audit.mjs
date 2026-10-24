// TEMPORARY: iPhone (WebKit) check of the new live-rewards section.
import { webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-bwk5k6thn-bm-med.vercel.app/";
const log = [];
const browser = await webkit.launch();
for (const cc of ["IN", "DE"]) {
  const ctx = await browser.newContext({ ...devices["iPhone 14"], timezoneId: "Europe/London" });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_known_visitor_v1", "1"); localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); sessionStorage.setItem("fyt_giveaway_teaser_hidden", "1"); } catch {} });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 90)));
  try {
    await page.goto(`${URL}?halloween=0&country=${cc}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2500);
    for (let i = 0; i < 6; i++) { await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView()); await page.evaluate((y) => window.scrollBy(0, y), 120 * i); await page.waitForTimeout(500); }
    await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView());
    for (let k = 0; k < 3; k++) {
      await page.waitForTimeout(3500);
      const st = await page.evaluate(() => {
        const s = document.getElementById("live-payouts");
        const imgs = Array.from(s.querySelectorAll("a img[alt^='Payout certificate']"));
        return { h2: s.querySelector("h2")?.textContent, stageImgs: imgs.map((i) => ({ complete: i.complete, w: i.naturalWidth, op: getComputedStyle(i).opacity })), overflowX: document.documentElement.scrollWidth - innerWidth };
      });
      log.push(`[${cc} iphone t${k}] ${JSON.stringify(st)} errors=${JSON.stringify([...new Set(errs)])}`);
    }
    await page.evaluate(() => document.querySelector("#live-payouts .fyt-ring")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(3500);
    const op = await page.evaluate(() => { let e = document.querySelector("#live-payouts .fyt-ring"); const out = []; for (let i = 0; i < 4 && e; i++) { out.push(getComputedStyle(e).opacity); e = e.parentElement; } return out; });
    log.push(`[${cc} panel opacity chain] ${JSON.stringify(op)}`);
    await page.screenshot({ path: `ci-out/${cc}-iphone.png` });
    await page.evaluate(() => window.scrollBy(0, 520));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `ci-out/${cc}-iphone2.png` });
  } catch (e) { log.push(`[${cc}] ERR ${String(e).slice(0, 200)}`); }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
