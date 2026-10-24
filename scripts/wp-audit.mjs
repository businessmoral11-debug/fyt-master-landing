import { webkit, devices } from "playwright";
const B = "https://fyt-master-landing-git-mobile-pricing-bm-med.vercel.app/";
await new Promise((r) => setTimeout(r, 150000));
const out = [];
const b = await webkit.launch();
for (const m of ["1", "2", "3"]) {
  const ctx = await b.newContext({ ...devices["iPhone 14"] });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); localStorage.setItem("fyt_known_visitor_v1", "1"); } catch {} });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(B + "?country=IN&mlayout=" + m, { waitUntil: "load", timeout: 60000 });
  await p.waitForSelector("#challenge"); await p.waitForTimeout(1500);
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  const at = async (n, y) => { await p.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y); await p.waitForTimeout(900); await p.screenshot({ path: `ci-out/m${m}-${n}.png` }); };
  await at("a", y0 + 40);
  await at("b", y0 + 560);
  if (m !== "3") await at("c", y0 + 1000);
  if (m === "3") {
    for (const k of [1, 2, 3]) { await p.getByRole("button", { name: "Continue" }).click().catch(() => {}); await p.waitForTimeout(500); await p.screenshot({ path: `ci-out/m3-step${k + 1}.png` }); }
  }
  const h = await p.evaluate(() => document.getElementById("challenge").offsetHeight);
  out.push(`m${m}: section height ${h} errs ${JSON.stringify(errs)}`);
  await ctx.close();
}
console.log(out.join("\n"));
await b.close();
