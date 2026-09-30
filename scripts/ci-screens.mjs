// TEMPORARY - used only by .github/workflows/redesign-preview.yml.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const URL = process.env.SCREENS_URL || "http://127.0.0.1:4173/";
const BENCH_ONLY = !!process.env.BENCH_ONLY;
const BENCH_LABEL = process.env.BENCH_LABEL || "this-branch";
const OUT = "ci-out";
const log = [];

const viewports = [
  { name: "desktop", width: 1440, height: 900, dpr: 1, mobile: false },
  { name: "mobile", width: 390, height: 844, dpr: 1, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
for (const vp of BENCH_ONLY ? [] : viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  // Screenshot-only: block the Klaviyo marketing popup so it doesn't cover the page.
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") log.push(`[${vp.name}] console.${m.type()}: ${m.text()}`); });
  page.on("pageerror", (e) => log.push(`[${vp.name}] PAGEERROR: ${e.message}`));
  page.on("response", (r) => { if (r.status() >= 400) log.push(`[${vp.name}] HTTP ${r.status()} ${r.url()}`); });
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "load", timeout: 60000 });
  log.push(`[${vp.name}] load in ${Date.now() - t0}ms`);
  await sleep(3500);
  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const lcp = performance.getEntriesByType("largest-contentful-paint").pop();
    const res = performance.getEntriesByType("resource");
    return {
      dcl: nav && Math.round(nav.domContentLoadedEventEnd),
      load: nav && Math.round(nav.loadEventEnd),
      lcp: lcp && Math.round(lcp.startTime),
      jsKB: Math.round(res.filter((r) => r.initiatorType === "script").reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
      totalKB: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
    };
  });
  log.push(`[${vp.name}] perf ${JSON.stringify(perf)}`);
  await page.screenshot({ path: `${OUT}/${vp.name}-00-top.png` });

  // Walk down the page one viewport at a time (lets scroll-triggered
  // animations fire) and capture each stop.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 1;
  for (let y = vp.height; y < h; y += vp.height) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(1300);
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(i).padStart(2, "0")}-y${y}.png` });
    if (i === 3) {
      const diag = await page.evaluate(() => ({
        scrollY: window.scrollY,
        docTop: document.documentElement.scrollTop,
        bodyTop: document.body.scrollTop,
        scrollH: document.documentElement.scrollHeight,
        cta: !!document.querySelector('a[aria-label^="Start Challenge"]'),
        challengeTop: document.getElementById("challenge")?.getBoundingClientRect().top,
      }));
      log.push(`[${vp.name}] diag ${JSON.stringify(diag)}`);
    }
    i++;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });
  log.push(`[${vp.name}] scrollHeight ${h}`);
  await ctx.close();
}
// ---- Smoothness benchmark: phone-sized page, CPU throttled 4x (roughly a
// mid-range phone). Scrolls the whole page smoothly and taps through the
// challenge picker, recording how many frames take too long.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.route(/klaviyo\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load", timeout: 60000 });
  await sleep(3000);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const frameStats = (label, fn) => page.evaluate(async ([label, body]) => {
    const deltas = [];
    let last = performance.now();
    let running = true;
    const loop = (t) => { deltas.push(t - last); last = t; if (running) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    await new Function(`return (async () => { ${body} })()`)();
    running = false;
    await new Promise((r) => setTimeout(r, 100));
    const d = deltas.slice(2);
    const avg = d.reduce((a, b) => a + b, 0) / d.length;
    return `${label}: frames=${d.length} avgMs=${avg.toFixed(1)} over33ms=${d.filter((x) => x > 33.4).length} over50ms=${d.filter((x) => x > 50).length} worstMs=${Math.max(...d).toFixed(0)}`;
  }, [label, fn]);
  const scrollBody = `
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
    const H = document.documentElement.scrollHeight - innerHeight;
    const start = performance.now(); const dur = 12000;
    await new Promise((resolve) => { const step = () => { const p = Math.min(1, (performance.now() - start) / dur); window.scrollTo(0, H * p); if (p < 1) requestAnimationFrame(step); else resolve(); }; requestAnimationFrame(step); });
  `;
  log.push(`[bench ${BENCH_LABEL}] ${await frameStats("scroll-whole-page", scrollBody)}`);
  const toggleBody = `
    document.getElementById("challenge").scrollIntoView(); await new Promise(r => setTimeout(r, 800));
    const groups = [...document.querySelectorAll('#challenge [role="group"] button')];
    for (let round = 0; round < 3; round++) for (const b of groups) { b.click(); await new Promise(r => setTimeout(r, 120)); }
  `;
  log.push(`[bench ${BENCH_LABEL}] ${await frameStats("idle-at-challenge-3s", `document.getElementById("challenge").scrollIntoView(); await new Promise(r => setTimeout(r, 3000));`)}`);
  if (!BENCH_ONLY) {
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
    await cdp.send("Profiler.start");
  }
  log.push(`[bench ${BENCH_LABEL}] ${await frameStats("tap-challenge-picker", toggleBody)}`);
  if (!BENCH_ONLY) {
    const { profile } = await cdp.send("Profiler.stop");
    const byId = new Map(profile.nodes.map((n) => [n.id, n]));
    const self = new Map();
    const dt = profile.timeDeltas;
    profile.samples.forEach((id, i) => {
      const n = byId.get(id);
      const cf = n.callFrame;
      const key = `${cf.functionName || "(anon)"} ${cf.url.split("/").pop()}:${cf.lineNumber}`;
      self.set(key, (self.get(key) || 0) + (dt[i] || 0));
    });
    const total = [...self.values()].reduce((a, b) => a + b, 0);
    const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
    log.push(`[profile] total ${(total / 1000).toFixed(0)}ms`);
    for (const [k, v] of top) log.push(`[profile] ${(v / 1000).toFixed(1)}ms ${k}`);
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/${BENCH_ONLY ? `bench-${BENCH_LABEL}` : "log"}.txt`, log.join("\n") + "\n");
console.log(log.join("\n"));
