# Migrated

The Mukoko Sanity Studio has moved to the marketing monorepo, where it
sits alongside the studios for the Nyuchi blog and the Bundu newsroom.

## Where it lives now

- **Path**: https://github.com/bundu-labs/marketing/tree/main/studio-mukoko-blog
- **Sanity project**: `npzanja1`, dataset `production` — unchanged.
- **Schema**: post / author / category, ported 1:1.
- **Studio host**: `https://mukoko-blog.sanity.studio` (configured in
  `sanity.cli.ts`).

No content migration was required — existing posts, authors, and
categories are read directly by `apps/mukoko/src/lib/sanity.ts` in the
new monorepo.

## Develop / deploy

```bash
gh repo clone bundu-labs/marketing
cd marketing/studio-mukoko-blog
npm install
npm run dev      # http://localhost:3333
npm run deploy   # lifts schema to mukoko-blog.sanity.studio
```
