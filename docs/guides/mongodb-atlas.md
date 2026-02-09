# MongoDB Atlas — Primary Database

Mukoko uses MongoDB Atlas as its primary database, chosen for its flexible document model, global distribution, and strong free-tier offering for early-stage development.

## Architecture

- **Cluster**: Shared M0 (free tier) for development, dedicated M10+ for production
- **Region**: Africa-optimized (AWS af-south-1 Cape Town when available, otherwise eu-west-1)
- **Access**: Via Cloudflare Workers using the MongoDB Data API or direct connection from Honey service

## Collections Overview

| Collection | Purpose |
|-----------|---------|
| `users` | User profiles and Digital Twin metadata |
| `honeyProfiles` | Honey personalization data (encrypted) |
| `miniApps` | Mini-app registry and metadata |
| `transactions` | Wallet and payment records |
| `content` | User-generated content (clips, posts) |
| `events` | Nhimbe event listings |

## Connection

### From Cloudflare Workers

Workers connect via the MongoDB Data API (HTTP-based) since Workers cannot maintain persistent TCP connections.

### From Honey Service

The Honey service connects directly via `pymongo` or `motor` using the connection string in `MONGODB_URI`.

## Security

- All connections require TLS
- IP allowlisting for direct connections
- Database users have role-based access (read-only for analytics, read-write for services)
- Honey profile data is encrypted at the application layer before storage
