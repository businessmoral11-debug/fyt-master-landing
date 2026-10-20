// TEMPORARY - testing branch only (used by .github/workflows/redesign-preview.yml).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.SCREENS_URL || "http://127.0.0.1:4173/";
const OUT = "ci-out";
const log = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });

async function open(vp, query = "") {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, timezoneId: "Asia/Kolkata", locale: "en-IN" });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${vp.name}${query}] PAGEERROR: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") log.push(`[${vp.name}${query}] console.error: ${m.text().slice(0, 300)}`); });
  await page.goto(BASE + query, { waitUntil: "load", timeout: 60000 });
  await sleep(3000);
  return { ctx, page };
}

// Log the shape of the rewards feeds (helps match payouts to certificate images).
try {
  const api = "https://rewards.fundingyourtrades.com/api/v1/public";
  const p = await (await fetch(`${api}/featured-payouts?limit=3&page=1&sort=latest`)).json();
  const c = await (await fetch(`${api}/featured-certificates?limit=3&page=1&sort=latest`)).json();
  log.push("[api] payouts " + JSON.stringify(p.data?.slice(0, 3)));
  log.push("[api] certificates " + JSON.stringify(c.data?.slice(0, 3)));
  log.push("[api] payouts total " + JSON.stringify(p.meta) + " certs total " + JSON.stringify(c.meta));
} catch (e) { log.push("[api] fail " + e.message); }

const viewports = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

for (const vp of viewports) {
  const { ctx, page } = await open(vp);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < h; y += vp.height) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(i).padStart(2, "0")}.png` });
    i++;
  }
  log.push(`[${vp.name}] scrollHeight ${h}, shots ${i}`);
  // Plan finder pop-up: open from pricing, answer, capture the result.
  const opener = page.getByRole("button", { name: /Find your plan/ }).first();
  if (await opener.count()) {
    await opener.scrollIntoViewIfNeeded();
    await sleep(600);
    await opener.click().catch((e) => log.push("finder open fail " + e.message.split("\n")[0]));
    await sleep(900);
    const dlg = page.getByRole("dialog", { name: "Plan finder" });
    await page.screenshot({ path: `${OUT}/${vp.name}-finder-q1.png` });
    for (const label of ["1-3 years", "Scalping", "Sometimes"]) {
      await dlg.getByRole("button", { name: new RegExp(label) }).first().click().catch((e) => log.push("finder click fail " + label + " " + e.message.split("\n")[0]));
      await sleep(600);
    }
    await dlg.getByRole("button", { name: /\$100K/ }).first().click().catch((e) => log.push("finder size fail " + e.message.split("\n")[0]));
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-finder-result.png` });
    await page.keyboard.press("Escape");
    await sleep(500);
  }
  // Test pricing options A-F.
  for (const id of ["a", "b", "c", "d", "e", "f"]) {
    const el = page.locator(`#pricing-option-${id}`);
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await sleep(900);
      await el.screenshot({ path: `${OUT}/${vp.name}-option-${id}.png` }).catch((e) => log.push("option " + id + " " + e.message));
    }
  }
  // Option A with the new-trader offer and Classic picked.
  const optA = page.locator("#pricing-option-a");
  if (await optA.count()) {
    await optA.getByRole("radio", { name: /New traders/ }).click().catch((e) => log.push("welcome click " + e.message.split("\n")[0]));
    await optA.getByRole("button", { name: /^Classic/ }).first().click().catch((e) => log.push("classic click " + e.message.split("\n")[0]));
    await sleep(900);
    await optA.screenshot({ path: `${OUT}/${vp.name}-option-a-welcome.png` }).catch(() => {});
  }
  // New pricing: default, then Instant + new-trader offer.
  const pr = page.locator("#challenge");
  if (await pr.count()) {
    await pr.scrollIntoViewIfNeeded();
    await sleep(1000);
    await pr.screenshot({ path: `${OUT}/${vp.name}-pricing.png` }).catch((e) => log.push("pricing shot " + e.message));
    await pr.getByRole("button", { name: /Compare/ }).first().click().catch((e) => log.push("compare " + e.message.split("\n")[0]));
    await sleep(700);
    await pr.screenshot({ path: `${OUT}/${vp.name}-pricing-compare.png` }).catch(() => {});
    await pr.getByRole("tab", { name: /Instant/ }).click().catch((e) => log.push("instant tab " + e.message.split("\n")[0]));
    const sy = async (tag) => log.push(`[${vp.name}] ${tag}: scrollY=${await page.evaluate(() => Math.round(window.scrollY))} docH=${await page.evaluate(() => document.documentElement.scrollHeight)}`);
    await sy("before gift");
    await pr.getByRole("button", { name: /New to FYT/ }).click().catch((e) => log.push("gift open " + e.message.split("\n")[0]));
    await sleep(900);
    await page.screenshot({ path: `${OUT}/${vp.name}-gift-1.png` });
    await sy("modal open");
    await page.getByRole("button", { name: /Open my gift/ }).click().catch((e) => log.push("gift unlock " + e.message.split("\n")[0]));
    await sleep(700);
    await page.screenshot({ path: `${OUT}/${vp.name}-gift-2.png` });
    await sleep(1800);
    await page.screenshot({ path: `${OUT}/${vp.name}-gift-3.png` });
    await sy("after unlock");
    await page.getByRole("button", { name: /Use my gift/ }).click().catch((e) => log.push("gift use " + e.message.split("\n")[0]));
    await sleep(150);
    await sy("150ms after use");
    await sleep(1200);
    await sy("1.3s after use");
    await sleep(1000);
    log.push(`[${vp.name}] after Use my gift: scrollY=${await page.evaluate(() => Math.round(window.scrollY))} pricingTop=${await page.evaluate(() => Math.round(document.getElementById("challenge")?.getBoundingClientRect().top ?? -1))}`);
    await pr.screenshot({ path: `${OUT}/${vp.name}-pricing-instant.png` }).catch(() => {});
  }
  // Proof board tabs.
  for (const [tabName, file] of [["Biggest", "board-biggest"], ["On camera", "board-camera"], ["Live payouts", "board-live"]]) {
    const t = page.getByRole("tab", { name: tabName });
    if (await t.count()) {
      await t.scrollIntoViewIfNeeded();
      await t.click();
      await sleep(tabName === "Biggest" ? 6000 : 2500);
      await page.locator("#live-payouts").screenshot({ path: `${OUT}/${vp.name}-${file}.png` }).catch((e) => log.push(tabName + " shot " + e.message));
    }
  }
  await ctx.close();
}

for (const [q, name] of [["?welcomeback=1", "welcome"], ["?exitdemo=1", "exit"]]) {
  for (const vp of viewports) {
    const { ctx, page } = await open(vp, q);
    await sleep(2000);
    await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png` });
    await ctx.close();
  }
}

writeFileSync(`${OUT}/screens-log.txt`, log.join("\n") + "\n");
await browser.close();
