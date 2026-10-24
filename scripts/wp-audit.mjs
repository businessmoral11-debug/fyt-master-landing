import { chromium, webkit, devices } from "playwright";
const out = [];
for (const [k, n, o] of [[chromium, "desk", { viewport: { width: 1280, height: 700 } }], [webkit, "phone", { ...devices["iPhone 14"] }]]) {
  const b = await k.launch(); const p = await (await b.newContext(o)).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto("https://fundingyourtrades.com/?country=IN&nocache=" + Date.now(), { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(4000);
  const heroVideo = await p.evaluate(() => document.querySelector('button[aria-label^="Play video:"]')?.getAttribute("aria-label") || null);
  await p.waitForSelector("#challenge", { timeout: 30000 }).catch(() => {});
  const info = await p.evaluate(() => ({ heroVideo: document.querySelector('button[aria-label^="Play video:"]')?.getAttribute("aria-label") || null, scope: [...document.querySelectorAll("span")].find((s) => /^Funded traders /.test(s.textContent || ""))?.textContent || null, vaultBar: /Haunted Vault/i.test(document.body.innerText), challenge: !!document.getElementById("challenge"), exitPopup: /Don't leave your treats/.test(document.body.innerText) }));
  out.push(`${n}: ${JSON.stringify(info)} errs ${JSON.stringify(errs)}`);
  await p.screenshot({ path: `ci-out/live-${n}.png` });
  await b.close();
}
console.log(out.join("\n"));
