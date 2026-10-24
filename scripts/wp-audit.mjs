import { webkit, chromium, devices } from "playwright";
const B = "https://fyt-master-landing-git-mobile-pricing-bm-med.vercel.app/";
await new Promise((r) => setTimeout(r, 20000));
const out = [];
for (const [k, n] of [[webkit, "wk"], [chromium, "ch"]]) {
  const b = await k.launch();
  const ctx = await b.newContext({ ...(n === "wk" ? devices["iPhone 14"] : devices["Pixel 7"]) });
  await ctx.addInitScript(() => { try { localStorage.setItem("fyt_giveaway_done_v1", String(Date.now())); localStorage.setItem("fyt_known_visitor_v1", "1"); } catch {} });
  const p = await ctx.newPage();
  await p.goto(B + "?country=IN&mlayout=1", { waitUntil: "load", timeout: 60000 });
  await p.waitForSelector("#challenge"); await p.waitForTimeout(1500);
  const y0 = await p.evaluate(() => document.getElementById("challenge").getBoundingClientRect().top + scrollY);
  for (const d of [250, 450, 650]) {
    await p.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y0 + d); await p.waitForTimeout(1500);
    const info = await p.evaluate(() => {
      const cls = document.body.classList.contains("fyt-buybar");
      const bar = [...document.querySelectorAll("body > div")].find((e) => /Get funded/.test(e.textContent || "") && getComputedStyle(e).position === "fixed");
      const r = bar?.getBoundingClientRect();
      return { cls, bar: !!bar, rect: r ? [Math.round(r.top), Math.round(r.bottom), Math.round(r.height)] : null, vh: innerHeight };
    });
    out.push(`${n} +${d}: ${JSON.stringify(info)}`);
    await p.screenshot({ path: `ci-out/${n}-m1-${d}.png` });
  }
  await b.close();
}
console.log(out.join("\n"));
