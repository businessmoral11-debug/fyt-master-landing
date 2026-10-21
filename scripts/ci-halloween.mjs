// TEMPORARY - halloween test branch only (used by .github/workflows/halloween-preview.yml). Never merge into main.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:4173/";
const OUT = "ci-out";
const log = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const vps = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
for (const vp of vps) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, timezoneId: "Asia/Kolkata" });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.name}] PAGEERROR: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") log.push(`[${vp.name}] console.error: ${m.text().slice(0, 200)}`); });
  await page.goto(BASE + "?halloween=1", { waitUntil: "load", timeout: 60000 });
  await sleep(3500);
  await page.screenshot({ path: `${OUT}/${vp.name}-01-top.png` });
  // Floating button
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/${vp.name}-02-floating.png` });
  const sec = page.locator("#challenge");
  await sec.scrollIntoViewIfNeeded();
  await sleep(1500);
  await sec.screenshot({ path: `${OUT}/${vp.name}-03-pricing-closed.png` });
  // CTA without treats should open the vault, not leave the page.
  const cta = sec.locator("a", { hasText: "Get funded" }).first();
  const before = page.url();
  await cta.click().catch((e) => log.push("cta1 " + e.message.split("\n")[0]));
  await sleep(1500);
  log.push(`[${vp.name}] after first CTA click url changed: ${page.url() !== before} vaultExpanded=${await page.locator("#fyt-vault > button").getAttribute("aria-expanded")}`);
  await page.screenshot({ path: `${OUT}/${vp.name}-04-nudge.png` });
  for (const name of ["Vampire's Share", "Nightmare Mode"]) {
    await page.locator("#fyt-vault button", { hasText: name }).first().click().catch((e) => log.push("treat " + e.message.split("\n")[0]));
    await sleep(400);
  }
  await sleep(800);
  await sec.screenshot({ path: `${OUT}/${vp.name}-05-pricing-picked.png` });
  log.push(`[${vp.name}] CTA href: ${await cta.getAttribute("href")}`);
  // Switch model to Instant and log its link too.
  await sec.getByRole("tab", { name: /Instant/ }).click().catch(() => {});
  await sleep(900);
  log.push(`[${vp.name}] Instant CTA href: ${await sec.locator("a", { hasText: "Get funded" }).first().getAttribute("href")}`);
  if (!vp.mobile) {
    await sleep(8500);
    await page.evaluate(() => document.dispatchEvent(new MouseEvent("mouseout", { clientX: 600, clientY: 0, bubbles: true, relatedTarget: null })));
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-06-exit.png` });
  }
  await ctx.close();
}
// Live dates: without the flag the launch offer should still show on a non-vercel host.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(2500);
  await page.screenshot({ path: `${OUT}/desktop-00-without-flag.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/log.txt`, log.join("\n") + "\n");
console.log("done");
