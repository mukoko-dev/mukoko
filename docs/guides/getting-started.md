# Getting Started with Mukoko

## Prerequisites

- Node.js 22+
- pnpm 9+
- Flutter 3.27+ (for mobile app)
- Python 3.12+ (for Honey service)
- Wrangler CLI (for Cloudflare Workers)

## Setup

```bash
# Clone the repository
git clone https://github.com/nyuchitech/mukoko.git
cd mukoko

# Install Node dependencies
pnpm install

# Build all packages
pnpm turbo run build

# Start development
pnpm turbo run dev
```

## Project Structure

See [CLAUDE.md](../CLAUDE.md) for the full repository structure.

## Running the Landing Page

```bash
# Dev server for mukoko.com
pnpm turbo run dev --filter=@mukoko/web

# Build for production
pnpm turbo run build --filter=@mukoko/web
```

The landing page deploys to Vercel automatically on push to `main` (see `.github/workflows/deploy-web.yml`). Waitlist form submissions go to Formspree.

## Key Technologies

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Database  | MongoDB Atlas                   |
| Auth      | Stytch                          |
| Web       | Vercel (Preact + Vite)          |
| Backend   | Cloudflare Workers + Containers |
| Mobile    | Flutter                         |
| Mini-Apps | Preact + Vite                   |
| Monorepo  | Turborepo + pnpm                |
