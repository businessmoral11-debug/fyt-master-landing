// TEMPORARY: verify hero video wall per country on the region-proof preview.
import { chromium, webkit, devices } from "playwright";
const BASE = "https://fyt-master-landing-git-region-proof-bm-med.vercel.app/";
const out = [];
async function run(kind, label, ctxOpts, cc) {
  const b = await (kind === "webkit" ? webkit : chromium).launch();
  const ctx = await b.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => m.type() === "error" && !/klaviyo|trustindex|favicon/i.test(m.text()) && errs.push(m.text()));
  await page.goto(BASE + (cc ? "?country=" + cc : ""), { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3500);
  const info = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label^="Play video:"]');
    const scope = [...document.querySelectorAll("span")].find((s) => /^Funded traders /.test(s.textContent || ""));
    const thumbs = [...document.querySelectorAll('button[aria-label^="Show video:"]')].map((t) => t.getAttribute("aria-label").replace("Show video: ", ""));
    return { main: btn?.getAttribute("aria-label"), scope: scope?.textContent, thumbs };
  });
  out.push(`${label} ${cc || "none"}: ${JSON.stringify(info)} errs=${JSON.stringify(errs)}`);
  const root = page.locator('button[aria-label^="Play video:"]').locator("xpath=ancestor::div[contains(@class,'relative w-full')][1]");
  try { await root.screenshot({ path: `ci-out/hero-${label}-${cc || "none"}.png` }); } catch (e) { out.push("shot fail " + e.message); }
  if (label === "desk") await page.screenshot({ path: `ci-out/full-${cc || "none"}.png` });
  if (cc === "IN") {
    const order = await page.evaluate(() => [...document.querySelectorAll("section, [id]")].map((e) => e.id).filter(Boolean).join(","));
    out.push("ids " + order);
  }
  await b.close();
}
for (const cc of ["IN", "US", "GB", "BR", "AE"]) await run("chromium", "desk", { viewport: { width: 1440, height: 1000 } }, cc);
await run("chromium", "desk", { viewport: { width: 1100, height: 900 } }, "IN");
for (const cc of ["IN", "US"]) await run("webkit", "phone", { ...devices["iPhone 14"] }, cc);
await run("chromium", "desk", { viewport: { width: 1440, height: 1000 } }, null);
console.log(out.join("\n"));
