# Deployment Queue — FYT Landing Page

Checklist for handing this project off to the client / deploying it on a new domain. See `README.md`'s "Deployment / Handoff" section for the full step-by-step; this file tracks the specific action items and owners.

## [YOU / BACKEND OPERATOR] Add the client's landing-page domain to backend CORS

The backend at `rewards.fundingyourtrades.com` currently only allows CORS requests from its own origin (`https://rewards.fundingyourtrades.com`). Once the client's landing page is live on its final domain, that domain must be added to the backend's `CORS_ORIGIN` allowlist, or the browser will block every API call (Globe stats, featured payouts, featured certificates) — the page still loads and functions, but falls back to its existing empty/error states instead of showing live data.

```
CORS_ORIGIN=https://rewards.fundingyourtrades.com,https://client-final-domain.com
```

- This is a config change on the **backend's** deployment — nothing to change in this project.
- **Do not add `http://localhost:*` or `*.trycloudflare.com` to the production CORS allowlist.** Those are dev/testing-only origins; leaving them in a production allowlist is an unnecessary attack surface with zero legitimate use once the real domain is live. Use them only in a local/staging `CORS_ORIGIN` value, never the one backing the production backend.
- The backend domain and the landing-page domain are intentionally independent — this project never assumes they're the same.

## [CLIENT / DEPLOYER] Configure the API base URL

`VITE_API_BASE_URL` is the only environment variable this project needs. Set it to wherever the backend actually runs, then build:

```
VITE_API_BASE_URL=https://api.client-domain.com/api/v1
npm run build
```

Documented in `.env.example`. If left unset, the build falls back to `https://rewards.fundingyourtrades.com/api/v1` (current production backend), so an unconfigured build still works for evaluation — but a real deployment should set this explicitly. Vite inlines this value at **build** time; changing `.env` after `npm run build` has no effect on an already-built `dist/` output — rebuild.

## [CLIENT / DEPLOYER] Deploy the static build

`npm run build` → serve the generated `dist/` folder on any static host. Single-page app, anchor-only navigation (no client-side router), so no SPA fallback/rewrite rule is required.

## [CLIENT] SEO metadata (manual, one-time)

If the landing page's public domain differs from `fundingyourtrades.com`, update `index.html`'s `<title>`, meta description, `canonical`, Open Graph tags, and JSON-LD block to match. Intentionally not derived from `VITE_API_BASE_URL` — the API origin and the public-facing site domain are different concepts.

## Verified (this audit)

- `VITE_API_BASE_URL` is the single, consistently-used source for every API call (`apiBaseUrl.ts` → `globeStatsApi.ts` / `rewardsApi.ts`) — no duplicated or hardcoded backend origins anywhere in `src/`.
- No hardcoded frontend-origin assumptions: only one `window.location` usage in the whole codebase (`window.location.hash = "challenge"`, a same-page anchor scroll — not an origin/domain assumption).
- No `localhost` or `trycloudflare.com` references anywhere in `src/` (the only `trycloudflare.com` mention anywhere in the project is `vite.config.ts`'s `server.allowedHosts`, which is dev-server-only and has zero effect on the production build — confirmed absent from `dist/` output).
- `npm test` — 701/701 passing. `npm run build` — succeeds, no dev-infra strings in the output bundle.
- No UI, Globe, or API logic was changed as part of this audit — verification only, plus the `.env.example` documentation and this file.
