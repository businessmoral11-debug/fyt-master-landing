// TEMPORARY: read-only look at the public featured-payouts feed (counts by country and recency).
import { writeFileSync } from "node:fs";
const base = "https://rewards.fundingyourtrades.com/api/v1/public/featured-payouts";
const all = [];
let totalItems = null;
for (let page = 1; page <= 10; page++) {
  const r = await fetch(`${base}?limit=100&page=${page}&sort=latest`);
  if (!r.ok) { all.push({ err: r.status }); break; }
  const j = await r.json();
  totalItems = j.meta?.pagination?.totalItems ?? totalItems;
  all.push(...j.data);
  if (!j.meta?.pagination?.hasNextPage) break;
}
const rows = all.filter((p) => p.amount !== undefined && Number(p.amount) > 0);
const now = Date.now();
const day = 86400000;
const win = (d) => rows.filter((p) => p.createdAt && now - Date.parse(p.createdAt) <= d * day);
const by = (arr) => { const m = {}; for (const p of arr) { const k = p.countryCode || "??"; (m[k] ||= { n: 0, usd: 0 }); m[k].n++; m[k].usd += Number(p.amount); } return Object.entries(m).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => `${k}:${v.n}/$${Math.round(v.usd)}`).join(" "); };
const dates = rows.map((p) => Date.parse(p.createdAt)).filter(Number.isFinite).sort((a, b) => a - b);
const out = [];
out.push(`totalItems(api)=${totalItems} fetched=${all.length} withAmount=${rows.length}`);
out.push(`oldest=${new Date(dates[0]).toISOString()} newest=${new Date(dates[dates.length - 1]).toISOString()}`);
for (const d of [7, 14, 30, 60, 90]) out.push(`last ${d}d: total=${win(d).length} countries=${new Set(win(d).map((p) => p.countryCode)).size} | ${by(win(d)).slice(0, 400)}`);
out.push(`ALL: ${by(rows).slice(0, 900)}`);
out.push(`sample: ${JSON.stringify(rows.slice(0, 2))}`);
writeFileSync("ci-out/log.txt", out.join("\n") + "\n");
