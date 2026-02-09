# Creating a Mini-App

Mini-apps in Mukoko are lightweight Preact + Vite applications that run inside the Mukoko ecosystem. They are hosted via Workers for Platforms and rendered in WebViews on mobile.

## Quick Start

1. Copy the mini-app template:

```bash
cp -r mini-apps/_template mini-apps/your-app-name
```

2. Update `package.json` with your app name:

```json
{
  "name": "@mukoko/mini-app-your-app-name",
  "version": "0.1.0"
}
```

3. Install dependencies and start development:

```bash
pnpm install
pnpm turbo run dev --filter=@mukoko/mini-app-your-app-name
```

## Structure

Each mini-app follows this structure:

```
mini-apps/your-app-name/
  src/
    index.tsx        # Entry point
    app.tsx          # Root component
    components/      # UI components
  public/
  package.json
  vite.config.ts
  tsconfig.json
```

## MukokoBridge

Mini-apps communicate with the native shell via the MukokoBridge JavaScript interface. This bridge provides access to wallet, auth, and device APIs.

## Deployment

Mini-apps are deployed to Workers for Platforms automatically when merged to `main`. Each mini-app gets its own subdomain under `apps.mukoko.com`.
