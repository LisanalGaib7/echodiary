# Migration Guide — Off Lovable

This app is deliberately structured so it can run on any host that supports
TanStack Start (Vercel, Netlify, Cloudflare Workers/Pages, or a plain Node
server). Lovable-specific bits are isolated to a handful of files.

## What's Lovable-specific?

| Concern | File | Replacement |
|---|---|---|
| Vite preset | `vite.config.ts` -> `@lovable.dev/vite-tanstack-config` | `vite.config.portable.ts` (already included) |
| AI provider | `AI_PROVIDER=lovable` + `LOVABLE_API_KEY` | Set `AI_PROVIDER` to `openai` / `openrouter` / `gemini` and the matching key |
| Error reporting | `src/lib/lovable-error-reporting.ts` | Optional: swap for Sentry etc. |

All other code (routes, IndexedDB, styles, hooks) is standard TanStack Start.

---

## Step 1 — Replace the Vite config

```bash
mv vite.config.portable.ts vite.config.ts
bun remove @lovable.dev/vite-tanstack-config
```

Then in `package.json` add whichever `nitro` preset you need (already a
devDep). Set `NITRO_PRESET` at build time:

- Vercel: `NITRO_PRESET=vercel`
- Netlify: `NITRO_PRESET=netlify`
- Cloudflare Workers: `NITRO_PRESET=cloudflare-module`
- Node server: `NITRO_PRESET=node-server` (default)

## Step 2 — Environment variables

Copy `.env.example` to `.env` (local) or configure them in your platform:

```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=https://your-domain.com
TURNSTILE_SECRET=...            # optional
VITE_TURNSTILE_SITE_KEY=...     # optional (browser-safe)
```

`ALLOWED_ORIGINS` is **required in production** — it blocks other sites
from calling your AI endpoint and burning your credits.

## Step 3 — Per-platform notes

### Vercel

```bash
NITRO_PRESET=vercel bun run build
vercel deploy
```

Set env vars in the Vercel dashboard. The output is standard Vercel
functions; no extra config needed.

### Netlify

```bash
NITRO_PRESET=netlify bun run build
```

Add a `netlify.toml`:
```toml
[build]
  command = "NITRO_PRESET=netlify bun run build"
  publish = ".output/public"
```

### Cloudflare Workers

Already the Lovable default. Off-Lovable equivalent:

```bash
NITRO_PRESET=cloudflare-module bun run build
wrangler deploy .output/server/index.mjs
```

Enable `nodejs_compat` in `wrangler.toml`.

### Self-hosted Node

```bash
NITRO_PRESET=node-server bun run build
node .output/server/index.mjs
```

Front with nginx/Caddy for TLS.

## Step 4 — Data

User entries live in the browser's IndexedDB (`echo-diary` DB). Nothing to
migrate server-side. If you later add cloud sync, bump `schemaVersion` on
the `Entry` type and write a migration.

## Step 5 — Rotate keys

Once off Lovable, revoke the old `LOVABLE_API_KEY` from the Lovable
dashboard so it can't be replayed.

---

## Security posture (portable, not Lovable-specific)

Already enforced in code:

- Per-IP in-memory rate limit on the AI endpoint (best-effort per isolate).
- `Origin`/`Referer` whitelist via `ALLOWED_ORIGINS`.
- Optional Cloudflare Turnstile via `TURNSTILE_SECRET` (server) +
  `VITE_TURNSTILE_SITE_KEY` (browser widget — wire up when needed).
- Security headers on every SSR response (`X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`).
- Input length cap (8000 chars) + Zod validation.
- No `dangerouslySetInnerHTML` anywhere in the render tree.

Recommended for production:

- Set `ALLOWED_ORIGINS` before public launch.
- Add Turnstile once you have >0 real users.
- Add a shared/distributed rate limiter (Upstash Redis, CF KV) if traffic
  outgrows a single isolate.
