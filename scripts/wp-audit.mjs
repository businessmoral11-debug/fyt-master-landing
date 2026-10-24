// TEMPORARY: no giveaway pop-up, calm countdown. Fresh visitor (no stored flags), scrolls the whole page.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const URL = "https://fyt-master-landing-7s7dthuvg-bm-med.vercel.app/";
const log = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, timezoneId: "Europe/London" });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
await page.goto(URL + "?halloween=1", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("#live-payouts", { timeout: 45000 });
let dialogs = 0;
for (let y = 0; y < 9000; y += 450) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y); await page.waitForTimeout(500); dialogs += await page.evaluate(() => Array.from(document.querySelectorAll("[role=dialog]")).filter((d) => !/demo accounts/i.test(d.textContent || "") && !/Find my best fit/.test(d.getAttribute("aria-label") || "")).length); }
log.push("pop-up dialogs seen while scrolling: " + dialogs);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(1500);
log.push("timer: " + JSON.stringify(await page.evaluate(() => { const t = document.querySelector(".fyt-hw-timer"); if (!t) return "no timer"; const cs = getComputedStyle(t); const b = getComputedStyle(t, "::before"); const n = document.querySelector(".fyt-hw-num"); return { anim: cs.animationName, glowAnim: b.animationName, glowOp: b.opacity, numAnim: n ? getComputedStyle(n).animationName : null }; })));
await page.screenshot({ path: "ci-out/top.png" });
log.push("errors " + JSON.stringify([...new Set(errs)]));
await browser.close();
writeFileSync("ci-out/log.txt", log.join("\n") + "\n");
