# Creating a Super App Mini-App Frontend

The `mini-apps/` directory contains **super app frontends** — lightweight Preact UIs that run inside the Flutter shell's WebView. Each super app frontend consumes an API owned by a standalone repository.

This guide covers creating the super app frontend. The standalone PWA and backend live in their own repo.

## Quick Start

1. Copy the template:

```bash
cp -r mini-apps/_template mini-apps/your-app-name
```

2. Update `package.json`:

```json
{
  "name": "@mukoko/mini-app-your-app-name",
  "version": "0.1.0"
}
```

3. Install and run:

```bash
pnpm install
pnpm turbo run dev --filter=@mukoko/mini-app-your-app-name
```

## Structure

```
mini-apps/your-app-name/
  src/
    index.tsx        # Entry point
    app.tsx          # Root component
    components/      # UI components (use @mukoko/ui)
  public/
  package.json
  vite.config.ts
  tsconfig.json
```

## Key Dependencies

Every super app frontend must use:

- **`@mukoko/ui`** — Shared Preact components (buttons, cards, inputs) using the Nyuchi design system
- **`@mukoko/bridge`** — Typed SDK for communicating with the Flutter shell (auth, wallet, navigation, device APIs)
- **`@mukoko/api`** — API client for calling backend services through the gateway

## How It Differs from the Standalone PWA

| Aspect     | Standalone PWA (own repo) | Super App Frontend (this monorepo)             |
| ---------- | ------------------------- | ---------------------------------------------- |
| Runs in    | Browser at `*.mukoko.com` | Flutter WebView inside the super app           |
| Auth       | Stytch SDK directly       | `MukokoBridge.auth.getToken()` via Flutter     |
| Navigation | Own router                | `MukokoBridge.nav` for shell integration       |
| Payments   | Own payment flow          | `MukokoBridge.wallet` for native payment sheet |
| Storage    | localStorage              | `MukokoBridge.storage` (no localStorage)       |
| Components | Own UI library            | `@mukoko/ui` for consistency across mini-apps  |
| API calls  | Direct to backend         | Through `@mukoko/api` via the gateway          |

## Rules

- Do NOT duplicate backend logic — the standalone repo owns the API
- Do NOT use `localStorage` — use `MukokoBridge.storage` instead
- Do NOT use `window.MukokoBridge` directly — use `@mukoko/bridge` typed SDK
- Do NOT use React — use Preact (3KB vs 40KB)
- Target < 150KB gzipped output

## Deployment

Super app frontends are built and bundled as part of the monorepo CI. They are served to the Flutter shell via Workers for Platforms.
