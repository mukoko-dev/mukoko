# Connected Repos — Dual-Frontend Architecture

Each ecosystem app exists as a **standalone repository** with its own backend and PWA frontend. The Mukoko monorepo does not replace these repos — it provides the **super app frontend** for each app, ensuring a consistent experience inside the Flutter shell.

**Exception:** Pulse is monorepo-native — it has no standalone repo because it is the super app's aggregated feed.

## Two Frontends, One Backend

```
Standalone Repo (e.g. mukoko-news)        Mukoko Monorepo
┌──────────────────────────┐              ┌──────────────────────────┐
│  Backend API             │◄─────────────│  mini-apps/news/         │
│  Standalone PWA frontend │              │  (super app frontend)    │
│  news.mukoko.com         │              │  Loaded in Flutter WebView│
└──────────────────────────┘              └──────────────────────────┘
         ▲                                          ▲
         │                                          │
    Web users,                                Flutter shell,
    direct links                              MukokoBridge integration
```

Both frontends call the **same backend API** — the standalone repo owns the backend.

## Repository Map

| Standalone Repo   | Owns                        | Standalone PWA        | Super App Frontend               |
| ----------------- | --------------------------- | --------------------- | -------------------------------- |
| `mukoko-news`     | Mukoko News + Bytes backend | `news.mukoko.com`     | `mini-apps/news/`                |
| `nhimbe`          | Nhimbe (events) backend     | `nhimbe.mukoko.com`   | `mini-apps/nhimbe/`              |
| `mukoko-weather`  | Weather backend             | `weather.mukoko.com`  | `mini-apps/weather/`             |
| `mukoko-connect`  | Circles backend             | `circles.mukoko.com`  | `mini-apps/circles/`             |
| `mukoko-novels`   | Novels backend              | `novels.mukoko.com`   | `mini-apps/novels/`              |
| `mukoko-campfire` | Campfire backend            | `campfire.mukoko.com` | `mini-apps/campfire/`            |
| `mukoko-auth`     | Auth backend (Stytch)       | `id.mukoko.com`       | `services/id-api/`               |
| `brand-warehouse` | Brand assets CDN            | —                     | `packages/design-system/assets/` |

### Monorepo-native features (no standalone repo)

| Feature   | Location           | Notes                                                                                  |
| --------- | ------------------ | -------------------------------------------------------------------------------------- |
| **Pulse** | `mini-apps/pulse/` | Personalized aggregated feed — pulls content from all apps, personalized by Your Honey |

### mukoko-news — Mukoko News + Bytes

`mukoko-news` is the news/articles standalone app. It contains:

- **Mukoko News** — news-style articles from trusted sources
- **Bytes** — TikTok-style short-form scrolling (standalone app only)

**Bytes stays in the standalone app.** The super app's equivalent is **Pulse** — a completely separate, monorepo-native personalized feed that aggregates content from ALL apps (not just news).

### Also in the monorepo (not dual-frontend)

| What                    | Location                     | Notes                                         |
| ----------------------- | ---------------------------- | --------------------------------------------- |
| Flutter super app shell | `app/`                       | Native platform services                      |
| Your Honey AI service   | `honey/`                     | Privacy-first personalization engine          |
| Shared packages         | `packages/`                  | Types, design system, bridge SDK, API client  |
| API gateway             | `services/gateway/`          | Routing + Stytch session verification         |
| Mukoko ID               | `services/id-api/`           | Stytch auth + Your Honey cloud storage        |
| Wallet                  | `services/wallet-api/`       | Payments + MXT tokens (ERC-20 on Polygon)     |
| Shamwari AI             | `services/shamwari-api/`     | AI companion (reads Your Honey)               |
| Mini-app registry       | `services/miniapp-registry/` | App manifests + R2 assets                     |
| Digital Twin            | `services/digital-twin/`     | Soulbound Identity Token (MIT) on Polygon PoS |

## How It Works

1. **Standalone repo** develops its backend API and standalone PWA independently
2. **Super app frontend** in `mini-apps/` consumes the same API but uses `@mukoko/ui` components and `@mukoko/bridge` for Flutter shell integration
3. **Pulse** aggregates content from all app APIs, personalized by Your Honey
4. **Shared packages** (`@mukoko/types`, `@mukoko/ui`, `@mukoko/bridge`, `@mukoko/api`) keep the super app frontends consistent
5. **The gateway** handles auth verification and routing for all API calls from inside the super app

## Naming Convention

| Type                   | Convention                    | Examples                                  |
| ---------------------- | ----------------------------- | ----------------------------------------- |
| Standalone repos       | `mukoko-{name}` or brand name | `mukoko-news`, `nhimbe`, `mukoko-connect` |
| Super app frontends    | `mini-apps/{name}/`           | `mini-apps/news/`, `mini-apps/campfire/`  |
| Standalone PWA domains | `{name}.mukoko.com`           | `news.mukoko.com`, `nhimbe.mukoko.com`    |

## Rules

- The standalone repo **owns** its backend — never duplicate backend logic in the monorepo
- The monorepo **owns** the super app frontend — standalone repos do not build for the Flutter shell
- Pulse is monorepo-native — it aggregates from external APIs, it does not have its own standalone repo
- Shared types should be published from `packages/types/` and consumed by both the monorepo and standalone repos
- Design tokens live in `packages/design-system/` and are consumed by all super app frontends
