# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Read this ENTIRELY before performing any task.

---

## IDENTITY

**Mukoko** — a Digital Twin Social Ecosystem for Africa, delivered as a WeChat-style super app. Built by **Nyuchi Africa**.

**Founder & Super Admin:** Bryan (`bryan@nyuchi.com`)
**Repository:** `https://github.com/nyuchitech/mukoko.git`
**Homepage:** `https://mukoko.com`

**Brand hierarchy** (context only — Bundu Family is a separate app/repo):

```
BUNDU (Container)     — The wilderness. Parent brand. SEPARATE APP.
  └─ NYUCHI (Action)  — The bee. Collective effort, pollination, building.
      └─ MUKOKO (Structure) — The hive. Community gathering space. THIS PROJECT.
          └─ SHAMWARI (Intelligence) — The friend. AI that lives inside the hive.
```

**Ubuntu Principle:** "Munhu munhu muvanhu" — A person is a person through other persons.

**The Ubuntu Test — apply before every feature decision:**

1. Does this strengthen community?
2. Does this respect human dignity?
3. Does this serve the collective good?
4. Would we explain this proudly to our elders?
5. Does this align with "I am because we are"?

---

## WHAT MUKOKO IS

15 mini-apps sharing one identity, one AI engine, one reputation system, and one token economy:

| App               | Domain                 | Purpose                                      | Type           | Standalone Repo    |
| ----------------- | ---------------------- | -------------------------------------------- | -------------- | ------------------ |
| **Campfire**      | `campfire.mukoko.com`  | Messaging + payments (platform anchor)       | Core           | `mukoko-campfire`  |
| **Pulse**         | `pulse.mukoko.com`     | Personalized aggregated feed across all apps | Core           | **This monorepo**  |
| **Mukoko News**   | `news.mukoko.com`      | Context-rich news from trusted sources       | Core           | `mukoko-news`      |
| **Bytes**         | `bytes.mukoko.com`     | Short-form video scrolling                   | Core           | `mukoko-news`      |
| **Circles**       | `circles.mukoko.com`   | Interest-based communities                   | Core           | `mukoko-connect`   |
| **Mukoko Events** | `events.mukoko.com`    | Cultural gatherings, ticketing               | Core           | `nhimbe`           |
| **Novels**        | `novels.mukoko.com`    | African author platform, web novels          | Core           | `mukoko-novels`    |
| **BushTrade**     | `trade.mukoko.com`     | Peer-to-peer marketplace                     | Core           | `mukoko-bushtrade` |
| **Mukoko Lingo**  | `lingo.mukoko.com`     | Language learning                            | Core           | `mukoko-lingo`     |
| **Weather**       | `weather.mukoko.com`   | Localized weather                            | Utility        | `mukoko-weather`   |
| **Transport**     | `transport.mukoko.com` | Transit and ride info                        | Utility        | `mukoko-transport` |
| **Mukoko ID**     | `id.mukoko.com`        | Sovereign identity, Your Honey, SSO (Stytch) | Infrastructure | `mukoko-auth`      |
| **shamwari**      | —                      | AI companion                                 | Infrastructure | —                  |
| **Your Honey**    | —                      | On-device personalization engine             | Infrastructure | —                  |
| **Mukoko Wallet** | `wallet.mukoko.com`    | Payments + MUKOKO tokens                     | Infrastructure | —                  |

**Campfire** is the platform anchor — messaging + payments in one place. Think WeChat's core chat experience.

**Pulse** is the super app's unified feed. It aggregates content from Mukoko News, Mukoko Events, Circles, Novels, and more — personalized by **Your Honey** (see below). Pulse lives in this monorepo, not in a standalone repo.

**Mukoko News** (`mukoko-news` repo) is the news/articles app. **Bytes** (TikTok-style short-form scrolling) is also in the standalone version.

**Separate products using Mukoko ID (Stytch SSO):** Nyuchi Learning, Zimbabwe Travel, Bundu Family.

---

## ARCHITECTURE

### Stack

| Layer                | Technology                                                                     |
| -------------------- | ------------------------------------------------------------------------------ |
| **Mobile Shell**     | Flutter (Dart) — clean architecture, Riverpod                                  |
| **Mini-Apps**        | Preact + Nyuchi Design System (WebView + standalone PWA on Vercel)             |
| **Bridge**           | MukokoBridge JavaScript API (injected into WebViews)                           |
| **Backend**          | Cloudflare Workers (translation layer) + Cloudflare Containers (heavy compute) |
| **Mini-App Hosting** | Workers for Platforms — each mini-app gets its own worker                      |
| **Database**         | MongoDB Atlas (primary) + Cloudflare KV (edge cache) + D1 (edge-local reads)   |
| **Auth**             | Stytch (sessions, OAuth, MFA, SSO)                                             |
| **AI**               | Cloudflare AI + TFLite/CoreML on-device + FastAPI backend (honey.nyuchi.com)   |
| **Storage**          | Cloudflare R2                                                                  |
| **Blockchain**       | Polygon PoS (MIT soulbound + MXT ERC-20)                                       |
| **Web Deployment**   | Vercel (mini-app PWAs); mukoko.com is in bundu-labs/marketing                  |
| **Monorepo**         | Turborepo + pnpm workspaces                                                    |

### Platforms

- Android API 24+ (primary market)
- iOS 15+
- HarmonyOS / Huawei AppGallery (HMS Core, HMS Push, Petal Maps)
- APK direct download (mukoko.com)
- PWA on Vercel at `*.mukoko.com` subdomains

### Design Pattern

```
Flutter shell = native platform services (auth, wallet, AI, notifications, device APIs)
WebView mini-apps = the 15 ecosystem apps
MukokoBridge = communication layer between shell and mini-apps
Workers = translation layer (routing, auth verification, caching)
Containers = heavy compute (AI inference, media processing, blockchain)
```

### Mini-App Architecture — Two Frontends, One Backend

Each ecosystem app (Campfire, Pulse, Mukoko News, Circles, Mukoko Events, Novels, etc.) exists as **two frontends** sharing a single backend:

```
┌─────────────────────────────────────────────────────────┐
│  STANDALONE (own repo)          SUPER APP (this monorepo)│
│  ─────────────────────          ─────────────────────── │
│  Full PWA at *.mukoko.com       Preact UI in mini-apps/ │
│  Own routing, own UI            @mukoko/ui components    │
│  Direct API calls               @mukoko/bridge for shell │
│  Works independently            Deep wallet/auth/nav     │
│                                 integration              │
│         └──────── Both consume the same backend API ────┘│
│                   (standalone repo owns the backend)     │
└─────────────────────────────────────────────────────────┘
```

**Why two frontends?**

- The standalone PWA ensures each app works outside the super app (web users, direct links, app store alternatives)
- The super app frontend ensures consistent UX inside the Flutter shell with access to native capabilities via MukokoBridge
- Backends are never duplicated — the super app frontend calls the same API as the standalone PWA

**Rule:** The standalone repo owns the backend + standalone frontend. This monorepo owns the super app frontend only. Do not duplicate backend logic here.

---

## DATA LAYER

### MongoDB Atlas (Primary Database)

- All application data: users, articles, events, novels, circles, messages, transactions
- Connection via MongoDB driver in Cloudflare Workers/Containers
- Collections mirror the domain: `users`, `articles`, `events`, `novels`, `circles`, `pulse_posts`, `transactions`, `notifications`

### Cloudflare KV (Edge Cache)

- `CONFIG_STORAGE` — App configuration, feature flags
- `CACHE_STORAGE` — API response cache, rate limiting counters
- `USER_STORAGE` — Session cache, user preferences
- `NEWS_STORAGE` — RSS feed cache, article summaries

### Cloudflare R2 (Object Storage)

- Media uploads, mini-app bundles, brand assets

### Cloudflare Durable Objects

- `ChatRoom` — Live messaging
- `UserSession` — User presence tracking

### Cloudflare Analytics Engine

- `category_clicks`, `news_interactions`, `search_queries`

---

## AUTH — STYTCH

Stytch is the auth provider for the entire ecosystem. NOT Supabase.

- **Sessions:** Stytch session tokens (not Supabase JWT)
- **Methods:** Email magic links, OAuth (Google, GitHub, Apple), SMS OTP, biometric
- **SSO:** Mukoko ID provides SSO to all Nyuchi products (Learning, Travel, Bundu Family)
- **Worker middleware:** Every worker verifies Stytch session token on protected routes
- **Flutter:** Stytch SDK for mobile auth flow + secure token storage (Keychain/Keystore)
- **Mini-apps:** Get Stytch session via `MukokoBridge.auth.getToken()`

---

## YOUR HONEY — THE PERSONALIZATION CORE

**Your Honey** is the central personalization artifact for each user. It is the single source of truth that the entire ecosystem uses to customize the experience.

### What it is

- A structured profile co-created by the **on-device Honey engine** and **Mukoko ID** (identity)
- Stored in **Mukoko ID** (the identity layer), not on-device only
- **Editable by the user** — full data sovereignty, the user can view, modify, and delete Your Honey
- The memory for **shamwari AI**, **Pulse feed curation**, and all app personalization

### What it contains

- Interest map (32 categories, weighted by engagement)
- Content preferences (formats, sources, languages)
- Interaction patterns (reading habits, time-of-day, session length)
- Explicit preferences (user-set, overrides inferred data)
- Cross-app context (what the user does in Mukoko News informs Pulse, Circles, etc.)

### How it flows

```
Honey Engine (on-device)          Mukoko ID (cloud)
┌───────────────────┐             ┌───────────────────┐
│ Observes behavior │────sync────▶│ Stores Your Honey │
│ Learns locally    │             │ User can edit      │
│ Privacy-first     │◀───read────│ API access for     │
└───────────────────┘             │ shamwari + Pulse   │
                                  └───────────────────┘
                                          │
                    ┌─────────────────────┤
                    ▼                     ▼
              Pulse Feed            shamwari AI
              (personalized         (context-aware
               aggregation)          companion)
```

### Rules

- Honey learns on-device — raw behavioral data never leaves the device
- Honey syncs a **summarized** profile to Mukoko ID (not raw events)
- The user can always see and edit Your Honey
- shamwari and Pulse read Your Honey via Mukoko ID API
- Deleting Your Honey resets all personalization

---

## EXISTING INFRASTRUCTURE

### Cloudflare Workers (15 deployed)

| Worker                 | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `mukoko-news-backend`  | Mukoko News feed + Bytes (app.mukoko.com) — owned by mukoko-news repo |
| `mukoko-id-api`        | Authentication, profiles — Mukoko ID (owned by mukoko-auth repo)      |
| `mukoko-nhimbe-api`    | Events (canonical — owned by nhimbe repo)                             |
| `mukoko-events-api`    | Events (legacy duplicate — consolidate into nhimbe)                   |
| `nyuchi_api`           | Core Nyuchi platform                                                  |
| `nyuchi-brand-assets`  | Brand CDN (assets.nyuchi.com)                                         |
| `hararemetro-redirect` | Legacy redirect                                                       |

**Note:** Existing workers use itty-router. New workers use Hono. Do not change existing worker routers unless explicitly migrating.

### Connected Repositories (nyuchitech org)

Each ecosystem app has its own standalone repository containing its backend and standalone PWA frontend. The monorepo does **not** replace these repos — it provides the **super app frontend** for each app, ensuring a consistent in-app experience.

| Standalone Repo   | Owns                                         | Super App Frontend In            |
| ----------------- | -------------------------------------------- | -------------------------------- |
| `mukoko-news`     | Mukoko News + Bytes backend + standalone PWA | `mini-apps/news/`                |
| `nhimbe`          | Mukoko Events backend + standalone PWA       | `mini-apps/events/`              |
| `mukoko-weather`  | Weather backend + standalone PWA             | `mini-apps/weather/`             |
| `mukoko-auth`     | Auth backend (Stytch)                        | —                                |
| `mukoko-connect`  | Circles backend + standalone PWA             | `mini-apps/circles/`             |
| `mukoko-novels`   | Novels backend + standalone PWA              | `mini-apps/novels/`              |
| `mukoko-campfire` | Campfire backend + standalone PWA            | `mini-apps/campfire/`            |
| `brand-warehouse` | Brand assets CDN                             | `packages/design-system/assets/` |

**Two frontends per app:**

- **Standalone PWA** (in the app's own repo) — full app at `*.mukoko.com`, works independently
- **Super app frontend** (in this monorepo's `mini-apps/`) — Preact UI loaded in the Flutter shell's WebView, uses `@mukoko/bridge` for deep integration with wallet, auth, navigation, and Shamwari

Separate products (use Mukoko ID SSO, NOT in this repo): `learning`, `zimbabwe-travel`, `bundu-family`

---

## REPOSITORY STRUCTURE

```
mukoko/
├── app/                           # Flutter super app shell (NOT a pnpm workspace)
│   ├── android/ | ios/ | huawei/
│   ├── lib/
│   │   ├── core/                  # Init, routing, DI, config
│   │   ├── features/
│   │   │   ├── auth/              # Stytch integration
│   │   │   ├── wallet/            # Payments, tokens, QR
│   │   │   ├── honey/             # On-device AI, Digital Twin
│   │   │   ├── shamwari/          # AI companion
│   │   │   ├── miniapp_runtime/   # WebView manager, bridge
│   │   │   ├── notifications/     # Push + local
│   │   │   ├── discovery/         # Home screen, mini-app launcher
│   │   │   └── settings/          # Preferences, data saver
│   │   ├── shared/                # Design system widgets, theme
│   │   └── bridge/                # MukokoBridge JS injection
│   └── pubspec.yaml
│
├── mini-apps/                     # Super app frontends (Preact, loaded in Flutter WebView)
│   ├── campfire/                  # Messaging + payments (backend in mukoko-campfire repo)
│   ├── pulse/                     # Personalized aggregated feed (monorepo-native)
│   ├── news/                      # Mukoko News — super app UI (backend in mukoko-news repo)
│   ├── bytes/                     # Short-form video (backend in mukoko-news repo)
│   ├── circles/                   # Communities — super app UI (backend in mukoko-connect repo)
│   ├── events/                    # Mukoko Events — super app UI (backend in nhimbe repo)
│   ├── novels/                    # Author platform — super app UI (backend in mukoko-novels repo)
│   ├── bushtrade/                 # Marketplace — super app UI (backend in mukoko-bushtrade repo)
│   ├── lingo/                     # Language learning — super app UI (backend in mukoko-lingo repo)
│   ├── weather/                   # Weather — super app UI (backend in mukoko-weather repo)
│   ├── transport/                 # Transit — super app UI (backend in mukoko-transport repo)
│   └── _template/                 # Starter for new super app mini-app frontends
│
├── services/                      # Cloudflare Workers (super app infrastructure only)
│   ├── gateway/                   # API gateway — routing + Stytch session verification
│   ├── wallet-api/                # Payments + MUKOKO tokens
│   ├── shamwari-api/              # AI companion (Cloudflare AI)
│   ├── miniapp-registry/          # Mini-app manifest + R2 assets
│   ├── digital-twin/              # NFT + reputation
│   └── _template/                 # Starter for new workers (Hono)
│   # NOTE: App-specific backends (clips, pulse, events, connect, novels, weather)
│   #        live in their standalone repos, NOT here.
│
├── honey/                         # Your Honey AI service (isolated, NOT a pnpm workspace)
│   ├── Dockerfile
│   ├── app/                       # FastAPI service
│   └── docker-compose.yml
│
├── packages/                      # Shared libraries
│   ├── tsconfig/                  # @mukoko/tsconfig
│   ├── eslint-config/             # @mukoko/eslint-config
│   ├── types/                     # @mukoko/types
│   ├── design-system/             # @mukoko/ui (Preact)
│   ├── bridge-sdk/                # @mukoko/bridge (TypeScript)
│   └── api-client/                # @mukoko/api
│
├── docs/                          # Architecture docs, guides, ADRs
│   ├── adr/                       # Architecture Decision Records
│   │   ├── 001-monorepo-turborepo.md
│   │   ├── 002-preact-over-react.md
│   │   ├── 003-hono-for-new-workers.md
│   │   ├── 004-mongodb-atlas-primary.md
│   │   ├── 005-stytch-auth.md
│   │   ├── 006-vercel-web-deployment.md
│   │   ├── 007-workers-for-platforms.md
│   │   ├── 008-polygon-two-token.md
│   │   └── 009-foundation-dual-entity.md
│   ├── guides/                    # Developer guides
│   │   ├── getting-started.md
│   │   ├── creating-mini-app.md
│   │   ├── creating-service.md
│   │   ├── connected-repos.md
│   │   ├── mongodb-atlas.md
│   │   └── stytch-integration.md
│   └── api/                       # API reference
│
├── .github/                       # CI/CD workflows
├── ARCHITECTURE.md                # Detailed technical specification (45KB)
├── turbo.json                     # Monorepo config
├── pnpm-workspace.yaml            # Workspace definition
└── CLAUDE.md                      # THIS FILE
```

---

## DEVELOPER ENVIRONMENT & TOOLING

### Prerequisites

| Tool    | Version | Notes                    |
| ------- | ------- | ------------------------ |
| Node.js | 22+     | Pinned in `.nvmrc`       |
| pnpm    | 9.15.4+ | Pinned in `package.json` |
| Flutter | Latest  | For `app/` development   |
| Python  | 3.12+   | For `honey/` only        |
| Docker  | Latest  | For `honey/` local dev   |

### Root Configuration Files

| File                  | Purpose                                                             |
| --------------------- | ------------------------------------------------------------------- |
| `turbo.json`          | Turborepo task graph (build, dev, lint, typecheck, test, deploy)    |
| `pnpm-workspace.yaml` | Workspace: `packages/*`, `services/*`, `mini-apps/*`, `web`         |
| `eslint.config.mjs`   | Root ESLint config — uses `@mukoko/eslint-config`                   |
| `.prettierrc`         | Prettier: semicolons, 2-space indent, 100 char width, single quotes |
| `.nvmrc`              | Locks Node to v22                                                   |
| `.npmrc`              | Auto-install peers, no strict peer deps                             |

### Git Hooks (Husky + lint-staged)

Pre-commit hook runs `lint-staged` automatically on staged files. Configured via `husky` (v9.1.7) and `lint-staged` (v16.4.0) in `package.json`.

### Key Dependency Versions

| Package    | Version | Used In              |
| ---------- | ------- | -------------------- |
| turbo      | 2.4.0   | Root monorepo        |
| typescript | 5.7.0   | All TS packages      |
| preact     | 10.25.0 | Mini-apps            |
| vite       | 6.0     | Mini-apps            |
| hono       | 4.12.8  | New workers/services |
| wrangler   | 4.0.0   | Worker deployment    |
| eslint     | 10.0.0  | Linting              |
| prettier   | 3.4.0   | Formatting           |

---

## BUILD & DEV COMMANDS

```bash
# Install dependencies (Node packages only — Flutter and Python managed separately)
pnpm install

# Build all packages
pnpm turbo run build

# Dev mode (all packages)
pnpm turbo run dev

# Lint + typecheck
pnpm turbo run lint typecheck

# Test
pnpm turbo run test

# Format
pnpm format

# Single package
pnpm turbo run build --filter=@mukoko/ui
pnpm turbo run dev --filter=news
pnpm turbo run test --filter=@mukoko/bridge

# Single service
cd services/gateway && pnpm dev          # wrangler dev
cd services/gateway && pnpm deploy       # wrangler deploy

# Flutter
cd app && flutter pub get
cd app && flutter analyze
cd app && flutter test
cd app && flutter run

# Honey (Python)
cd honey && pip install -r requirements.txt
cd honey && python -m pytest tests/
cd honey && docker compose up
```

---

## CI/CD & CODE QUALITY

### GitHub Actions (`.github/workflows/ci.yml`)

Triggers on push to `main` and all PRs to `main`. Runs:

```
pnpm turbo run build typecheck lint test
```

Uses pnpm v4 action, Node 22, Turborepo cache. Concurrency group cancels in-progress runs for the same ref.

### Code Ownership (`.github/CODEOWNERS`)

| Path                      | Team                   |
| ------------------------- | ---------------------- |
| Root config               | `@nyuchitech/core`     |
| `app/`                    | `@nyuchitech/mobile`   |
| `packages/design-system/` | `@nyuchitech/design`   |
| `services/`               | `@nyuchitech/backend`  |
| `honey/`                  | `@nyuchitech/ai`       |
| `mini-apps/`              | `@nyuchitech/frontend` |

### PR Template

All PRs use `.github/PULL_REQUEST_TEMPLATE.md` which includes the Ubuntu Test checklist.

---

## MARKETING SITE (mukoko.com)

Not in this repo. mukoko.com is the Astro site in [`bundu-labs/marketing` `apps/mukoko`](https://github.com/bundu-labs/marketing/tree/main/apps/mukoko) (Sanity studio: `studio-mukoko-blog` there). The retired Next.js `web/` tree and `web/studio/` were removed from this repo; do not recreate them.

---

## API GATEWAY ROUTING (`services/gateway/`)

The gateway worker routes all API traffic and verifies Stytch sessions:

| Route Path    | Upstream Service           |
| ------------- | -------------------------- |
| `/auth/*`     | Not wired (stub)           |
| `/news/*`     | External (mukoko-news)     |
| `/nhimbe/*`   | External (nhimbe)          |
| `/pulse/*`    | Pulse API                  |
| `/circles/*`  | External (mukoko-connect)  |
| `/campfire/*` | External (mukoko-campfire) |
| `/novels/*`   | External (mukoko-novels)   |
| `/weather/*`  | External (mukoko-weather)  |
| `/wallet/*`   | `wallet-api`               |
| `/shamwari/*` | `shamwari-api`             |
| `/miniapps/*` | `miniapp-registry`         |
| `/twin/*`     | `digital-twin`             |

---

## MUKOKO BRIDGE API

Injected into every mini-app WebView. Contract between Flutter shell and web mini-apps.

```javascript
window.MukokoBridge = {
  auth: {
    getUser()              // Returns user profile + Digital Twin
    getToken()             // Stytch session token for API calls
    onAuthChange(cb)       // Auth state subscription
  },
  honey: {
    getInterests()         // 32-category interest map
    trackInteraction({ type, contentId, duration })
    getSuggestions(context) // Recommendations from Your Honey
  },
  shamwari: {
    ask(question)          // Invoke Shamwari AI (Cloudflare AI)
    summarize(content)     // Content summarization
    translate(text, lang)  // Translation
  },
  wallet: {
    getBalance()           // Fiat + MUKOKO tokens
    requestPayment({ amount, currency, description })
    transferTokens({ to, amount })
    onPaymentResult(cb)
  },
  device: {
    getLocation()          // GPS
    openCamera()           // Camera
    scanQR()               // QR scanner
    share(data)            // Native share sheet
    haptic(type)           // Haptic feedback
  },
  nav: {
    openMiniApp(id, params) // Launch another mini-app
    goBack()
    setTitle(text)
  },
  storage: {
    get(key) / set(key, value) / remove(key)
  },
  reputation: {
    getScore()             // Cross-platform reputation
    getTokenBalance()      // MUKOKO tokens
  }
}
```

**Every mini-app must use `@mukoko/bridge` (typed SDK) rather than `window.MukokoBridge` directly.**

---

## DESIGN SYSTEM — NYUCHI BRAND v6

### Five African Minerals Palette

| Mineral        | Light Mode | Dark Mode | Mukoko Usage                                   |
| -------------- | ---------- | --------- | ---------------------------------------------- |
| **Tanzanite**  | `#4B0082`  | `#B388FF` | **Primary** — CTAs, active states, nav         |
| **Cobalt**     | `#0047AB`  | `#00B0FF` | **Secondary** — Links, info, secondary actions |
| **Gold**       | `#5D4037`  | `#FFD740` | **Accent** — Rewards, wallet, honey            |
| **Malachite**  | `#004D40`  | `#64FFDA` | Shamwari AI, success states                    |
| **Terracotta** | `#8B4513`  | `#D4A574` | Community, Ubuntu                              |

### Typography

- **Display:** Noto Serif
- **Body:** Plus Jakarta Sans
- **Code:** JetBrains Mono

### Design Rules

- Button radius: `12px`, Card radius: `16px`
- Touch targets: `44x44px` minimum
- Five African Minerals strip: 4px vertical left edge (Tanzanite → Cobalt → Gold → Malachite → Terracotta, hidden < 480px)
- Wordmarks: **always lowercase** (`mukoko`, `nyuchi`, `shamwari`)
- Contrast: WCAG AAA (7:1+) — non-negotiable
- Light/dark mode: all colors auto-adapt

---

## CODING STANDARDS

### Flutter (Dart)

- Clean architecture: `presentation/` → `domain/` → `data/`
- State management: `flutter_riverpod`
- Null safety: strict (no `!` operator unless impossible)
- Feature folders: `features/{feature}/presentation|domain|data/`
- All widgets const where possible
- No business logic in widgets — only in providers/use cases

### Mini-Apps (TypeScript/Preact)

- Framework: Preact (NOT React — 3KB vs 40KB)
- Design system: `@mukoko/ui` components only
- Bridge: `@mukoko/bridge` SDK (typed, not raw window access)
- Build: Vite, target < 150KB gzipped output
- API calls: through `@mukoko/api` client
- Style: Tailwind CSS with Nyuchi design tokens
- No localStorage (use `MukokoBridge.storage`)

### Cloudflare Workers (TypeScript)

- New workers: Hono router
- Existing workers: itty-router (do not change unless migrating)
- Auth: Verify Stytch session token on every protected request
- Database: MongoDB Atlas via mongodb driver
- Cache: KV for edge caching, D1 for edge-local reads
- Error handling: structured error responses with codes
- Rate limiting: per-user via KV
- Environment variables for ALL secrets

### Shared File Patterns

**Every mini-app** follows the same structure:

```
mini-apps/{app}/
├── package.json          # @mukoko/{app}, Preact + Vite
├── index.html            # Entry point
├── src/
│   ├── index.tsx         # Mount point
│   └── app.tsx           # Root component
├── public/manifest.json  # PWA manifest
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

**Every service** follows the same structure:

```
services/{service}/
├── package.json          # @mukoko/{service}, Hono + wrangler
├── src/
│   ├── index.ts          # Hono app entry
│   ├── middleware/
│   │   ├── auth.ts       # Stytch session verification
│   │   └── index.ts
│   └── lib/
│       └── mongodb.ts    # MongoDB Atlas connection
├── wrangler.jsonc        # Cloudflare config (bindings, env)
├── vitest.config.ts
└── tsconfig.json
```

### General

- TypeScript strict mode everywhere
- No `any` types
- Conventional commits
- No console.log in production (use structured logging)

---

## PAYMENT INTEGRATION

1. **EcoCash** — Econet API, USSD push / app-to-app (Zimbabwe's dominant payment)
2. **InnBucks** — Wallet integration (growing Zimbabwe market)
3. **MUKOKO Tokens** — Polygon PoS: MIT (soulbound identity) + MXT (transferable ERC-20)
4. **Bank Transfer** — ZimSwitch / RTGS (Phase 2)
5. **Card Payments** — Visa/Mastercard gateway (Phase 2)

### Creator Economics

- Novel authors: **85%** of chapter revenue
- Pulse creators: **80%** of tipping revenue
- Event organizers: **90%** of ticket revenue
- Circle moderators: reputation + token bonuses

---

## DATA EFFICIENCY

Zimbabwe market reality: data is expensive, connectivity is intermittent.

| Action                          | Budget          |
| ------------------------------- | --------------- |
| App install                     | < 25MB          |
| Mini-app first load             | < 150KB gzipped |
| News feed refresh (20 articles) | < 50KB          |
| Your Honey model sync           | < 500KB delta   |
| Image thumbnails                | < 30KB WebP     |

---

## SECURITY

- HTTPS + certificate pinning on all API calls
- Stytch session tokens in platform secure storage (Keychain/Keystore) — NEVER in WebView localStorage
- Mini-app sandboxing: scoped storage, no cross-app data without Bridge
- Your Honey: on-device only, no raw data leaves device
- Wallet: biometric auth for transactions above threshold
- Your Honey backend: isolated infrastructure, Cloudflare Tunnel, secret auth
- All secrets in environment variables — NEVER in source code

---

## TOKEN ECONOMY — TWO-TOKEN ARCHITECTURE

The platform uses two tokens on **Polygon PoS** (Solidity ^0.8.20, OpenZeppelin v5):

**MUKOKO Identity Token (MIT)** — soulbound ERC-721, non-transferable, anchored to verified birth date. Used for governance staking and as value anchor for MXT. Think of it as ancestral land under Ubuntu customary law.

**MUKOKO Exchange Token (MXT)** — standard transferable ERC-20 for all transactions. Floor price derived from MIT three-pool system. Elastic supply: no hard cap, baseline emission 10,000 MXT/user, annual ceiling 15%, burn rate 30% of fees.

**Three-Pool Temporal Value:** `V = 0.60 × Mean(Year) + 0.30 × Mean(Month) + 0.10 × Mean(Day)` — pool means computed via O(1) running aggregates.

**Governance:** Conviction staking with quadratic voting: `Weight = √(MXT staked) × Ubuntu Multiplier × Regional Multiplier`. Four tiers (Constitutional 66%, Strategic 40%, Operational 20%, Community 10%).

**Initial allocation (3B MXT):** Ecosystem Reserve 30%, Community Treasury 20%, Founding Team 25% (4yr/1yr cliff), Operations 10%, Investors 10% (economic only, no governance), Advisors 5%.

**Smart contracts:** PoolRegistry, IdentityToken, ValueOracle, ExchangeToken, EmissionController.

See `ARCHITECTURE.md` sections 6 and 9 for full specification.

---

## FOUNDATION & LEGAL STRUCTURE

**Mukoko Foundation** — Mauritius (Foundations Act 2012, VASP licence under VAITOS Act 2021). Non-profit custodian of protocol, token economics, and Ubuntu charter. Governed by a Council elected by MIT holders.

**Nyuchi Africa (Pvt) Ltd** — Zimbabwe (Companies Act). For-profit operating company that builds and operates the platform. Licensed by the Foundation under a revocable service agreement.

**Founder's Reserved Powers** (legal rights in Foundation charter, NOT token rights):

- Ubuntu Veto — block proposals failing the Ubuntu Test
- African Sovereignty Mandate — majority-African Council composition
- Core Protocol Lock — protect MIT soulbound property, birth-date anchoring, three-pool system
- Emergency Pause — circuit breaker for security incidents

Reserved Powers cannot allocate tokens, direct treasury spending, or benefit the founder financially.

---

## COMMON MISTAKES TO AVOID

1. **DO NOT** use React for mini-apps. Use Preact (3KB, not 40KB).
2. **DO NOT** use Supabase for auth. Use Stytch.
3. **DO NOT** use Supabase as primary database. Use MongoDB Atlas.
4. **DO NOT** store tokens in WebView localStorage. Use Flutter secure storage via Bridge.
5. **DO NOT** send user behavior data to servers. All Your Honey learning is on-device.
6. **DO NOT** hardcode API keys, tokens, or secrets. Environment variables only.
7. **DO NOT** build features that fail the Ubuntu Test.
8. **DO NOT** ignore offline scenarios. Every feature must degrade gracefully.
9. **DO NOT** skip Huawei/HMS support.
10. **DO NOT** capitalize brand wordmarks. Always lowercase: `mukoko`, `nyuchi`, `shamwari`.
11. **DO NOT** change existing worker routers (itty-router) unless explicitly migrating. New workers use Hono.
12. **DO NOT** treat Bundu Family as part of this repo. It is a separate app.
13. **DO NOT** duplicate backend logic in this monorepo. Each app's backend lives in its standalone repo. The `mini-apps/` directory contains super app frontends only.
14. **DO NOT** confuse the super app frontend (`mini-apps/`) with the standalone PWA. They are separate codebases sharing the same backend API.
15. **DO NOT** create page-specific CSS. All pages use the same shared brand primitives from `globals.css` (and ultimately from `@mukoko/ui` registry). No page should have its own parallel styling system. New primitives must be submitted as issues to `nyuchitech/mukoko-registry`.
16. **DO NOT** set touch targets below 48px. Default touch target is **56px**; minimum is **48px** (only for compact inline form elements). All interactive elements must meet these minimums.
17. **DO NOT** add a marketing site here. mukoko.com lives in `bundu-labs/marketing` (`apps/mukoko`).

---

## QUICK REFERENCE

| Item              | Value                                    |
| ----------------- | ---------------------------------------- |
| Primary color     | Tanzanite `#4B0082` / `#B388FF`          |
| Auth provider     | Stytch                                   |
| Primary database  | MongoDB Atlas                            |
| Edge cache        | Cloudflare KV + D1                       |
| Object storage    | Cloudflare R2                            |
| AI                | Cloudflare AI + on-device TFLite/CoreML  |
| Web deployment    | Vercel                                   |
| Worker deployment | Cloudflare Workers + Containers          |
| Mini-app workers  | Workers for Platforms                    |
| Framework         | Flutter + Preact WebView mini-apps       |
| State management  | Riverpod                                 |
| Blockchain        | Polygon PoS (MIT soulbound + MXT ERC-20) |
| Payments          | EcoCash → InnBucks → MUKOKO tokens       |
| Monorepo          | Turborepo + pnpm                         |
| Node              | 22+                                      |
| Min Android       | API 24 (7.0)                             |
| Min iOS           | 15.0                                     |
| Architecture doc  | `ARCHITECTURE.md` (detailed spec)        |
| ADRs              | `docs/adr/001-009`                       |
| Dev guides        | `docs/guides/`                           |
| CI                | GitHub Actions (`ci.yml`)                |

---

## Track big work in GitHub issues

Any substantial build, migration, investigation or multi-step task gets a GitHub issue in the repo that owns it — before or as work starts — so another session, agent or person can pick it up.

- The issue holds the goal, the owner's decisions (verbatim where given), the plan, acceptance criteria, owner-only steps and links.
- Every PR references its issue (`Refs #n`; `Fixes #n` only when the merge completes it).
- Post progress, decisions and a hand-off note (what's done, what's left, branch names) as issue comments — at each merge and before a session or agent finishes.
- Work spanning repos gets a tracking issue that links the per-repo issues.
- Never put secrets, credential status or exploitable detail in issues on public repos.

## Dev skills, progress reports and the merge gate

Load the Mzizi **dev skills** before starting work: `mzizi_get_skills category=dev` on the Mzizi MCP (`mcp.mzizi.dev`), or `@nyuchi/mzizi-skills` from npm. They are `digital-hygiene` and `progress-report`.

- **Digital hygiene.** Check free disk before starting, clone only under `$TMPDIR`, share build caches, and audit, then delete, your clones once the work merges (`digital-hygiene` skill).
- **Clone isolation.** Clone only into a directory unique to you; never touch another agent's.
- **Progress reports.** All dev work runs on a 10-minute progress-report loop (`progress-report` skill): measured bars, what changed, and a final "Needs you:" line. Report ticks never publish, release, merge or deploy without the owner's approval.
- **Merge gate.** Merge only when the work is complete, CI is green, it's verified at runtime, and `/code-review` has run with findings resolved.

---

_Ndiri nekuti tiri — I am because we are._
