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

## Key Technologies

| Layer | Technology |
|-------|-----------|
| Database | MongoDB Atlas |
| Auth | Stytch |
| Web | Vercel |
| Backend | Cloudflare Workers + Containers |
| Mobile | Flutter |
| Mini-Apps | Preact + Vite |
| Monorepo | Turborepo + pnpm |
