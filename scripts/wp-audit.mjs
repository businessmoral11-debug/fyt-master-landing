// TEMPORARY: test the links-fix snippet on live pages (injected in the test browser only).
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync("scripts/links.html", "utf8");
const js = html.replace(/^<script>/, "").replace(/<\/script>\s*$/, "");
const pages = ["affiliate-registration/", "contact/", "cart/", "my-account/", "product/instant-funding-prime/"];
const log = [];
const browser = await chromium.launch();
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 70)));
  for (const p of pages) {
    try {
      await page.goto("https://fundingyourtrades.com/" + p, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(3000);
      const count = () => page.evaluate(() => { const all = Array.from(document.querySelectorAll("a[href]")); const bad = all.filter((a) => /^https?:\/\/intercom\.help\/funding-your-trades\/en\/?$/i.test(a.getAttribute("href")) || /clients\.fundingyourtrades\.com/i.test(a.getAttribute("href"))); const faq = all.filter((a) => a.getAttribute("href") === "https://fundingyourtrades.com/faq").length; const app = all.filter((a) => a.getAttribute("href") === "https://app.fundingyourtrades.com/").length; const keep = all.filter((a) => /intercom\.help.*articles/.test(a.getAttribute("href"))).length; return { oldLeft: bad.length, toFaq: faq, toApp: app, articleLinksKept: keep }; });
      const before = await count();
      const e0 = errs.length;
      await page.addScriptTag({ content: js });
      await page.waitForTimeout(1500);
      const after = await count();
      // simulate a late-added link (e.g. a menu opened by a click)
      await page.evaluate(() => { const a = document.createElement("a"); a.id = "late"; a.href = "https://clients.fundingyourtrades.com/login"; a.textContent = "x"; document.body.appendChild(a); });
      await page.waitForTimeout(600);
      const late = await page.evaluate(() => document.getElementById("late").getAttribute("href"));
      log.push(`[${vp.n}] /${p} before=${JSON.stringify(before)} after=${JSON.stringify(after)} late=${late} newErrors=${errs.length - e0}`);
    } catch (e) { log.push(`[${vp.n}] /${p} ERR ${String(e).slice(0, 120)}`); }
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
