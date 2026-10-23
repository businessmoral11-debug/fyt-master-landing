// TEMPORARY - table-test branch only. Never merge into main.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const OUT = "ci-out"; const log = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
for (const vp of [{ n: "desktop", w: 1440, h: 900, m: false }, { n: "mobile", w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.n}] PAGEERROR ${e.message}`));
  await page.goto("http://127.0.0.1:4173/?halloween=1&giveaway=0", { waitUntil: "load", timeout: 60000 });
  await sleep(3000);
  await page.screenshot({ path: `${OUT}/${vp.n}-hero.png` });
  const sec = page.locator("#challenge");
  await sec.scrollIntoViewIfNeeded(); await sleep(1200);
  const shot = async (name) => { await sleep(700); await sec.screenshot({ path: `${OUT}/${vp.n}-${name}.png` }); };
  await shot("2step");
  await sec.getByRole("button", { name: /^Compare$/ }).click().catch((e) => log.push("cmp " + e.message.split("\n")[0]));
  await shot("2step-compare");
  await sec.getByRole("tab", { name: /Instant/ }).click(); await shot("instant-compare");
  await sec.getByRole("button", { name: /^Hide$/ }).click().catch(() => {});
  await sec.getByRole("button", { name: /Plus/ }).first().click().catch(() => {});
  await shot("instant-plus");
  await sec.getByRole("tab", { name: /1-Step/ }).click(); await shot("1step");
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/log.txt`, log.join("\n") + "\n");
