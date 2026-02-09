# ADR 004: MongoDB Atlas as Primary Database

## Status

Accepted

## Context

Mukoko needs a database that supports flexible schemas (Digital Twin profiles vary by user), global distribution for African and diaspora users, and a generous free tier for early development. Relational databases impose rigid schemas that conflict with the evolving nature of user profiles and Honey data.

## Decision

We use MongoDB Atlas as the primary database. Cloudflare Workers access it via the Data API (HTTP). The Honey service connects directly via the MongoDB driver.

## Consequences

- **Positive**: Flexible document model fits Digital Twin profiles and Honey personalization data.
- **Positive**: Free M0 tier supports early development without cost.
- **Positive**: Global clusters with Africa region availability (Cape Town).
- **Negative**: No native Cloudflare Workers binding; requires HTTP Data API with higher latency than D1.
- **Negative**: Document databases require careful schema design to avoid performance issues at scale.
