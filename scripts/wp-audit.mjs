import { chromium } from "playwright";
const B = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/";
await new Promise((r) => setTimeout(r, 150000));
const out = [];
const b = await chromium.launch();
for (const cc of ["GB", "DE", "BR", "ID", "VN", "PH", "AU", "NG"]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(B + "?country=" + cc, { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(3000);
  const order = [];
  // advance through the deck via thumbnails shown over time is slow; read main + thumbs
  const info = await p.evaluate(() => ({ main: document.querySelector('button[aria-label^="Play video:"]')?.getAttribute("aria-label"), thumbs: [...document.querySelectorAll('button[aria-label^="Show video:"]')].map((t) => t.getAttribute("aria-label").replace("Show video: ", "")), scope: [...document.querySelectorAll("span")].find((s) => /^Funded traders /.test(s.textContent || ""))?.textContent }));
  out.push(cc + " " + JSON.stringify(info));
  await p.close();
}
// popup check: wait for giveaway popup on IN
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(B + "?country=IN", { waitUntil: "load" });
await p.waitForTimeout(2000);
for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 700); await p.waitForTimeout(500); }
await p.waitForTimeout(8000);
out.push("dialogs: " + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map((d) => (d.getAttribute("aria-label") || "") + "|" + (d.textContent || "").slice(0, 80)))));
await p.screenshot({ path: "ci-out/popup.png" });
console.log(out.join("\n"));
await b.close();
