// TEMPORARY: logged-out health check of live WP pages after cache plugin swap.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const pages = ["", "affiliate-registration/", "faq/", "contact/", "cart/", "checkout/", "my-account/", "product/instant-funding-prime/"];
const log = [];
const browser = await chromium.launch();
const UA_M = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true, ua: UA_M }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.ua });
  const page = await ctx.newPage();
  let errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 80)));
  for (const p of pages) {
    errs = [];
    try {
      const t0 = Date.now();
      const res = await page.goto("https://fundingyourtrades.com/" + p, { waitUntil: "load", timeout: 60000 });
      const loadMs = Date.now() - t0;
      const h = res.headers();
      await page.waitForTimeout(4000);
      const st = await page.evaluate(() => {
        const b = document.getElementById("fyt-hw-bar");
        const o = document.getElementById("fyt4wrap");
        const txt = document.body.innerText;
        return { title: document.title.slice(0, 50), hwBar: !!b && b.offsetHeight > 0, oldBarVisible: !!o && o.offsetHeight > 0, seraphBanner: /Seraphinite/i.test(txt), seraphInHtml: /seraph_accel/i.test(document.documentElement.outerHTML), bodyLen: txt.length, overflowX: document.documentElement.scrollWidth - innerWidth };
      });
      log.push(`[${vp.n}] /${p} status=${res.status()} load=${loadMs}ms lscache=${h["x-litespeed-cache"] || "-"} cc=${h["cache-control"] || "-"} ${JSON.stringify(st)} errors=${errs.length}${errs.length ? " " + JSON.stringify([...new Set(errs)].slice(0, 3)) : ""}`);
      await page.screenshot({ path: `ci-out/${vp.n}-${(p || "home").replace(/\W+/g, "_")}.png`, clip: { x: 0, y: 0, width: vp.w, height: 400 } });
    } catch (e) { log.push(`[${vp.n}] /${p} ERR ${String(e).slice(0, 150)}`); }
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
