import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const pages = ["affiliate-registration/", "affiliate-account/", "contact/", "faq/", "fundingyourtrades-reviews-trader-results/", "terms-of-services/", "privacy-policy/", "refund_returns/", "cart/", "checkout/"];
const out = [];
const browser = await chromium.launch();
for (const vp of [{ n: "d", w: 1440, h: 900, m: false }, { n: "m", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? undefined : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/132 Safari/537.36" });
  const page = await ctx.newPage();
  for (const p of pages) {
    const url = "https://fundingyourtrades.com/" + p;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(4000);
      const slug = p.replace(/\W+/g, "_");
      await page.screenshot({ path: `ci-out/${vp.n}-${slug}.png`, clip: { x: 0, y: 0, width: vp.w, height: Math.min(vp.h, 360) } });
      const info = await page.evaluate(() => {
        const hits = [];
        const all = Array.from(document.querySelectorAll("body *"));
        for (const el of all) {
          const t = (el.innerText || "").trim();
          if (!t || t.length > 400) continue;
          const r = el.getBoundingClientRect();
          if (r.top > 260 || r.height === 0 || r.width === 0) continue;
          if (/%|code|off|bogo|offer|sale|left|ends/i.test(t) && el.children.length < 12) {
            const chain = [];
            let e = el;
            for (let i = 0; i < 6 && e && e !== document.body; i++) { chain.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 4).join(".") : "")); e = e.parentElement; }
            hits.push({ text: t.slice(0, 160), top: Math.round(r.top), h: Math.round(r.height), chain });
          }
        }
        const elementorHeader = Array.from(document.querySelectorAll('[data-elementor-type="header"], header, .elementor-location-header')).map((x) => (x.tagName + " " + (x.getAttribute("data-elementor-id") || "") + " " + (x.className || "")).slice(0, 200));
        return { hits: hits.slice(0, 25), headers: elementorHeader };
      });
      out.push({ vp: vp.n, url, ...info });
    } catch (e) { out.push({ vp: vp.n, url, error: String(e).slice(0, 200) }); }
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/audit.json", JSON.stringify(out, null, 1));
