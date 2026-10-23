// TEMPORARY: screenshots of the region-proof preview for several visitor countries.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-nqz2pwf51-bm-med.vercel.app/";
const cases = [["IN", "d"], ["IN", "m"], ["DE", "d"], ["US", "m"], ["ES", "d"], ["NG", "m"], ["BR", "d"], ["XX", "m"]];
const log = [];
const browser = await chromium.launch();
for (const [cc, vpn] of cases) {
  const m = vpn === "m";
  const ctx = await browser.newContext({ viewport: m ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: m, hasTouch: m, deviceScaleFactor: m ? 2 : 1, timezoneId: "Europe/London" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 90)));
  try {
    await page.goto(`${URL}?halloween=0&country=${cc}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const el = document.getElementById("live-payouts"); if (el) el.scrollIntoView(); });
    await page.waitForTimeout(500);
    for (let y = 0; y < 3; y++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(400); }
    await page.evaluate(() => document.getElementById("live-payouts")?.scrollIntoView());
    await page.waitForTimeout(6000);
    const st = await page.evaluate(() => {
      const s = document.getElementById("live-payouts");
      if (!s) return { found: false };
      const h = s.querySelector("h2")?.textContent;
      const rows = s.querySelectorAll("ul li button").length;
      const txt = s.innerText.replace(/\s+/g, " ").slice(0, 330);
      return { found: true, h2: h, rows, overflowX: document.documentElement.scrollWidth - innerWidth, text: txt };
    });
    log.push(`[${cc} ${vpn}] ${JSON.stringify(st)} errors=${JSON.stringify([...new Set(errs)])}`);
    const el = await page.$("#live-payouts");
    if (el) await el.screenshot({ path: `ci-out/${cc}-${vpn}.png` });
  } catch (e) { log.push(`[${cc} ${vpn}] ERR ${String(e).slice(0, 160)}`); }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
