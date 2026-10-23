// TEMPORARY: check live WP pages (no injection) for the installed promo bar snippet.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const pages = ["affiliate-registration/", "contact/", "cart/"];
const log = [];
const browser = await chromium.launch();
const UA_M = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true, ua: UA_M }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.ua });
  const page = await ctx.newPage();
  for (const p of pages) {
    try {
      const res = await page.goto("https://fundingyourtrades.com/" + p, { waitUntil: "domcontentloaded", timeout: 45000 });
      const h = res.headers();
      log.push(`[${vp.n}] ${p} status=${res.status()} headers=${JSON.stringify(h)}`);
      await page.waitForTimeout(5000);
      const st = await page.evaluate(() => {
        const html = document.documentElement.outerHTML;
        const b = document.getElementById("fyt-hw-bar");
        const olds = Array.from(document.querySelectorAll("#fyt4wrap, [id^=fyt4], .fset")).map(e => e.id || e.className).slice(0,6);
        const vis = Array.from(document.querySelectorAll("#fyt4wrap")).map(e => getComputedStyle(e).display + "/" + e.offsetHeight);
        const summer = Array.from(document.querySelectorAll("body *")).filter(e => e.children.length === 0 && /SUMMER/i.test(e.textContent || "") && e.offsetHeight > 0).slice(0, 4).map(e => { const r = e.getBoundingClientRect(); let a = e, chain = []; for (let i = 0; i < 6 && a; i++) { chain.push((a.id ? "#" + a.id : a.tagName.toLowerCase()) + (a.className && typeof a.className === "string" ? "." + a.className.split(" ").slice(0,2).join(".") : "")); a = a.parentElement; } return { top: Math.round(r.top), text: e.textContent.trim().slice(0, 40), chain: chain.join(" < ") }; });
        const wpcode = (html.match(/wpcode[^"\' >]{0,40}/gi) || []).slice(0, 8); const footerTail = document.body.innerHTML.slice(-1500).replace(/\s+/g," "); return { wpcode, footerTail, snippetInHtml: html.includes("fyt-hw-bar"), bar: !!b, barTop: b ? Math.round(b.getBoundingClientRect().top) : null, barH: b ? b.offsetHeight : null, olds, fyt4wrapVis: vis, summer };
      });
      log.push(`[${vp.n}] ${p} ${JSON.stringify(st)}`);
      await page.screenshot({ path: `ci-out/${vp.n}-${p.replace(/\W+/g, "_")}.png`, clip: { x: 0, y: 0, width: vp.w, height: 300 } });
    } catch (e) { log.push(`[${vp.n}] ${p} ERR ${String(e).slice(0, 150)}`); }
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
