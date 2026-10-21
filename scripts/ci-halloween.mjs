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
  await page.screenshot({ path: `${OUT}/${vp.name}-01b-banner.png`, clip: { x: 0, y: 0, width: vp.width, height: 140 } });
  // Floating button
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/${vp.name}-02-floating.png` });
  const sec = page.locator("#challenge");
  await sec.scrollIntoViewIfNeeded();
  await sleep(1500);
  await sec.screenshot({ path: `${OUT}/${vp.name}-03-pricing-closed.png` });
  // Scroll-jump check: page position must stay put when picking options.
  const jump = async (label, loc) => {
    if (loc) await loc.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(500);
    const st = () => page.evaluate(() => [Math.round(window.scrollY), document.documentElement.scrollHeight, Math.round(document.getElementById("challenge").getBoundingClientRect().top), document.activeElement?.tagName + ":" + (document.activeElement?.textContent || "").slice(0, 20)].join(" "));
    const s0 = await st();
    if (loc) await loc.click().catch((e) => log.push(`click ${label} fail ${e.message.split("\n")[0]}`));
    await sleep(1500);
    const s1 = await st();
    log.push(`[${vp.name}] ${label}: [y h top focus] ${s0}  ->  ${s1}`);
  };
  await jump("tab 1-Step", sec.getByRole("tab", { name: /1-Step/ }));
  await jump("tab Instant", sec.getByRole("tab", { name: /Instant/ }));
  await jump("tab 2-Step", sec.getByRole("tab", { name: /2-Step/ }));
  await jump("control no click", null);
  await jump("size $50K", sec.getByRole("button", { name: "$50K" }));
  await jump("size $10K", sec.getByRole("button", { name: "$10K" }));
  await jump("size $200K", sec.getByRole("button", { name: "$200K" }));
  await jump("size $100K", sec.getByRole("button", { name: "$100K" }));
  await jump("type Classic", sec.getByRole("button", { name: /Classic/ }).first());
  await jump("platform 5", sec.getByRole("button", { name: /Platform 5/ }));
  await jump("open vault", page.locator("#fyt-vault > button"));
  await jump("treat Midnight", page.locator("#fyt-vault button", { hasText: "Midnight Rush" }));
  await jump("treat Midnight off", page.locator("#fyt-vault button", { hasText: "Midnight Rush" }));
  await jump("close vault", page.locator("#fyt-vault > button"));
  // CTA without treats should open the treat sheet, not leave or scroll the page.
  const cta = sec.locator("a", { hasText: "Get funded" }).first();
  await cta.scrollIntoViewIfNeeded();
  await sleep(600);
  const y0 = await page.evaluate(() => window.scrollY);
  await cta.click().catch((e) => log.push("cta1 " + e.message.split("\n")[0]));
  await sleep(1200);
  const sheet = page.getByRole("dialog", { name: "Pick your treats" });
  log.push(`[${vp.name}] CTA w/o treats: sheet=${await sheet.count()} scroll ${y0}->${await page.evaluate(() => window.scrollY)}`);
  await page.screenshot({ path: `${OUT}/${vp.name}-04-sheet.png` });
  for (const name of ["Vampire's Share", "Nightmare Mode"]) {
    await sheet.locator("button", { hasText: name }).first().click().catch((e) => log.push("treat " + e.message.split("\n")[0]));
    await sleep(400);
  }
  await sleep(500);
  await page.screenshot({ path: `${OUT}/${vp.name}-04b-sheet-picked.png` });
  log.push(`[${vp.name}] sheet CTA href: ${await sheet.locator("a").first().getAttribute("href")}`);
  await page.keyboard.press("Escape");
  await sleep(800);
  await sec.screenshot({ path: `${OUT}/${vp.name}-05-pricing-picked.png` });
  log.push(`[${vp.name}] CTA href: ${await cta.getAttribute("href")}`);
  if (!vp.mobile) {
    await sleep(8500);
    await page.evaluate(() => document.dispatchEvent(new MouseEvent("mouseout", { clientX: 600, clientY: 0, bubbles: true, relatedTarget: null })));
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-06-exit.png` });
    await page.getByRole("button", { name: /Keep my treats/ }).click().catch(() => {});
    await sleep(1800);
    log.push(`[desktop] after Keep my treats: #challenge top = ${await page.evaluate(() => Math.round(document.getElementById("challenge").getBoundingClientRect().top))}`);
  }
  await ctx.close();
}
// Giveaway pop-up (not submitted: no test sign-ups in Klaviyo).
for (const vp of vps) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[giveaway ${vp.name}] PAGEERROR: ${e.message}`));
  await page.goto(BASE + "?giveaway=1&halloween=1", { waitUntil: "load", timeout: 60000 });
  await sleep(3000);
  await page.screenshot({ path: `${OUT}/${vp.name}-07-giveaway.png` });
  const dlg = page.getByRole("dialog", { name: "FYT Private Giveaway" });
  await dlg.getByLabel("Email address").fill("name@example.com").catch((e) => log.push("fill " + e.message.split("\n")[0]));
  await dlg.getByLabel("Your name").fill("Rahul").catch(() => {});
  await sleep(500);
  await page.screenshot({ path: `${OUT}/${vp.name}-07b-giveaway-filled.png` });
  log.push(`[giveaway ${vp.name}] dialog=${await dlg.count()}`);
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
