# Creating a Cloudflare Worker Service

Services in this monorepo are **super app infrastructure** — shared services like the API gateway, wallet, Shamwari AI, and mini-app registry. App-specific backends (Clips, Events, Connect, etc.) live in their own standalone repos.

New services use Hono as the routing framework.

## Quick Start

1. Create a new service directory:

```bash
mkdir -p services/your-service
cd services/your-service
```

2. Initialize with the standard structure:

```bash
pnpm init
```

3. Add the required files:

```
services/your-service/
  src/
    index.ts         # Worker entry point with Hono app
    routes/          # Route handlers
    middleware/       # Custom middleware
  wrangler.toml      # Cloudflare configuration
  package.json
  tsconfig.json
```

## Hono Setup

```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
```

## Wrangler Configuration

Each service needs a `wrangler.toml` with at minimum:

```toml
name = "mukoko-your-service"
main = "src/index.ts"
compatibility_date = "2024-12-01"
```

## Deployment

Services deploy automatically via the `deploy-services.yml` GitHub Actions workflow when changes are pushed to `main` in the `services/` directory.
