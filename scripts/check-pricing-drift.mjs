#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractArrayLiteral, sanitizeToJson } from "./parseProductsConfig.mjs";
import { STEP_PLANS, STEP_SIZES, getEntry } from "../src/app/data/pricing.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRICING_TS_PATH = join(__dirname, "..", "src", "app", "data", "pricing.ts");
const LIVE_URL = "https://fundingyourtrades.com/";
const MARKER = "const PRODUCTS_CONFIG =";
const STEPS = ["1-Step", "2-Step", "Instant"];
const PLATFORMS = ["match-trader", "platform-5"];

const PROD_MAP = {
  "1-Step": { classic: "fyt", prime: "fyt-prime" },
  "2-Step": { classic: "fyt", prime: "fyt-pro" },
  Instant: { plus: "fyt", prime: "fyt-pro" },
};
const TYPE_MAP = {
  "1-Step": () => "1-STEP",
  "2-Step": () => "2-STEP-∞",
  Instant: (plan) => (plan === "plus" ? "INSTANT-PLUS" : "INSTANT"),
};

function findLiveEntry(liveProducts, step, plan, platform, size) {
  const prodId = PROD_MAP[step][plan];
  const type = TYPE_MAP[step](plan);
  const product = liveProducts.find((p) => p.id === prodId);
  return product?.plans?.[platform]?.[type]?.[size] ?? null;
}

async function main() {
  const write = process.argv.includes("--write");

  const res = await fetch(LIVE_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; pricing-drift-check/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`fetch failed: HTTP ${res.status}`);
  const html = await res.text();

  const arrayLiteral = extractArrayLiteral(html, MARKER);
  const liveProducts = JSON.parse(sanitizeToJson(arrayLiteral));

  let pricingSrc = readFileSync(PRICING_TS_PATH, "utf8");
  const mismatches = [];

  for (const step of STEPS) {
    for (const plan of STEP_PLANS[step]) {
      for (const platform of PLATFORMS) {
        for (const size of STEP_SIZES[step]) {
          const ours = getEntry(step, plan.id, platform, size);
          if (!ours) continue;
          const live = findLiveEntry(liveProducts, step, plan.id, platform, size);
          if (!live) {
            mismatches.push({ step, plan: plan.id, platform, size, issue: "no live entry found" });
            continue;
          }
          const liveId = Number(live.url.match(/add-to-cart=(\d+)/)?.[1]);
          const idOk = liveId === ours.productId;
          const oldOk = Math.abs(live.priceOld - ours.priceOld) < 0.001;
          const newOk = Math.abs(live.priceNew - ours.priceNew) < 0.001;
          if (!idOk || !oldOk || !newOk) {
            mismatches.push({
              step, plan: plan.id, platform, size,
              ours: { priceOld: ours.priceOld, priceNew: ours.priceNew, productId: ours.productId },
              live: { priceOld: live.priceOld, priceNew: live.priceNew, productId: liveId },
            });
          }
        }
      }
    }
  }

  if (mismatches.length === 0) {
    console.log("✅ pricing.ts matches the live PRODUCTS_CONFIG exactly (60/60 combinations).");
    process.exit(0);
  }

  console.log(`⚠️  ${mismatches.length} mismatch(es) found:\n`);
  for (const m of mismatches) {
    const label = `${m.step}/${m.plan}/${m.platform}/$${m.size / 1000}K`;
    if (m.issue) {
      console.log(`  ${label}: ${m.issue}`);
      continue;
    }
    console.log(`  ${label}: ours=${JSON.stringify(m.ours)} live=${JSON.stringify(m.live)}`);
    if (write) {
      if (m.ours.productId !== m.live.productId) {
        console.log(`    ⚠️ --write: productId itself differs (ours ${m.ours.productId} vs live ${m.live.productId}) — needs manual review, skipping.`);
      } else {
        const anchor = new RegExp(`\\[\\s*[\\d.]+\\s*,\\s*[\\d.]+\\s*,\\s*${m.ours.productId}\\s*\\]`);
        if (!anchor.test(pricingSrc)) {
          console.log(`    ⚠️ --write: could not find a unique anchor for productId ${m.ours.productId} in pricing.ts, skipping — patch by hand.`);
        } else {
          pricingSrc = pricingSrc.replace(anchor, `[${m.live.priceOld}, ${m.live.priceNew}, ${m.ours.productId}]`);
        }
      }
    }
  }

  if (write) {
    writeFileSync(PRICING_TS_PATH, pricingSrc);
    console.log(`\n✏️  Wrote updated priceOld/priceNew literals to ${PRICING_TS_PATH}`);
    console.log("   This does NOT touch pricing.test.ts's hardcoded literal assertions, the");
    console.log("   file's header comments, or productId/rule fields — check those by hand,");
    console.log("   then run `npm test`, `npx tsc --noEmit`, and `npm run build`.");
  } else {
    console.log("\nRun again with --write to patch these priceOld/priceNew values in place.");
  }

  process.exit(1);
}

main().catch((err) => {
  console.error("check-pricing-drift failed:", err.message);
  process.exit(2);
});
