# mukoko

**A Digital Twin Social Ecosystem for Africa.**

mukoko is a WeChat-style super app that gives every user a sovereign digital identity — a soulbound token anchored to their birth date — and connects them through 15 mini-apps, one AI companion, and one token economy. Built for Africa's realities: mixed device quality, high data costs, intermittent connectivity, and mobile money as the primary payment rail.

Built by [Nyuchi Africa](https://nyuchi.com). Custodied by the Mukoko Foundation (Mauritius).

_Ndiri nekuti tiri — I am because we are._

---

## Why mukoko exists

The platforms that dominate Africa today were not built for Africa. They extract attention, harvest data, and export value. mukoko inverts every assumption:

- **Your data stays yours.** Your Honey (our personalization engine) runs on-device. Raw behavioral data never leaves your phone.
- **Your identity is sovereign.** Your Digital Twin is a soulbound token (MIT) — non-transferable, anchored to your verified birth date, and deletable by you alone.
- **The algorithm works FOR you.** Personalization that empowers, not manipulates. You can see, edit, and delete everything the system knows about you.
- **Value flows back to creators.** Authors keep 85% of revenue. Event organizers keep 90%. The platform takes the minimum needed to operate.
- **Ubuntu governs everything.** Every feature must pass the Ubuntu Test: Does this strengthen community? Does this respect human dignity? Does this serve the collective good?

---

## What's in the super app

| App               | Purpose                                | Type           |
| ----------------- | -------------------------------------- | -------------- |
| **Campfire**      | Messaging + payments (platform anchor) | Core           |
| **Pulse**         | Personalized aggregated feed           | Core           |
| **Mukoko News**   | Context-rich news from trusted sources | Core           |
| **Bytes**         | Short-form video scrolling             | Core           |
| **Circles**       | Interest-based communities             | Core           |
| **Nhimbe**        | Cultural gatherings, ticketing         | Core           |
| **Novels**        | African author platform                | Core           |
| **BushTrade**     | Peer-to-peer marketplace               | Core           |
| **Mukoko Lingo**  | Language learning                      | Core           |
| **Weather**       | Localized weather                      | Utility        |
| **Transport**     | Transit and ride info                  | Utility        |
| **Mukoko ID**     | Sovereign identity + SSO               | Infrastructure |
| **shamwari**      | AI companion                           | Infrastructure |
| **Your Honey**    | On-device personalization              | Infrastructure |
| **Mukoko Wallet** | Payments + MUKOKO tokens               | Infrastructure |

**Shamwari** is the AI companion that lives inside the hive — context-aware, powered by Your Honey, and designed to help rather than surveil.

---

## Architecture at a glance

```
Flutter shell (native)          WebView mini-apps (Preact)
┌─────────────────────┐        ┌─────────────────────────┐
│ Auth (Stytch)       │        │ Campfire, Pulse, News   │
│ Wallet (EcoCash/MXT)│◄──────►│ Circles, Nhimbe, Novels │
│ Shamwari AI         │ Bridge │ @mukoko/ui components   │
│ Your Honey (on-dev) │        │ < 150KB gzipped each    │
│ Notifications       │        │ Standalone PWA capable  │
└─────────────────────┘        └─────────────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    ▼
         Cloudflare Workers (Hono)
         MongoDB Atlas + KV + D1
         Polygon PoS (MIT + MXT)
```

Each ecosystem app has **two frontends**: a standalone PWA (in its own repo) and a super app frontend (in this monorepo's `mini-apps/`). Both consume the same backend API. The standalone repo owns the backend.

---

## Token economy

Two tokens on Polygon PoS:

- **MIT (MUKOKO Identity Token)** — soulbound ERC-721, non-transferable, birth-date anchored. Your permanent stake in the community.
- **MXT (MUKOKO Exchange Token)** — transferable ERC-20 for all transactions. Floor price derived from MIT pool system. Elastic supply with no hard cap.

More users join, more MITs are minted, pool means grow as the community ages, MXT floor rises. Growth benefits everyone already here. This is Ubuntu expressed as token economics.

See [ARCHITECTURE.md](./ARCHITECTURE.md) sections 6 and 9 for the full specification.

---

## Repository structure

```
mukoko/
├── app/            # Flutter super app shell (not a pnpm workspace)
├── mini-apps/      # Super app frontends (Preact, loaded in WebView)
│   ├── campfire/   # Messaging + payments (platform anchor)
│   ├── pulse/      # Aggregated feed (monorepo-native)
│   ├── news/       # News UI (backend in mukoko-news)
│   ├── bytes/      # Short-form video scrolling
│   ├── circles/    # Communities UI (backend in mukoko-connect)
│   ├── nhimbe/     # Events UI (backend in nhimbe)
│   ├── novels/     # Author platform UI (backend in mukoko-novels)
│   ├── bushtrade/  # Peer-to-peer marketplace
│   ├── lingo/      # Language learning
│   ├── weather/    # Weather UI (backend in mukoko-weather)
│   └── transport/  # Transit and ride info
├── services/       # Cloudflare Workers (gateway, auth, wallet, AI)
├── packages/       # Shared: @mukoko/ui, @mukoko/bridge, @mukoko/types
├── honey/          # Your Honey AI service (Python/FastAPI, isolated)
├── web/            # Marketing site (Next.js 15, Vercel)
└── docs/           # Architecture docs, ADRs, developer guides
```

---

## Getting started

### Prerequisites

| Tool    | Version                         |
| ------- | ------------------------------- |
| Node.js | 22+ (pinned in `.nvmrc`)        |
| pnpm    | 9.15.4+                         |
| Flutter | Latest stable (for `app/` only) |
| Python  | 3.12+ (for `honey/` only)       |
| Docker  | Latest (for `honey/` only)      |

### Quick start

```bash
# Clone
git clone https://github.com/nyuchitech/mukoko.git
cd mukoko

# Install Node dependencies
pnpm install

# Build everything
pnpm turbo run build

# Run the marketing site locally
cd web && pnpm dev

# Run all packages in dev mode
pnpm turbo run dev

# Lint + typecheck
pnpm turbo run lint typecheck

# Test
pnpm turbo run test
```

### Working on a specific package

```bash
pnpm turbo run dev --filter=@mukoko/ui      # Design system
pnpm turbo run dev --filter=mukoko-news     # News mini-app
cd services/gateway && pnpm dev             # API gateway (wrangler)
cd app && flutter run                       # Flutter shell
cd honey && docker compose up               # Your Honey AI
```

---

## Contributing

We welcome contributors who share the Ubuntu philosophy. Before submitting work, ensure it passes the **Ubuntu Test**:

1. Does this strengthen community?
2. Does this respect human dignity?
3. Does this serve the collective good?
4. Would we explain this proudly to our elders?
5. Does this align with "I am because we are"?

### Workflow

1. Fork the repo and create a feature branch
2. Make changes following the coding standards in [CLAUDE.md](./CLAUDE.md)
3. Run `pnpm turbo run build typecheck lint test` before submitting
4. Open a PR using the template (includes Ubuntu Test checklist)

### Key rules

- Mini-apps use **Preact** (not React). `web/` uses React (Next.js requires it).
- Auth is **Stytch** (not Supabase). Database is **MongoDB Atlas**.
- New workers use **Hono**. Don't change existing itty-router workers.
- No page-specific CSS. All styles go in shared `globals.css` primitives.
- Brand wordmarks are always lowercase: `mukoko`, `nyuchi`, `shamwari`, `bundu`.
- Touch targets minimum **48px** (default 56px).
- Marketing site is **dark-mode only**.

See [CLAUDE.md](./CLAUDE.md) for the complete developer guide and [ARCHITECTURE.md](./ARCHITECTURE.md) for the technical specification.

---

## Documentation

| Document                             | Purpose                                                         |
| ------------------------------------ | --------------------------------------------------------------- |
| [CLAUDE.md](./CLAUDE.md)             | How we build — coding standards, patterns, tooling              |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Full technical specification (~50KB)                            |
| [docs/adr/](./docs/adr/)             | Architecture Decision Records (001-009)                         |
| [docs/guides/](./docs/guides/)       | Developer guides (getting started, creating mini-apps/services) |

---

## Legal structure

**Mukoko Foundation** (Mauritius) — non-profit custodian of the protocol, token economics, and Ubuntu charter. VASP licence under VAITOS Act 2021.

**Nyuchi Africa (Pvt) Ltd** (Zimbabwe) — for-profit operating company that builds and operates the platform.

The Foundation protects the soul. Nyuchi Africa builds the product.

---

## Links

- **Website:** [mukoko.com](https://mukoko.com)
- **Nyuchi Africa:** [nyuchi.com](https://nyuchi.com)
- **Brand Assets:** [assets.nyuchi.com](https://assets.nyuchi.com)
- **API Status:** [status.mukoko.com](https://status.mukoko.com)

---

## License

See [LICENSE](./LICENSE) for details.

---

_Munhu munhu muvanhu — A person is a person through other persons._

_Built with Ubuntu in Zimbabwe._
