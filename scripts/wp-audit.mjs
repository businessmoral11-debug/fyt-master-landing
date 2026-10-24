import { webkit, chromium, devices } from "playwright";
const B = "https://fyt-master-landing-git-mobile-pricing-bm-med.vercel.app/?country=IN";
await new Promise((r) => setTimeout(r, 150000));
const out = [];
for (const [k, n, o] of [[webkit, "iphone", devices["iPhone 14"]], [chromium, "desk", { viewport: { width: 1280, height: 700 } }]]) {
  const b = await k.launch();
  const ctx = await b.newContext(o);
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); localStorage.setItem("fyt_known_visitor_v1", "1"); } catch {} });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(B, { waitUntil: "load", timeout: 60000 }); await p.waitForSelector("#challenge"); await p.waitForTimeout(1500);
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  const h = await p.evaluate(() => document.getElementById("challenge").offsetHeight);
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y0 + (n === "iphone" ? 480 : 120)); await p.waitForTimeout(1200);
  await p.screenshot({ path: `ci-out/${n}-1.png` });
  if (n === "iphone") { await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y0 + 40); await p.waitForTimeout(1000); await p.screenshot({ path: `ci-out/${n}-0.png` }); await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y0 + 900); await p.waitForTimeout(1000); await p.screenshot({ path: `ci-out/${n}-2.png` }); }
  out.push(`${n}: height ${h} errs ${JSON.stringify(errs)}`);
  await b.close();
}
console.log(out.join("\n"));
