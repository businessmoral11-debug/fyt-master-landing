// TEMPORARY: screenshots of the hero-tweak preview (desktop + phone).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-p4f3fuh65-bm-med.vercel.app/";
const log = [];
const browser = await chromium.launch();
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "l", w: 1280, h: 760, m: false }, { n: "m", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, deviceScaleFactor: vp.m ? 2 : 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.n}] PAGEERROR ${e.message}`));
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(9000);
    const st = await page.evaluate(() => { const t = document.querySelector(".fyt-hw-timer"); const h = document.querySelector("h1"); const w = document.querySelectorAll(".ti-widget"); return { timerH: t ? t.offsetHeight : null, timerW: t ? t.offsetWidth : null, h1Top: h ? Math.round(h.getBoundingClientRect().top) : null, tiWidgets: Array.from(w).map((x) => Math.round(x.getBoundingClientRect().top)), overflowX: document.documentElement.scrollWidth - innerWidth }; });
    log.push(`[${vp.n}] ${JSON.stringify(st)}`);
    await page.screenshot({ path: `ci-out/${vp.n}-hero.png` });
  } catch (e) { log.push(`[${vp.n}] ERR ${String(e).slice(0, 150)}`); }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
