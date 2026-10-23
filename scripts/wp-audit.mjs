// TEMPORARY: test the updated snippet (code text colour) on the live affiliate page.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync("scripts/snippet.html", "utf8");
const log = [];
const browser = await chromium.launch();
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto("https://fundingyourtrades.com/affiliate-registration/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  const before = await page.evaluate(() => getComputedStyle(document.querySelector("#fyt-hw-bar .fyt-hw-code-txt")).color);
  await page.evaluate((h) => {
    document.querySelectorAll("#fyt-hw-bar, #fyt-hw-bar ~ style").forEach((e) => e.remove());
    const box = document.createElement("div"); box.innerHTML = h;
    Array.from(box.childNodes).forEach((n) => { if (n.nodeName === "SCRIPT") { const s = document.createElement("script"); s.textContent = n.textContent; document.body.appendChild(s); } else document.body.appendChild(n); });
  }, html);
  await page.waitForTimeout(6000);
  const after = await page.evaluate(() => { const bars = document.querySelectorAll("#fyt-hw-bar"); const t = bars[bars.length-1].querySelector(".fyt-hw-code-txt"); return { bars: bars.length, color: getComputedStyle(t).color }; });
  log.push(`[${vp.n}] before=${before} after=${JSON.stringify(after)}`);
  await page.screenshot({ path: `ci-out/${vp.n}-code.png`, clip: { x: 0, y: 0, width: vp.w, height: 140 } });
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
