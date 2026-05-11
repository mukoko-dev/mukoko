# Migrated

The marketing-Mukoko site has moved out of this repo.

## Where it lives now

- **Source code**: https://github.com/bundu-labs/marketing/tree/main/apps/mukoko
- **Sanity studio**: https://github.com/bundu-labs/marketing/tree/main/studio-mukoko-blog
- **Stack**: Astro 6 (was Next.js 15) + Tailwind v4, deployed on Vercel.
- **Sanity project**: `npzanja1`, dataset `production` — reused as-is, no
  content migration was required.

## Why it moved

The Bundu Family marketing properties (Nyuchi Africa, the Bundu
Foundation, and Mukoko) now share a single monorepo so they can share
design tokens, layout primitives (`@bundu-labs/domains`,
`packages/ui-tokens`), CI checks, and Vercel previews. Keeping Mukoko
in its own platform repo created drift between the marketing voices.

## What lives in `web/` for now

The original Next.js source tree is intentionally kept on `main` until
the new Astro site has been live on `mukoko.com` for one release cycle.
That way we can roll back deploys without resurrecting deleted code.

A follow-up PR will remove `web/` and `web/studio/` once the new site
has been verified in production.

## How to develop

Don't develop here. Push changes to the marketing repo:

```bash
gh repo clone bundu-labs/marketing
cd marketing
npm install
npm run dev --workspace=apps/mukoko
```

The studio is a separate Sanity app:

```bash
cd studio-mukoko-blog
npm install
npm run dev   # http://localhost:3333
```
