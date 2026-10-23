// TEMPORARY: preview the WordPress promo-bar snippet on live pages (injected only in this test browser).
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync("scripts/snippet.html", "utf8");
const pages = ["affiliate-registration/", "contact/", "terms-of-services/", "cart/"];
const log = [];
const browser = await chromium.launch();
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.n}] PAGEERROR ${e.message}`));
  for (const p of pages) {
    try {
      await page.goto("https://fundingyourtrades.com/" + p, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(3000);
      log.push(`[${vp.n}] ${p} --- inject now ---`);
      await page.evaluate((h) => {
        const box = document.createElement("div");
        box.innerHTML = h;
        Array.from(box.childNodes).forEach((n) => {
          if (n.nodeName === "SCRIPT") { const s = document.createElement("script"); s.textContent = n.textContent; document.body.appendChild(s); }
          else document.body.appendChild(n);
        });
      }, html);
      await page.waitForTimeout(3500);
      const st = await page.evaluate(() => { const b = document.getElementById("fyt-hw-bar"); const o = document.getElementById("fyt4wrap"); return { bar: !!b, barTop: b ? Math.round(b.getBoundingClientRect().top) : null, barH: b ? b.offsetHeight : null, oldVisible: o ? getComputedStyle(o).display : "none", overflowX: document.documentElement.scrollWidth - innerWidth }; });
      log.push(`[${vp.n}] ${p} ${JSON.stringify(st)}`);
      await page.screenshot({ path: `ci-out/${vp.n}-${p.replace(/\W+/g, "_")}.png`, clip: { x: 0, y: 0, width: vp.w, height: Math.min(vp.h, 300) } });
    } catch (e) { log.push(`[${vp.n}] ${p} ERR ${String(e).slice(0, 150)}`); }
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
