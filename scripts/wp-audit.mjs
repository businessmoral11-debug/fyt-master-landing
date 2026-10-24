import { chromium, webkit, devices } from "playwright";
const BASE = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/?country=IN";
await new Promise((r) => setTimeout(r, 150000));
for (const [k, n, o] of [[chromium, "desk", { viewport: { width: 1440, height: 900 } }], [chromium, "lap", { viewport: { width: 1100, height: 800 } }], [webkit, "phone", { ...devices["iPhone 14"] }]]) {
  const b = await k.launch(); const p = await (await b.newContext(o)).newPage();
  await p.goto(BASE, { waitUntil: "load", timeout: 60000 }); await p.waitForTimeout(4000);
  await p.screenshot({ path: `ci-out/top-${n}.png` });
  await b.close();
}
