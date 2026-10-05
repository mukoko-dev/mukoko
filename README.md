# Mukoko

> The monorepo for the Mukoko super app — a privacy-first social ecosystem for
> Africa, built on Ubuntu philosophy.

[![CI](https://github.com/mukoko-dev/mukoko/actions/workflows/ci.yml/badge.svg)](https://github.com/mukoko-dev/mukoko/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Preact](https://img.shields.io/badge/Preact-10-673AB8?style=flat-square&logo=preact&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-4-E36002?style=flat-square&logo=hono&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9.15.4-F69220?style=flat-square&logo=pnpm&logoColor=white)

**Node:** 22 | **Package manager:** pnpm 9.15.4 | **Build:** Turborepo |
**Marketing site:** [mukoko.com](https://mukoko.com) |
**Identity service:** [id.mukoko.com](https://id.mukoko.com)

---

## Status: scaffold

**Read this before reading anything else.** This repository is a skeleton, not
a running platform. The workspace layout, the toolchain, the CI pipeline and
the architecture decisions are real and settled. The implementations are not:

- Every mini-app in `mini-apps/` is a single Preact screen that renders a
  heading and one line of copy.
- Every route handler in `services/` returns
  `{"message": "TODO: Implement ..."}`. No worker declares a route or a custom
  domain, so nothing here is deployed.
- `honey/` exposes `/health` and `/` and nothing else; its `models/`,
  `routes/` and `services/` directories are empty.
- mukoko.com is not built here: it lives in
  [`bundu-labs/marketing` `apps/mukoko`](https://github.com/bundu-labs/marketing/tree/main/apps/mukoko).
  The retired Next.js `web/` tree and its Sanity studio were removed.
- The Flutter shell that earlier revisions of this README described was
  removed in [#75](https://github.com/mukoko-dev/mukoko/pull/75). There is no
  `app/` directory.

The design intent lives in [ARCHITECTURE.md](./ARCHITECTURE.md) and
[docs/adr/](./docs/adr/). Treat both as specification, not as description of
what runs today.

---

## What's in here

### Mini-apps — `mini-apps/`

Preact + Vite front-ends, each intended to be loaded as a mini-app inside the
super app shell. Six of them, plus a template.

| Directory    | Package                    | Placeholder copy                      |
| ------------ | -------------------------- | ------------------------------------- |
| `clips/`     | `@mukoko/clips`            | clips — informed communities          |
| `connect/`   | `@mukoko/connect`          | connect — interest communities        |
| `events/`    | `@mukoko/events`           | events — community gatherings         |
| `novels/`    | `@mukoko/novels`           | novels — african stories              |
| `pulse/`     | `@mukoko/pulse`            | pulse — trending moments              |
| `weather/`   | `@mukoko/weather`          | weather — zimbabwe forecasts          |
| `_template/` | `@mukoko/miniapp-template` | the starting point for a new mini-app |

The repository description names six apps — ID, Clips, Pulse, Connect, Novels
and Events. Five of those are the mini-apps above. **ID is not a mini-app**: it
is `services/id-api`, and the identity product that actually ships lives in a
separate repository, [`mukoko-dev/mukoko-auth`](https://github.com/mukoko-dev/mukoko-auth)
(deployed at [id.mukoko.com](https://id.mukoko.com)). **Weather is a seventh
mini-app** the description omits.

### Services — `services/`

Cloudflare Workers written with Hono. Six, plus a template.

| Directory           | Worker name               | Bindings declared                               |
| ------------------- | ------------------------- | ----------------------------------------------- |
| `gateway/`          | `mukoko-gateway`          | KV `CACHE_STORAGE`                              |
| `id-api/`           | `mukoko-id-api`           | D1 `mukoko_users`, KV `USER_STORAGE`            |
| `miniapp-registry/` | `mukoko-miniapp-registry` | KV `CONFIG_STORAGE`, R2 `mukoko-miniapp-assets` |
| `shamwari-api/`     | `mukoko-shamwari-api`     | Workers AI                                      |
| `wallet-api/`       | `mukoko-wallet-api`       | none yet                                        |
| `digital-twin/`     | `mukoko-digital-twin`     | none yet                                        |

The gateway is the front door: it declares route groups for `/clips`,
`/events`, `/pulse`, `/connect`, `/novels` and `/weather`. All six are stubs.

### Shared packages — `packages/`

| Directory        | Package                 | Purpose                       |
| ---------------- | ----------------------- | ----------------------------- |
| `design-system/` | `@mukoko/ui`            | Shared UI primitives          |
| `bridge-sdk/`    | `@mukoko/bridge`        | Shell ↔ mini-app bridge       |
| `api-client/`    | `@mukoko/api`           | Typed client for the services |
| `types/`         | `@mukoko/types`         | Shared TypeScript types       |
| `eslint-config/` | `@mukoko/eslint-config` | Lint config for the workspace |
| `tsconfig/`      | `@mukoko/tsconfig`      | Base TypeScript configs       |

### Your Honey — `honey/`

The personalization engine, and the one part of the system with a hard rule
attached: personalization is meant to run for the user, not on them. It is a
Python 3.12 FastAPI service (`nuchi-honey`, version 0.1.0) with a Dockerfile
and a `docker-compose.yml`. Today it serves a health check and a root message.

### Marketing site (mukoko.com)

Not in this repo. mukoko.com is the Astro site in
[`bundu-labs/marketing` `apps/mukoko`](https://github.com/bundu-labs/marketing/tree/main/apps/mukoko),
with its Sanity studio in `studio-mukoko-blog` there. The retired Next.js
`web/` tree and `web/studio/` were removed from this repo.

---

## Architecture

| Layer          | Choice                               | Decision record                                     |
| -------------- | ------------------------------------ | --------------------------------------------------- |
| Monorepo       | pnpm workspaces + Turborepo          | [ADR 001](./docs/adr/001-monorepo-turborepo.md)     |
| Mini-app UI    | Preact, not React                    | [ADR 002](./docs/adr/002-preact-over-react.md)      |
| Workers        | Hono for anything new                | [ADR 003](./docs/adr/003-hono-for-new-workers.md)   |
| Primary data   | MongoDB Atlas                        | [ADR 004](./docs/adr/004-mongodb-atlas-primary.md)  |
| Authentication | Stytch                               | [ADR 005](./docs/adr/005-stytch-auth.md)            |
| Web hosting    | Vercel (superseded)                  | [ADR 006](./docs/adr/006-vercel-web-deployment.md)  |
| Mini-app host  | Workers for Platforms                | [ADR 007](./docs/adr/007-workers-for-platforms.md)  |
| Token economy  | Two tokens on Polygon PoS            | [ADR 008](./docs/adr/008-polygon-two-token.md)      |
| Governance     | Foundation / operating company split | [ADR 009](./docs/adr/009-foundation-dual-entity.md) |

MongoDB Atlas is the intended primary database; the workers type a
`MONGODB_URI` binding but none of them connect to it yet.

---

## Getting started

```bash
git clone https://github.com/mukoko-dev/mukoko.git
cd mukoko
pnpm install
pnpm build
```

Python 3.12 and Docker are needed only for `honey/`.

## Commands

| Command                                  | Description                            |
| ---------------------------------------- | -------------------------------------- |
| `pnpm dev`                               | Every workspace in dev mode, via Turbo |
| `pnpm build`                             | Build everything                       |
| `pnpm lint`                              | ESLint across the workspace            |
| `pnpm typecheck`                         | `tsc --noEmit` across the workspace    |
| `pnpm test`                              | Vitest across the workspace            |
| `pnpm format` / `pnpm format:check`      | Prettier                               |
| `pnpm turbo run dev --filter=@mukoko/ui` | One package only                       |
| `cd honey && docker compose up`          | Your Honey, locally                    |

CI runs `pnpm turbo run build typecheck lint test` on every push and pull
request to `main`. Husky and lint-staged run ESLint and Prettier on commit.

---

## Ecosystem

| Repository                                                                  | What it is                                  |
| --------------------------------------------------------------------------- | ------------------------------------------- |
| [`mukoko-dev/mukoko-auth`](https://github.com/mukoko-dev/mukoko-auth)       | Mukoko ID — the identity service that ships |
| [`mukoko-dev/mukoko-lingo`](https://github.com/mukoko-dev/mukoko-lingo)     | Language learning                           |
| [`mukoko-dev/mukoko-circles`](https://github.com/mukoko-dev/mukoko-circles) | Communities                                 |
| [`mukoko-dev/kweli-mcp`](https://github.com/mukoko-dev/kweli-mcp)           | Business, places and verification, over MCP |
| `bundu-labs/marketing`                                                      | The marketing sites, including mukoko.com   |

---

## Contributing

Before submitting work, check it against the Ubuntu Test:

1. Does this strengthen community?
2. Does this respect human dignity?
3. Does this serve the collective good?
4. Would we explain this proudly to our elders?
5. Does this align with "I am because we are"?

House rules that trip people up:

- Mini-apps use **Preact**, not React.
- New workers use **Hono**.
- Auth is **Stytch**; the primary database is **MongoDB Atlas**.
- Brand wordmarks are lowercase: `mukoko`, `nyuchi`, `shamwari`, `bundu`.
- Touch targets are at least 48px.

[CLAUDE.md](./CLAUDE.md) is the full developer guide.
[ARCHITECTURE.md](./ARCHITECTURE.md) is the technical specification.

---

## Governance

**Mukoko Foundation** (Mauritius) is the non-profit custodian of the protocol,
the token economics and the Ubuntu charter, under a VASP licence per the
VAITOS Act 2021. **Nyuchi Africa (Pvt) Ltd** (Zimbabwe) is the operating
company that builds and runs the platform.

## Licence

**No `LICENSE` file is committed to this repository.** Until one is added the
work is under exclusive copyright and carries no grant of use.

© Mukoko Foundation, operated by Nyuchi Africa (Pvt) Ltd.

---

_Ndiri nekuti tiri — I am because we are._
