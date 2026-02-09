# ADR 001: Monorepo with Turborepo

## Status

Accepted

## Context

Mukoko consists of multiple frontends (web, mobile, mini-apps), backend services (Cloudflare Workers), shared packages, and an AI service. Managing these as separate repositories creates friction with shared types, inconsistent tooling, and complex cross-repo CI.

## Decision

We adopt a monorepo structure managed by Turborepo with pnpm workspaces. Turborepo provides incremental builds, intelligent caching, and parallel task execution across all JavaScript/TypeScript packages.

## Consequences

- **Positive**: Single source of truth for shared types and design tokens. Atomic PRs across frontend and backend. Simplified dependency management.
- **Positive**: Turborepo's remote caching speeds up CI significantly.
- **Negative**: Initial setup complexity. Contributors must understand the workspace structure.
- **Negative**: Non-JS projects (Flutter app, Python Honey service) live alongside but outside the Turborepo task graph.
