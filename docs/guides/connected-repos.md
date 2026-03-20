# Connected Repos — Dual-Frontend Architecture

Each ecosystem app exists as a **standalone repository** with its own backend and PWA frontend. The Mukoko monorepo does not replace these repos — it provides the **super app frontend** for each app, ensuring a consistent experience inside the Flutter shell.

**Exception:** Pulse is monorepo-native — it has no standalone repo because it is the super app's aggregated feed.

## Two Frontends, One Backend

```
Standalone Repo (e.g. mukoko-news)        Mukoko Monorepo
┌──────────────────────────┐              ┌──────────────────────────┐
│  Backend API             │◄─────────────│  mini-apps/clips/        │
│  Standalone PWA frontend │              │  (super app frontend)    │
│  clips.mukoko.com        │              │  Loaded in Flutter WebView│
└──────────────────────────┘              └──────────────────────────┘
         ▲                                          ▲
         │                                          │
    Web users,                                Flutter shell,
    direct links                              MukokoBridge integration
```

Both frontends call the **same backend API** — the standalone repo owns the backend.

## Repository Map

| Standalone Repo          | Owns                    | Standalone PWA       | Super App Frontend               |
| ------------------------ | ----------------------- | -------------------- | -------------------------------- |
| `mukoko-news`            | Clips + Bytes backend   | `clips.mukoko.com`   | `mini-apps/clips/`               |
| `nhimbe`                 | Events backend          | `events.mukoko.com`  | `mini-apps/events/`              |
| `mukoko-weather`         | Weather backend         | `weather.mukoko.com` | `mini-apps/weather/`             |
| `mukoko-connect` _(new)_ | Connect/Circles backend | `connect.mukoko.com` | `mini-apps/connect/`             |
| `mukoko-novels` _(new)_  | Novels backend          | `novels.mukoko.com`  | `mini-apps/novels/`              |
| `mukoko-auth`            | Auth backend (Stytch)   | `id.mukoko.com`      | `services/id-api/`               |
| `brand-warehouse`        | Brand assets CDN        | —                    | `packages/design-system/assets/` |

### Monorepo-native features (no standalone repo)

| Feature   | Location           | Notes                                                                                       |
| --------- | ------------------ | ------------------------------------------------------------------------------------------- |
| **Pulse** | `mini-apps/pulse/` | Personalized aggregated feed — pulls content from all apps, personalized by the Memory File |

### mukoko-news — Clips + Bytes

`mukoko-news` is the news/articles standalone app. It contains:

- **Clips** — news-style articles from trusted sources
- **Bytes** — TikTok-style short-form scrolling (standalone app only)

**Bytes stays in the standalone app.** The super app's equivalent is **Pulse** — a completely separate, monorepo-native personalized feed that aggregates content from ALL apps (not just news).

### Also in the monorepo (not dual-frontend)

| What                    | Location                     | Notes                                                 |
| ----------------------- | ---------------------------- | ----------------------------------------------------- |
| Flutter super app shell | `app/`                       | Native platform services                              |
| Nuchi Honey AI service  | `honey/`                     | Privacy-first personalization, co-creates Memory File |
| Shared packages         | `packages/`                  | Types, design system, bridge SDK, API client          |
| API gateway             | `services/gateway/`          | Routing + Stytch session verification                 |
| Mukoko ID               | `services/id-api/`           | Stytch auth + Memory File storage                     |
| Wallet                  | `services/wallet-api/`       | Payments + MUKOKO tokens                              |
| Shamwari AI             | `services/shamwari-api/`     | AI companion (reads Memory File)                      |
| Mini-app registry       | `services/miniapp-registry/` | App manifests + R2 assets                             |
| Digital Twin            | `services/digital-twin/`     | NFT + reputation                                      |

## How It Works

1. **Standalone repo** develops its backend API and standalone PWA independently
2. **Super app frontend** in `mini-apps/` consumes the same API but uses `@mukoko/ui` components and `@mukoko/bridge` for Flutter shell integration
3. **Pulse** aggregates content from all app APIs, personalized by the Memory File
4. **Shared packages** (`@mukoko/types`, `@mukoko/ui`, `@mukoko/bridge`, `@mukoko/api`) keep the super app frontends consistent
5. **The gateway** handles auth verification and routing for all API calls from inside the super app

## Naming Convention

| Type                   | Convention                    | Examples                                  |
| ---------------------- | ----------------------------- | ----------------------------------------- |
| Standalone repos       | `mukoko-{name}` or brand name | `mukoko-news`, `nhimbe`, `mukoko-connect` |
| Super app frontends    | `mini-apps/{name}/`           | `mini-apps/clips/`, `mini-apps/pulse/`    |
| Standalone PWA domains | `{name}.mukoko.com`           | `clips.mukoko.com`, `events.mukoko.com`   |

## Rules

- The standalone repo **owns** its backend — never duplicate backend logic in the monorepo
- The monorepo **owns** the super app frontend — standalone repos do not build for the Flutter shell
- Pulse is monorepo-native — it aggregates from external APIs, it does not have its own standalone repo
- Shared types should be published from `packages/types/` and consumed by both the monorepo and standalone repos
- Design tokens live in `packages/design-system/` and are consumed by all super app frontends
