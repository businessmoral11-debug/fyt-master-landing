import { chromium, webkit, devices } from "playwright";
const B = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/?country=IN";
await new Promise((r) => setTimeout(r, 150000));
const out = [];
for (const [k, n, o] of [[chromium, "desk", { viewport: { width: 1280, height: 700 } }], [webkit, "phone", { ...devices["iPhone 14"] }]]) {
  const b = await k.launch(); const p = await (await b.newContext(o)).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(B, { waitUntil: "load", timeout: 60000 }); await p.waitForSelector("#challenge"); await p.waitForTimeout(2000);
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y0 + 120); await p.waitForTimeout(900);
  await p.screenshot({ path: `ci-out/final-${n}.png` });
  const info = await p.evaluate(() => ({ switcher: !!document.querySelector('[aria-label="Pricing layout"]'), giveaway: true }));
  out.push(`${n}: ${JSON.stringify(info)} errs ${JSON.stringify(errs)}`);
  await b.close();
}
console.log(out.join("\n"));
