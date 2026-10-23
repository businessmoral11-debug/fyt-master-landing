// TEMPORARY: list header/footer/nav links of live WP pages (read only).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const pages = ["affiliate-registration/", "affiliate-account/", "contact/", "terms-of-services/", "privacy-policy/", "refund_returns/", "cart/", "checkout/", "my-account/", "product/instant-funding-prime/", "faq/"];
const log = [];
const browser = await chromium.launch();
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  const page = await ctx.newPage();
  for (const p of pages) {
    try {
      await page.goto("https://fundingyourtrades.com/" + p, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(3500);
      const links = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll("a[href]").forEach((a) => {
          const t = (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
          const href = a.getAttribute("href");
          if (!/faq|login|log in|sign|register|dashboard|client|account|buy|help|support|affiliate|rewards|app\./i.test(t + " " + href)) return;
          let a2 = a, chain = [];
          for (let i = 0; i < 5 && a2; i++) { chain.push((a2.id ? "#" + a2.id : a2.tagName.toLowerCase()) + (typeof a2.className === "string" && a2.className ? "." + a2.className.split(" ").filter(Boolean).slice(0, 2).join(".") : "")); a2 = a2.parentElement; }
          const r = a.getBoundingClientRect();
          out.push({ t, href, vis: a.offsetParent !== null && r.height > 0, top: Math.round(r.top + scrollY), chain: chain.join(" < ") });
        });
        return out;
      });
      log.push(`[${vp.n}] /${p} (${links.length})`);
      for (const l of links) log.push(`   ${l.vis ? "VIS" : "hid"} y=${l.top} "${l.t}" -> ${l.href}   {${l.chain}}`);
    } catch (e) { log.push(`[${vp.n}] /${p} ERR ${String(e).slice(0, 120)}`); }
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
