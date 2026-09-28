# FYT Landing Page

## Development

```
npm install
npm run dev
```

## Tests & build

```
npm test          # Vitest
npm run build     # production build -> dist/
```

This project has no separate typecheck/lint scripts — `npm run build` (Vite/esbuild) is the closest thing to a type check it performs, and `npm test` is the only automated correctness check.

## Deployment / Handoff

This landing page and its backend are **separate deployments** — they do not need to share a domain, server, or hosting provider.

1. **Install dependencies**

   ```
   npm install
   ```

2. **Configure the backend origin.** Copy `.env.example` to `.env` (or `.env.production`, or set the variable in your hosting platform's environment-variable UI) and set:

   ```
   VITE_API_BASE_URL=https://backend-domain.com/api/v1
   ```

   If left unset, the build falls back to the current production backend (`https://rewards.fundingyourtrades.com/api/v1`), so an unconfigured build still works — but a real deployment on a different backend should set this explicitly.

   **Important:** Vite inlines `VITE_API_BASE_URL` at *build* time, not at runtime. Set it before running `npm run build`; changing it afterward requires a rebuild, not just a redeploy of the same `dist/` output.

3. **Build**

   ```
   npm run build
   ```

4. **Serve** the generated `dist/` folder using any static host (Nginx, Vercel, Netlify, Cloudflare Pages, S3+CDN, etc.). This is a single-page app with anchor-based (`#section`) navigation only — no client-side router — so no SPA fallback/rewrite rule is required.

5. **Backend CORS.** The backend must allow the landing page's deployed domain via its own `CORS_ORIGIN` configuration (that's a setting on the backend's deployment, not something to change here). Without it, the browser blocks the API calls and the Globe/rewards/certificates sections fall back to their existing empty/error states instead of showing live data — the page itself still loads and functions correctly.

**The landing page domain and the backend domain can be completely different.** For example:

```
Landing page: https://client-domain.com
Backend API:  https://api.client-domain.com/api/v1
```

That configuration is fully supported without any source-code change.

No secrets belong in this project's frontend environment — everything under `VITE_*` ends up in the public JS bundle, so only ever put public, non-sensitive values there.

### SEO metadata

`index.html`'s `<title>`, meta description, `canonical`, Open Graph (`og:*`), Twitter Card tags, and the JSON-LD `Organization` block currently point at `fundingyourtrades.com` — the real business domain this content describes. If the landing page is deployed under a **different public-facing domain**, update these values by hand to match (they are static SEO/social-preview metadata, intentionally not derived from `VITE_API_BASE_URL` — the API origin and the public site's own domain are different concepts and shouldn't be coupled).
